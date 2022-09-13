import {animate, style, transition, trigger} from '@angular/animations';

export const playerAnimation =
    trigger('playerAnimation', [
        transition(':enter', [
            style({
                position: 'absolute',
                top: '100%',
                width: '100%',
                height: '100%',
                opacity: 0,
                ['z-index']: 1000
            }),
            animate('350ms ease', style({top: 0, opacity: 1}))
        ]),
        transition(':leave', [
            style({
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 1,
                ['z-index']: 1000
            }),
            animate('250ms', style({top: '100%', opacity: 0}))
        ])
    ]);
