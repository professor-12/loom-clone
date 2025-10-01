import { create } from "zustand";

type State = {
    isCollapsed: boolean;
};

type Actions = {
    open: () => void;
    close: () => void;
};

export const useSideBar = create<State & Actions>((set) => ({
    isCollapsed: false,
    open: () => {
        set((prev) => ({ ...prev, isCollapsed: false }));
    },
    close: () => {
        set({ isCollapsed: true });
    },
}));
