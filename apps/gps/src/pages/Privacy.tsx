import { PageMeta } from '../components/PageMeta';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export default function Privacy() {
  return (
    <div className="w-full">
      <PageMeta
        title="Privacy Policy | Global Public School, Fatehpur"
        description="Privacy policy for Global Public School, Fatehpur. Learn what information we collect and how we use it."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="mt-3 text-lg text-white/85">
            This page explains how we handle information submitted through our
            website.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                We may collect information you voluntarily submit (for example,
                via the Contact form or Admissions Enquiry form), such as your
                name, email address, phone number, and message.
              </p>
              <p>
                We use this information only to respond to enquiries, provide
                requested information, and support admissions-related
                communication.
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">What we collect</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Contact details you submit (name, email, phone)</li>
                  <li>Messages and enquiry details you include</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">How we use it</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To reply to your message or enquiry</li>
                  <li>To share admissions-related information you request</li>
                  <li>To improve communication and support</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  Third-party services
                </p>
                <p>
                  Forms on this website may be delivered using third-party
                  form/email services. Information you submit may be processed
                  by those providers to deliver your message.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Contact</p>
                <p>
                  If you have questions about this policy, please contact the
                  school using the details on the Contact page.
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
