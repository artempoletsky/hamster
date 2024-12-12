"use client";

// import Konva from "konva";
import { useEffect, useRef } from "react";
import css from "./game.module.css";
// import { createEffectsLayer, removeEffectsLayer } from "./effects";
// import { Button } from "@mantine/core";
import * as game from "./game";
import { useStore } from "../store";
// import { useStore } from "../store";


function fitGameIntoViewport(viewport: HTMLDivElement, gameContainer: HTMLDivElement) {
  const gameRatio = 1229 / 2339;
  const containerW = viewport.clientWidth;
  const containerH = viewport.clientHeight;

  const containerRatio = containerW / containerH;

  // console.log(containerRatio, gameRatio);


  if (containerRatio > gameRatio) {
    gameContainer.style.width = containerH * gameRatio + "px";
    gameContainer.style.height = containerH + "px";
  } else {
    gameContainer.style.width = containerW + "px";
    gameContainer.style.height = containerW / gameRatio + "px";
  }
  // stageWidth = containerW;
  // stageHeight = containerH;
}


export default function GameView() {
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const konvaContainerRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const [tapsCount,] = useStore("tapsCount");
  const [lastTouches,] = useStore("lastTouches");
  const [heat,] = useStore("heat");

  function onWindowResize(e: UIEvent) {
    fitGameIntoViewport(viewportContainerRef.current!, gameContainerRef.current!);
    game.resize(konvaContainerRef.current!);
  }


  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    fitGameIntoViewport(viewportContainerRef.current!, gameContainerRef.current!);
    game.init(konvaContainerRef.current!);

    return () => {
      game.destroy();
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div ref={viewportContainerRef} className="grow min-h-[300px] text-white text-lg flex items-center justify-center">
    <div ref={gameContainerRef} className={css.game}>
      <div className="p-3">Taps: <span id="CoinsTarget">{tapsCount}</span></div>
      <ul className="absolute right-0 top-0 p-3">
        {/* <div>Heat: {heat}</div> */}
        {lastTouches.map((t, i) => <li key={i}>{t.x} | {t.y}</li>)}
      </ul>
      <div ref={konvaContainerRef} className={css.konva}></div>
    </div>
  </div>;
}