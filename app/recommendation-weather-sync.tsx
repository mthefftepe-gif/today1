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
    // The collector runs at minute 07. Refresh at minute 08 and retry a few
    // minutes later in case the scheduled GitHub run has started slightly late.
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(8, 0, 0);
    if (next <= now) next.setHours(next.getHours() + 1);
    let retryTimer: number | undefined;
    const runHourlyRefresh = () => {
      refresh();
      retryTimer = window.setTimeout(refresh, 4 * 60 * 1000);
    };
    const startTimer = window.setTimeout(() => {
      runHourlyRefresh();
      hourlyTimer = window.setInterval(runHourlyRefresh, 60 * 60 * 1000);
    }, next.getTime() - now.getTime());
    let hourlyTimer: number | undefined;
    return () => { active = false; window.clearTimeout(startTimer); if (hourlyTimer) window.clearInterval(hourlyTimer); if (retryTimer) window.clearTimeout(retryTimer); };
  }, []);
  return null;
}
