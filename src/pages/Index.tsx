
import ProfileSection from '@/components/ProfileSection';
import AboutSection from '@/components/AboutSection';
import PublicationsSection from '@/components/PublicationsSection';
import ContactSection from '@/components/ContactSection';
import AsciiGameOfLife from '@/components/AsciiGameOfLife';

const Index = () => {
  return (
    <div className="min-h-screen bg-warmPaper font-mono">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-4">
          <ProfileSection />
          <ContactSection />
        </header>

        {/* ASCII Animation */}
        <section className="mb-4">
          <AsciiGameOfLife />
        </section>

        {/* Main Content */}
        <main className="space-y-8">
          <AboutSection />
          
          {/* Second ASCII Animation */}
          <section className="mb-4">
            <AsciiGameOfLife />
          </section>
          
          <PublicationsSection />
        </main>
      </div>
    </div>
  );
};

export default Index;
