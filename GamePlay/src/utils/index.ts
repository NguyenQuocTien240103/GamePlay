interface NumberObject {
    number: number;
    positionX: number;
    positionY: number;
}

const createArrayObjectNumber = (points: number, width: number, height: number): NumberObject[] => {
    let arrObj: NumberObject[] = [];

    for (let i = 0; i < points; i++) {
        let obj = {
            number: i + 1,
            positionX: Math.floor(Math.random() * width),
            positionY: Math.floor(Math.random() * height),
        }
        arrObj.push(obj);
    }

    return arrObj;
}

export { createArrayObjectNumber }