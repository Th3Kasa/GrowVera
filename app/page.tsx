import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhatsIncludedSection from '@/components/WhatsIncludedSection';
import AuditRequestForm from '@/components/AuditRequestForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-zinc-950 min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <WhatsIncludedSection />
      <AuditRequestForm />
      <Footer />
    </main>
  );
}
