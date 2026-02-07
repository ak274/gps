import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    details: [
      'Vill-Bherta, P.O. & Teh.- Fatehpur',
      'Distt.-Kangra',
      'Himachal Pradesh',
    ],
    color: 'bg-blue-600',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['7807226670', '9805501640'],
    color: 'bg-green-600',
    links: ['tel:7807226670', 'tel:9805501640'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['globalpublicschoolfatehpur@gmail.com'],
    color: 'bg-purple-600',
    links: ['mailto:globalpublicschoolfatehpur@gmail.com'],
  },
  {
    icon: Globe,
    title: 'Website',
    details: ['www.gpsfatehpur.com'],
    color: 'bg-orange-600',
    links: ['http://www.gpsfatehpur.com'],
  },
];

export type ContactItem = (typeof contactInfo)[number];
