import { collection, getDocs, query, where, type Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type LatestWeather = {
  beachId: string; observedAt: Timestamp; temperature: number; feelsLike?: number;
  precipitationProbability: number; windSpeed: number; windDirection?: number;
  humidity?: number; weatherCondition?: string; uvIndex?: number; visibility?: number;
  waveHeight?: number; waterTemperature?: number; source: string;
};

/** Reads only the latest server-collected record; the browser never calls KMA. */
export async function getLatestWeather(beachId: string) {
  const q = query(collection(db, "weather_history"), where("beachId", "==", beachId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs
    .map((doc) => doc.data() as LatestWeather)
    .sort((a, b) => b.observedAt.toMillis() - a.observedAt.toMillis())[0];
}

/** Latest available record for every beach used by the recommendation engine. */
export async function getLatestWeatherForBeaches(beachIds: string[]) {
  const records = await Promise.all(beachIds.map(async beachId => [beachId, await getLatestWeather(beachId)] as const));
  return Object.fromEntries(records.filter((entry): entry is [string, LatestWeather] => entry[1] !== null));
}
