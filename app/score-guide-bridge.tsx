"use client";

import { useEffect, useState } from "react";

type Key = "weather" | "marine" | "safety" | "activity" | "comfort" | "scenery" | "access";
type Row = { rank: number; key: Key; weight: number; reason: string };

const info: Record<Key, { name: string; data: string }> = {
  weather: { name: "기상 적합성", data: "기온·체감온도·강수확률·풍속·습도" },
  marine: { name: "해양환경 적합성", data: "파고·수온·풍속·조석" },
  safety: { name: "안전성", data: "이안류·파도·강풍·입수통제" },
  activity: { name: "활동 적합성", data: "수영·산책·서핑·사진·가족 적합도" },
  comfort: { name: "쾌적성", data: "혼잡도·소음·대기질·체감환경" },
  scenery: { name: "경관성", data: "가시거리·일몰·경관 점수" },
  access: { name: "접근·편의성", data: "대중교통·주차·화장실·편의시설" },
};

const rankings: Record<string, Row[]> = {
  "수영·물놀이": [
    { rank: 1, key: "marine", weight: 30, reason: "파고와 수온, 바람이 물놀이 가능 여부를 가장 크게 좌우합니다." },
    { rank: 2, key: "safety", weight: 25, reason: "입수 전 위험 신호와 안전 운영 상태를 우선 확인합니다." },
    { rank: 3, key: "weather", weight: 15, reason: "강수와 체감온도는 현장 활동의 지속 가능성을 판단합니다." },
    { rank: 4, key: "activity", weight: 15, reason: "해변의 수영 환경이 선택 목적과 맞는지 반영합니다." },
    { rank: 5, key: "comfort", weight: 5, reason: "혼잡도와 머무르기 좋은 환경을 보조적으로 반영합니다." },
    { rank: 6, key: "access", weight: 5, reason: "샤워장·주차 등 현장 이용 편의를 확인합니다." },
    { rank: 7, key: "scenery", weight: 5, reason: "풍경은 물놀이 판단의 보조 요소로 반영합니다." },
  ],
  "가족 나들이": [
    { rank: 1, key: "safety", weight: 25, reason: "동반 가족의 안전을 위해 위험 요소와 안전시설을 최우선으로 봅니다." },
    { rank: 2, key: "access", weight: 20, reason: "주차와 화장실, 편의시설 접근이 가족 방문의 만족도를 높입니다." },
    { rank: 3, key: "marine", weight: 15, reason: "잔잔한 바다 상태가 어린이 동반 활동에 중요합니다." },
    { rank: 4, key: "comfort", weight: 15, reason: "혼잡도와 쉴 수 있는 환경을 함께 고려합니다." },
    { rank: 5, key: "weather", weight: 10, reason: "날씨 변화와 강수 가능성을 확인합니다." },
    { rank: 6, key: "activity", weight: 10, reason: "가족 친화적인 해변 특성을 반영합니다." },
    { rank: 7, key: "scenery", weight: 5, reason: "경관은 나들이 경험을 보완하는 요소입니다." },
  ],
  "산책": [
    { rank: 1, key: "weather", weight: 25, reason: "체감온도와 강수, 바람이 걷기 좋은 시간을 결정합니다." },
    { rank: 2, key: "comfort", weight: 20, reason: "혼잡도와 대기질이 편안한 산책 경험에 중요합니다." },
    { rank: 3, key: "activity", weight: 15, reason: "해변 산책로와 걷기 환경의 적합도를 반영합니다." },
    { rank: 4, key: "scenery", weight: 15, reason: "바다 풍경과 시야가 산책의 만족도를 높입니다." },
    { rank: 5, key: "safety", weight: 10, reason: "보행 중 위험 요소와 현장 안전 상태를 확인합니다." },
    { rank: 6, key: "access", weight: 10, reason: "대중교통과 주차 편의성을 함께 고려합니다." },
    { rank: 7, key: "marine", weight: 5, reason: "바다 상태는 해안 산책의 보조 판단 요소입니다." },
  ],
  "서핑": [
    { rank: 1, key: "marine", weight: 35, reason: "파고와 풍속, 조석이 서핑 가능 조건을 가장 직접적으로 결정합니다." },
    { rank: 2, key: "safety", weight: 20, reason: "강풍과 파도 위험을 확인해 안전한 입수를 판단합니다." },
    { rank: 3, key: "activity", weight: 20, reason: "해변의 서핑 친화 특성과 파도 환경을 반영합니다." },
    { rank: 4, key: "weather", weight: 10, reason: "강수와 기온 등 현장 날씨를 확인합니다." },
    { rank: 5, key: "access", weight: 5, reason: "장비 이동과 주차 편의성을 보조적으로 반영합니다." },
    { rank: 6, key: "comfort", weight: 5, reason: "혼잡도와 대기 환경을 확인합니다." },
    { rank: 7, key: "scenery", weight: 5, reason: "경관은 서핑 조건의 보조 요소입니다." },
  ],
  "사진 촬영": [
    { rank: 1, key: "scenery", weight: 40, reason: "가시거리와 구름, 촬영 포인트가 사진 결과에 가장 큰 영향을 줍니다." },
    { rank: 2, key: "weather", weight: 15, reason: "빛과 강수 여부를 확인해 촬영 시간을 판단합니다." },
    { rank: 3, key: "activity", weight: 15, reason: "해변의 사진 친화 특성과 구도를 반영합니다." },
    { rank: 4, key: "comfort", weight: 10, reason: "혼잡도와 체감 환경을 고려해 여유로운 촬영을 돕습니다." },
    { rank: 5, key: "access", weight: 10, reason: "장비 이동과 편의시설 접근성을 확인합니다." },
    { rank: 6, key: "safety", weight: 5, reason: "해안 촬영 시 위험 요소를 확인합니다." },
    { rank: 7, key: "marine", weight: 5, reason: "바다 상태는 사진 분위기를 보조적으로 반영합니다." },
  ],
  "노을 감상": [
    { rank: 1, key: "scenery", weight: 40, reason: "일몰 방향과 구름, 가시거리가 노을 감상의 핵심 조건입니다." },
    { rank: 2, key: "weather", weight: 15, reason: "비와 하늘 상태를 확인해 노을 관측 가능성을 판단합니다." },
    { rank: 3, key: "activity", weight: 15, reason: "일몰 감상에 어울리는 해변 특성을 반영합니다." },
    { rank: 4, key: "comfort", weight: 10, reason: "혼잡도와 바람 등 머무르기 좋은 환경을 봅니다." },
    { rank: 5, key: "access", weight: 10, reason: "해 질 무렵 이동과 귀가 편의성을 고려합니다." },
    { rank: 6, key: "safety", weight: 5, reason: "야간 전환 시간의 현장 안전을 확인합니다." },
    { rank: 7, key: "marine", weight: 5, reason: "바다 상태는 노을 감상의 보조 요소입니다." },
  ],
  "힐링·휴식": [
    { rank: 1, key: "comfort", weight: 30, reason: "혼잡도와 소음, 체감 환경이 조용한 휴식에 가장 중요합니다." },
    { rank: 2, key: "scenery", weight: 25, reason: "바다 경관과 시야가 휴식의 만족도를 높입니다." },
    { rank: 3, key: "weather", weight: 15, reason: "기온과 바람이 편안한 체류 시간을 결정합니다." },
    { rank: 4, key: "activity", weight: 10, reason: "휴식에 어울리는 해변의 고유 특성을 반영합니다." },
    { rank: 5, key: "access", weight: 10, reason: "카페와 편의시설 접근성을 확인합니다." },
    { rank: 6, key: "safety", weight: 5, reason: "안전한 휴식 공간인지 확인합니다." },
    { rank: 7, key: "marine", weight: 5, reason: "바다 상태는 휴식 판단의 보조 요소입니다." },
  ],
  "반려동물 산책": [
    { rank: 1, key: "comfort", weight: 25, reason: "혼잡도와 소음, 그늘 환경이 반려동물 산책에 중요합니다." },
    { rank: 2, key: "weather", weight: 20, reason: "기온과 체감온도로 바닥 열기와 산책 쾌적도를 판단합니다." },
    { rank: 3, key: "access", weight: 15, reason: "주차와 편의시설, 이동 동선을 확인합니다." },
    { rank: 4, key: "activity", weight: 15, reason: "반려동물과 걷기 좋은 해변 특성을 반영합니다." },
    { rank: 5, key: "safety", weight: 10, reason: "보행 구간의 위험 요소와 안전 상태를 확인합니다." },
    { rank: 6, key: "scenery", weight: 10, reason: "함께 즐길 수 있는 해안 풍경을 고려합니다." },
    { rank: 7, key: "marine", weight: 5, reason: "바다 상태는 산책 판단의 보조 요소입니다." },
  ],
};

