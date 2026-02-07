import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, BookOpen, Lightbulb, Award, Check } from 'lucide-react';

const programImages: Record<string, string> = {
  'Play School': '/all_images/page4_img14.jpeg',
  Kindergarten: '/all_images/page4_img13.jpeg',
  'Primary School': '/all_images/page5_img15.jpeg',
  'Middle School': '/all_images/page6_img18.jpeg',
};

export default function Academics() {
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-amber-900 to-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
            Academics
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive educational programs from Play School to Middle School
          </p>
        </div>
      </section>

      {/* Academic Programs */}
      <section id="programs" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {programs.map((program, index) => (
              <div
                key={index}
                className="grid md:grid-cols-3 gap-8 items-start"
              >
                {/* Left side - Icon and Title */}
                <div className="md:col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-lg h-64">
                    <img
                      src={programImages[program.name]}
                      alt={program.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {program.name}
                    </h2>
                    <p className="text-primary font-semibold text-lg">
                      {program.age}
                    </p>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>

                  <div className="pt-4">
                    <h4 className="font-semibold text-foreground mb-4">
                      Key Features:
                    </h4>
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
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-16 md:py-24 bg-slate-50">
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
                title: 'Interactive Learning',
                description:
                  'Engaging classrooms with active participation, discussions, and collaborative projects that encourage critical thinking.',
              },
              {
                title: 'Technology Integration',
                description:
                  'Smart classrooms with digital resources, online learning platforms, and technology-enhanced teaching methods.',
              },
              {
                title: 'Assessment & Feedback',
                description:
                  'Regular assessments combined with constructive feedback to help students understand their progress and areas for improvement.',
              },
              {
                title: 'Personalized Attention',
                description:
                  'Small class sizes and individual attention to cater to diverse learning styles and ensure no student is left behind.',
              },
            ].map((method, index) => (
              <Card key={index}>
                <CardHeader>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Curriculum Highlights
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-primary">
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

            <Card className="border-l-4 border-secondary">
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

            <Card className="border-l-4 border-accent">
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

            <Card className="border-l-4 border-primary/60">
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
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/all_images/page5_img17.jpeg"
                alt="Students in Extracurricular Activities"
                className="w-full h-full object-cover"
              />
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
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Co-curricular Activities */}
      <section className="py-16 md:py-24 bg-slate-50">
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
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/all_images/page5_img16.jpeg"
                alt="Students in Sports and Extracurricular Activities"
                className="w-full h-full object-cover"
              />
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
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-center font-semibold text-foreground">
                    {activity}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
