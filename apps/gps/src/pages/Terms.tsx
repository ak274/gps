import { PageMeta } from '../components/PageMeta';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export default function Terms() {
  return (
    <div className="w-full">
      <PageMeta
        title="Terms of Service | Global Public School, Fatehpur"
        description="Terms of service for the Global Public School, Fatehpur website."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="mt-3 text-lg text-white/85">
            Basic terms for using this website.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Website Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                The information on this website is provided for general
                informational purposes about Global Public School, Fatehpur. We
                may update content at any time.
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Acceptable use</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use the website lawfully and respectfully</li>
                  <li>Do not attempt to disrupt or misuse the site</li>
                  <li>
                    Do not submit false or misleading information via forms
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  Admissions & enquiries
                </p>
                <p>
                  Submitting an enquiry does not guarantee admission. Admissions
                  are subject to school policy, availability, and required
                  documentation.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Contact</p>
                <p>
                  For questions about these terms, please contact the school.
                </p>
              </div>

              <p className="text-xs">Last updated: 7 Feb 2026</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
