import type { LucideIcon } from 'lucide-react';

export interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  dataAiHint: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  dataAiHint?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  icon: LucideIcon;
  dataAiHint: string;
}
