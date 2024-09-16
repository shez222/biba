import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function extendedEmail(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // we only check the simply x@y.z pattern, because the other check will be handled by default validator
    const pattern = /@[^@]+\.[^@]{2,}$/;
    const isValid = pattern.test(control.value);
    return isValid ? null : { email: { value: control.value } };
  };
}
