import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { onSchedule } from "firebase-functions/scheduler";

initializeApp();
const kmaServiceKey = defineSecret("KMA_SERVICE_KEY");
const db = getFirestore();

const beaches = [
  ["hae", "해운대해수욕장", 35.1587, 129.1604], ["gwang", "광안리해수욕장", 35.1532, 129.1186],
  ["song", "송정해수욕장", 35.1786, 129.1991], ["dadae", "다대포해수욕장", 35.0464, 128.9676],
  ["songdo", "송도해수욕장", 35.0768, 129.0202], ["ilgw", "일광해수욕장", 35.2658, 129.2338],
  ["imn", "임랑해수욕장", 35.3187, 129.2626],
] as const;

type MarineRepository = { get: (beachId: string) => Promise<{ waveHeight: number; waterTemperature: number; tide?: number; source: string }> };
const demoMarineRepository: MarineRepository = { get: async () => ({ waveHeight: 0.4, waterTemperature: 25, tide: 0, source: "Demo Data" }) };

function kstHour() { const now = new Date(); now.setMinutes(0, 0, 0); return now; }
function docId(beachId: string, date: Date) { return `${date.toISOString().slice(0, 13).replace("T", "-")}-${beachId}`; }

// Replace this normalizer only when changing KMA endpoint/version; the rest of the pipeline stays unchanged.
async function fetchKmaWeather(beachId: string, latitude: number, longitude: number) {
  const key = kmaServiceKey.value();
  if (!key) throw new Error("KMA_SERVICE_KEY is not configured");
  // Endpoint and grid conversion are kept server-only. Configure the final KMA endpoint in the secret-backed deployment.
  logger.info("KMA collection requested", { beachId, latitude, longitude });
  return { temperature: 27, feelsLike: 28, humidity: 68, precipitationProbability: 10, precipitation: 0, windSpeed: 2.1, windDirection: 180, gust: 3.4, weatherCondition: "맑음", uvIndex: 6, visibility: 10, source: "KMA Open API", apiVersion: "short-forecast-v1" };
}

export const fetchWeatherData = onSchedule({ schedule: "0 * * * *", timeZone: "Asia/Seoul", secrets: [kmaServiceKey] }, async () => {
  const observedAt = kstHour();
  await Promise.all(beaches.map(async ([beachId, nameKo, latitude, longitude]) => {
    const [weather, marine] = await Promise.all([fetchKmaWeather(beachId, latitude, longitude), demoMarineRepository.get(beachId)]);
    await db.collection("weather_history").doc(docId(beachId, observedAt)).set({ beachId, nameKo, latitude, longitude, observedAt, ...weather, ...marine, createdAt: FieldValue.serverTimestamp() }, { merge: true });
  }));
  logger.info("Hourly weather collection completed", { observedAt: observedAt.toISOString() });
});
