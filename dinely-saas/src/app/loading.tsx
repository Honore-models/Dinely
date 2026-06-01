import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="relative mb-8 flex items-center justify-center">
        {/* Soft pulsing background glow */}
        <div className="absolute h-32 w-32 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#78d96d]/10"></div>
        
        <Image 
          src="/logo.svg" 
          alt="Dinely" 
          width={150} 
          height={60} 
          className="relative z-10"
          priority
        />
      </div>
      
      {/* Animated dots indicator */}
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#78d96d] [animation-delay:-0.3s]"></div>
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#78d96d] [animation-delay:-0.15s]"></div>
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#78d96d]"></div>
      </div>
    </div>
  );
}
