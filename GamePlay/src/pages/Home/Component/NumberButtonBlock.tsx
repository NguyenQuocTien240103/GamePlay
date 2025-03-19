import { useEffect, useState, useRef } from "react";
import { usePointStore, useControlStore, useTitleStore, useTimerStore, useStepStore, useNumberButton } from "@/store";
import { createArrayObjectNumber } from "@/utils";
import { Button } from "@/components/ui/button";

interface NumberBlockProps {
    width: number;
    height: number;
}
interface NumberObject {
    number: number;
    positionX: number;
    positionY: number;
}
let arrayObjectNumberTemp: NumberObject[] = [];
const NumberButtonBlock: React.FC<NumberBlockProps> = ({ width, height }) => {
    const buttonsRef = useRef<HTMLButtonElement[]>([]);
    const intervalRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
    // const { intervalId, setIntervalId } = useIntervalStore();
    const [arrayNumberObject, setArrayNumberOject] = useState<NumberObject[]>([]);
    const { point } = usePointStore();
    const { setStep } = useStepStore()
    const { setTitle } = useTitleStore();
    const { timerId, setTimerId } = useTimerStore();
    const { isReset, setButtonAutoDisabled } = useControlStore();
    const { displayNumberButtons, setDisplayNumberButtons, removeFirstDisplayButton, isNumberButtonClicked, setNumberButtonClicked } = useNumberButton();

    useEffect(() => {
        if (buttonsRef.current.length > 0) {
            setDisplayNumberButtons(buttonsRef.current);
        }

    }, [arrayNumberObject]);

    useEffect(() => {
        if (displayNumberButtons) {
            if (isNumberButtonClicked) {
                arrayObjectNumberTemp.shift();
            }
        }

    }, [displayNumberButtons]);

    useEffect(() => {
        let arrayObjectNumber = createArrayObjectNumber(point, width, height);
        arrayObjectNumberTemp = [...arrayObjectNumber];

        buttonsRef.current.forEach((elemnt) => {
            elemnt.classList.remove('hidden', 'transition', 'duration-3000', 'opacity-50')
            elemnt.querySelector('.modifier')!.innerHTML = ""
        })

        setArrayNumberOject(arrayObjectNumber);

        return () => {
            intervalRef.current.forEach((interval) => clearInterval(interval));
        };
    }, [isReset]);
    // case 1:
    const handleOnClick = (numberClicked: number, index: number) => {
        const removedObject = arrayObjectNumberTemp!.shift();
        if (removedObject?.number === numberClicked) {
            setStep();
            removeFirstDisplayButton();
            let numbersDisplay = arrayNumberObject.length - 1;
            if (index === numbersDisplay) {
                setButtonAutoDisabled(false);

            }
            setNumberButtonClicked(false);
            let timeCurrent = 3000;
            let interval = setInterval(() => {
                buttonsRef.current[index].classList.add('transition', 'duration-3000', 'opacity-50')
                buttonsRef.current[index].querySelector('.modifier')!.innerHTML = (timeCurrent / 1000).toFixed(1);
                timeCurrent -= 100;
                if (timeCurrent === 0) {
                    buttonsRef.current[index].classList.add('hidden')
                    clearInterval(interval);
                    // case 1:
                    if (index + 1 === point) {
                        if (timerId) {
                            clearInterval(timerId);
                            setTimerId(null);
                        }
                        setTitle("ALL CLEARED");
                    }
                }
            }, 100)
            intervalRef.current.set(index, interval);
        } else {
            // case 2:
            intervalRef.current.forEach((interval) => clearInterval(interval));
            if (timerId) {
                clearInterval(timerId);
                setTimerId(null);
            }
            setTitle("GAME OVER");
        }
    };

    return (
        <>
            {arrayNumberObject?.map((obj, index) => (
                <div key={obj.number}>
                    <Button
                        ref={(element) => {
                            if (element) {
                                buttonsRef.current[index] = element;
                            }
                        }}
                        key={obj.number}
                        style={{ top: `${Math.abs(obj.positionY - 48)}px`, left: `${Math.abs(obj.positionX - 48)}px` }}
                        className="absolute w-12 h-12 rounded-full text-xs flex flex-col leading-none gap-0.5"
                        onClick={() => handleOnClick(obj.number, index)}
                    >
                        <p>{obj.number}</p>
                        <p className="modifier text-[10px]"></p>
                    </Button>
                </div>
            ))}
        </>
    );
};

export { NumberButtonBlock }


