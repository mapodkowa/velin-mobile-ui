import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[appRandomColorSeed]'
})
export class RandomColorSeedDirective implements OnInit {
    private static modifier = 15;
    private static colors = [
        '#7D959F',
        '#529A7E',
        '#F3573B',
        '#E21CA2',
        '#599CF1',
        '#A2C2CE',
        '#E6B762',
        '#EE9829',
        '#DB0734',
        '#B595C7',
        '#A51294',
        '#6F6E70',
        '#096F50',
        '#529A7E'
    ];

    @Input('appRandomColorSeed') seed: string;

    constructor(private el: ElementRef) {}

    public static getRandomColor(seed: string): string {
        const pos: number = this.getRandomWithSeed(0, this.colors.length - 1, seed);
        return this.colors[pos];
    }

    private static getRandomWithSeed(min: number, max: number, seed: string): number {
        let numSeed = 0;
        numSeed += this.modifier;
        for (let i = 0; i < seed.length; i++) {
            numSeed += seed.charCodeAt(i);
        }

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.mulberry32(numSeed) * (max - min + 1)) + min;
    }

    // tslint:disable:no-bitwise
    private static mulberry32(seed: number): number {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    ngOnInit(): void {
        this.el.nativeElement.style.backgroundColor = RandomColorSeedDirective.getRandomColor(this.seed);
    }

}
