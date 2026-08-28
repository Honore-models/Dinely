"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#22c51f]">
            Get In Touch
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-neutral-900">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-500">
            Have a question, need help, or want to partner with us? We&apos;d love to hear
            from you. Our team typically responds within 24 hours.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="rounded-2xl bg-[#f8fdf8] p-6">
              <h3 className="text-lg font-bold text-neutral-900">Email Us</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Our friendly team is here to help.
              </p>
              <a
                href="mailto:support@dinely.com"
                className="mt-3 inline-block text-sm font-bold text-[#22c51f] hover:underline"
              >
                support@dinely.com
              </a>
            </div>

            <div className="rounded-2xl bg-[#f8fdf8] p-6">
              <h3 className="text-lg font-bold text-neutral-900">Call Us</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Mon - Fri from 8am to 5pm.
              </p>
              <a
                href="tel:+250788123456"
                className="mt-3 inline-block text-sm font-bold text-[#22c51f] hover:underline"
              >
                +250 788 123 456
              </a>
            </div>

            <div className="rounded-2xl bg-[#f8fdf8] p-6">
              <h3 className="text-lg font-bold text-neutral-900">Visit Us</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Come say hello at our office.
              </p>
              <p className="mt-3 text-sm font-bold text-neutral-700">
                Kigali Heights, 4th Floor
                <br />
                Kigali, Rwanda
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-neutral-200 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#e8f5e9] text-3xl">
                  ✓
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">
                  Message Sent!
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl bg-[#22c51f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1bad1a]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-neutral-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700">
                    Subject
                  </label>
                  <select className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-[#22c51f] focus:ring-1 focus:ring-green-100">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Billing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c51f] text-sm font-bold text-white transition hover:bg-[#1bad1a] disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
