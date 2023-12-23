// import Customer from "@/app/components/Customer";
// import Customer from "@/app/components/Customer";
const Customer = dynamic(() => import("@/app/components/Customer"), {
  loading: () => <LoadingCustomer />,
  ssr: false,
});

//import TransNoItem from "@/app/components/TransNoItem";
const TransNoItem = dynamic(() => import("@/app/components/TransNoItem"));
import LoadingCustomer from "@/app/components/LoadingCustomer";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BahiKhata",
  description: "Simplify Business Management",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <Customer />
      <TransNoItem title={"No customer selected"} />
      {children}
    </div>
  );
}
