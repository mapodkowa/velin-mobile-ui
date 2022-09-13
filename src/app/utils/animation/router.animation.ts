import {animate, query, style, transition, trigger} from '@angular/animations';

export const routerAnimation =
    trigger('routerAnimation', [
        transition('* => *', [
            style({position: 'relative'}),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    width: '100%'
                }),
            ], {optional: true}),
            query(':enter',
                [
                    style({opacity: 0})
                ],
                {optional: true}
            ),
            query(':leave',
                [
                    style({opacity: 1}),
                    animate('80ms', style({opacity: 0}))
                ],
                {optional: true}
            ),
            query(':enter',
                [
                    style({opacity: 0}),
                    animate('80ms 80ms', style({opacity: 1}))
                ],
                {optional: true}
            )
        ])
    ]);
