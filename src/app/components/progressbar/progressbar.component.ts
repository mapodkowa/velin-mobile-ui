import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
    selector: 'app-progress',
    templateUrl: './progressbar.component.html',
    styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {

    @ViewChild('bar', {read: ElementRef, static: false}) barElement: ElementRef;

    constructor() {
    }

    @Input() value: number;
    @Input() dragEnabled = true;
    @Output() userChangedValue = new EventEmitter<number>();
    @Output() userMovedValue = new EventEmitter<number>();

    userValue = -1;
    positionDrag = false;
    positionDragBlockClick = false;

    ngOnInit(): void {
    }

    @HostListener('click', ['$event'])
    onProgressClick(event): void {
        if (this.positionDragBlockClick) {
            this.positionDragBlockClick = false;
            return;
        }

        if (!this.dragEnabled) {
            return;
        }

        // console.log('onProgressClick', event);
        this.userChangedValue.emit((event.x - this.barElement.nativeElement.offsetLeft) * 100.0 /
            this.barElement.nativeElement.offsetWidth);
    }

    positionTouchStart(event: any): void {
        // console.log('positionTouchStart', event);

        if (!this.dragEnabled) {
            return;
        }

        this.positionDrag = true;
        this.positionDragBlockClick = true;
    }

    @HostListener('window:touchend', ['$event'])
    positionTouchEnd(event: any): void {
        // console.log('positionTouchEnd', event);

        if (!this.positionDrag) {
            return;
        }

        this.positionDrag = false;
        if (event !== undefined && this.userValue > -1) {
            this.userChangedValue.emit(this.userValue);
            this.value = this.userValue;
        }

        this.userValue = -1;
    }

    @HostListener('window:touchmove', ['$event'])
    touchMove(event): void {
        // console.log('touchMove', event);

        if (!this.positionDrag) {
            return;
        }

        if (event.touches.length > 0) {
            const touch = event.touches[0];

            const tempValue = (touch.clientX - this.barElement.nativeElement.offsetLeft) * 100.0 /
                this.barElement.nativeElement.offsetWidth;
            if (tempValue >= 0 && tempValue <= 100) {
                this.userValue = tempValue;
                this.userMovedValue.emit(this.userValue);
            }
        }
    }

}
