import { CustomerTopNav } from "@/components/customer/CustomerTopNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <CustomerTopNav />
      <main>{children}</main>
    </div>
  );
}
