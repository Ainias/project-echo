import {Helper} from "cordova-sites";

export class Scaler {
    async scaleHeightFromWidth(element){
        await this.scale(element)
    }

    async scale(targetValue, getTargetValueFn, getScaleValueFn, setScaleValueFn, delta, addListenerElement) {

        delta = Helper.nonNull(delta, 0.0001);

        let currentValue = await getTargetValueFn();
        let currentDelta = Math.abs(targetValue-currentValue);
        while(currentDelta > delta){
            let previousValue = currentValue;
            let scaleValue = await getScaleValueFn();
            await setScaleValueFn(scaleValue*targetValue/currentValue);

            currentValue = await getTargetValueFn();
            if (currentValue === previousValue){
                break;
            }

            currentDelta = Math.abs(targetValue-currentValue);
        }

        if (addListenerElement) {
            addListenerElement.addEventListener("resize", async () => {
                await this.scale(targetValue, getTargetValueFn, getScaleValueFn, setScaleValueFn, delta);
            });
        }
    }
}