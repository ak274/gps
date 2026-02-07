import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export default function Sitemap() {
  const links = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'About — Our Journey', to: '/about#journey' },
    { label: 'About — Our Values', to: '/about#values' },
    { label: 'About — Leadership', to: '/about#leadership' },
    { label: 'About — Facilities', to: '/about#facilities' },
    { label: 'Academics', to: '/academics' },
    { label: 'Academics — Programs', to: '/academics#programs' },
    { label: 'Academics — Curriculum', to: '/academics#curriculum' },
    { label: 'Academics — Extracurricular', to: '/academics#extracurricular' },
    { label: 'Admissions', to: '/admissions' },
    { label: 'Admissions — Requirements', to: '/admissions#requirements' },
    { label: 'Admissions — Enquiry', to: '/admissions#enquiry' },
    { label: 'Admissions — Fees', to: '/admissions#fees' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ];

  return (
    <div className="w-full">
      <PageMeta
        title="Sitemap | Global Public School, Fatehpur"
        description="Sitemap for the Global Public School, Fatehpur website."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Sitemap
          </h1>
          <p className="mt-3 text-lg text-white/85">
            Quick links to all pages and sections.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Pages</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="grid sm:grid-cols-2 gap-2">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
