const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export function validateLoginForm(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function validateRegisterForm(values) {
  const errors = validateLoginForm(values);

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (values.password && !strongPasswordRegex.test(values.password)) {
    errors.password =
      "Use 8+ characters with uppercase, lowercase, number, and special character.";
  }

  return errors;
}
