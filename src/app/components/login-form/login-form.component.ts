import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Trainer } from 'src/app/models/trainer.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  constructor(
    private readonly router: Router,
    private readonly LoginService: LoginService
  ) {}

  public loginSubmit(loginForm: NgForm): void {
    const { username } = loginForm.value;

    this.LoginService.login(username).subscribe({
      next: (trainer: Trainer) => {
        this.router.navigateByUrl('/catalogue');
      },
      error: () => {},
    });
  }
}
