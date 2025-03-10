import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public showPass = false;
  public userForm!: FormGroup;
  public invalidLogin = false;
  public loading = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    this.invalidLogin = false;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.login(this.userForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        localStorage.setItem('role', response.data.roles[0].name);
        localStorage.setItem(
          'user_data',
          JSON.stringify({
            userId: response.data.account.userId,
            name: response.data.account.name,
            firstSurname: response.data.account.firstSurname,
          })
        );
        this._snackBar.open('Bienvenido', '', {
          duration: 3000,
        });
        this.router.navigate(['home']);
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.invalidLogin = true;
          }
        }
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  get email(): AbstractControl {
    return this.userForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.userForm.get('password')!;
  }
}
