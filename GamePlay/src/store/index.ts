import { create } from "zustand";

interface ControlState {
    isReset: boolean;
    setReset: (by: boolean) => void;
    isButtonAutoDisabled: boolean;
    setButtonAutoDisabled: (key: boolean) => void;
}

interface PointState {
    point: number;
    setPoint: (by: number) => void;
}

interface TitleState {
    title: string;
    setTitle: (by: string) => void;

}

interface StepState {
    step: number;
    setStep: () => void;
    resetStep: () => void;
}

interface TimerState {
    timerId: NodeJS.Timeout | null;
    setTimerId: (id: NodeJS.Timeout | null) => void;
}

interface NumberButtonSate {
    isNumberButtonClicked: boolean;
    setNumberButtonClicked: (key: boolean) => void;
    displayNumberButtons: HTMLButtonElement[] | null;
    setDisplayNumberButtons: (array: HTMLButtonElement[]) => void;
    removeFirstDisplayButton: () => void;
    resetDisplayNumberButtons: () => void;
}

const useControlStore = create<ControlState>()((set) => ({
    isReset: true,
    setReset: (by) => set(() => ({ isReset: by })),
    isButtonAutoDisabled: false,
    setButtonAutoDisabled: (by) => set(() => ({
        isButtonAutoDisabled: by,
    })),

}));

const usePointStore = create<PointState>()((set) => ({
    point: 0,
    setPoint: (by) =>
        set(() => ({
            point: by,
        })),
}));

const useTitleStore = create<TitleState>()((set) => ({
    title: "LET'S PLAY",
    setTitle: (by) => set(() => ({ title: by })),
}));

const useStepStore = create<StepState>()((set) => ({
    step: 1,
    setStep: () => set((state) => ({ step: state.step + 1 })),
    resetStep: () => set(() => ({ step: 1 })),

}));

const useTimerStore = create<TimerState>()((set) => ({
    timerId: null,
    setTimerId: (id) => set(() => ({ timerId: id })),
}));

const useNumberButton = create<NumberButtonSate>()((set) => ({
    isNumberButtonClicked: false,
    setNumberButtonClicked: (key) => set(() => ({
        isNumberButtonClicked: key
    })),
    displayNumberButtons: null,
    setDisplayNumberButtons: (array) => set(() => ({
        displayNumberButtons: [...array],
    })),
    removeFirstDisplayButton: () => set((state) => ({
        displayNumberButtons: state.displayNumberButtons ? [...state.displayNumberButtons.slice(1)] : [],
    })),
    resetDisplayNumberButtons: () => set(() => ({
        displayNumberButtons: null,
    })),

}));

export { usePointStore, useControlStore, useTitleStore, useTimerStore, useStepStore, useNumberButton };
