import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Trainer } from 'src/app/models/trainer.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  constructor(private readonly LoginService: LoginService) {}

  public loginSubmit(loginForm: NgForm): void {
    const { username } = loginForm.value;
    console.log(username);

    this.LoginService.login(username).subscribe({
      next: (trainer: Trainer) => {},
      error: () => {},
    });
  }
}
