'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  CheckCircle,
  Calendar,
  FileText,
  Users,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

export default function Admissions() {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    class: '',
    message: '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission is handled via FormSubmit.co (no server required).
  // The form below posts directly to the service which will email the
  // submitted values to the configured address.

  const admissionSteps = [
    {
      icon: FileText,
      step: '1',
      title: 'Submit Application',
      description: 'Fill out the admission form with complete details',
    },
    {
      icon: Users,
      step: '2',
      title: 'Personal Interview',
      description: 'Meet with school officials for discussion',
    },
    {
      icon: Calendar,
      step: '3',
      title: 'Assessment Test',
      description: 'Written or verbal assessment as per class requirement',
    },
    {
      icon: CheckCircle,
      step: '4',
      title: 'Admission Confirmation',
      description: 'Document submission and enrollment process',
    },
  ];

  return (
    <div className="w-full">
      <PageMeta
        title="Admissions | Global Public School, Fatehpur"
        description="Admissions at Global Public School, Fatehpur — requirements, admission process, enquiry form, and fee structure information."
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-24 md:py-36 overflow-hidden">
        <img
          src="/all_images/page12_img35.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none select-none"
        />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm text-white/90">
            <Sparkles className="w-4 h-4" />
            Global Public School • Fatehpur
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Admissions
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Join our learning community and be part of Global Public School — a
            supportive campus with strong academics and values.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-full shadow-lg"
            >
              <a
                href="#requirements"
                className="inline-flex items-center gap-2"
              >
                View Requirements <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              <a href="#enquiry">Enquiry Form</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Admission Criteria */}
      <section id="requirements" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Admission Requirements
            </h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-3xl mx-auto">
              Clear, simple, and transparent — so you know exactly what you
              need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <CardTitle>Age & Class Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-primary">
                    Play School (3-4 years)
                  </p>
                  <p className="text-muted-foreground">
                    Age 3-4 years as per date of birth
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Kindergarten (4-5 years)
                  </p>
                  <p className="text-muted-foreground">
                    Age 4-5 years as per date of birth
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Primary School (5-11 years)
                  </p>
                  <p className="text-muted-foreground">
                    Classes I-V for ages 5-11
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Middle School (11-14 years)
                  </p>
                  <p className="text-muted-foreground">
                    Classes VI-VIII for ages 11-14
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <CardTitle>Documents Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  'Birth Certificate (original & photocopy)',
                  'Previous School Records/Transfer Certificate',
                  'Medical Fitness Certificate',
                  'Parent/Guardian Identification Proof',
                  'Passport Size Photographs',
                ].map((doc, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="gap-2 py-2 px-3 text-xs font-medium"
                  >
                    <Check size={14} className="text-green-600" />
                    <span>{doc}</span>
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="rounded-full">
              <a href="#enquiry" className="inline-flex items-center gap-2">
                Start Enquiry <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="rounded-xl overflow-hidden shadow-lg relative">
              <img
                src="/all_images/page7_img21.jpeg"
                alt="Student Admission Process"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/10 to-transparent" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Welcome to Our School
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                We are excited to welcome new students to Global Public School.
                Our admission process is designed to be welcoming and
                transparent, ensuring that we find the right fit for every
                student.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With a supportive community and dedicated faculty, we ensure
                every student feels welcomed and valued from day one.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Admission Process
            </h2>
            <p className="text-lg text-muted-foreground mt-3">
              Four simple steps to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {admissionSteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {item.step}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
                {index !== admissionSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-primary text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Enquiry Form */}
      <section id="enquiry" className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Admission Enquiry Form
            </h2>
            <p className="text-lg text-muted-foreground mt-3">
              Share your details and we’ll guide you through next steps.
            </p>
          </div>

          <Card className="overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src="/all_images/page8_img25.jpeg"
                alt="Admissions"
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-sm text-foreground/80">Admissions enquiry</p>
                <h3 className="text-2xl font-bold text-foreground">
                  Let’s get started
                </h3>
              </div>
            </div>

            <CardContent className="pt-6">
              <form
                action="https://formsubmit.co/globalpublicschoolfatehpur@gmail.com"
                method="POST"
                className="space-y-6"
              >
                <input
                  type="hidden"
                  name="_subject"
                  value="Admissions Enquiry: GPS"
                />
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" style={{ display: 'none' }} />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="Enter student name"
                      required
                      className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      placeholder="Enter parent name"
                      required
                      className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                      className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                      className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Class of Interest *
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Select a class</option>
                    <option value="Play School">Play School</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Class I">Class I</option>
                    <option value="Class II">Class II</option>
                    <option value="Class III">Class III</option>
                    <option value="Class IV">Class IV</option>
                    <option value="Class V">Class V</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class VII">Class VII</option>
                    <option value="Class VIII">Class VIII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share any additional information or questions"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Submit Enquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fee Structure */}
      <section id="fees" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Fee Structure</h2>
            <p className="text-lg text-muted-foreground mt-3">
              Transparent fee information — contact the office for exact
              details.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-input bg-muted/40">
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Annual Fee
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Monthly Fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      class: 'Play School',
                      annual: 'On Request',
                      monthly: 'On Request',
                    },
                    {
                      class: 'Kindergarten',
                      annual: 'On Request',
                      monthly: 'On Request',
                    },
                    {
                      class: 'Classes I-V',
                      annual: 'On Request',
                      monthly: 'On Request',
                    },
                    {
                      class: 'Classes VI-VIII',
                      annual: 'On Request',
                      monthly: 'On Request',
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-input last:border-b-0"
                    >
                      <td className="py-3 px-4">{row.class}</td>
                      <td className="py-3 px-4">{row.annual}</td>
                      <td className="py-3 px-4">{row.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-muted-foreground mt-4">
                * Contact the school office for detailed fee structure and
                payment plans
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-center">
            <Button asChild className="rounded-full">
              <Link to="/contact" className="inline-flex items-center gap-2">
                Talk to Admissions <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
