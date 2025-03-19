import { useState, useRef, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { usePointStore, useControlStore, useTitleStore, useStepStore, useTimerStore, useNumberButton } from "@/store";
import { NumberButtonBlock, TimeBlock } from "./Component";

const Home = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const timeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const intervalRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const [displayTimeBlock, setDisplayTimeBlock] = useState<boolean>(false);
    const [isAuto, setIsAuto] = useState<boolean>(false);
    const { title, setTitle } = useTitleStore();
    const { point, setPoint } = usePointStore();
    const { timerId, setTimerId } = useTimerStore();
    const { step, setStep, resetStep } = useStepStore()
    const { isReset, setReset, isButtonAutoDisabled, setButtonAutoDisabled } = useControlStore();
    const { displayNumberButtons, removeFirstDisplayButton, setNumberButtonClicked } = useNumberButton();

    const handleOnClick = () => {
        setDisplayTimeBlock(true);
        setNumberButtonClicked(false);
        setButtonAutoDisabled(true);
        resetStep();
        if (inputRef.current) {
            const pointValue = parseInt(inputRef.current.value) || 0;
            if (pointValue <= 0) {
                alert("Please enter a number greater than 0!");
                return;
            }
            setPoint(pointValue);
        }
        setReset(!isReset);
    };

    useEffect(() => {
        return () => {
            intervalRef.current.forEach((interval) => clearInterval(interval));
            timeoutRef.current.forEach((timeout) => clearTimeout(timeout));

        };
    }, [isReset]);
    // case 5:
    const handleAutoPlay = () => {
        if (isAuto) {
            let count = 0;
            timeoutRef.current.forEach((timeout, index) => {
                timeoutRef.current.delete(index);
                clearTimeout(timeout);
                count++;
            });
            setIsAuto(false);
            setNumberButtonClicked(false);
            return;
        }
        setNumberButtonClicked(true);
        setIsAuto(true);
        let displayNumberButtonsTemp = [...displayNumberButtons!];
        displayNumberButtonsTemp?.forEach((element, index) => {
            let timeout = setTimeout(() => {
                removeFirstDisplayButton();
                setStep();
                let numbersDisplay = displayNumberButtonsTemp.length - 1;
                if (index === numbersDisplay) {
                    setButtonAutoDisabled(false);

                }
                timeoutRef.current.delete(index)
                let timeCurrent = 3000;
                let interval = setInterval(() => {
                    element.classList.add('transition', 'duration-3000', 'opacity-50')
                    element.querySelector('.modifier')!.innerHTML = (timeCurrent / 1000).toFixed(1);
                    timeCurrent -= 100;
                    if (timeCurrent === 0) {
                        element.classList.add('hidden')
                        clearInterval(interval);
                        if (index + 1 === displayNumberButtonsTemp.length) {
                            if (timerId) {
                                clearInterval(timerId);
                                setTimerId(null);
                            }
                            setTitle("ALL CLEARED");
                            setIsAuto(false);
                        }
                    }
                }, 100)
                intervalRef.current.set(index, interval);
            }, index * 1000);
            timeoutRef.current.set(index, timeout);
        }
        );
    }
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="border border-black p-4 bg-white">
                <h1 className="text-3xl font-bold text-center">{title}</h1>
                <div>
                    <div className="flex items-center">
                        <label className="font-semibold min-w-16">Points:</label>
                        <Input className="w-24 outline-none focus:border-none" ref={inputRef} defaultValue="5" />
                    </div>
                    <div className="flex items-center">
                        <label className="font-semibold min-w-16">Time:</label>
                        {
                            displayTimeBlock &&
                            <TimeBlock />
                        }
                    </div>
                </div>
                <div className={`mt-2 flex justify-between ${isAuto ? "pointer-events-none" : ""}`}>
                    <Button className="cursor-pointer" onClick={handleOnClick}>
                        {displayTimeBlock ? "Restart" : "Play"}
                    </Button>
                    <Button className={`cursor-pointer ${isButtonAutoDisabled ? "" : "hidden"} pointer-events-auto`} onClick={handleAutoPlay}>
                        {isAuto ? "Auto Play Off" : "Auto Play On"}
                    </Button>
                </div>

                <div className={`mt-2 border border-black h-64 w-xl flex flex-wrap relative ${isAuto ? "pointer-events-none" : ""}`}>
                    {displayTimeBlock &&
                        <NumberButtonBlock width={576} height={256} />
                    }
                </div>
                {
                    displayTimeBlock && step <= point &&
                    <p className="mt-1">Next {step}</p>
                }
            </div>
        </div>
    );
};

export default Home;
