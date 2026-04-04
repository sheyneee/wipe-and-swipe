"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { BRAND } from "@/lib/config/brand";
import { extractApiMessage, isNonEmpty, normalizeEmail, parseResponse } from "@/lib/utils/admin/auth/adminAuth.utils";
import type { Mode } from "@/components/admin/auth/AdminAuthShell";
import type { LoginPayload } from "@/components/admin/auth/AdminLoginForm";
import type { RegisterPayload } from "@/components/admin/auth/AdminRegisterForm";
import type { ForgotPasswordEmailPayload } from "@/components/admin/auth/AdminForgotPasswordEmailForm";
import type { VerifyResetCodePayload } from "@/components/admin/auth/AdminVerifyResetCodeForm";
import type { ResetPasswordPayload } from "@/components/admin/auth/AdminResetPasswordForm";

export function useAdminAuth() {
  const [mode, setMode] = useState<Mode>("login");
  const [submitting, setSubmitting] = useState(false);

  const [login, setLogin] = useState<LoginPayload>({ email: "", password: "" });

    const [register, setRegister] = useState<RegisterPayload>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    });

  const [forgotEmail, setForgotEmail] = useState<ForgotPasswordEmailPayload>({
    email: "",
  });

  const [verifyCode, setVerifyCode] = useState<VerifyResetCodePayload>({
    code: "",
  });

  const [resetPassword, setResetPassword] = useState<ResetPasswordPayload>({
    newPassword: "",
    confirmPassword: "",
  });

  function goToForgotEmail() {
    setForgotEmail({ email: login.email });
    setVerifyCode({ code: "" });
    setResetPassword({ newPassword: "", confirmPassword: "" });
    setMode("forgot-email");
  }

  function resetForgotFlow() {
    setForgotEmail({ email: "" });
    setVerifyCode({ code: "" });
    setResetPassword({ newPassword: "", confirmPassword: "" });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const email = normalizeEmail(login.email);
    const password = login.password;

    if (!isNonEmpty(email) || !isNonEmpty(password)) {
      await Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Email and password are required.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await parseResponse(res);
      const message = extractApiMessage(data);

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Login blocked",
          text: message || "Login failed.",
          confirmButtonColor: BRAND.primary,
        });
        return;
      }

      window.location.href = "/admin";
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: BRAND.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const payload: Omit<RegisterPayload, "confirmPassword"> = {
    firstName: register.firstName.trim(),
    middleName: (register.middleName ?? "").trim() || "",
    lastName: register.lastName.trim(),
    email: normalizeEmail(register.email),
    password: register.password,
    };

    if (payload.firstName.length < 2) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid name",
        text: "First name must contain at least 2 characters.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    if (register.password !== register.confirmPassword) {
    await Swal.fire({
        icon: "warning",
        title: "Password mismatch",
        text: "Passwords do not match.",
        confirmButtonColor: BRAND.primary,
    });
    return;
    }

    if (payload.lastName.length < 2) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid name",
        text: "Last name must contain at least 2 characters.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    if (!isNonEmpty(payload.email)) {
      await Swal.fire({
        icon: "warning",
        title: "Missing email",
        text: "Email is required.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    if (!isNonEmpty(payload.password) || payload.password.length < 8) {
      await Swal.fire({
        icon: "warning",
        title: "Weak password",
        text: "Password must be at least 8 characters.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/register/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

     const data = await parseResponse(res);
     const message = extractApiMessage(data);

        if (!res.ok) {
        await Swal.fire({
            icon: "error",
            title: "Registration failed",
            text: message || "Registration failed.",
            confirmButtonColor: BRAND.primary,
        });
        return;
        }

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "Check your email for a verification link. After verification, wait for approval if required.",
        confirmButtonColor: BRAND.primary,
      });

      setMode("login");
      setLogin({ email: payload.email, password: "" });
      setRegister({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        });
    } catch (err: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        confirmButtonColor: BRAND.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();

    const email = normalizeEmail(forgotEmail.email);

    if (!isNonEmpty(email)) {
      await Swal.fire({
        icon: "warning",
        title: "Missing email",
        text: "Please enter your email address.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await parseResponse(res);
      const message = extractApiMessage(data);

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Request failed",
          text: message || "Unable to send reset code.",
          confirmButtonColor: BRAND.primary,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Code sent",
        text: "If the email exists, a 6-digit reset code has been sent.",
        confirmButtonColor: BRAND.primary,
      });

      setForgotEmail({ email });
      setVerifyCode({ code: "" });
      setMode("forgot-code");
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: BRAND.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyResetCode(e: React.FormEvent) {
    e.preventDefault();

    const email = normalizeEmail(forgotEmail.email);
    const code = verifyCode.code.trim();

    if (!isNonEmpty(code) || code.length !== 6) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid code",
        text: "Please enter the 6-digit code.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await parseResponse(res);
      const message = extractApiMessage(data);

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Verification failed",
          text: message || "Invalid or expired code.",
          confirmButtonColor: BRAND.primary,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Code verified",
        text: "You can now set a new password.",
        confirmButtonColor: BRAND.primary,
      });

      setMode("reset-password");
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: BRAND.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    const email = normalizeEmail(forgotEmail.email);
    const code = verifyCode.code.trim();
    const newPassword = resetPassword.newPassword;
    const confirmPassword = resetPassword.confirmPassword;

    if (!isNonEmpty(newPassword) || newPassword.length < 8) {
      await Swal.fire({
        icon: "warning",
        title: "Weak password",
        text: "Password must be at least 8 characters.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      await Swal.fire({
        icon: "warning",
        title: "Password mismatch",
        text: "Passwords do not match.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await parseResponse(res);
      const message = extractApiMessage(data);

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Reset failed",
          text: message || "Unable to reset password.",
          confirmButtonColor: BRAND.primary,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Password updated",
        text: "Your password has been reset successfully.",
        confirmButtonColor: BRAND.primary,
      });

      setMode("login");
      setLogin({ email, password: "" });
      resetForgotFlow();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: BRAND.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendCode() {
    const email = normalizeEmail(forgotEmail.email);

    if (!isNonEmpty(email)) {
      await Swal.fire({
        icon: "warning",
        title: "Missing email",
        text: "Please go back and enter your email first.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await parseResponse(res);
      const message = extractApiMessage(data);

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Resend failed",
          text: message || "Unable to resend code.",
          confirmButtonColor: BRAND.primary,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Code resent",
        text: "A new 6-digit reset code has been sent if the email exists.",
        confirmButtonColor: BRAND.primary,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: BRAND.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    mode,
    setMode,
    submitting,

    login,
    setLogin,

    register,
    setRegister,

    forgotEmail,
    setForgotEmail,

    verifyCode,
    setVerifyCode,

    resetPassword,
    setResetPassword,

    goToForgotEmail,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleVerifyResetCode,
    handleResetPassword,
    handleResendCode,
  };
}