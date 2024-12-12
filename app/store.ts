import { createStore, useStoreUntyped } from "@artempoletsky/easystore";

export type Store = {
  tapsCount: number;
  heat: number;
  lastTouches: { x: number, y: number }[]
};

export const Store = createStore<Store>({
  initialValues: {
    heat: 0,
    tapsCount: 0,
    lastTouches: []
  }
});


export function useStore<KeyT extends keyof Store>(key: KeyT) {
  return useStoreUntyped<Store, KeyT>(key);
}