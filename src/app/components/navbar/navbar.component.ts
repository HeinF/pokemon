import { Component } from '@angular/core';
import { TrainerService } from 'src/app/services/trainer.service';
import { Router } from '@angular/router';
import { Trainer } from 'src/app/models/trainer.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  get trainer(): Trainer | undefined {
    return this.trainerService.trainer;
  }

  constructor(
    private readonly trainerService: TrainerService,
    private readonly router: Router
  ) {}
  // Handle when the user click on logout
  handleLogout(): void {
    this.trainerService.logOut();
    this.router.navigateByUrl('/');
  }
}
