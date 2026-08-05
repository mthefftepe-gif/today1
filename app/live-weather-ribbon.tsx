"use client";

import { useEffect, useState } from "react";
import { getLatestWeather, type LatestWeather } from "./weather-repository";

function updatedAt(weather: LatestWeather) {
  return new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(weather.observedAt.toDate());
}

export default function LiveWeatherRibbon() {
  const [weather, setWeather] = useState<LatestWeather | null>(null);

  useEffect(() => {
    getLatestWeather("hae").then(setWeather).catch(() => setWeather(null));
  }, []);

  if (!weather) return null;
  return <aside className="live-weather-ribbon" aria-label="실시간 기상 데이터"><span className="live-dot"/><b>실시간 기상 · 해운대</b><span>{weather.temperature.toFixed(1)}℃</span><span>풍속 {weather.windSpeed.toFixed(1)}m/s</span><small>기상청 Open API · {updatedAt(weather)} 갱신</small></aside>;
}
