import {AfterContentInit, Directive, ElementRef, NgZone} from '@angular/core';

@Directive({
    selector: '[appFitText]'
})
export class FitTextDirective implements AfterContentInit {

    constructor(
        private el: ElementRef,
        private zone: NgZone
    ) {}

    private static isOverflown(element): boolean {
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }

    ngAfterContentInit(): void {
        this.zone.runOutsideAngular(() =>  {
            const el = this.el.nativeElement;
            let fontSize = Number.parseInt(window.getComputedStyle(el).fontSize, 10);

            for (let i = fontSize; i > 0; i -= 0.2) {
                if (FitTextDirective.isOverflown(el)) {
                    fontSize -= 0.1;
                    el.style.fontSize = fontSize + 'px';
                }
            }
        });
    }
}
