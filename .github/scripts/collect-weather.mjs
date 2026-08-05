import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { appendFile } from "node:fs/promises";

const serviceKey = process.env.KMA_SERVICE_KEY;
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceKey || !serviceAccount) {
  console.log("Weather collection is waiting for KMA_SERVICE_KEY and FIREBASE_SERVICE_ACCOUNT GitHub secrets.");
  process.exit(0);
}

const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
const db = getFirestore(app);
const beaches = [
  ["hae", "해운대해수욕장", 35.1587, 129.1604],
  ["gwang", "광안리해수욕장", 35.1532, 129.1186],
  ["song", "송정해수욕장", 35.1786, 129.1991],
  ["dadae", "다대포해수욕장", 35.0464, 128.9676],
  ["songdo", "송도해수욕장", 35.0768, 129.0202],
  ["ilgw", "일광해수욕장", 35.2658, 129.2338],
  ["imn", "임랑해수욕장", 35.3187, 129.2626],
];

function toGrid(lat, lon) {
  const RE = 6371.00877, GRID = 5, SLAT1 = 30, SLAT2 = 60, OLON = 126, OLAT = 38, XO = 43, YO = 136;
  const radians = Math.PI / 180, re = RE / GRID, slat1 = SLAT1 * radians, slat2 = SLAT2 * radians, olon = OLON * radians, olat = OLAT * radians;
  const sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(Math.tan(Math.PI * .25 + slat2 * .5) / Math.tan(Math.PI * .25 + slat1 * .5));
  const sf = Math.pow(Math.tan(Math.PI * .25 + slat1 * .5), sn) * Math.cos(slat1) / sn;
  const ro = re * sf / Math.pow(Math.tan(Math.PI * .25 + olat * .5), sn);
  const ra = re * sf / Math.pow(Math.tan(Math.PI * .25 + lat * radians * .5), sn);
  const theta = (lon * radians - olon) * sn;
  return { nx: Math.floor(ra * Math.sin(theta) + XO + .5), ny: Math.floor(ro - ra * Math.cos(theta) + YO + .5) };
}

function getBaseTime() {
  const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  nowKst.setUTCMinutes(0, 0, 0);
  nowKst.setUTCHours(nowKst.getUTCHours() - 1);
  return nowKst;
}
function dateText(d) { return d.toISOString().slice(0, 10).replaceAll("-", ""); }
function hourText(d) { return `${String(d.getUTCHours()).padStart(2, "0")}00`; }

async function kma(endpoint, grid, base) {
  const url = new URL(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${endpoint}`);
  url.search = new URLSearchParams({ serviceKey, pageNo: "1", numOfRows: "1000", dataType: "JSON", base_date: dateText(base), base_time: hourText(base), nx: String(grid.nx), ny: String(grid.ny) });
  const response = await fetch(url, { headers: { "User-Agent": "today1-weather-collector/1.0", Accept: "application/json" } });
  if (!response.ok) throw new Error(`KMA request failed: ${response.status}`);
  const json = await response.json();
  const items = json?.response?.body?.items?.item;
  if (!items) throw new Error(`KMA returned no data: ${json?.response?.header?.resultMsg ?? "unknown"}`);
  return items;
}

function indexed(items) { return Object.fromEntries(items.map((item) => [item.category, item.obsrValue ?? item.fcstValue])); }
function condition(pty) { return ({ "0": "맑음", "1": "비", "2": "비/눈", "3": "눈", "4": "소나기" })[String(pty)] ?? "정보 없음"; }

const base = getBaseTime();
try {
  await Promise.all(beaches.map(async ([beachId, nameKo, latitude, longitude]) => {
    const grid = toGrid(latitude, longitude);
    const [nowItems, forecastItems] = await Promise.all([kma("getUltraSrtNcst", grid, base), kma("getUltraSrtFcst", grid, base)]);
    const now = indexed(nowItems), forecast = indexed(forecastItems);
    const observedAt = new Date(); observedAt.setMinutes(0, 0, 0);
    const id = `${observedAt.toISOString().slice(0, 13).replace("T", "-")}-${beachId}`;
    await db.collection("weather_history").doc(id).set({
      beachId, nameKo, latitude, longitude, observedAt,
      temperature: Number(now.T1H), feelsLike: Number(now.T1H), humidity: Number(now.REH),
      precipitationProbability: null, precipitation: Number(now.RN1 ?? 0), windSpeed: Number(now.WSD), windDirection: Number(now.VEC),
      weatherCondition: condition(now.PTY), waveHeight: 0.4, waterTemperature: 25,
      source: "KMA Open API", apiVersion: "VilageFcstInfoService_2.0", createdAt: FieldValue.serverTimestamp(), marineSource: "Demo Data",
    }, { merge: true });
  }));
  console.log(`Stored weather for ${beaches.length} beaches at ${new Date().toISOString()}`);
} catch (error) {
  const message = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
  console.error(`WEATHER_COLLECTION_ERROR\n${message}`);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Weather collection failed\n\n\`\`\`\n${message}\n\`\`\`\n`);
  throw error;
}
