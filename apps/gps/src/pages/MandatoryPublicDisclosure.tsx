import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

type DocumentRecord = { title: string; file: string };
type DisclosureRow = { item: string; details: string; link?: DocumentRecord };

const documents: DocumentRecord[] = [
  { title: 'Recognition Certificate', file: '/MPD/Recognition%20certificate.pdf' },
  { title: 'Society Registration Certificate', file: '/MPD/Registration%20of%20society.pdf' },
  { title: 'Building Safety Certificate', file: '/MPD/building%20safety%20certificate.pdf' },
  { title: 'Fire Safety Certificate', file: '/MPD/Fire%20certificate.pdf' },
  { title: 'Water Sanitation Certificate', file: '/MPD/water%20sanitation%20certificate.pdf' },
  { title: 'Built-up Area Certificate', file: '/MPD/Built%20up%20Area%20Certificate%201.pdf' },
  { title: 'School Management Committee (SMC)', file: '/MPD/School%20Management%20Committee%20(SMC).pdf' },
  { title: 'Parent-Teacher Association (PTA)', file: '/MPD/Parents%20-%20Teacher%20Association%20(PTA).pdf' },
  { title: 'Teachers Detail', file: '/MPD/Teachers%20Detail%201.pdf' },
  { title: 'Annual Calendar', file: '/MPD/Annual%20Calendar.pdf' },
  { title: 'Fee Structure', file: '/MPD/Fee%20structure%201.pdf' },
];

const teachers = [
  ['Amita Guleria', 'PGT', 'B.Sc (B.Ed), M.Sc Chemistry'],
  ['Ambika Sharma', 'TGT', 'B.A. (B.Ed)'],
  ['Amritdeep Kaur', 'TGT', 'B.A. (B.Ed)'],
  ['Ashima', 'PGT', 'B.Sc (B.Ed), M.Sc Botany'],
  ['Indu Sharma', 'PGT', 'B.Sc (B.Ed)'],
  ['Kiran Bala', 'TGT', 'B.Sc (B.Ed)'],
  ['Neha Sharma', 'PGT', 'B.Sc (B.Ed), M.Sc Chemistry'],
  ['Nisha', 'TGT', 'B.A. (B.Ed)'],
  ['Preeti Guleria', 'PGT', 'B.Sc (B.Ed), M.Sc Mathematics'],
  ['Ripul Kashmiriya', 'PRT', 'JBT'],
  ['Shivani', 'TGT', 'B.A. (B.Ed)'],
  ['Shivani Devi', 'PRT', 'JBT'],
  ['Sonia', 'PRT', 'D.El.Ed'],
  ['Suman Bala', 'TGT', 'B.Sc (B.Ed)'],
  ['Swapnil Bharadwaj', 'PRT', 'JBT'],
];

const documentByTitle = (title: string) => documents.find((doc) => doc.title === title);

const generalInformation: DisclosureRow[] = [
  { item: 'Name of the School', details: 'Global Public School, Fatehpur' },
  { item: 'School Code', details: '1951' },
  { item: 'Complete Address', details: 'Vill. Bherta, P.O. & Tehsil Fatehpur, District Kangra, Himachal Pradesh' },
  { item: 'Year of Establishment', details: '2018' },
  { item: 'School Email ID', details: 'globalpublicschoolfatehpur@gmail.com' },
  { item: 'Contact Details', details: '7807226670 · 9805501640' },
  { item: 'Recognition / Registration', details: 'View LINK', link: documentByTitle('Recognition Certificate') },
];

const academicInformation: DisclosureRow[] = [
  { item: 'Affiliation Status', details: 'Not Applicable at present' },
  { item: 'Classes Offered', details: 'Play School to Middle School' },
  { item: 'Board Examination Results', details: 'Not Applicable at present' },
  { item: 'Academic Calendar', details: 'View LINK', link: documentByTitle('Annual Calendar') },
];

const infrastructureInformation: DisclosureRow[] = [
  { item: 'Built-up Area', details: 'View LINK', link: documentByTitle('Built-up Area Certificate') },
  { item: 'Building Safety', details: 'View LINK', link: documentByTitle('Building Safety Certificate') },
  { item: 'Fire Safety', details: 'View LINK', link: documentByTitle('Fire Safety Certificate') },
  { item: 'Water and Sanitation', details: 'View LINK', link: documentByTitle('Water Sanitation Certificate') },
  { item: 'Fee Structure', details: 'View LINK', link: documentByTitle('Fee Structure') },
];

const staffStats: { value: string; label: string; icon: LucideIcon }[] = [
  { value: '15', label: 'Total teachers', icon: Users },
  { value: '5', label: 'PGT teachers', icon: GraduationCap },
  { value: '6 TGT · 4 PRT', label: 'Teaching categories', icon: FileText },
];

