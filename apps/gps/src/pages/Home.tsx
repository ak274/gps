import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
// Removed Badge — keeping design minimal
import {
  ArrowRight,
  BookOpen,
  Users,
  Zap,
  Award,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-24 md:py-40 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 text-slate-950 px-4 py-2 rounded-full text-sm font-semibold">
                <span role="img" aria-label="sparkle">
                  ✨
                </span>{' '}
                Welcome to Excellence
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Global Public School
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-blue-200">
                Learning Today, Leading Tomorrow
              </p>
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Established in 2018, we provide quality education with modern
                teaching methods and holistic development for every student.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/admissions" className="gap-2">
                    Admissions Enquiry
                    <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/all_images/page1_img1.jpeg"
                    alt="Global Public School Campus"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Info Cards */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Why Choose Global Public School?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence and holistic development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: 'Excellence',
                description:
                  'High academic standards with dedicated faculty members',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Users,
                title: 'Community',
                description:
                  'Strong parent-teacher collaboration for student growth',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Zap,
                title: 'Innovation',
                description:
                  'Modern teaching methods and technology integration',
                gradient: 'from-orange-500 to-red-500',
              },
              {
                icon: BookOpen,
                title: 'Holistic Development',
                description:
                  'Sports, arts, and cultural activities for all-round growth',
                gradient: 'from-green-500 to-emerald-500',
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000`}
                />
                <Card className="relative bg-white hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 rounded-2xl overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.gradient}`}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      {/* removed Featured badge for cleaner layout */}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motto, Vision, Mission, Policy Cards */}
      <section id="philosophy" className="py-20 md:py-28 bg-white relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Our Philosophy
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">
                  Our Motto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-center py-4 text-slate-800">
                  "Excellence in Education, Character in Action"
                </p>
                <p className="text-muted-foreground">
                  We believe in nurturing not just academically bright students,
                  but individuals with strong moral values and ethical
                  principles.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
              <CardHeader>
                <CardTitle className="text-2xl text-purple-600">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To nurture students into confident, competent, and
                  compassionate global citizens who contribute positively to
                  society through innovation, integrity, and lifelong learning.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500" />
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Providing quality education that develops critical thinking,
                  creativity, and character, fostering an environment where
                  every student can excel and discover their unique potential.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-emerald-500" />
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">
                  Our Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    Student-centric teaching methodology
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    Inclusive and safe learning environment
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    Regular parent-teacher interactions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    Continuous professional development of staff
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Managing Director's Message */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute -inset-0 opacity-10">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-1 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600">
                <img
                  src="/managing-director.jpeg"
                  alt="Managing Director"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold">
                Leadership Message
              </div>
              <h3 className="text-4xl font-bold text-white">
                Message from Managing Director
              </h3>
              <p className="text-lg text-gray-200 leading-relaxed">
                At Global Public School, we believe that education is not just
                about academic excellence, but about shaping responsible
                citizens who can make a positive impact on society. Our
                dedicated team of educators is committed to providing a
                nurturing environment where every child can discover their
                potential and grow into confident, compassionate individuals.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed">
                We invite you to be part of our educational journey and
                experience the difference that quality education can make in
                your child's life.
              </p>
              <div className="pt-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-base px-6 py-3"
                >
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (improved) */}
      <section className="py-24 md:py-32 bg-gradient-to-r from-indigo-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -left-16 top-0 w-96 h-96 bg-white/8 rounded-full blur-3xl transform -translate-x-1/3" />
          <div className="absolute -right-16 bottom-0 w-96 h-96 bg-white/6 rounded-full blur-3xl transform translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left md:flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Ready to Join Our School Community?
            </h2>
            <p className="text-lg mt-3 max-w-2xl text-white/90">
              We welcome inquiries from parents and guardians. Explore our
              programs and meet our team today.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <Button
              asChild
              size="lg"
              className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl"
            >
              <Link to="/admissions">
                Apply Now
                <ArrowRight size={20} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
