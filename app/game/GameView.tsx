"use client";

// import Konva from "konva";
import { useEffect, useRef } from "react";
import css from "./game.module.css";
// import { createEffectsLayer, removeEffectsLayer } from "./effects";
// import { Button } from "@mantine/core";
import * as game from "./game";
import { useStore } from "../store";
// import { useStore } from "../store";



export default function GameView() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tapsCount,] = useStore("tapsCount");
  const [lastTouches,] = useStore("lastTouches");
  const [heat,] = useStore("heat");

  function onWindowResize(e: UIEvent) {
    const { clientWidth, clientHeight } = containerRef.current!;
    game.resize(clientWidth, clientHeight);
  }


  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    game.init(containerRef.current!);
    return () => {
      game.destroy();
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div className={css.game + " text-white text-lg"}>
    <div className="p-3">Taps: {tapsCount}</div>
    <ul className="absolute right-0 top-0 p-3">
      <div>Heat: {heat}</div>
      {lastTouches.map((t, i) => <li key={i}>{t.x} | {t.y}</li>)}
    </ul>
    <div ref={containerRef} className={css.konva}></div>
    {/* {spawnMode && <div className={css.spawn_hint}>Click on canvas to spawn rectangle</div>} */}
    {/* <div className={css.game_menu}>
      <Button onClick={() => {
        setSpawnMode(!spawnMode);
      }}>Spawn Rectangle</Button>
    </div> */}
  </div>;
}