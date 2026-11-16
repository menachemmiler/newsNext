import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Article, ThemeMode } from "@/types/news";

interface UiState {
  theme: ThemeMode;
  bookmarks: Article[];
  fontScale: number;
  hydrated: boolean;
}

const initialState: UiState = {
  theme: "light",
  bookmarks: [],
  fontScale: 1,
  hydrated: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    toggleBookmark(state, action: PayloadAction<Article>) {
      const exists = state.bookmarks.some((item) => item.id === action.payload.id);
      state.bookmarks = exists
        ? state.bookmarks.filter((item) => item.id !== action.payload.id)
        : [action.payload, ...state.bookmarks];
    },
    setFontScale(state, action: PayloadAction<number>) {
      state.fontScale = Math.min(1.35, Math.max(0.9, action.payload));
    },
    hydrateUi(
      state,
      action: PayloadAction<{ theme: ThemeMode; bookmarks: Article[] }>,
    ) {
      state.theme = action.payload.theme;
      state.bookmarks = action.payload.bookmarks;
      state.hydrated = true;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  toggleBookmark,
  setFontScale,
  hydrateUi,
} = uiSlice.actions;

export default uiSlice.reducer;
