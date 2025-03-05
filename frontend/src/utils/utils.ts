export function dinamicImport(name: string) {
  const url = new URL(`../assets/${name}`, import.meta.url).href;
  return url;
}

/**
 * Checks if the password is valid, must be between 6 and 20 characters, contain at least one number, one lowercase letter, one uppercase letter and one special character
 * @param password string containing the password
 * @returns
 */
export function passwordValidator(password: string): boolean {
  const length = password.length >= 6 && password.length <= 20;
  const hasNumber = /\d/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecial = password.match(/[-_*+@]/) !== null;

  return length && hasNumber && hasLowerCase && hasUpperCase && hasSpecial;
}
