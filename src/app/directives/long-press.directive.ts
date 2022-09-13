import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';

@Directive({
    selector: '[appLongPress]'
})
export class LongPressDirective {

    @Input() longPressTime = 300;
    @Output() shortPress = new EventEmitter<void>();
    @Output() longPress = new EventEmitter<void>();

    readonly deadZone = 20;

    pressTime = 0;
    pressInterval: number;
    startTouch: Touch;
    stopTouch: Touch;
    cancelTouch = false;
    handled = false;

    constructor(private el: ElementRef) {
        this.el.nativeElement.addEventListener('touchstart', (event) => this.onTouchStart(event), {passive: true});
        this.el.nativeElement.addEventListener('touchmove', (event) => this.onTouchMove(event), {passive: true});
        this.el.nativeElement.addEventListener('touchend', () => this.onTouchEnd(), {passive: true});
    }

    onTouchStart(event: TouchEvent): void {
        // console.log('onTouchStart()', event.touches.item(0));

        if (this.pressInterval) {
            clearInterval(this.pressInterval);
            this.pressInterval = undefined;
        }

        this.startTouch = event.touches.item(0);
        this.cancelTouch = false;
        this.handled = false;

        // Prevent accidental open while using back gesture
        if (window.innerWidth - this.startTouch.clientX < this.deadZone) {
            this.cancelTouch = true;
            return;
        }

        this.pressTime = 0;
        this.pressInterval = setInterval(() => {
            this.pressTime += 10;

            if (this.pressTime > this.longPressTime && !this.cancelTouch) {
                navigator.vibrate(5);

                this.onTouchEnd();
                this.handled = true;
            }
        }, 10);
    }

    onTouchMove(event: TouchEvent): void {
        const touch = event.touches.item(0);
        const distance = Math.hypot((this.startTouch.clientX - touch.clientX), (this.startTouch.clientY - touch.clientY));
        // console.log('onTouchMove() distance = ' + distance);

        if (distance > 10) {
            this.cancelTouch = true;

            clearInterval(this.pressInterval);
            this.pressInterval = undefined;
        }
    }

    onTouchEnd(): void {
        // console.log('onTouchEnd()');

        if (this.cancelTouch || this.handled) {
            return;
        }

        this.handled = true;

        if (this.pressInterval) {
            clearInterval(this.pressInterval);
            this.pressInterval = undefined;
        }

        if (this.pressTime > this.longPressTime) {
            this.longPress.emit();
        } else {
            this.shortPress.emit();
        }
    }

}
