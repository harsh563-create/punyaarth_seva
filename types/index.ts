export type Lang = 'en' | 'hi';

export interface LocalizedText {
  en: string;
  hi: string;
}

export interface Activity {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  longDescription: LocalizedText;
  date: string;
  location: LocalizedText;
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
  title: LocalizedText;
  description: LocalizedText;
  date: string;
  location: LocalizedText;
  image: string;
  status: 'upcoming' | 'past';
  volunteersNeeded?: number;
  volunteersJoined?: number;
}

export interface ImpactStat {
  id: string;
  label: LocalizedText;
  value: number;
  suffix: string;
  icon: string;
}

export interface SevaCategory {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  longDescription: LocalizedText;
  icon: string;
  image: string;
  activities: LocalizedText[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: LocalizedText;
  category: ActivityCategory;
  date: string;
}

export type DonationStatus = 'pending' | 'verified';

export interface Donation {
  id: string;
  donorName: string;
  mobile: string;
  amount: number;
  utr: string;
  /** Storage path of the optional payment screenshot (private bucket). */
  screenshot?: string;
  status: DonationStatus;
  createdAt?: string;
}

/** UPI + organization details shown on the donation page. Admin-editable. */
export interface DonationSettings {
  upiId: string;
  payeeName: string;
  qrImage: string;
  orgName: string;
  registrationDetails: string;
  taxExemptionDetails: string;
  contactEmail: string;
  contactPhone: string;
}

export interface VolunteerWay {
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}
