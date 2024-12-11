
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
    const dateParts = date.split('-');

    if (dateParts.length !== 3 || dateParts.findIndex(part => isNaN(+part)) >= 0) {
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