export default function ScoreGuideBridge() {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState("산책");

  useEffect(() => {
    const readActivity = () => {
      const next = document.querySelector<HTMLElement>(".activity-grid .chosen")?.innerText.replace("선택됨", "").trim() || "산책";
      setActivity(current => current === next ? current : (rankings[next] ? next : "산책"));
    };
    readActivity();
    const timer = window.setInterval(readActivity, 300);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const card = document.querySelector<HTMLElement>(".beach-detail");
    if (!card || card.querySelector(".score-guide-help")) return;
    card.style.position = "relative";
    const button = document.createElement("button");
    button.className = "score-guide-help";
    button.textContent = "?";
    button.setAttribute("aria-label", "추천 점수 기준 보기");
    button.onclick = () => setOpen(true);
    card.append(button);
    return () => button.remove();
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, []);

  if (!open) return null;
  const rows = rankings[activity] || rankings["산책"];
  return <div className="score-guide-overlay" onMouseDown={() => setOpen(false)}>
    <section className="score-guide-modal" role="dialog" aria-modal="true" aria-labelledby="score-guide-title" onMouseDown={event => event.stopPropagation()}>
      <button className="score-guide-close" onClick={() => setOpen(false)} aria-label="추천 점수 기준 닫기">×</button>
      <p>SCORE GUIDE</p>
      <h2 id="score-guide-title">{activity} 추천 평가 기준</h2>
      <span>{activity} 목적에 맞게 미리 정의된 고유 우선순위입니다. 같은 비율이라도 판단 이유에 따라 순위가 다릅니다.</span>
      <article><b>점수 계산 방식</b><strong>기준 점수 × 활동별 가중치 = 기여점수</strong><small>7개 기준의 기여점수를 합산해 최종 추천 점수를 계산합니다.</small></article>
      <article><b>우선순위와 가중치</b>{rows.map(row => <div className="guide-row" key={row.key}>
        <strong>{row.rank}위 · {info[row.key].name}</strong><span>{row.weight}%</span><small>{row.reason}<br />사용 데이터: {info[row.key].data}</small>
      </div>)}</article>
      <article><b>계산식</b><small>최종 추천 점수 = {rows.map(row => `${info[row.key].name} × ${row.weight}%`).join(" + ")}</small></article>
      <article><b>안전 게이트</b><small>공식 입수통제, 이안류·강풍·파고 위험이 확인되면 높은 점수여도 물놀이를 추천하지 않습니다.</small></article>
    </section>
  </div>;
}
