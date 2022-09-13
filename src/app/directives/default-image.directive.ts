import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[appDefaultImage]'
})
export class DefaultImageDirective implements OnInit {

    @Input() reflowWidth = 1;
    @Input() reflowHeight = 1;

    constructor(
        private el: ElementRef
    ) {
    }

    ngOnInit(): void {
        this.el.nativeElement.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${this.reflowWidth} ${this.reflowHeight}'%3E%3C/svg%3E`;
    }

}
