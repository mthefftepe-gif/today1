import { collection, getDocs, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';

export type CriterionId = 'weatherSuitability'|'marineSuitability'|'safety'|'activitySuitability'|'comfort'|'scenery'|'accessibility';
export type PriorityId = 'safety'|'lowCrowd'|'scenery'|'parking'|'publicTransport'|'calmWave'|'lowRain'|'lowUV'|'facilities';
export type Beach = { id:string; name:string; latitude:number; longitude:number; activityScores:Record<string,number>; criterionScores:Partial<Record<CriterionId,number>> };
export type Weather = { beachId:string; nameKo?:string; latitude?:number; longitude?:number; temperature:number; feelsLike?:number; precipitationProbability?:number|null; precipitation?:number; windSpeed:number; windDirection?:number; humidity?:number; waveHeight?:number; waterTemperature?:number; marineSource?:string; source:string; observedAt?:{toMillis:()=>number}; uvIndex?:number; crowdLevel?:number };
export type Weight = { activityId:string; weights:Record<CriterionId,number> };
export type Criteria = { id:CriterionId; label:string };
export type Input = { activityId:string; priorities:PriorityId[] };
export type Result = { beachId:string; totalScore:number; grade:'green'|'yellow'|'red'; breakdown:{criterionId:CriterionId;score:number;weight:number;contribution:number}[]; reasons:string[] };

const ids:CriterionId[] = ['weatherSuitability','marineSuitability','safety','activitySuitability','comfort','scenery','accessibility'];
const read = <T,>(name:string) => getDocs(collection(db,name)).then(snapshot => snapshot.docs.map(doc => ({id:doc.id,...doc.data()} as T)));

function latestPerBeach(records:Weather[]) {
  return Object.values(records.reduce<Record<string,Weather>>((latest, record) => {
    const previous = latest[record.beachId];
    if (!previous || (record.observedAt?.toMillis?.() ?? 0) > (previous.observedAt?.toMillis?.() ?? 0)) latest[record.beachId] = record;
    return latest;
  }, {}));
}

export async function loadRecommendationData() {
  const [storedBeaches, latest, history, weights, criteria, adjustments] = await Promise.all([
    read<Beach>('beaches'), read<Weather>('weather_latest'), read<Weather>('weather_history'), read<Weight>('activity_weights'), read<Criteria>('evaluation_criteria'), read<{priorityId:PriorityId;adjustments:Partial<Record<CriterionId,number>>}>('priority_adjustments'),
  ]);
  const weather = latest.length ? latest : latestPerBeach(history);
  const beaches = storedBeaches.length ? storedBeaches : weather.map(record => ({
    id:record.beachId, name:record.nameKo ?? record.beachId, latitude:record.latitude ?? 0, longitude:record.longitude ?? 0, activityScores:{}, criterionScores:{},
  }));
  return {beaches, weather, weights, criteria, adjustments};
}

export function subscribeWeather(onChange:(weather:Weather[])=>void,onError:(error:Error)=>void):Unsubscribe {
  return onSnapshot(collection(db,'weather_latest'), snapshot => onChange(snapshot.docs.map(doc => ({id:doc.id,...doc.data()} as Weather))), onError);
}

export function calculateAll(data:Awaited<ReturnType<typeof loadRecommendationData>>, input:Input):Result[] {
  const storedWeight = data.weights.find(item => item.activityId === input.activityId);
  const adjustment = data.adjustments.filter(item => input.priorities.includes(item.priorityId));
  return data.beaches.flatMap(beach => {
    const weather = data.weather.find(item => item.beachId === beach.id);
    if (!weather) return [];
    const weights:Record<CriterionId,number> = storedWeight ? {...storedWeight.weights} : {weatherSuitability:1,marineSuitability:1,safety:1,activitySuitability:1,comfort:1,scenery:1,accessibility:1};
    adjustment.forEach(item => Object.entries(item.adjustments).forEach(([key,value]) => { weights[key as CriterionId] += value ?? 0; }));
    const rain = weather.precipitationProbability ?? (weather.precipitation && weather.precipitation > 0 ? 100 : 0);
    const wave = weather.waveHeight ?? 0;
    const uv = weather.uvIndex ?? 0;
    const crowd = weather.crowdLevel ?? 2;
    const activityScore = input.activityId === 'swimming' ? Math.max(0,100-wave*40-weather.windSpeed*5) : input.activityId === 'surfing' ? Math.min(100,40+wave*55+weather.windSpeed*5) : Math.max(0,100-rain-weather.windSpeed*3);
    const score:Record<CriterionId,number> = {
      weatherSuitability:Math.max(0,100-rain-uv*3), marineSuitability:Math.max(0,100-wave*35-weather.windSpeed*4), safety:beach.criterionScores.safety ?? Math.max(0,100-wave*40-weather.windSpeed*4), activitySuitability:beach.activityScores[input.activityId] ?? activityScore, comfort:Math.max(0,100-crowd*18), scenery:beach.criterionScores.scenery ?? 80, accessibility:beach.criterionScores.accessibility ?? 75,
    };
    const totalWeight = ids.reduce((sum,id) => sum + weights[id], 0);
    const breakdown = ids.map(criterionId => ({criterionId,score:Math.round(score[criterionId]),weight:weights[criterionId]/totalWeight,contribution:score[criterionId]*weights[criterionId]/totalWeight}));
    const rawTotal = Math.round(breakdown.reduce((sum,item) => sum + item.contribution, 0));
    const unsafe = wave >= 1 || weather.windSpeed >= 10;
    const totalScore = unsafe ? Math.min(59,rawTotal) : rawTotal;
    return [{beachId:beach.id,totalScore,grade:totalScore>=80?'green':totalScore>=65?'yellow':'red',breakdown,reasons:[weather.source.includes('KMA')?'기상청 최신 관측값을 반영했습니다.':'최신 Firestore 관측값을 반영했습니다.',wave<0.5?`파고 ${wave}m로 안정적인 해양 조건입니다.`:`파고 ${wave}m를 고려해 활동을 선택하세요.`,weather.windSpeed<3?'풍속이 약해 야외 활동이 편안합니다.':`풍속 ${weather.windSpeed}m로 바람 영향을 고려했습니다.`]}];
  }).sort((a,b) => b.totalScore-a.totalScore);
}
