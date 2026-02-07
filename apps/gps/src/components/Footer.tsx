import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  DownloadCloud,
} from 'lucide-react';
import { contactInfo } from '../lib/contactInfo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* System status row */}
        <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-300">System status:</span>
            <span className="font-medium text-white">Operational</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white/80">
                GDPR
              </span>
              <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white/80">
                SOC2
              </span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/all_images/page1_img4.jpeg"
                alt="GPS logo"
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <div className="font-bold text-lg">Global Public School</div>
                <div className="text-sm text-slate-400">
                  Learning Today, Leading Tomorrow
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              A modern, values-driven school in Fatehpur offering holistic
              education from play school to middle school.
            </p>
            <div className="flex gap-3 mt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
            <div className="mt-4">
              <a
                href="/prospectus.pdf"
                download
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-md font-semibold shadow-sm hover:shadow-md"
              >
                <DownloadCloud size={16} />
                Prospectus
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/about" className="hover:text-accent">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/academics" className="hover:text-accent">
                    Academics
                  </Link>
                </li>
                <li>
                  <Link to="/admissions" className="hover:text-accent">
                    Admissions
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-accent">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/privacy" className="hover:text-accent">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-accent">
                    Terms
                  </Link>
                </li>
                <li>
                  <a href="/" className="hover:text-accent">
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {contactInfo.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.title} className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-md flex items-center justify-center ${c.color} text-white flex-shrink-0`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {c.title}
                      </div>
                      <div className="text-slate-400 text-sm mt-1">
                        {c.links
                          ? c.details.map((d, i) => (
                              <div key={i}>
                                <a
                                  href={c.links?.[i] ?? '#'}
                                  className="hover:underline"
                                >
                                  {d}
                                </a>
                              </div>
                            ))
                          : c.details.map((d, i) => <div key={i}>{d}</div>)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>
              © {new Date().getFullYear()} Global Public School. All rights
              reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-accent">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-accent">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* small spacer removed - watermark will be absolutely positioned */}
      </div>

      {/* Huge outlined watermark (absolutely positioned, clipped by footer) */}
      <svg
        className="absolute left-1/2 transform -translate-x-1/2 -bottom-24 w-[220%] h-[400px] pointer-events-none z-0"
        viewBox="0 0 1400 200"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          fontFamily="Inter, Helvetica, Arial, sans-serif"
          fontWeight="500"
          fontSize="170"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          strokeLinejoin="round"
          letterSpacing={8}
        >
          GPS
        </text>
      </svg>
    </footer>
  );
}
