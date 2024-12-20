"use client";

import Konva from "konva";
// import { createEffectsLayer, removeEffectsLayer, runFireworks } from "./effects";
import { KonvaEventObject } from "konva/lib/Node";
import { Store } from "../store";
import debounce from "lodash.debounce";
// import { Store } from "../store";

let stage: Konva.Stage;
let gameLayer: Konva.Layer;
let coinsLayer: Konva.Layer;

let stageWidth = 0;
let stageHeight = 0;

let hamster: Konva.Image;
let hamsterContainer: Konva.Group;
let tapTween: Konva.Tween;

let coinsTarget = { x: 0, y: 0 };


function calculateHamsterScale() {
  let scale = 0.3 * Store.heat + 0.7;
  if (scale > 1) scale = 1;
  return scale;
}

function resizeHamster() {
  const imageRatio = 1445 / 1228;
  const width = stageWidth - 50;
  const height = imageRatio * width;
  hamster.setAttrs({
    offsetX: width / 2,
    offsetY: height / 2,
    x: width / 2,
    y: height / 2,
    // scaleX: 0.5,
    // scaleY: 0.5,
    width,
    height,
    shadowColor: "#f73325",
    shadowBlur: 10,
    // shadowOffsetX	Number	<optional>
    // shadowOffsetY	Number	<optional>
    shadowOpacity: 0,
    shadowEnabled: true,
  });

  const scale = calculateHamsterScale();
  hamsterContainer.setAttrs({
    scaleX: scale,
    scaleY: scale,
    offsetX: width / 2,
    offsetY: height,
    x: stageWidth / 2,
    y: stageHeight * 0.95,
  });
}

function addHamster() {
  // console.log(stageHeight, stageWidth);
  hamsterContainer = new Konva.Group();


  gameLayer.add(hamsterContainer);
  Konva.Image.fromURL("/game/Boss_Hamster.png", function (image) {
    hamster = image;
    resizeHamster();
    hamsterContainer.add(image);

    tapTween = new Konva.Tween({
      node: hamster,
      duration: 0.05,
      scaleX: 1.3,
      scaleY: 1.3,
      shadowOpacity: 0.6,
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        // tapTween.tween.duration = 0.1;
        tapTween.reverse();
      }
    });

  });

}

export function init(container: HTMLDivElement) {
  stageWidth = container.clientWidth;
  stageHeight = container.clientHeight;
  stage = new Konva.Stage({
    container: container,
    width: stageWidth,
    height: stageHeight,
  });

  gameLayer = new Konva.Layer();
  gameLayer.draw();
  stage.add(gameLayer);

  coinsLayer = new Konva.Layer();
  stage.add(coinsLayer);

  addHamster();

  stage.on("click touchstart", onStageClick);
}

export function destroy() {
  coinsLayer.remove();
  gameLayer.remove();
  stage.off("click touchstart", onStageClick);
  stage.remove();
}


function redrawHeat() {
  const scale = calculateHamsterScale();
  hamsterContainer.setAttrs({
    scaleX: scale,
    scaleY: scale,
  });
}

let coolInterval: ReturnType<typeof setInterval>;

const debouncedCool = debounce(() => {
  let t = 0;
  const tEnd = 5000;
  const heatStart = Store.heat;
  coolInterval = setInterval(() => {
    t += 100;
    const dt = t / tEnd;
    if (dt >= 1) {
      Store.heat = 0;
      clearInterval(coolInterval);
    } else {
      Store.heat = heatStart * (1 - Math.pow(dt, 3));
    }
    redrawHeat();
  }, 100);
}, 2000);

function hamsterTap(touchesCount: number) {
  Store.tapsCount += touchesCount;
  let heat = Store.heat;
  heat += touchesCount * 0.15;
  if (heat > 1) heat = 1;
  Store.heat = heat;
  clearInterval(coolInterval);
  debouncedCool();
  tapTween.play();
  if (navigator && "vibrate" in navigator){
    navigator.vibrate(200);
  }
}


function spawnCoin(x: number, y: number) {
  const target = document.getElementById("CoinsTarget")!;
  // console.log(target.offsetLeft, target.offsetTop);
  coinsTarget.x = target.offsetLeft + Math.random() * target.offsetWidth;
  coinsTarget.y = target.offsetTop + target.offsetHeight / 2;

  Konva.Image.fromURL("/game/Coin.png", function (coin) {
    const imageRatio = 631 / 641;
    const width = stageWidth / 6;
    const height = width * imageRatio;

    coin.setAttrs({
      x,
      y,
      offsetX: width / 2,
      offsetY: height / 2,
      width,
      height,
    });
    coinsLayer.add(coin);

    // const aY = -10;
    // let aX = 0;
    // const distanceScale = 20;

    coin.to({
      x: coinsTarget.x,
      y: coinsTarget.y,
      scaleX: 0.3,
      scaleY: 0.3,
      duration: 0.3,
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        coin.remove();
      }
    });

  });

}



function onStageClick(e: KonvaEventObject<MouseEvent | TouchEvent>) {
  if ("touches" in e.evt) {
    // console.log(e.evt);
    if (e.evt.touches.length) {
      hamsterTap(e.evt.touches.length);;
      let lastTouches: typeof Store.lastTouches = [];
      for (const t of e.evt.touches) {
        let x = Math.floor(t.clientX), y = Math.floor(t.clientY);
        spawnCoin(x, y);
        lastTouches.push({ x, y });
      }
      Store.lastTouches = lastTouches;
    } else {
      throw "Touches list is empty";
    }

  } else {
    const x = Math.floor(e.evt.layerX);
    const y = Math.floor(e.evt.layerY);
    hamsterTap(1);
    spawnCoin(x, y);
    Store.lastTouches = [{ x, y }];
  }

  redrawHeat();
}

export function resize(container: HTMLDivElement) {
  stageWidth = container.clientWidth;
  stageHeight = container.clientHeight;

  stage.width(stageWidth);
  stage.height(stageHeight);

  resizeHamster();
}