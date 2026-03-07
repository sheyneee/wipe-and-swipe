// src/components/sections/MeetTheTeam.tsx
"use client";

import { useMemo, useState } from "react";
import { companyTeamMembers, type CompanyTeamMember } from "@/lib/data/companyteam";

type Props = {
  id?: string; 
  badgeText?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  members?: CompanyTeamMember[]; // optional override if you want different sets later
};

export default function MeetTheTeam({
  id = "about",
  badgeText = "Meet the Team",
  title = "Our Team",
  subtitle = "Meet the passionate professionals behind Wipe & Swipe Cleaning Services",
  className = "py-24 bg-gradient-to-b from-white to-teal-50",
  members,
}: Props) {
  const data = useMemo(() => members ?? companyTeamMembers, [members]);
  const total = data.length;
  const [index, setIndex] = useState(0);

  const go = (next: number | "prev" | "next") => {
    if (typeof next === "number") return setIndex(next);
    if (next === "prev") return setIndex((v) => (v - 1 + total) % total);
    return setIndex((v) => (v + 1) % total);
  };

  const active = data[index];

  return (
    <section id={id} className={className}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 font-semibold rounded-full text-sm mb-4">
            {badgeText}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border-4 border-brand-primary/20">
            <div className="px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
              <div
                className={[
                  "w-48 h-48 md:w-64 md:h-64 rounded-2xl",
                  "bg-gradient-to-br",
                  active.gradientClass,
                  "flex items-center justify-center flex-shrink-0 shadow-xl",
                ].join(" ")}
              >
                <div className="text-center">
                  <svg
                    className="w-24 h-24 text-white mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="text-white font-bold text-sm">{active.shortName}</p>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {active.name}
                </h3>
                <p className="text-xl text-brand-primary font-semibold mb-4">
                  {active.role}
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {active.bio}
                </p>

                <div className="flex flex-wrap gap-2">
                  {active.tags.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-brand-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => go("prev")}
              className="w-12 h-12 rounded-full bg-brand-primary text-white hover:bg-brand-secondary transition-colors flex items-center justify-center shadow-lg"
              aria-label="Previous team member"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2" aria-label="Team member dots">
              {data.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => go(i)}
                  className={[
                    "w-3 h-3 rounded-full transition-all",
                    i === index ? "bg-brand-primary" : "bg-gray-300",
                  ].join(" ")}
                  aria-label={`Go to ${m.name}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go("next")}
              className="w-12 h-12 rounded-full bg-brand-primary text-white hover:bg-brand-secondary transition-colors flex items-center justify-center shadow-lg"
              aria-label="Next team member"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Family-Owned</h4>
                <p className="text-gray-600 text-sm">Built with passion and personal care</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Expert Team</h4>
                <p className="text-gray-600 text-sm">Trained professionals with years of experience</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">High Standards</h4>
                <p className="text-gray-600 text-sm">Consistent excellence in every job</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Peace of Mind</h4>
                <p className="text-gray-600 text-sm">Trust and reliability you can count on</p>
            </div>
            </div>
          {/* Optional small accessibility hint */}
          <p className="sr-only" aria-live="polite">
            Showing {index + 1} of {total}. {active.name}.
          </p>
        </div>
      </div>
    </section>
  );
}