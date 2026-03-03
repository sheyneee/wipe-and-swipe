"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function VerifyEmailPage() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = sp.get("status");
    const account = sp.get("account"); // ACTIVE | PENDING | SUSPENDED

    if (status === "success") {
      if (account === "ACTIVE") {
        Swal.fire({
          icon: "success",
          title: "Email verified",
          text: "Your account is verified and active. You can now log in.",
          confirmButtonText: "Go to Login",
        }).then(() => router.push("/admin/login"));
        return;
      }

      if (account === "PENDING") {
        Swal.fire({
          icon: "info",
          title: "Email verified",
          text: "Your email is verified. Your account is still pending approval.",
          confirmButtonText: "Go to Login",
        }).then(() => router.push("/admin/login"));
        return;
      }

      if (account === "SUSPENDED") {
        Swal.fire({
          icon: "warning",
          title: "Email verified",
          text: "Your email is verified but your account is suspended. Please contact support.",
          confirmButtonText: "Go to Home",
        }).then(() => router.push("/"));
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Email verified",
        text: "Your email is verified. Please try logging in.",
        confirmButtonText: "Go to Login",
      }).then(() => router.push("/admin/login"));
      return;
    }

    if (status === "expired") {
      Swal.fire({
        icon: "warning",
        title: "Link expired",
        text: "Please log in again to receive a new verification link.",
        confirmButtonText: "Go to Login",
      }).then(() => router.push("/admin/login"));
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Verification failed",
      text: "Invalid verification request.",
      confirmButtonText: "Go to Home",
    }).then(() => router.push("/"));
  }, [sp, router]);

  return <div className="min-h-screen" />;
}