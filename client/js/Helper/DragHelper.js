import {App, Helper} from "cordova-sites";

export class DragHelper {
    static init() {
        window.addEventListener("mouseup", () => {
            this._endDrag();
        });
        window.addEventListener("mousemove", e => {
           this._dragMove(e.clientY)
        });
        window.addEventListener("touchend", () => {
            this._endDrag();
        });
        window.addEventListener("touchmove", e => {
            this._dragMove(e.targetTouches[0].clientY)
        });

        this._draggendListeners = [];
    }

    static async makeDragToShow(elem, listener, threshold) {
        threshold = Helper.nonNull(threshold, 15);

        elem.addEventListener("mousedown", e => {
            this._beginDrag(elem, e.clientY);
        });
        elem.addEventListener("touchstart", e => {
            if (e.targetTouches.length === 1){
                this._beginDrag(elem, e.targetTouches[0].clientY);
            }
        });

        elem.classList.add("draggable");
        elem.dataset["originalTop"] = window.getComputedStyle(elem).getPropertyValue("top").replace("px", "");
        elem.dataset["dragThreshold"] = threshold;

        this._draggendListeners[elem] = listener;
    }

    static _beginDrag(elem, y){
        if (elem.classList.contains("draggable")) {
            DragHelper.mouseDownData = {
                element: elem,
                y: y,
                topStart: parseFloat(window.getComputedStyle(elem).getPropertyValue("top").replace("px", "")),
                thresholdOverridden: false,
            };
        }
    }

    static _dragMove(y){
        if (DragHelper.mouseDownData !== null) {
            let yDiff = DragHelper.mouseDownData.y - y;
            let elem = DragHelper.mouseDownData.element;
            let topStart = DragHelper.mouseDownData.topStart;

            //Set originalTop if not set before
            let maxTop = elem.dataset["originalTop"];
            if (maxTop.trim() === "") {
                maxTop = topStart;
                elem.dataset["originalTop"] = maxTop;
            } else {
                maxTop = parseFloat(maxTop);
            }

            //Set new top only if threshold is overridden
            if (topStart !== maxTop || DragHelper.mouseDownData.thresholdOverridden || yDiff > elem.dataset["dragThreshold"]) {
                elem.classList.add("is-dragging");
                if (topStart - yDiff < maxTop) {
                    elem.style.top = Math.max(topStart - yDiff, 0) + "px";
                } else {
                    elem.style.top = maxTop + "px";
                }
                DragHelper.mouseDownData.thresholdOverridden = true;
            }
        }
    }

    static _endDrag(){
        if (DragHelper.mouseDownData !== null) {
            if (DragHelper.mouseDownData.thresholdOverridden) {
                let elem = DragHelper.mouseDownData.element;
                requestAnimationFrame(() => {
                    elem.classList.remove("is-dragging");
                });
                if (typeof this._draggendListeners[elem] === "function") {
                    this._draggendListeners[elem](DragHelper.mouseDownData.topStart, parseFloat(window.getComputedStyle(elem).getPropertyValue("top").replace("px", "")));
                }
            }
            DragHelper.mouseDownData = null;
        }
    }
}

App.addInitialization(() => {
    DragHelper.init();
});
DragHelper.mouseDownData = null;