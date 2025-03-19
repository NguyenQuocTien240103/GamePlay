import { useRef, useEffect } from "react";
import { useControlStore, useTimerStore, useTitleStore } from "@/store";

const TimeBlock: React.FC = () => {
    const displayTimeRef = useRef<HTMLDivElement | null>(null);
    const { setTitle } = useTitleStore();
    const { isReset } = useControlStore();
    const { timerId, setTimerId } = useTimerStore();

    useEffect(() => {
        setTitle("LET'S PLAY");
        if (timerId) {
            clearInterval(timerId);
        }
        let initialTime: number = 0;
        const newInterval = setInterval(() => {
            initialTime += 100;
            if (displayTimeRef.current) {
                displayTimeRef.current.innerText = (initialTime / 1000).toFixed(1) + "s";
            }
        }, 100)
        setTimerId(newInterval);
        return () => {
            clearInterval(newInterval);
        };
    }, [isReset]);

    return (
        <>
            <div ref={displayTimeRef}></div>
        </>
    );
};

export { TimeBlock }
