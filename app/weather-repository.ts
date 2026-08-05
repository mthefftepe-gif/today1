import { collection, getDocs, limit, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type LatestWeather = {
  beachId: string; observedAt: Timestamp; temperature: number; feelsLike?: number;
  precipitationProbability: number; windSpeed: number; windDirection?: number;
  humidity?: number; weatherCondition?: string; uvIndex?: number; visibility?: number;
  waveHeight?: number; waterTemperature?: number; source: string;
};

/** Reads only the latest server-collected record; the browser never calls KMA. */
export async function getLatestWeather(beachId: string) {
  const q = query(collection(db, "weather_history"), where("beachId", "==", beachId), orderBy("observedAt", "desc"), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : snapshot.docs[0].data() as LatestWeather;
}
