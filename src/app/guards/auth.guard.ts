import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TrainerService } from '../services/trainer.service';

@Injectable({
  providedIn: 'root',
})
// Guard catalogue and trainer routes
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly trainerService: TrainerService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.trainerService.trainer) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
