import { PlaceHolderImages } from '@/lib/placeholder-images';

export type Project = {
  id: string;
  title: string;
  description: string;
  category: 'Web Design' | 'Branding' | 'UI/UX';
  software: string[];
  imageUrl: string;
  imageHint: string;
  resources?: {
    label: string;
    url: string;
    type: 'website' | 'github';
  }[];
};

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        return { imageUrl: '', imageHint: '' };
    }
    return { imageUrl: img.imageUrl, imageHint: img.imageHint };
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Site Vitrine Moderne',
    description: 'Création d\'un site vitrine pour une startup technologique, axé sur une expérience utilisateur fluide.',
    category: 'Web Design',
    software: ['Next.js', 'Tailwind CSS'],
    ...getImage('project-1'),
    resources: [
      { label: 'Site Web', url: '#', type: 'website' },
      { label: 'GitHub', url: '#', type: 'github' },
    ]
  },
  {
    id: '2',
    title: 'Identité de Marque "Avenir"',
    description: 'Développement complet de l\'identité visuelle pour une marque de mode durable.',
    category: 'Branding',
    software: ['Illustrator', 'Photoshop'],
    ...getImage('project-2')
  },
  {
    id: '3',
    title: 'Application de Productivité',
    description: 'Conception de l\'interface et de l\'expérience utilisateur pour une nouvelle application mobile.',
    category: 'UI/UX',
    software: ['Figma', 'Sketch'],
    ...getImage('project-3'),
     resources: [
      { label: 'Voir sur Figma', url: '#', type: 'website' },
    ]
  },
  {
    id: '4',
    title: 'Plateforme E-commerce',
    description: 'Refonte d\'une plateforme e-commerce pour améliorer la conversion et la navigation.',
    category: 'Web Design',
    software: ['React', 'Shopify'],
    ...getImage('project-4'),
    resources: [
      { label: 'Site Web', url: '#', type: 'website' },
    ]
  },
  {
    id: '5',
    title: 'Refonte du logo "Innovate"',
    description: 'Modernisation du logo et de la charte graphique d\'une société de conseil.',
    category: 'Branding',
    software: ['Illustrator'],
    ...getImage('project-5')
  },
  {
    id: '6',
    title: 'Dashboard Analytique',
    description: 'Design d\'un tableau de bord complexe pour la visualisation de données financières.',
    category: 'UI/UX',
    software: ['Figma', 'Tableau'],
    ...getImage('project-6')
  },
];

export const categories = [...new Set(projects.map((p) => p.category))];
export const software = [...new Set(projects.flatMap((p) => p.software))];
