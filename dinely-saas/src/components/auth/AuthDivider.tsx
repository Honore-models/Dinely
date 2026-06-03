export function AuthDivider() {
  return (
    <div className="relative py-0.5">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-2 text-[10px] font-medium uppercase tracking-wider text-neutral-400">or</span>
      </div>
    </div>
  );
}
