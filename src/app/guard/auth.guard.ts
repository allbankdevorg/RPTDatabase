import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { MyDataService } from '../my-data.service'; 

// No need to use @Injectable decorator here
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  // Use 'inject' to get the service instances
  const myDataService = inject(MyDataService);
  
  const bnValue = myDataService.getBnValue();
  
  if (!bnValue) {
    const router = inject(Router);
    router.navigate(['dri']);
    return false;
  }

  return true;
}