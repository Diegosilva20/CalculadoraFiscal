"use client";

import React from "react";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("calculafiscal:open-cookie-settings"))}
      className="hover:text-slate-900 underline-offset-2 hover:underline text-left"
    >
      Preferências de cookies
    </button>
  );
}
