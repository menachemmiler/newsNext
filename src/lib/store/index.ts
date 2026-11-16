import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "@/lib/store/newsSlice";
import uiReducer from "@/lib/store/uiSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      news: newsReducer,
      ui: uiReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
