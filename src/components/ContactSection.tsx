
import { Github, Linkedin, Mail } from 'lucide-react';

const ContactSection = () => {
  const links = [
    {
      name: 'Email',
      icon: Mail,
      display: 'l.linhardt(∂)tu-berlin.de'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/a1247418',
      icon: Github,
      display: 'GitHub'
    },
    {
      name: 'Google Scholar',
      url: 'https://scholar.google.com/citations?user=579iMjgAAAAJ',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.242 13.769L0.5 9.5 12 1l11.5 8.5-4.742 4.269C17.548 12.53 14.978 11.5 12 11.5c-2.977 0-5.548 1.03-6.758 2.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
        </svg>
      ),
      display: 'Scholar'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/lorenz-linhardt/',
      icon: Linkedin,
      display: 'LinkedIn'
    },
    {
      name: 'Bluesky',
      url: 'https://bsky.app/profile/lorenzlinhardt.bsky.social',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      display: 'Bluesky'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-warmBrown/20">
      <div className="flex flex-wrap justify-center sm:justify-center gap-4 sm:gap-6 text-sm">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-warmBrown/70 hover:text-warmBrown transition-colors"
          >
            <link.icon className="w-4 h-4" />
            <span>{link.display}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactSection;
