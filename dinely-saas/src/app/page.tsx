import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Image
        src="/Group 103.png"
        alt="Vercel Logo"
        width={100}
        height={30}
        priority
      />
    </div>
  );
}
