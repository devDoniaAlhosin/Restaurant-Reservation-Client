import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  static passwordMatchValidator(arg0: string, arg1: string): any {
    throw new Error('Method not implemented.');
  }

  constructor() { }
  passwordMatchValidator(
    password: string,
    confirmPassword: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordValue = control.get(password)?.value;
      const confirmPasswordValue = control.get(confirmPassword)?.value;

      return passwordValue === confirmPasswordValue
        ? null
        : { passwordMismatch: true };
    };
  }
  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasNumber = /\d/.test(password);
      const isValidLength = password.length >= 8; // Optional: Minimum length requirement

      if (hasUpperCase && hasSpecialChar && hasNumber && isValidLength) {
        return null;
      } else {
        return { strongPassword: true };
      }
    };
  }
}
