import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isLoading = false;
constructor(public authService: AuthService) {

}
  onSignup(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}
