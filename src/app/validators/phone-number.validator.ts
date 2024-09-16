import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const phoneNumber = parsePhoneNumberFromString(control.value);
    const isValid = phoneNumber ? phoneNumber.isValid() : false;
    return isValid ? null : { invalidPhoneNumber: { value: control.value } };
  };
}
