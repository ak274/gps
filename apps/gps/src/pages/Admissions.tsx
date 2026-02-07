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
import { Badge } from '../components/ui/badge';
import { CheckCircle, Calendar, FileText, Users, Check } from 'lucide-react';

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-emerald-900 to-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
            Admissions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join our learning community and be part of Global Public School
          </p>
        </div>
      </section>

      {/* Admission Criteria */}
      <section id="requirements" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Admission Requirements
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Age & Class Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

            <Card>
              <CardHeader>
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
                    variant="outline"
                    className="gap-2 py-2 px-3"
                  >
                    <Check size={14} className="text-green-600" />
                    <span>{doc}</span>
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/all_images/page7_img21.jpeg"
                alt="Student Admission Process"
                className="w-full h-full object-cover"
              />
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

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Admission Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {admissionSteps.map((item, index) => (
              <div key={index} className="relative">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {item.step}
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
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Admission Enquiry Form
          </h2>

          <Card>
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
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
      <section id="fees" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Fee Structure
          </h2>

          <Card>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-input">
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
        </div>
      </section>
    </div>
  );
}
