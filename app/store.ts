import { createStore, useStoreUntyped } from "@artempoletsky/easystore";


export const Store = createStore({
  initialValues: {
    tapsCount: 0,
  }
});


export function useStore<KeyT extends keyof typeof Store>(key: KeyT) {
  return useStoreUntyped<typeof Store, KeyT>(key);
}