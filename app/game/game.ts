"use client";

import Konva from "konva";
// import { createEffectsLayer, removeEffectsLayer, runFireworks } from "./effects";
import { KonvaEventObject } from "konva/lib/Node";
import { Store } from "../store";
// import { Store } from "../store";

let stage: Konva.Stage;
let gameLayer: Konva.Layer;
let coinsLayer: Konva.Layer;

let stageWidth = 0;
let stageHeight = 0;

let hamster: Konva.Image;
let hamsterContainer: Konva.Group;
let tapTween: Konva.Tween;

let heat = 0;

function calculateHamsterScale() {
  let scale = Store.tapsCount / 50 + 0.5;

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
    shadowColor: "#ffffff",
    shadowBlur: 30,
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
      shadowOpacity: 1,
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


function hamsterTap(x: number, y: number) {
  tapTween.play();
}


function spawnCoin(x: number, y: number) {

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

    const aY = -10;
    // let aX = 0;
    const distanceScale = 20;
    const anim = new Konva.Animation(function (frame) {
      if (!frame) return;

      const t = frame.time / 1000;

      if (t > 1) {
        anim.stop();
        coin.remove();
        return;
      }
      coin.y(y + (t * -25 + aY * t * t / 2) * distanceScale);
      // coin.x(x + (t * 0 + aX * t * t / 2) * distanceScale);
      coin.opacity(1 - Math.pow(t, 4));
      // coin.rotation(t * rotations[i]);

      // shape.y(shape.y() + 1);
      // update stuff
    }, coinsLayer);

    anim.start();
  });

}

function onStageClick(e: KonvaEventObject<MouseEvent | TouchEvent>) {
  if ("touches" in e.evt) {
    // console.log(e.evt);
    if (e.evt.touches.length) {
      hamsterTap(e.evt.touches[0].clientX, e.evt.touches[0].clientY);
      let lastTouches: typeof Store.lastTouches = [];
      for (const t of e.evt.touches) {
        let x = t.clientX, y = t.clientY;
        spawnCoin(x, y);
        lastTouches.push({ x, y });
        Store.tapsCount++;
      }
      Store.lastTouches = lastTouches;
    } else {
      throw "Touches list is empty";
    }

  } else {
    const x = e.evt.layerX;
    const y = e.evt.layerY;
    hamsterTap(x, y);
    spawnCoin(x, y);
    Store.lastTouches = [{ x, y }];
    Store.tapsCount++;
  }

  const scale = calculateHamsterScale();
  hamsterContainer.setAttrs({
    scaleX: scale,
    scaleY: scale,
  });
}

export function resize(width: number, height: number) {
  stage.width(width);
  stage.height(height);

  stageWidth = width;
  stageHeight = height;

  resizeHamster();
}