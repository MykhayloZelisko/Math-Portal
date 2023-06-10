import { AbstractControl, ValidatorFn } from '@angular/forms';

export function requiredValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value || !value.trim()) {
      return {
        required: `Поле обов'язкове для заповнення`,
      };
    }
    return null;
  };
}

export function minMaxLengthValidator(
  minLength: number | null,
  maxLength: number | null,
): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (minLength && maxLength) {
      if (!value || value.length < minLength || value.length > maxLength) {
        return {
          minMaxLength: `Кількість символів повинна бути від ${minLength} до ${maxLength}`,
        };
      }
    } else if (minLength && !maxLength) {
      if (!value || value.length < minLength) {
        return {
          minLength: `Кількість символів повинна бути не менша за ${minLength}`,
        };
      }
    } else if (!minLength && maxLength) {
      if (!value || value.length > maxLength) {
        return {
          maxLength: `Кількість символів повинна бути не більша за ${maxLength}`,
        };
      }
    }
    return null;
  };
}

export function passwordPatternValidator(str: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value || !value.match(str)) {
      if (value && !value.match(/\d/)) {
        return {
          pattern: 'Пароль повинен містити хоча б одну цифру',
        };
      }
      if (value && !value.match(/[A-Z]/)) {
        return {
          pattern: 'Пароль повинен містити хоча б одну велику латинську літеру',
        };
      }
      if (value && !value.match(/[a-z]/)) {
        return {
          pattern: 'Пароль повинен містити хоча б одну малу латинську літеру',
        };
      }
      return {
        pattern: 'Пароль повинен містити хоча б один спецсимвол',
      };
    }
    return null;
  };
}

export function emailPatternValidator(str: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value || !value.match(str)) {
      return {
        pattern: 'Не валідна адреса електронної пошти',
      };
    }
    return null;
  };
}

export function namePatternValidator(str: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value || !value.match(str)) {
      return {
        pattern: `Не валідне ім'я/прізвище`,
      };
    }
    return null;
  };
}

export function showErrorMessage(control: AbstractControl): string {
  return control.errors ? Object.values(control.errors)[0] : null;
}
