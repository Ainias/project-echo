import { App, Helper } from 'cordova-sites';

export class DragHelper {
    static init() {
        window.addEventListener('mouseup', (e) => {
            this._endDrag(e);
        });
        window.addEventListener('mousemove', (e) => {
            this._dragMove(e.clientY);
        });
        window.addEventListener('touchend', (e) => {
            this._endDrag(e);
        });
        window.addEventListener('touchmove', (e) => {
            this._dragMove(e.targetTouches[0].clientY);
        });

        this._draggendListeners = [];
    }

    static async makeDragToShow(elem, listener, threshold) {
        threshold = Helper.nonNull(threshold, 15);

        elem.addEventListener('mousedown', (e) => {
            this._beginDrag(elem, e.clientY, e);
        });
        elem.addEventListener('touchstart', (e) => {
            if (e.targetTouches.length === 1) {
                this._beginDrag(elem, e.targetTouches[0].clientY, e);
            }
        });

        elem.classList.add('draggable');
        elem.dataset.originalTop = window.getComputedStyle(elem).getPropertyValue('top').replace('px', '');
        elem.dataset.dragThreshold = threshold;

        this._draggendListeners[elem] = listener;
    }

    static _beginDrag(elem, y, e) {
        if (elem.classList.contains('draggable')) {
            DragHelper.mouseDownData = {
                element: elem,
                y,
                topStart: parseFloat(window.getComputedStyle(elem).getPropertyValue('top').replace('px', '')),
                thresholdOverridden: false,
                event: e,
            };
        }
    }

    static _dragMove(y) {
        if (DragHelper.mouseDownData !== null) {
            const yDiff = DragHelper.mouseDownData.y - y;
            const elem = DragHelper.mouseDownData.element;
            const {topStart} = DragHelper.mouseDownData;

            // Set originalTop if not set before
            let maxTop = elem.dataset.originalTop;
            if (maxTop.trim() === '') {
                maxTop = topStart;
                elem.dataset.originalTop = maxTop;
            } else {
                maxTop = parseFloat(maxTop);
            }

            // Set new top only if threshold is overridden
            if (
                topStart !== maxTop ||
                DragHelper.mouseDownData.thresholdOverridden ||
                yDiff > elem.dataset.dragThreshold
            ) {
                elem.classList.add('is-dragging');
                DragHelper.mouseDownData.event.stopPropagation();
                if (topStart - yDiff < maxTop) {
                    elem.style.top = `${Math.max(topStart - yDiff, 0)  }px`;
                } else {
                    elem.style.top = `${maxTop  }px`;
                }
                DragHelper.mouseDownData.thresholdOverridden = true;
            }
        }
    }

    static _endDrag(e) {
        if (DragHelper.mouseDownData !== null) {
            if (DragHelper.mouseDownData.thresholdOverridden) {
                e.stopPropagation();
                const elem = DragHelper.mouseDownData.element;
                requestAnimationFrame(() => {
                    elem.classList.remove('is-dragging');
                });
                if (typeof this._draggendListeners[elem] === 'function') {
                    this._draggendListeners[elem](
                        DragHelper.mouseDownData.topStart,
                        parseFloat(window.getComputedStyle(elem).getPropertyValue('top').replace('px', ''))
                    );
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
