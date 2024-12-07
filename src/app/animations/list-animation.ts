import { trigger, transition, query, style, stagger, animate } from "@angular/animations";

export const listAnimation = trigger('listAnimation', [
    transition(':enter', [
        query('*',
            [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
            { optional: true }
        ),
    ])
]);
