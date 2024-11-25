"use client";

import React from "react";

export default function AuthCard({ title, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[400px]">
        <h2 className="text-2xl font-semibold text-[#F2994A] mb-6 text-center">
          {title}
        </h2>
        <form className="space-y-4">{children}</form>
        <p className="text-center text-sm text-gray-600 mt-4">
          {footerText}{" "}
          <a href={footerLink} className="text-[#F2994A] font-medium hover:underline">
            {footerLinkText}
          </a>
        </p>
      </div>
    </div>
  );
}
