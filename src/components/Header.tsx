"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { Globe, Menu, ChevronDown, User, Heart, Briefcase, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslations } from 'next-intl';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const t = useTranslations('Header');
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const switchLanguage = (locale: string) => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '');
    window.location.href = `/${locale}${pathWithoutLocale === '' ? '' : pathWithoutLocale}`;
  };

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#D4AF37] z-[101] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-[#eaeaea] dark:border-[#1f1f1f]' : 'py-8 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Navigation Links (Left) */}
          <nav className="hidden md:flex items-center gap-10 flex-1">
            {[
              { name: t('home'), id: '#home' },
              { name: t('destinations'), id: '#destinations' },
              { name: t('experiences'), id: '#experiences' },
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.id}
                onClick={(e) => handleSmoothScroll(e, link.id)}
                className={`text-[10px] tracking-[0.2em] font-semibold hover:text-[#D4AF37] transition-colors ${scrolled ? 'text-[#2a2a2a] dark:text-white' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Logo (Center) */}
          <div className={`text-3xl tracking-widest font-serif text-center flex-1 cursor-pointer transition-colors duration-500 ${scrolled ? 'text-black dark:text-white' : 'text-white'}`}>
            VOYAGE
          </div>

          {/* Actions (Right) */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <ThemeToggle />
            
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className={`hidden sm:flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold hover:text-[#D4AF37] transition-colors ${scrolled ? 'text-[#2a2a2a] dark:text-gray-100' : 'text-white/90'}`}
              >
                <Globe size={14} strokeWidth={1.5} />
                LANG <ChevronDown size={12} />
              </button>
              
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 glass-dropdown rounded-md overflow-y-auto max-h-64 scrollbar-thin py-1 z-50">
                  {["en","es","fr","de","hi","zh","ja","pt","ru","ar","it","ko","nl","tr","pl","sv","da","fi","no","el","cs","hu","ro","th","vi","id","ms","bn","ta","te","ur"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { switchLanguage(lang); setLangOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#2a2a2a] dark:text-[#f3f4f6] hover:bg-[#D4AF37] hover:text-white transition-colors"
                    >
                      {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : lang === 'fr' ? 'Français' : lang === 'de' ? 'Deutsch' : lang === 'hi' ? 'हिन्दी' : lang === 'zh' ? '中文' : lang === 'ja' ? '日本語' : lang === 'pt' ? 'Português' : lang === 'ru' ? 'Русский' : lang === 'ar' ? 'العربية' : lang === 'it' ? 'Italiano' : lang === 'ko' ? '한국어' : lang === 'nl' ? 'Nederlands' : lang === 'tr' ? 'Türkçe' : lang === 'pl' ? 'Polski' : lang === 'sv' ? 'Svenska' : lang === 'da' ? 'Dansk' : lang === 'fi' ? 'Suomi' : lang === 'no' ? 'Norsk' : lang === 'el' ? 'Ελληνικά' : lang === 'cs' ? 'Čeština' : lang === 'hu' ? 'Magyar' : lang === 'ro' ? 'Română' : lang === 'th' ? 'ไทย' : lang === 'vi' ? 'Tiếng Việt' : lang === 'id' ? 'Bahasa Indonesia' : lang === 'ms' ? 'Bahasa Melayu' : lang === 'bn' ? 'বাংলা' : lang === 'ta' ? 'தமிழ்' : lang === 'te' ? 'తెలుగు' : lang === 'ur' ? 'اردو' :  lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer ${scrolled ? 'text-[#2a2a2a] dark:text-gray-100' : 'text-white/90'}`}>
              <Menu size={20} strokeWidth={1} />
            </div>

            <div className="flex items-center gap-3 ml-2">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] ${scrolled ? 'border-[#2a2a2a]/20 text-[#2a2a2a] dark:border-white/20 dark:text-gray-100' : 'border-white/30 text-white/90'}`}
                  >
                    <User size={16} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 glass-dropdown rounded-md overflow-hidden py-1 z-50">
                      <div className="px-4 py-2 border-b border-[#eaeaea] dark:border-[#1f1f1f]">
                        <p className="text-xs font-semibold text-[#2a2a2a] dark:text-[#f3f4f6] truncate">
                          {session.user?.name || session.user?.email || "User"}
                        </p>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2a2a2a] dark:text-[#f3f4f6] hover:bg-[#D4AF37] hover:text-white transition-colors">
                        <User size={14} /> My Profile
                      </Link>
                      <Link href="/bookings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2a2a2a] dark:text-[#f3f4f6] hover:bg-[#D4AF37] hover:text-white transition-colors">
                        <Briefcase size={14} /> Bookings
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2a2a2a] dark:text-[#f3f4f6] hover:bg-[#D4AF37] hover:text-white transition-colors">
                        <Heart size={14} /> Wishlist
                      </Link>
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2a2a2a] dark:text-[#f3f4f6] hover:bg-[#D4AF37] hover:text-white transition-colors">
                        <Briefcase size={14} /> Admin
                      </Link>
                      <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2a2a2a] dark:text-[#f3f4f6] hover:bg-[#D4AF37] hover:text-white transition-colors">
                        <Settings size={14} /> Settings
                      </Link>
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-colors border-t border-[#eaeaea] dark:border-[#1f1f1f]"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="glass-button text-[10px] tracking-[0.1em] uppercase font-semibold px-4 py-2 rounded-full text-white/90 dark:text-gray-100"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
          
        </div>
      </motion.header>
    </>
  );
}
