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
let tapTween: Konva.Tween;

function addHamster() {
  const imageRatio = 1445 / 1228;
  // console.log(stageHeight, stageWidth);

  Konva.Image.fromURL("/game/Boss_Hamster.png", function (image) {
    const width = stageWidth - 50;
    const height = imageRatio * width;
    hamster = image;
    image.setAttrs({
      offsetX: width / 2,
      offsetY: height / 2,
      x: stageWidth / 2,
      y: stageHeight * 0.95 - height / 2,
      // scaleX: 0.5,
      // scaleY: 0.5,
      width,
      height,
    });
    gameLayer.add(image);

    tapTween = new Konva.Tween({
      node: hamster,
      duration: 0.05,
      scaleX: 1.3,
      scaleY: 1.3,
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
  Store.tapsCount++;
  tapTween.play();
}

function onStageClick(e: KonvaEventObject<MouseEvent | TouchEvent>) {
  if ("touches" in e.evt) {
    // console.log(e.evt);
    if (e.evt.touches.length) {
      hamsterTap(e.evt.touches[0].clientX, e.evt.touches[0].clientY);
    } else {
      throw "Touches list is empty";
    }

  } else {
    hamsterTap(e.evt.layerX, e.evt.layerY);
  }
}

export function resize(width: number, height: number) {
  stage.width(width);
  stage.height(height);

  for (const shape of gameLayer.children) {
    const w = shape.width();
    const h = shape.height();
    if (w + shape.x() > width) {
      shape.x(width - w);
    }
    if (h + shape.y() > height) {
      shape.y(height - h);
    }
  }
}