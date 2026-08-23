import type { TeamMember } from '@/types';

/**
 * Fallback shown until the team_members table exists / has rows.
 * Mirrors the founder seed in supabase/migration-team.sql.
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'mbr-founder',
    name: 'Drx Devashish Shukla',
    designation: { en: 'Founder & President', hi: 'संस्थापक एवं अध्यक्ष' },
    category: 'leadership',
    bio: {
      en: "Founded Punyaarth Seva Samiti with the belief that ordinary people, coming together, can create extraordinary change. Leads the organization's vision, seva drives and community programs.",
      hi: 'पुण्यार्थ सेवा समिति की स्थापना इस विश्वास के साथ की कि साधारण लोग मिलकर असाधारण परिवर्तन ला सकते हैं। संस्था के दृष्टिकोण, सेवा अभियानों और सामुदायिक कार्यक्रमों का नेतृत्व करते हैं।',
    },
    photo: '',
    socials: [],
    phone: '',
    showPhone: false,
    active: true,
    publicProfile: true,
    orderIndex: 0,
  },
];
