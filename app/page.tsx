"use client";

import { useEffect, useState } from "react";

type Zone = "A" | "B" | "C" | "D";

const zones = {
  A: { name: "민락수변공원", level: "혼잡", people: "3,420명", rate: "87%", color: "#ff6b5f", status: "입장 지연 예상", time: "18분" },
  B: { name: "광안리 중앙", level: "보통", people: "2,180명", rate: "62%", color: "#ffb84e", status: "여유 공간 확인", time: "7분" },
  C: { name: "남천 해변", level: "여유", people: "980명", rate: "31%", color: "#3fcf9c", status: "추천 구역", time: "바로 입장" },
  D: { name: "호메르스 앞", level: "주의", people: "2,870명", rate: "74%", color: "#a579ff", status: "이동량 증가 중", time: "12분" },
} as const;

export default function Home() {
  const [selected, setSelected] = useState<Zone>("C");
  const [time, setTime] = useState("오후 3:24");
  const [alert, setAlert] = useState(false);
  const zone = zones[selected];

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date())), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">◌</span><b>BEACH:ON</b><span>SMART GWANGALLI</span></div>
        <div className="top-actions"><button className="weather">☀️ 27° <small>맑음</small></button><button className="profile" aria-label="내 프로필">김</button></div>
      </header>

      <section className="hero">
        <div><p className="eyebrow"><i /> AI LIVE MONITORING</p><h1>오늘의 광안리,<br /><em>어디가 가장 여유로울까요?</em></h1><p className="hero-copy">AI가 CCTV·센서·이동 데이터를 분석해<br />해변의 현재 혼잡도를 안내합니다.</p></div>
        <div className="live-card"><span className="live-dot" /> <b>실시간 업데이트</b><time>{time} 기준</time><strong>6,942<span>명</span></strong><small>현재 해변 방문객 추정</small></div>
      </section>

      <section className="content-grid">
        <section className="map-panel">
          <div className="panel-heading"><div><p className="eyebrow">LIVE BEACH MAP</p><h2>구역별 혼잡도</h2></div><button className="expand" aria-label="지도 확대">⛶</button></div>
          <div className="beach-map" aria-label="광안리 해변 혼잡도 지도">
            <div className="ocean"><span>광안대교</span><i /><i /><i /></div>
            <div className="shoreline" />
            <div className="map-label g1">광안리해수욕장</div><div className="map-label g2">금련산역</div><div className="map-label g3">민락수변공원</div>
            {(Object.keys(zones) as Zone[]).map((key) => <button key={key} onClick={() => setSelected(key)} className={`zone zone-${key} ${selected === key ? "active" : ""}`} style={{ "--zone": zones[key].color } as React.CSSProperties} aria-label={`${zones[key].name} ${zones[key].level}`}><span>{key}</span><b>{zones[key].rate}</b></button>)}
            <div className="you-are-here"><span /> 현재 위치</div>
            <div className="map-credit">ⓘ AI 추정 혼잡도</div>
          </div>
          <div className="legend"><span><i className="green" /> 여유 0–40%</span><span><i className="yellow" /> 보통 41–70%</span><span><i className="purple" /> 주의 71–80%</span><span><i className="red" /> 혼잡 81%+</span></div>
        </section>

        <aside className="insight-panel">
          <p className="eyebrow">AI INSIGHT</p><h2>지금, 가장 편안한 선택</h2>
          <div className="recommend"><div className="spark">✦</div><div><span>AI 추천 구역</span><h3>남천 해변 <b>Zone C</b></h3><p>현재 가장 여유로운 구역이에요.</p></div><strong>31<small>%</small></strong></div>
          <div className="mini-stats"><article><span>도보 예상</span><b>8 <small>분</small></b><i>↗ 현재 위치 기준</i></article><article><span>1시간 후</span><b className="green-text">여유</b><i>↘ 혼잡도 유지 예상</i></article></div>
          <button className="route-btn" onClick={() => setAlert(true)}>추천 경로 안내 받기 <span>→</span></button>
        </aside>
      </section>

      <section className="status-strip"><div className="section-title"><p className="eyebrow">ZONE STATUS</p><h2>해변 현황</h2></div><div className="zone-cards">{(Object.keys(zones) as Zone[]).map((key) => <button onClick={() => setSelected(key)} className={`status-card ${selected === key ? "selected" : ""}`} key={key}><span style={{ background: zones[key].color }}>ZONE {key}</span><b>{zones[key].name}</b><strong>{zones[key].level}</strong><small>{zones[key].people} · {zones[key].status}</small></button>)}</div></section>

      <section className="selected-detail" style={{ "--accent": zone.color } as React.CSSProperties}><div className="detail-dot" /><div><p>ZONE {selected} · 실시간 현황</p><h2>{zone.name}은 현재 <em>{zone.level}</em> 상태예요</h2></div><div className="detail-metric"><b>{zone.people}</b><span>방문객 추정</span></div><div className="detail-metric"><b>{zone.time}</b><span>예상 대기</span></div><button onClick={() => setAlert(true)}>알림 설정</button></section>

      {alert && <div className="modal-backdrop" role="dialog" aria-modal="true"><section className="modal"><button className="close" onClick={() => setAlert(false)} aria-label="닫기">×</button><span className="modal-icon">✓</span><p>알림이 설정되었습니다</p><h2>{zone.name}의 혼잡도가 바뀌면<br />바로 알려드릴게요.</h2><button onClick={() => setAlert(false)}>확인</button></section></div>}
    </main>
  );
}
