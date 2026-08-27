export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold text-neutral-900">Privacy Policy</h1>
        <p className="mt-4 text-sm text-neutral-500">Last updated: August 25, 2026</p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-neutral-900">1. Information We Collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              When you use Dinely, we collect information you provide directly, such as your name, email
              address, phone number, and payment details when you create an account or place an order. We
              also collect usage data including pages visited, features used, and device information to
              improve our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900">2. How We Use Your Information</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              We use your information to provide and improve our services, process transactions, send
              order confirmations and updates, personalize your experience, and communicate with you about
              promotions, new features, and restaurant recommendations. Restaurant owners use our analytics
              tools to understand their business performance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900">3. Information Sharing</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              We do not sell your personal information. We share data only with restaurants to fulfill your
              orders, with payment processors to handle transactions, and with service providers who assist
              in operating our platform. All partners are contractually bound to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900">4. Data Security</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              We implement industry-standard security measures including encryption, secure servers, and
              regular security audits. While no method of transmission is 100% secure, we work hard to
              protect your personal information using commercially acceptable means.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900">5. Your Rights</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              You have the right to access, correct, or delete your personal data at any time through
              your account settings. You can also opt out of marketing communications by clicking the
              unsubscribe link in any email. For data requests, contact us at privacy@dinely.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900">6. Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Dinely uses cookies and similar technologies to maintain your session, remember your
              preferences, and analyze platform usage. You can control cookie settings through your
              browser preferences, though some features may not function properly without them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900">7. Changes to This Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              We may update this privacy policy from time to time. We will notify you of any material
              changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
              Your continued use of Dinely after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900">8. Contact Us</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              If you have any questions about this Privacy Policy, please contact us at
              privacy@dinely.com or visit our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
