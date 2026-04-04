export function normalizeRequiredText(value: string) {
  return value.trim();
}

export function normalizeOptionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function formatAdminRole(role: string) {
  return role === "SUPER_ADMIN" ? "SUPER ADMIN" : role;
}

export function validateProfileDetails(payload: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  if (payload.firstName.trim().length < 2) {
    return "First name must contain at least 2 characters.";
  }

  if (payload.lastName.trim().length < 2) {
    return "Last name must contain at least 2 characters.";
  }

  if (!payload.email.trim()) {
    return "Email is required.";
  }

  const emailRegex =
    /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

  if (!emailRegex.test(payload.email)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function validatePasswordChange(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  if (!payload.currentPassword.trim()) {
    return "Current password is required.";
  }

  if (payload.newPassword.trim().length < 8) {
    return "New password must be at least 8 characters.";
  }

  if (payload.newPassword !== payload.confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}