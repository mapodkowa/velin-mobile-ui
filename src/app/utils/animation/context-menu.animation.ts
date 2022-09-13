import {animate, style, transition, trigger} from '@angular/animations';

export const contextMenuAnimation =
    trigger('contextMenuAnimation', [
        transition(':enter', [
            style({
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                ['z-index']: 1500
            }),
            animate('200ms ease', style({opacity: 1}))
        ]),
        transition(':leave', [
            style({
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 1,
                ['z-index']: 1500
            }),
            animate('200ms ease', style({opacity: 0}))
        ])
    ]);
