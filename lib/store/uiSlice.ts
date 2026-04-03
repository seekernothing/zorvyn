import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Role, ActiveTab } from "./types";

interface UiState {
  role: Role;
  activeTab: ActiveTab;
  selectedMonth: number; // 0-11
  selectedYear: number;
}

const initialState: UiState = {
  role: "viewer",
  activeTab: "overview",
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
    setSelectedMonth: (state, action: PayloadAction<number>) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
  },
});

export const { setRole, setActiveTab, setSelectedMonth, setSelectedYear } = uiSlice.actions;

export const selectRole = (state: { ui: UiState }) => state.ui.role;
export const selectActiveTab = (state: { ui: UiState }) => state.ui.activeTab;

export default uiSlice.reducer;
