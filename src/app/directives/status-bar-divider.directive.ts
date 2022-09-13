import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {BridgeService} from '../providers/bridge/bridge.service';

@Directive({
    selector: '[appStatusBarDivider]'
})
export class StatusBarDividerDirective implements OnInit {

    @Input() margin = 0;
    @Input() styleToApply = 'padding-top';

    constructor(
        private el: ElementRef,
        private bridge: BridgeService) {
    }

    ngOnInit(): void {
        this.el.nativeElement.style[this.styleToApply] = this.bridge.app.statusBarHeight + this.convertRemToPixels(this.margin) + 'px';
    }

    convertRemToPixels(rem): number {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

}
