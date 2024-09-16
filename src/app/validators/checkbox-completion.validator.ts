import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneCheckboxCheckedValidator(...controlNames: string[]): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const controls = controlNames.map(name => formGroup.get(name));
    const isChecked = controls.some(control => control && control.value);
    return isChecked ? null : { atLeastOneCheckboxChecked: true };
  };
}
