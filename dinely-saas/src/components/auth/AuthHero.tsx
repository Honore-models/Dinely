import Image from "next/image";

interface AuthHeroProps {
  description: string;
}

export function AuthHero({ description }: AuthHeroProps) {
  return (
    <>
      <section className="relative hidden overflow-hidden lg:block lg:min-h-screen">
        <Image
          src="/login.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="55vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/92 via-neutral-950/78 to-neutral-950/55" />
        <div className="relative flex min-h-screen flex-col justify-between px-12 py-12 xl:px-16 xl:py-14">
          <Image
            src="/logo.svg"
            alt="Dinely"
            width={132}
            height={48}
            className="brightness-0 invert"
            priority
          />
          <div className="max-w-lg pb-6">
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-white xl:text-5xl">
              Good food,
              <span className="mt-1 block text-[#7cc243]">great mood</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{description}</p>
          </div>
        </div>
      </section>

      <section className="relative h-28 overflow-hidden sm:h-32 lg:hidden" aria-hidden="true">
        <Image src="/login.png" alt="" fill className="object-cover object-center" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/88 to-neutral-950/65" />
      </section>
    </>
  );
}
