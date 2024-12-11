"use client";

import Konva from "konva";
import { useEffect, useRef } from "react";
import css from "./game.module.css";
// import { createEffectsLayer, removeEffectsLayer } from "./effects";
// import { Button } from "@mantine/core";
import * as game from "./game";
import { useStore } from "../store";
// import { useStore } from "../store";



export default function GameView() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tapsCount, setTapsCount] = useStore("tapsCount");
  
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

  return <div className={css.game}>
    <div className="p-3 text-white text-lg">Taps: {tapsCount}</div>
    <div ref={containerRef} className={css.konva}></div>
    {/* {spawnMode && <div className={css.spawn_hint}>Click on canvas to spawn rectangle</div>} */}
    {/* <div className={css.game_menu}>
      <Button onClick={() => {
        setSpawnMode(!spawnMode);
      }}>Spawn Rectangle</Button>
    </div> */}
  </div>;
}