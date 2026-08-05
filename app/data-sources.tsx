"use client";

import { useState } from "react";

export function DataSources() {
  const [open, setOpen] = useState(false);
  return <>
    <button className="data-source-trigger" onClick={() => setOpen(true)}>ⓘ 데이터 출처</button>
    {open && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="데이터 출처"><section className="modal source-modal">
      <button className="close" onClick={() => setOpen(false)} aria-label="닫기">×</button>
      <p className="kicker">DATA PROVENANCE</p><h2>데이터 출처</h2>
      <article><b>현재 사용 데이터</b><p>Firebase Firestore · GitHub Actions 자동 수집</p></article>
      <article><b>기상 데이터</b><p>기상청 Open API · 매시 7분경 자동 수집 · 1시간 갱신</p></article>
      <article><b>해양 데이터</b><p>현재 Demo Data · 향후 국립해양조사원 Open API 연계</p></article>
      <article><b>추천 알고리즘</b><p>Rule-based Explainable AI</p></article>
      <small>실제 방문 전 기상청·국립해양조사원 및 현장 안전요원의 안내를 확인하세요.</small>
    </section></div>}
  </>;
}
