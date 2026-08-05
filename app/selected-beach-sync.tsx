"use client";
import { useEffect } from "react";
export default function SelectedBeachSync(){useEffect(()=>{let last="";const sync=()=>{const name=document.querySelector<HTMLElement>(".recommend-result h3")?.textContent||"";if(!name||name===last)return;const pin=[...document.querySelectorAll<HTMLElement>(".pin")].find(x=>x.querySelector("small")?.textContent===name.replace("해수욕장",""));if(pin){last=name;pin.click()}};sync();const id=setInterval(sync,500);return()=>clearInterval(id)},[]);return null}
