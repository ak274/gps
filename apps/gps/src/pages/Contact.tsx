'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { contactInfo } from '../lib/contactInfo';
import { PageMeta } from '../components/PageMeta';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Using formsubmit.co for no-server email delivery. The form posts
  // directly to the service which will deliver an email to the
  // configured address without requiring a backend.

  return (
    <div className="w-full">
      <PageMeta
        title="Contact | Global Public School, Fatehpur"
        description="Contact Global Public School, Fatehpur — reach us by phone or email, send a message, and find campus directions."
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <img
          src="/all_images/page12_img34.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none select-none"
        />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm text-white/90">
            Global Public School • Fatehpur
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Reach out for admissions, academics, or general queries — we’ll get
            back to you quickly.
          </p>
        </div>
      </section>

      {/* Contact Information removed — consolidated in Find Us section below */}

      {/* Contact Details + Form */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Contact Details */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">Reach us</h2>
                  <p className="text-muted-foreground mt-2">
                    Call, email, or visit — whichever is easiest.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {contactInfo.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Card key={c.title} className="shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex gap-4 items-start">
                          <div
                            className={`w-11 h-11 rounded-lg flex items-center justify-center text-white ${c.color}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {c.title}
                            </p>
                            <div className="text-sm text-muted-foreground mt-1 space-y-1">
                              {c.links
                                ? c.details.map((d: string, i: number) => (
                                    <div key={i}>
                                      <a
                                        href={c.links?.[i] ?? '#'}
                                        className="hover:underline"
                                      >
                                        {d}
                                      </a>
                                    </div>
                                  ))
                                : c.details.map((d: string, i: number) => (
                                    <div key={i}>{d}</div>
                                  ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Office Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p>Mon - Fri: 9:00 AM - 4:00 PM</p>
                    <p>Sat: 10:00 AM - 1:00 PM</p>
                    <p>Sun: Closed</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    We aim to respond within 24 hours during business days. For
                    urgent matters, please call the school office.
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden shadow-lg">
                <div className="relative">
                  <img
                    src="/all_images/page10_img30.jpeg"
                    alt="Contact"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-sm text-foreground/80">Send a message</p>
                    <h3 className="text-2xl font-bold text-foreground">
                      We’re here to help
                    </h3>
                  </div>
                </div>

                <CardContent className="pt-6">
                  <form
                    action="https://formsubmit.co/globalpublicschoolfatehpur@gmail.com"
                    method="POST"
                    className="space-y-5"
                  >
                    <input
                      type="hidden"
                      name="_subject"
                      value="Website Contact: GPS"
                    />
                    <input type="hidden" name="_captcha" value="false" />
                    <input
                      type="text"
                      name="_honey"
                      style={{ display: 'none' }}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                          className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your email"
                          required
                          className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Message subject"
                        required
                        className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help"
                        rows={6}
                        required
                        className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Find Us Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Find us</h2>
              <p className="text-muted-foreground mt-2">
                Visit the campus — directions open in Google Maps.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg border border-input bg-background">
            <iframe
              title="GPS Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=75.945%2C32.0989%2C75.955%2C32.1089&layer=mapnik&marker=32.1039375%2C75.9501875"
              className="w-full h-96"
              loading="lazy"
            />

            <div className="p-4 bg-muted/30 border-t border-border text-sm flex items-center justify-between gap-4">
              <p className="text-muted-foreground">
                Prefer Google Maps for navigation?
              </p>
              <a
                href="https://www.google.com/maps/place/Global+Public+School,+Fatehpur/@32.0989459,56.4314015,5z/data=!4m10!1m3!11m2!2sVGd336yfjFT9AfXur7YVMrk2W4UeUw!3e1!3m5!1s0x391b6f9510ac9c5b:0xaa1f27acc122a731!8m2!3d32.1039375!4d75.9501875!16s%2Fg%2F11tfyv27m0?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'What are the admission timings?',
                a: 'Admissions are accepted during the school year with applications closing by June each year.',
              },
              {
                q: 'Is transportation available?',
                a: 'Yes, we provide transportation facilities for students. Please contact the school for more details.',
              },
              {
                q: 'What is the student-teacher ratio?',
                a: 'We maintain a low student-teacher ratio to ensure personalized attention for every student.',
              },
              {
                q: 'Are scholarships available?',
                a: 'Yes, scholarships are available based on merit and financial need. Contact the office for details.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
