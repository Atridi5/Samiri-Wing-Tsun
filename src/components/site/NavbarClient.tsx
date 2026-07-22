"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, Phone, LogIn } from "lucide-react";
import { InstagramIcon, FacebookIcon, TiktokIcon } from "./SocialIcons";
import RegisterModal from "./RegisterModal";

type NavLink = { href: string; label: string };

export default function NavbarClient({
  links,
  ctaLabel,
  phone,
  instagram,
  facebook,
  tiktok,
}: {
  links: NavLink[];
  ctaLabel: string;
  phone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top info bar */}
      <div className="hidden border-b border-navy-900/5 bg-cream-50 text-navy-800/70 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-gold-600" />
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-gold-600">
              {phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-gold-600" aria-label="Instagram">
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer" className="hover:text-gold-600" aria-label="Facebook">
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
            )}
            {tiktok && (
              <a href={tiktok} target="_blank" rel="noreferrer" className="hover:text-gold-600" aria-label="TikTok">
                <TiktokIcon className="h-3.5 w-3.5" />
              </a>
            )}
            <NextLink href="/admin/login" className="flex items-center gap-1.5 hover:text-gold-600">
              <LogIn className="h-3.5 w-3.5" />
              Kyçu si Admin
            </NextLink>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "bg-cream-50/95 shadow-md backdrop-blur" : "bg-cream-50/85 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Samir Wing Tsun System" width={48} height={48} className="h-11 w-11 rounded-full" priority />
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-navy-900 sm:text-base">
              Samir Wing Tsun <span className="text-gold-600">System</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {links.map((link) =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-navy-800/75 transition-colors hover:text-gold-600"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-navy-800/75 transition-colors hover:text-gold-600"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher variant="dark" />
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 shadow-md transition-transform hover:scale-105 hover:bg-navy-800"
            >
              {ctaLabel}
            </button>
          </div>

          <button
            type="button"
            className="text-navy-900 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-navy-900/10 bg-cream-50 px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-4">
              {links.map((link) =>
                link.href.startsWith("/#") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-navy-800/80 hover:text-gold-600"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-navy-800/80 hover:text-gold-600"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <NextLink
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-navy-800/80 hover:text-gold-600"
              >
                <LogIn className="h-4 w-4" />
                Kyçu (Admin)
              </NextLink>
              <div className="flex items-center justify-between pt-2">
                <LanguageSwitcher variant="dark" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setRegisterOpen(true);
                  }}
                  className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50"
                >
                  {ctaLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </header>
  );
}
