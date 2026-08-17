import type { Event } from '@/types';

export const events: Event[] = [
  {
    id: 'evt-001',
    title: 'Community Seva Day',
    description:
      'A day dedicated to serving our community through food distribution, cleanliness drives, and connecting with people who need support.',
    date: '2026-08-15',
    location: 'Main Community Ground',
    image: '/assets/images/community-support.jpg',
    status: 'upcoming',
    volunteersNeeded: 50,
    volunteersJoined: 32,
  },
  {
    id: 'evt-002',
    title: 'Seva & Nature Initiative',
    description:
      'A combined initiative focusing on tree plantation, river clean-up, and environmental awareness in our neighborhood.',
    date: '2026-08-26',
    location: 'River Bank & Community Park',
    image: '/assets/images/nature-seva.jpg',
    status: 'upcoming',
    volunteersNeeded: 40,
    volunteersJoined: 18,
  },
  {
    id: 'evt-003',
    title: 'Winter Food Seva',
    description:
      'Preparing and distributing warm meals and blankets to those in need during the cold winter months.',
    date: '2026-12-15',
    location: 'Multiple Locations',
    image: '/assets/images/food-seva.jpg',
    status: 'upcoming',
    volunteersNeeded: 60,
    volunteersJoined: 10,
  },
  {
    id: 'evt-004',
    title: 'Republic Day Special Seva',
    description:
      'A special food distribution and community gathering to celebrate Republic Day with service.',
    date: '2026-01-26',
    location: 'Main Community Ground',
    image: '/assets/images/community-support.jpg',
    status: 'past',
    volunteersJoined: 50,
  },
  {
    id: 'evt-005',
    title: 'World Environment Day Plantation',
    description:
      'Planted 100 trees and conducted environmental awareness activities with local schools.',
    date: '2026-06-05',
    location: 'Community Park',
    image: '/assets/images/nature-seva.jpg',
    status: 'past',
    volunteersJoined: 45,
  },
  {
    id: 'evt-006',
    title: 'Summer Water Seva Camp',
    description:
      'Set up water distribution points across the city to help people and animals during extreme heat.',
    date: '2026-05-20',
    location: 'Citywide',
    image: '/assets/images/food-seva.jpg',
    status: 'past',
    volunteersJoined: 30,
  },
];
