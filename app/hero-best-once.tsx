"use client";
import { useEffect } from "react";
export default function HeroBestOnce(){useEffect(()=>{const stat=document.querySelector<HTMLElement>(".hero-stat"),name=document.querySelector<HTMLElement>(".recommend-result h3")?.textContent;if(!stat||!name||stat.querySelector(".hero-best-once"))return;const label=document.createElement("b");label.className="hero-best-once";label.textContent=`오늘의 1순위 · ${name}`;stat.querySelector("span")?.after(label)},[]);return null}
