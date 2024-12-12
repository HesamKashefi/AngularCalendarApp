
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const makeSureDateIsValidGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) => {
    const date: string | undefined = next.params['date'];

    const router = inject(Router);

    if (!date) {
        router.navigateByUrl('calendar');
        return false;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(date) === false) {
        router.navigateByUrl('calendar');
        return false;
    }

    const dateParts = date.split('-');

    if (dateParts.length !== 3 ||
        +dateParts[0] < 1 ||
        +dateParts[1] < 1 || +dateParts[1] > 12 ||
        +dateParts[2] < 1 || +dateParts[1] > 31) {
        router.navigateByUrl('calendar');
        return false;
    }

    const dateObject = new Date(date);

    if (dateObject.toString() === 'Invalid Date') {
        router.navigateByUrl('calendar');
        return false;
    }

    return true;

}