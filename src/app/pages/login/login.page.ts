import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {
  constructor(private readonly router: Router) {}
  // On login, navigate to catalogue
  handleLogin(): void {
    this.router.navigateByUrl('/catalogue');
  }
}
