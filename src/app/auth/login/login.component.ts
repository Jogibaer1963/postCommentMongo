import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: false
})
export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService) { }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.authService.login(form.value.email, form.value.password);
  }
}
