import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { PageMeta } from '../components/PageMeta';
import {
  Users,
  BookOpen,
  Lightbulb,
  Award,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const programImages: Record<string, string> = {
  'Play School': '/all_images/page4_img14.jpeg',
  Kindergarten: '/all_images/page4_img13.jpeg',
  'Primary School': '/all_images/page5_img15.jpeg',
  'Middle School': '/all_images/page6_img18.jpeg',
};

export default function Academics() {
  // SEO metadata
  const programs = [
    {
      name: 'Play School',
      age: 'Age 3-4 Years',
      icon: Lightbulb,
      description:
        'Our play school program focuses on sensory development, motor skills, and basic social interaction through age-appropriate play-based activities.',
      highlights: [
        'Play-based learning approach',
        'Language and motor skill development',
        'Social and emotional growth',
        'Creative activities and art',
        'Safe and nurturing environment',
      ],
    },
    {
      name: 'Kindergarten',
      age: 'Age 4-5 Years',
      icon: BookOpen,
      description:
        'Kindergarten combines structured learning with play, introducing basic academic concepts while maintaining a child-friendly atmosphere.',
      highlights: [
        'Alphabets and number recognition',
        'Early literacy and numeracy',
        'Creative expression through art',
        'Sports and physical activities',
        'Interactive group activities',
      ],
    },
    {
      name: 'Primary School',
      age: 'Age 5-11 Years (Classes I-V)',
      icon: Users,
      description:
        'Our primary school curriculum focuses on building strong foundational knowledge in all subjects while encouraging critical thinking and creativity.',
      highlights: [
        'Comprehensive curriculum (Hindi, English, Maths, Science, Social Studies)',
        'Project-based learning',
        'Extracurricular activities',
        'Regular assessments and feedback',
        'Interactive teaching methods',
      ],
    },
    {
      name: 'Middle School',
      age: 'Age 11-14 Years (Classes VI-VIII)',
      icon: Award,
      description:
        'Middle school provides specialized subject teaching with emphasis on academic rigor, personality development, and career awareness.',
      highlights: [
        'Subject-based curriculum',
        'Laboratory practices and experiments',
        'Competitive exam preparation',
        'Personality development programs',
        'Career guidance and counseling',
      ],
    },
  ];

  return (
    <div className="w-full">
      <PageMeta
        title="Academics | Global Public School, Fatehpur"
        description="Explore academics at Global Public School, Fatehpur — programs, teaching methodology, curriculum highlights, and extracurricular activities."
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-24 md:py-36 overflow-hidden">
        <img
          src="/all_images/page12_img33.jpeg"
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
            Academics
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Comprehensive educational programs from Play School to Middle School
            — with modern teaching and strong foundations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-slate-950 hover:from-blue-300 hover:to-purple-400 rounded-full shadow-lg"
            >
              <a href="#programs" className="inline-flex items-center gap-2">
                Explore Programs <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              <Link to="/admissions">Admissions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section id="programs" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Academic Programs
            </h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-3xl mx-auto">
              Age-appropriate learning pathways designed to build confidence,
              curiosity, and strong academic foundations.
            </p>
          </div>

          <div className="space-y-10">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div
                    className={`md:col-span-2 relative ${
                      index % 2 === 1 ? 'md:order-2' : 'md:order-1'
                    }`}
                  >
                    <img
                      src={programImages[program.name]}
                      alt={program.name}
                      className="w-full h-56 md:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/15 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs text-white">
                        <program.icon className="w-4 h-4" />
                        {program.age}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`md:col-span-3 p-6 md:p-8 space-y-4 ${
                      index % 2 === 1 ? 'md:order-1' : 'md:order-2'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                          {program.name}
                        </h3>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                          {program.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-semibold text-foreground mb-3">
                        Key Features
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {program.highlights.map((highlight, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="gap-2 py-2 px-3 text-xs font-medium"
                          >
                            <Check size={14} />
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Teaching Methodology
            </h2>
            <p className="text-lg text-muted-foreground">
              We employ modern, student-centric teaching approaches
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: 'Interactive Learning',
                description:
                  'Engaging classrooms with active participation, discussions, and collaborative projects that encourage critical thinking.',
              },
              {
                icon: BookOpen,
                title: 'Technology Integration',
                description:
                  'Smart classrooms with digital resources, online learning platforms, and technology-enhanced teaching methods.',
              },
              {
                icon: Award,
                title: 'Assessment & Feedback',
                description:
                  'Regular assessments combined with constructive feedback to help students understand their progress and areas for improvement.',
              },
              {
                icon: Lightbulb,
                title: 'Personalized Attention',
                description:
                  'Small class sizes and individual attention to cater to diverse learning styles and ensure no student is left behind.',
              },
            ].map((method, index) => (
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <CardTitle>{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Highlights */}
      <section id="curriculum" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Curriculum Highlights
            </h2>
            <p className="text-lg text-muted-foreground mt-3">
              A balanced curriculum that builds strong fundamentals and life
              skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-primary bg-gradient-to-br from-card to-muted">
              <CardHeader>
                <CardTitle>Core Subjects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  English • Hindi • Mathematics
                </p>
                <p className="text-muted-foreground">
                  Science • Social Studies • Sanskrit
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-secondary bg-gradient-to-br from-card to-muted">
              <CardHeader>
                <CardTitle>Skill Development</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Life Skills • Communication Skills
                </p>
                <p className="text-muted-foreground">
                  Problem-Solving • Teamwork & Leadership
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-accent bg-gradient-to-br from-card to-muted">
              <CardHeader>
                <CardTitle>Sports & Physical Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Regular physical education, inter-school competitions, and
                  sports activities
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-primary/60 bg-gradient-to-br from-card to-muted">
              <CardHeader>
                <CardTitle>Arts & Culture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Music, Dance, Drama, and Art classes with focus on cultural
                  preservation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sports & Extra-curricular Showcase */}
      <section id="extracurricular" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg relative">
              <img
                src="/all_images/page5_img17.jpeg"
                alt="Students in Extracurricular Activities"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/10 to-transparent" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Beyond Academics
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We believe in developing the whole child through a comprehensive
                range of extracurricular activities.
              </p>
              <ul className="space-y-4">
                {[
                  'Multiple sports programs including cricket, football, basketball, and athletics',
                  'Cultural activities including music, dance, and theatrical performances',
                  'Science and technology clubs for interested students',
                  'Debate and public speaking forums',
                  'Art and creative expression workshops',
                  'Community service and social responsibility initiatives',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Co-curricular Activities */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Co-curricular Activities
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Beyond the classroom, we offer a wide range of activities to
                develop every student's talents and interests.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our sports programs, cultural events, and clubs help students
                build confidence, teamwork skills, and discover their passions.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg relative">
              <img
                src="/all_images/page5_img16.jpeg"
                alt="Students in Sports and Extracurricular Activities"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-purple-500/10" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Activities & Programs
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Annual Sports Day',
              'Cultural Programs',
              'Science Fair',
              'Debate Competitions',
              'Field Trips & Excursions',
              'School Assembly',
              'Scout & Guide',
              'Art Exhibitions',
              'Hobby Classes',
            ].map((activity, index) => (
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-foreground">{activity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
