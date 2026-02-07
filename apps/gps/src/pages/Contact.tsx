'use client';

import React from 'react';

import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { contactInfo } from '../lib/contactInfo';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Using formsubmit.co for no-server email delivery. The form posts
  // directly to the service which will deliver an email to the
  // configured address without requiring a backend.

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-pink-900 to-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with us for any queries or
            information.
          </p>
        </div>
      </section>

      {/* Contact Information removed — consolidated in Find Us section below */}

      {/* Contact Form and Map */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Send us a Message
              </h2>
              <div className="rounded-lg overflow-hidden shadow-lg mb-8">
                <img
                  src="/all_images/page10_img30.jpeg"
                  alt="Contact Us"
                  className="w-full h-48 object-cover"
                />
              </div>
              <Card>
                <CardContent className="pt-6">
                  <form
                    action="https://formsubmit.co/globalpublicschoolfatehpur@gmail.com"
                    method="POST"
                    className="space-y-6"
                  >
                    {/* FormSubmit.co expects form fields; hidden inputs below help with subject and basic spam protection */}
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
                        className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
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
                        className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                        placeholder="Your message"
                        rows={5}
                        required
                        className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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

            {/* Additional Info */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>

              <Card>
                <CardHeader>
                  <CardTitle>School Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Address:</span> Fatehpur,
                    Rajasthan
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Phone:</span> +91
                    XXXX-XXX-XXX
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Email:</span>{' '}
                    info@gps.edu.in
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 4:00 PM</p>
                  <p>Saturday: 10:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We aim to respond to all inquiries within 24 hours during
                    business days. For urgent matters, please call the school
                    office directly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Find Us Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Find Us</h2>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="flex gap-4 items-start bg-white rounded-lg shadow-sm border border-slate-100 p-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${c.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{c.title}</p>
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
                );
              })}

              <div className="mt-2 text-sm text-muted-foreground">
                <p className="font-semibold">Office Hours</p>
                <p>Mon - Fri: 9:00 AM - 4:00 PM</p>
              </div>
            </div>

            {/* Map / Image */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-input">
              {/* Google maps place URLs often block embedding (X-Frame-Options).
                  Use OpenStreetMap embed for reliable in-page map, and provide
                  a link that opens the official Google Maps place in a new tab. */}
              <iframe
                title="GPS Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=75.945%2C32.0989%2C75.955%2C32.1089&layer=mapnik&marker=32.1039375%2C75.9501875"
                className="w-full h-96"
                loading="lazy"
              />

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-sm">
                <a
                  href="https://www.google.com/maps/place/Global+Public+School,+Fatehpur/@32.0989459,56.4314015,5z/data=!4m10!1m3!11m2!2sVGd336yfjFT9AfXur7YVMrk2W4UeUw!3e1!3m5!1s0x391b6f9510ac9c5b:0xaa1f27acc122a731!8m2!3d32.1039375!4d75.9501875!16s%2Fg%2F11tfyv27m0?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-50">
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
