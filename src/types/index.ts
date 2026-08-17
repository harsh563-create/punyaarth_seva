export interface Activity {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  location: string;
  category: ActivityCategory;
  images: string[];
  volunteersInvolved?: number;
  featured?: boolean;
}

export type ActivityCategory =
  | 'all'
  | 'food-seva'
  | 'nature'
  | 'animals'
  | 'community'
  | 'events'
  | 'awareness';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  status: 'upcoming' | 'past';
  volunteersNeeded?: number;
  volunteersJoined?: number;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface SevaCategory {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  activities: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: ActivityCategory;
  date: string;
}

export interface VolunteerWay {
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}
