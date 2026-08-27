import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
      <div>
        <div className="relative mx-auto h-[300px] w-[300px]">
          <Image
            src="/404.png"
            alt="Page not found"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-neutral-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm font-medium text-neutral-500">
          The Dinely page you requested does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-[#22c51f] px-8 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
