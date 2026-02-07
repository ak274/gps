import { Award, Users, Heart, BookOpen } from 'lucide-react';

export default function About() {
  const timeline = [
    { year: '2018', event: 'Global Public School Founded in Fatehpur' },
    { year: '2019', event: 'Play School and Kindergarten Programs Launched' },
    { year: '2020', event: 'Primary School Section Established' },
    { year: '2022', event: 'Middle School Classes Introduced' },
    { year: '2024', event: 'Extended Infrastructure and Facilities' },
  ];

  const values = [
    {
      icon: Award,
      title: 'Academic Excellence',
      description:
        'Commitment to highest standards of education and continuous improvement',
    },
    {
      icon: Heart,
      title: 'Integrity & Ethics',
      description:
        'Building strong moral character and ethical values in our students',
    },
    {
      icon: Users,
      title: 'Community Spirit',
      description:
        'Fostering cooperation, respect, and teamwork among all members',
    },
    {
      icon: BookOpen,
      title: 'Lifelong Learning',
      description:
        'Encouraging curiosity, creativity, and continuous personal development',
    },
  ];

  // Use larger illustrative images from the public folder for visual richness
  const timelineImages = [
    '/all_images/page10_img30.jpeg',
    '/all_images/page5_img17.jpeg',
    '/all_images/page5_img16.jpeg',
    '/all_images/page7_img21.jpeg',
    '/all_images/page8_img25.jpeg',
  ];

  const valueImages = [
    '/all_images/page5_img17.jpeg',
    '/all_images/page5_img16.jpeg',
    '/all_images/page4_img14.jpeg',
    '/all_images/page6_img18.jpeg',
  ];

  const team = [
    {
      name: 'Mr. Gaurav Kalia',
      role: 'Managing Director',
      bio: 'Educational leadership with a focus on inclusive growth and community engagement.',
      img: '/all_images/managing-director.jpeg',
    },
  ];

  const facilities = [
    {
      title: 'Library & Resource Center',
      description:
        'Well-stocked library with digital resources and quiet study spaces.',
      img: '/all_images/page8_img25.jpeg',
    },
    {
      title: 'Science Labs',
      description:
        'Fully equipped labs to encourage hands-on scientific exploration.',
      img: '/all_images/page5_img17.jpeg',
    },
    {
      title: 'Playgrounds & Sports',
      description:
        'Large playgrounds and sports facilities for physical development.',
      img: '/all_images/page7_img21.jpeg',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Global Public School
          </h1>
          <p className="mt-4 text-lg text-slate-200 max-w-3xl mx-auto">
            Educating the next generation with compassion, creativity and
            excellence — a modern campus grounded in strong values.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/admissions"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-[1.02] transition-transform"
            >
              Apply Now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 border border-slate-200 text-white/90 px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-40" />
      </section>

      {/* About + Stats */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              About Global Public School
            </h2>
            <p className="text-lg text-muted-foreground">
              Since 2018, Global Public School has grown into a vibrant learning
              community. Our curriculum blends strong academics with
              extracurricular opportunities to shape well-rounded students.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">
                  Students enrolled
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm">
                <p className="text-2xl font-bold">50+</p>
                <p className="text-sm text-muted-foreground">
                  Experienced staff
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="/all_images/page4_img13.jpeg"
              alt="School building"
              className="w-full h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Timeline (alternating) */}
      <section id="journey" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 z-0" />
            <div className="space-y-12">
              {timeline.map((t, i) => (
                <div
                  key={i}
                  className={`relative z-10 flex flex-col md:flex-row items-center gap-6 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="md:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={timelineImages[i]}
                        alt={t.event}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm text-primary font-semibold">
                            {t.year}
                          </p>
                          <p className="mt-1 text-lg font-bold">{t.event}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Learn more about this milestone and how it shaped our
                        school.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our Core Values
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Principles that guide our educational philosophy
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition-transform"
              >
                <div className="w-full h-40 relative">
                  <img
                    src={valueImages[idx]}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Leadership
          </h2>
          {team.length > 1 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow text-center"
                >
                  <div className="w-28 h-28 rounded-full mx-auto overflow-hidden mb-4">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-sm text-muted-foreground mt-2">{t.role}</p>
                  <p className="text-sm text-muted-foreground mt-3">{t.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow text-center">
                <div className="w-36 h-36 rounded-full mx-auto overflow-hidden mb-6 ring-4 ring-primary/10">
                  <img
                    src={team[0].img}
                    alt={team[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-2xl font-semibold">{team[0].name}</h4>
                <p className="text-sm text-primary mt-1">{team[0].role}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  {team[0].bio}
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <a href="/contact" className="text-sm text-primary underline">
                    Contact
                  </a>
                  <a
                    href="/admissions"
                    className="text-sm text-muted-foreground"
                  >
                    Admissions
                  </a>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                More leadership profiles coming soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Facilities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {facilities.map((f, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition"
              >
                <div className="relative w-full h-48">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <h4 className="absolute left-4 bottom-4 text-white font-semibold">
                    {f.title}
                  </h4>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Ready to join our community?</h3>
            <p className="text-sm mt-1">
              Apply today or contact our admissions office for a visit.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/admissions"
              className="bg-white text-indigo-600 px-5 py-3 rounded-full font-semibold"
            >
              Apply Now
            </a>
            <a
              href="/contact"
              className="border border-white/30 px-5 py-3 rounded-full"
            >
              Contact
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
