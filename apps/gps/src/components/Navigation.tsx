'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { contactInfo } from '../lib/contactInfo';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Contact', href: '/contact' },
  ];

  const dropdowns: Record<string, { name: string; href?: string }[]> = {
    'About Us': [
      { name: 'About Global Public School', href: '/about' },
      { name: 'Our Journey', href: '/about#journey' },
      { name: 'Our Values', href: '/about#values' },
      { name: 'Leadership', href: '/about#leadership' },
      { name: 'Facilities', href: '/about#facilities' },
    ],
    Academics: [
      { name: 'Programs Overview', href: '/academics' },
      { name: 'Play School to Secondary', href: '/academics#programs' },
      { name: 'Curriculum', href: '/academics#curriculum' },
      {
        name: 'Extracurricular Activities',
        href: '/academics#extracurricular',
      },
    ],
    Admissions: [
      { name: 'Admissions Process', href: '/admissions' },
      { name: 'Requirements', href: '/admissions#requirements' },
      { name: 'Fee Structure', href: '/admissions#fees' },
    ],
  };

  return (
    <>
      {/* Top Bar - Info Section */}
      <div className="hidden sm:block bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 text-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex gap-6">
            {(() => {
              const phone = contactInfo.find((c) => c.title === 'Phone');
              const email = contactInfo.find((c) => c.title === 'Email');

              return (
                <>
                  {phone?.details?.[0] && (
                    <a
                      href={phone.links?.[0] ?? `tel:${phone.details[0]}`}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <Phone size={14} />
                      <span>{phone.details[0]}</span>
                    </a>
                  )}

                  {email?.details?.[0] && (
                    <a
                      href={email.links?.[0] ?? `mailto:${email.details[0]}`}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <Mail size={14} />
                      <span>{email.details[0]}</span>
                    </a>
                  )}
                </>
              );
            })()}
          </div>
          <div className="text-xs text-slate-400">
            {contactInfo[0].details.join(' | ')}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center gap-3 font-bold text-xl group flex-shrink-0"
            >
              <img
                src="/all_images/page1_img4.jpeg"
                alt="GPS logo"
                className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-base font-bold">
                  GPS
                </span>
                <span className="hidden sm:inline text-xs text-slate-500 font-normal">
                  Fatehpur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            <div className="flex items-center flex-1 justify-center gap-1">
              {navLinks.map((link) => {
                const hasDropdown = link.name in dropdowns;

                if (!hasDropdown) {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-200"
                    >
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <div key={link.name} className="relative group">
                    <button
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-200 flex items-center gap-1"
                    >
                      {link.name}
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-200 group-hover:rotate-180"
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className={`absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg transition-all duration-200 z-50 ${
                        openDropdown === link.name
                          ? 'opacity-100 visible'
                          : 'opacity-0 invisible'
                      }`}
                    >
                      <div className="py-2">
                        {dropdowns[link.name].map((item) => (
                          <Link
                            key={item.name}
                            to={item.href || '/'}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/admissions">Apply Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Sheet */}
            <div className="md:hidden flex-shrink-0">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {isOpen ? (
                      <X size={24} className="text-slate-700" />
                    ) : (
                      <Menu size={24} className="text-slate-700" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[440px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6">
                    {navLinks.map((link) => {
                      const hasDropdown = link.name in dropdowns;
                      if (!hasDropdown) {
                        return (
                          <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                          >
                            {link.name}
                          </Link>
                        );
                      }

                      return (
                        <div
                          key={link.name}
                          className="border-t border-slate-200 mt-2 pt-2"
                        >
                          <div className="px-4 py-2 text-sm font-semibold text-slate-700">
                            {link.name}
                          </div>
                          {dropdowns[link.name].map((item) => (
                            <Link
                              key={item.name}
                              to={item.href || '/'}
                              onClick={() => setIsOpen(false)}
                              className="block px-6 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/admissions">Apply Now</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