function DisclosureTable({ rows }: { rows: DisclosureRow[] }) {
  return (
    <div className="overflow-hidden border border-slate-200 bg-white">
      <div className="hidden grid-cols-[64px_minmax(180px,0.85fr)_minmax(0,1.5fr)] bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white sm:grid">
        <span>S. No.</span><span>Information</span><span>Details</span>
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((row, index) => (
          <div key={row.item} className="grid gap-2 px-5 py-4 sm:grid-cols-[64px_minmax(180px,0.85fr)_minmax(0,1.5fr)] sm:items-center sm:gap-0">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-sm font-semibold text-slate-900">{row.item}</span>
            <span className="text-sm leading-6 text-slate-600">
              {row.link ? <a href={row.link.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-blue-800 underline decoration-blue-200 underline-offset-4 hover:text-blue-600">View LINK <ArrowUpRight className="h-3.5 w-3.5" /></a> : row.details}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">{label}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default function MandatoryPublicDisclosure() {
  return (
    <div className="w-full bg-[#f7f8fb]">
      <PageMeta title="Mandatory Public Disclosure | Global Public School, Fatehpur" description="CBSE-style Mandatory Public Disclosure for Global Public School, Fatehpur, including statutory documents, academic information, infrastructure and teaching staff." />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(30,64,175,0.42),transparent_36%),radial-gradient(circle_at_14%_80%,rgba(15,118,110,0.24),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100"><ShieldCheck className="h-4 w-4 text-emerald-300" />Official school disclosure</div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-blue-200">Global Public School · Fatehpur</p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl md:text-6xl">Mandatory Public Disclosure</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Mandatory Public Disclosure on School’s Website</p>
          </div>
          <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="border-t border-white/20 pt-4"><p className="text-3xl font-semibold">A—E</p><p className="mt-1 text-sm text-slate-400">Disclosure sections</p></div>
            <div className="border-t border-white/20 pt-4"><p className="text-3xl font-semibold">11</p><p className="mt-1 text-sm text-slate-400">Public documents</p></div>
            <div className="border-t border-white/20 pt-4"><p className="text-3xl font-semibold">15</p><p className="mt-1 text-sm text-slate-400">Teaching staff</p></div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <section className="mb-16" aria-labelledby="general-information"><SectionHeading label="Section A" title="General Information" description="Basic school information and official contact details." /><DisclosureTable rows={generalInformation} /></section>

        <section className="mb-16" aria-labelledby="documents-information"><SectionHeading label="Section B" title="Documents and Information" description="The required statutory records are published in the requested sequence. Select View LINK to open each PDF directly." />
          <div id="documents-information" className="overflow-hidden border border-slate-200 bg-white">
            <div className="hidden grid-cols-[64px_minmax(0,1fr)_140px] bg-blue-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white sm:grid"><span>S. No.</span><span>Document / Information</span><span>Website Link</span></div>
            <div className="divide-y divide-slate-200">{documents.map((document, index) => <div key={document.title} className="grid gap-3 px-5 py-4 sm:grid-cols-[64px_minmax(0,1fr)_140px] sm:items-center"><span className="text-xs font-bold uppercase tracking-wider text-blue-700">{String(index + 1).padStart(2, '0')}</span><span className="text-sm font-semibold text-slate-900">{document.title}</span><a href={document.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 underline decoration-blue-200 underline-offset-4 hover:text-blue-600">View LINK <ExternalLink className="h-3.5 w-3.5" /></a></div>)}</div>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="academics-information"><SectionHeading label="Section C" title="Results and Academics" description="Academic information currently applicable to Global Public School’s Play School to Middle School programme." /><div id="academics-information"><DisclosureTable rows={academicInformation} /></div></section>

        <section className="mb-16" aria-labelledby="staff-information"><SectionHeading label="Section D" title="Staff (Teaching)" description="Teaching staff details are published below in the required format: Name — Designation — Qualification." />
          <div className="mb-8 grid gap-4 sm:grid-cols-3">{staffStats.map(({ value, label, icon: Icon }) => <div key={label} className="flex items-center gap-4 border border-slate-200 bg-white p-5"><Icon className="h-5 w-5 text-blue-700" /><div><p className="font-semibold text-slate-950">{value}</p><p className="text-xs text-slate-500">{label}</p></div></div>)}</div>
          <div className="mb-8 flex flex-col justify-between gap-4 border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:px-6"><div><p className="text-sm font-semibold text-slate-950">Complete signed teacher register</p><p className="mt-1 text-sm text-slate-600">Open the source PDF for the school’s signed record.</p></div><a href="/MPD/Teachers%20Detail%201.pdf" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 font-semibold text-blue-800 hover:text-blue-600">View teacher PDF <ExternalLink className="h-4 w-4" /></a></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{teachers.map(([name, designation, qualification], index) => <article key={name} className="group border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center bg-blue-950 text-sm font-bold text-white">{name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div className="min-w-0"><p className="text-base font-semibold text-slate-950">{name}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{designation}</p></div></div><div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-400">Qualification</p><p className="mt-1 text-sm leading-6 text-slate-600">{qualification}</p></div><span className="mt-4 block text-right text-xs text-slate-400">{String(index + 1).padStart(2, '0')}</span></article>)}</div>
        </section>

        <section className="mb-16" aria-labelledby="infrastructure-information"><SectionHeading label="Section E" title="School Infrastructure" description="Published safety, sanitation, built-up area and fee information for families and stakeholders." /><div id="infrastructure-information"><DisclosureTable rows={infrastructureInformation} /></div></section>

        <section className="border-t border-slate-200 pt-10" aria-label="Disclosure note"><div className="flex flex-col gap-5 border border-slate-200 bg-white p-6 sm:flex-row sm:items-start sm:p-8"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" /><div className="max-w-3xl"><h2 className="font-semibold text-slate-950">Public access and document availability</h2><p className="mt-2 text-sm leading-7 text-slate-600">All linked records are available directly from this page without login or access approval. The school should review this page whenever a certificate, staff record, annual calendar or fee detail changes.</p><a href="/MPD/Fee%20structure%201.pdf" download className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-600">Download fee structure <Download className="h-4 w-4" /></a></div></div></section>
      </main>
    </div>
  );
}
