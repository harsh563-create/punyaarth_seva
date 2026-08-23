export type Lang = 'en' | 'hi';

export interface LocalizedText {
  en: string;
  hi: string;
}

/** A reusable asset in the admin media library. */
export interface MediaAsset {
  id: string;
  url: string;
  kind: 'image' | 'video';
  title: string;
  source: 'upload' | 'youtube' | 'link';
  createdAt: string;
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
  /** Video links — YouTube URLs are embedded, direct files play inline. */
  videos?: string[];
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

/** Editable narrative block on the About page (stored as one jsonb object). */
export interface AboutLabeledItem {
  title: LocalizedText;
  description: LocalizedText;
}

export interface AboutContent {
  storyP1: LocalizedText;
  storyP2: LocalizedText;
  storyP3: LocalizedText;
  /** Photo shown beside the story section (URL or /api/upload path). */
  storyImage: string;
  visionQuote: LocalizedText;
  missionItems: AboutLabeledItem[];
  valuesItems: AboutLabeledItem[];
  ctaTitle: LocalizedText;
  ctaText: LocalizedText;
}

export type MemberCategory = 'leadership' | 'core' | 'volunteer';

export interface TeamMember {
  id: string;
  name: string;
  designation: LocalizedText;
  category: MemberCategory;
  bio: LocalizedText;
  photo: string;
  /** Public profile links (Instagram, LinkedIn, X…); icons derive from host. */
  socials: string[];
  /** Private contact — never rendered unless showPhone is approved. */
  phone: string;
  showPhone: boolean;
  active: boolean;
  publicProfile: boolean;
  orderIndex: number;
}
