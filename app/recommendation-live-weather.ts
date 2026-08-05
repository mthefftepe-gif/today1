import type { LatestWeather } from "./weather-repository";

let latestByBeach: Record<string, LatestWeather> = {};

export function getRecommendationWeather() {
  return latestByBeach;
}

export function setRecommendationWeather(next: Record<string, LatestWeather>) {
  latestByBeach = next;
}
