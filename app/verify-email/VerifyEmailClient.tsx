"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

function getAdminLoginUrl() {
  if (typeof window === "undefined") {
    return "/admin/login";
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  // local subdomain
  if (hostname === "admin.localhost") {
    return `${protocol}//admin.localhost${port ? `:${port}` : ""}/admin/login`;
  }

  // production admin subdomain
  if (hostname === "admin.wipeandswipe.co.nz") {
    return "https://admin.wipeandswipe.co.nz/admin/login";
  }

  // fallback:
  // if currently on another wipeandswipe subdomain or root domain, force admin subdomain
  if (hostname.endsWith("wipeandswipe.co.nz")) {
    return "https://admin.wipeandswipe.co.nz/admin/login";
  }

  // generic fallback
  return "/admin/login";
}

function getHomeUrl() {
  if (typeof window === "undefined") {
    return "/";
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  if (hostname === "admin.localhost") {
    return `${protocol}//admin.localhost${port ? `:${port}` : ""}/`;
  }

  if (hostname === "admin.wipeandswipe.co.nz") {
    return "https://admin.wipeandswipe.co.nz/";
  }

  return "/";
}

export default function VerifyEmailClient() {
  const sp = useSearchParams();

  useEffect(() => {
    const status = sp.get("status");
    const account = sp.get("account");

    const loginUrl = getAdminLoginUrl();
    const homeUrl = getHomeUrl();

    if (status === "success") {
      if (account === "ACTIVE") {
        Swal.fire({
          icon: "success",
          title: "Email verified",
          text: "Your account is verified and active. You can now log in.",
          confirmButtonText: "Go to Login",
        }).then(() => {
          window.location.href = loginUrl;
        });
        return;
      }

      if (account === "PENDING") {
        Swal.fire({
          icon: "info",
          title: "Email verified",
          text: "Your email is verified. Your account is still pending approval.",
          confirmButtonText: "Go to Login",
        }).then(() => {
          window.location.href = loginUrl;
        });
        return;
      }

      if (account === "SUSPENDED") {
        Swal.fire({
          icon: "warning",
          title: "Email verified",
          text: "Your email is verified but your account is suspended. Please contact support.",
          confirmButtonText: "Go to Home",
        }).then(() => {
          window.location.href = homeUrl;
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Email verified",
        text: "Your email is verified. Please try logging in.",
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = loginUrl;
      });
      return;
    }

    if (status === "expired") {
      Swal.fire({
        icon: "warning",
        title: "Link expired",
        text: "Please log in again to receive a new verification link.",
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = loginUrl;
      });
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Verification failed",
      text: "Invalid verification request.",
      confirmButtonText: "Go to Home",
    }).then(() => {
      window.location.href = homeUrl;
    });
  }, [sp]);

  return <div className="min-h-screen" />;
}