import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-3 font-semibold text-neutral-500">The Dinely page you requested does not exist.</p>
        <Link href="/" className="mt-6 inline-flex rounded-md bg-[#22c51f] px-5 py-3 font-bold text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
