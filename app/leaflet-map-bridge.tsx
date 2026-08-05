"use client";
import { useEffect } from "react";

const beaches = [
  ["해운대해수욕장", 35.1587, 129.1604, 85], ["광안리해수욕장", 35.1532, 129.1186, 90], ["송정해수욕장", 35.1786, 129.1991, 85],
  ["송도해수욕장", 35.0768, 129.0202, 81], ["다대포해수욕장", 35.0464, 128.9676, 88], ["일광해수욕장", 35.2658, 129.2338, 83], ["임랑해수욕장", 35.3187, 129.2626, 79],
] as const;

export default function LeafletMapBridge() {
  useEffect(() => {
    const host = document.querySelector<HTMLElement>(".map");
    if (!host || document.getElementById("today-leaflet")) return;
    host.replaceChildren(); host.id = "today-leaflet";
    const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.append(css);
    const script = document.createElement("script"); script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; script.onload = () => {
      const L = (window as any).L; if (!L) return;
      const map = L.map(host, { minZoom: 9, maxZoom: 17, zoomControl: true }).setView([35.145, 129.075], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
      const bounds: [number, number][] = [];
      beaches.forEach(([name, lat, lng, score]) => { bounds.push([lat, lng]); const icon = L.divIcon({ className: "beach-map-marker", html: `<div><b>${score}</b><span>★ 추천</span></div>`, iconSize: [52, 62], iconAnchor: [26, 54] }); L.marker([lat, lng], { icon }).addTo(map).bindPopup(`<strong>${name}</strong><br/>추천 점수 ${score}점`); });
      map.fitBounds(bounds, { padding: [36, 36] });
      const control = L.control({ position: "topright" }); control.onAdd = () => { const button = L.DomUtil.create("button", "map-all-button"); button.textContent = "전체 보기"; button.onclick = () => map.fitBounds(bounds, { padding: [36, 36] }); return button; }; control.addTo(map);
    }; document.body.append(script);
    return () => { script.remove(); css.remove(); };
  }, []);
  return null;
}
