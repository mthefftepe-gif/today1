"use client";

import { useMemo, useState } from "react";

type View = "map" | "ar" | "meet";

const members = [
  { name: "민지", initials: "MJ", color: "#b4ff45", x: 64, y: 29, distance: "186m", status: "이동 중", battery: 82 },
  { name: "도윤", initials: "DY", color: "#c8b6ff", x: 31, y: 57, distance: "240m", status: "대기 중", battery: 47 },
  { name: "나", initials: "나", color: "#ff9c77", x: 49, y: 76, distance: "현재 위치", status: "", battery: 94 },
];

export default function Home() {
  const [view, setView] = useState<View>("map");
  const [sos, setSos] = useState(false);
  const [meeting, setMeeting] = useState(false);
  const [sharing, setSharing] = useState(true);
  const active = useMemo(() => members[0], []);

  return (
    <main className="app-shell">
      <section className="phone">
        <header className="topbar">
          <button className="group-button" aria-label="그룹 선택"><span className="tiny-stack">●●●</span> Summer Beat 2026 <span>⌄</span></button>
          <button className="profile" aria-label="내 프로필">나</button>
        </header>

        <div className="status-row">
          <span className="live-dot" /> <strong>위치 공유 중</strong><span>·</span><span>12:48에 종료</span>
          <button onClick={() => setSharing(!sharing)} className={sharing ? "share-toggle on" : "share-toggle"}>{sharing ? "ON" : "OFF"}</button>
        </div>

        {view === "map" && <MapView onAR={() => setView("ar")} onMeet={() => setView("meet")} />}
        {view === "ar" && <ArView active={active} onBack={() => setView("map")} />}
        {view === "meet" && <MeetView confirmed={meeting} onConfirm={() => setMeeting(true)} onBack={() => setView("map")} />}

        <section className="member-strip" aria-label="일행 상태">
          {members.slice(0, 2).map((m) => <article key={m.name} className="member-card"><div className="avatar" style={{ background: m.color }}>{m.initials}</div><div><b>{m.name}</b><span>{m.status} · {m.distance}</span></div><span className="battery">▰ {m.battery}%</span></article>)}
        </section>

        <nav className="bottom-nav" aria-label="주요 기능">
          <button className={view === "map" ? "selected" : ""} onClick={() => setView("map")}><span>⌖</span>지도</button>
          <button className={view === "ar" ? "selected" : ""} onClick={() => setView("ar")}><span>⌁</span>AR로 찾기</button>
          <button className={view === "meet" ? "selected" : ""} onClick={() => setView("meet")}><span>✦</span>만남 장소</button>
        </nav>
        <button className="sos-button" onClick={() => setSos(true)} aria-label="SOS 긴급 알림">SOS</button>

        {sos && <div className="modal-backdrop"><section className="sos-modal"><span className="warning">!</span><p>긴급 상황인가요?</p><h2>일행 전체에게 SOS를 보냅니다</h2><div className="sos-location">⌖ 현재 위치와 실시간 지도가 공유됩니다.</div><button className="send-sos" onClick={() => setSos(false)}>SOS 보내기</button><button className="cancel" onClick={() => setSos(false)}>취소</button></section></div>}
      </section>
    </main>
  );
}

function MapView({ onAR, onMeet }: { onAR: () => void; onMeet: () => void }) {
  return <><section className="map"><div className="map-grid" /><span className="zone z1">MAIN STAGE</span><span className="zone z2">FOOD & DRINKS</span><span className="zone z3">ART MARKET</span><span className="path p1" /><span className="path p2" /><span className="path p3" />{members.map((m) => <div className="map-person" key={m.name} style={{ left: `${m.x}%`, top: `${m.y}%` }}><i style={{ background: m.color }}>{m.initials}</i><b>{m.name}</b></div>)}<div className="map-card"><span className="map-card-icon">⌖</span><div><strong>민지까지 186m</strong><p>약 3분 · 위치 정확도 높음</p></div><button onClick={onAR}>찾기</button></div></section><section className="quick-actions"><button onClick={onAR}><span>⌁</span><b>AR로 찾기</b><small>카메라로 방향 안내</small></button><button onClick={onMeet}><span>✦</span><b>만남 장소</b><small>중간 지점 추천</small></button></section></>;
}

function ArView({ active, onBack }: { active: typeof members[0]; onBack: () => void }) {
  return <section className="ar-view"><div className="ar-noise" /><button className="back" onClick={onBack}>‹</button><span className="ar-live">● LIVE</span><div className="compass">W &nbsp; NW &nbsp; <b>N</b> &nbsp; NE &nbsp; E</div><div className="ar-arrow">↑</div><div className="ar-target"><div className="avatar" style={{ background: active.color }}>{active.initials}</div><b>민지는 이쪽이에요</b><strong>186m</strong><span>약 3분 거리 · 정확도 ±8m</span></div><p className="ar-tip">휴대폰을 들고 화살표 방향으로 이동하세요</p></section>;
}

function MeetView({ confirmed, onConfirm, onBack }: { confirmed: boolean; onConfirm: () => void; onBack: () => void }) {
  return <section className="meet-view"><button className="text-back" onClick={onBack}>‹ 지도</button><p className="eyebrow">AI MEETING POINT</p><h1>모두에게 가장<br />가까운 곳이에요.</h1><div className="place-card"><div className="place-icon">⌂</div><div><span>추천 만남 장소</span><h2>2번 출입구 안내소</h2><p>메인 스테이지 오른쪽, 분수대 앞</p></div><b className="score">92<span>점</span></b></div><div className="arrival"><span>나 <b>4분</b></span><i /><span>민지 <b>3분</b></span><i /><span>도윤 <b>5분</b></span></div><div className="reason"><b>왜 이곳인가요?</b><p>모두의 이동 시간이 짧고, 밝은 안내소 앞이라 찾기 쉬워요.</p></div><button className={confirmed ? "confirmed" : "confirm-meet"} onClick={onConfirm}>{confirmed ? "✓ 만남 장소가 공유됐어요" : "여기로 만나요"}</button></section>;
}
