import Link from "next/link";
import { DinelyLogo } from "../brand/DinelyLogo";
import { Button } from "../ui/Button";

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-transparent px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <DinelyLogo width={126} height={48} priority />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="font-bold text-black">
            Login
          </Link>
          <Button href="/register" className="text-black">
            Sign up free
          </Button>
        </div>
      </div>
    </header>
  );
}
