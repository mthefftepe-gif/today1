"use client";

import { useEffect } from "react";
import { setRecommendationWeather } from "./recommendation-live-weather";
import { getLatestWeatherForBeaches } from "./weather-repository";

const beachIds = ["hae", "gwang", "song", "dadae", "songdo", "ilgw", "imn"];

export default function RecommendationWeatherSync() {
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const weather = await getLatestWeatherForBeaches(beachIds);
        if (!active || Object.keys(weather).length === 0) return;
        setRecommendationWeather(weather);
        window.dispatchEvent(new Event("recommendation-weather-change"));
      } catch {
        // Static demonstration values remain available if Firestore is temporarily unavailable.
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 5 * 60 * 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  return null;
}
