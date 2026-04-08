import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <WhatsAppFAB />
      <Footer />
    </>
  );
}
