import {AfterContentInit, Directive, ElementRef, Input, NgZone, Renderer2} from '@angular/core';

@Directive({
    selector: '[appFocus]'
})
export class FocusDirective implements AfterContentInit {

    @Input() autoFocus = true;
    @Input() timeout = 0;

    constructor(
        private el: ElementRef,
        private zone: NgZone,
        private renderer: Renderer2
    ) {}

    ngAfterContentInit(): void {
        if (!this.autoFocus) {
            return;
        }

        this.zone.runOutsideAngular(() => setTimeout(() => {
            this.renderer.selectRootElement(this.el.nativeElement).focus();
        }, this.timeout));
    }

}
