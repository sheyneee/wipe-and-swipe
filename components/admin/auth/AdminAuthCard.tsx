"use client";

import AdminAuthShell from "@/components/admin/auth/AdminAuthShell";
import AdminLoginForm from "@/components/admin/auth/AdminLoginForm";
import AdminRegisterForm from "@/components/admin/auth/AdminRegisterForm";
import AdminForgotPasswordEmailForm from "@/components/admin/auth/AdminForgotPasswordEmailForm";
import AdminVerifyResetCodeForm from "@/components/admin/auth/AdminVerifyResetCodeForm";
import AdminResetPasswordForm from "@/components/admin/auth/AdminResetPasswordForm";
import { useAdminAuth } from "@/hooks/admin/auth/useAdminAuth";

export default function AdminAuthCard() {
  const {
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
  } = useAdminAuth();

  return (
    <AdminAuthShell mode={mode} setMode={setMode}>
      {mode === "login" && (
        <AdminLoginForm
          value={login}
          onChange={setLogin}
          onSubmit={handleLogin}
          onForgotPassword={goToForgotEmail}
          submitting={submitting}
        />
      )}

      {mode === "register" && (
        <AdminRegisterForm
          value={register}
          onChange={setRegister}
          onSubmit={handleRegister}
          submitting={submitting}
        />
      )}

      {mode === "forgot-email" && (
        <AdminForgotPasswordEmailForm
          value={forgotEmail}
          onChange={setForgotEmail}
          onSubmit={handleForgotPassword}
          onBack={() => setMode("login")}
          submitting={submitting}
        />
      )}

      {mode === "forgot-code" && (
        <AdminVerifyResetCodeForm
          email={forgotEmail.email}
          value={verifyCode}
          onChange={setVerifyCode}
          onSubmit={handleVerifyResetCode}
          onBack={() => setMode("forgot-email")}
          onResend={handleResendCode}
          submitting={submitting}
        />
      )}

      {mode === "reset-password" && (
        <AdminResetPasswordForm
          value={resetPassword}
          onChange={setResetPassword}
          onSubmit={handleResetPassword}
          onBack={() => setMode("forgot-code")}
          submitting={submitting}
        />
      )}
    </AdminAuthShell>
  );
}