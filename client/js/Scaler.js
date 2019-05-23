import {Helper, PromiseHelper} from "cordova-sites";

export class Scaler {
    async scaleHeightThroughWidth(element, targetHeight) {
        element.style.transition = "none";
        await this.scale(targetHeight, async () => {
                return element.getBoundingClientRect().height;
                // return window.getComputedStyle(element, null).getPropertyValue("height").replace("px", "");
            },
            async () => {
                return element.getBoundingClientRect().width;
                // return window.getComputedStyle(element, null).getPropertyValue("width").replace("px", "");
            },
            width => {
                console.log("newWidth", (Math.fround(width*1000+0.00001)/1000));
                element.style.width = (Math.fround(width*1000+0.00001)/1000) + "px";
            }, null, element
        )
    }

    async scale(targetValueFunc, getTargetValueFn, getScaleValueFn, setScaleValueFn, delta, addListenerElement) {

        delta = Helper.nonNull(delta, 0.01);

        let targetValue = 0;
        if (typeof targetValueFunc === "function"){
            targetValue = await targetValueFunc();
        }
        else {
            targetValue = targetValueFunc;
        }
        targetValue = parseFloat(targetValue);

        let breakCount = 0;

        let previousValues = [];
        let currentValue = parseFloat(await getTargetValueFn());
        let currentDelta = Math.abs(targetValue - currentValue);
        while (currentDelta > delta) {
            let previousValue = currentValue;
            previousValues.push(previousValue);

            let scaleValue = parseFloat(await getScaleValueFn());
            console.log("T", scaleValue, "-", targetValue, " - ", currentValue, " - ", scaleValue * targetValue / currentValue);
            await setScaleValueFn(scaleValue * targetValue / currentValue);

            currentValue = parseFloat(await getTargetValueFn());
            console.log("diffs", Math.abs(previousValue - currentValue), " - ", Math.abs(targetValue - currentValue), " - ", delta);
            if (Math.abs(previousValue - currentValue) < delta/2 || previousValues.indexOf(currentValue) !== -1) {
                console.log("change too small or value already having, break");
                break;
            }

            currentDelta = Math.abs(targetValue - currentValue);
            breakCount++;
            if (breakCount >= 25){
                console.log("breaking after ", breakCount, " iterations");
                break;
            }
        }

        if (addListenerElement) {
            addListenerElement.addEventListener("resize", async () => {
                await this.scale(targetValueFunc, getTargetValueFn, getScaleValueFn, setScaleValueFn, delta);
            });
        }
    }
}