import type { SevaCategory } from '@/types';

export const sevaCategories: SevaCategory[] = [
  {
    id: 'dana-pani',
    title: 'Dana Pani',
    description: 'Providing food and water to people and animals who need it.',
    longDescription:
      'Dana Pani Seva is at the heart of our mission. We believe that no person or animal should go hungry. Our volunteers regularly distribute meals, drinking water, and basic food supplies to those in need — from street vendors and daily wage workers to stray animals suffering in the heat.',
    icon: 'utensils',
    image: '/assets/images/food-seva.jpg',
    activities: [
      'Meal distribution in localities',
      'Water distribution during summer',
      'Food packets for daily wage workers',
      'Feeding stray animals',
    ],
  },
  {
    id: 'nature-seva',
    title: 'Nature Seva',
    description: 'Working towards a cleaner, greener and healthier environment.',
    longDescription:
      'Nature Seva focuses on creating a cleaner and greener environment for everyone. Through tree plantations, cleanliness drives, and environmental awareness campaigns, we work to protect and restore the natural world around us.',
    icon: 'leaf',
    image: '/assets/images/nature-seva.jpg',
    activities: [
      'Tree plantation drives',
      'Neighborhood cleanliness campaigns',
      'River and lake clean-up',
      'Environmental awareness programs',
    ],
  },
  {
    id: 'community-support',
    title: 'Community Support',
    description: 'Helping people through small but meaningful acts of kindness.',
    longDescription:
      'Our Community Support initiatives focus on helping individuals and families facing difficult times. From distributing essential supplies to organizing support for the elderly and underprivileged, we aim to strengthen the fabric of our community through compassion.',
    icon: 'heart-handshake',
    image: '/assets/images/community-support.jpg',
    activities: [
      'Essential supply distribution',
      'Support for elderly citizens',
      'Helping families in need',
      'Community gathering and support',
    ],
  },
  {
    id: 'animal-care',
    title: 'Animal & Bird Care',
    description: 'Providing food and water and caring for animals and birds.',
    longDescription:
      'Every living being deserves care. Our Animal & Bird Care initiative provides food, water, and basic medical support to stray animals and birds. From setting up water bowls in summer to feeding stray dogs and cats, we work to make our neighborhoods safer for all creatures.',
    icon: 'paw-print',
    image: '/assets/images/animal-care.jpg',
    activities: [
      'Feeding stray animals',
      'Setting up water bowls for birds',
      'Animal awareness campaigns',
      'Collaborating with local shelters',
    ],
  },
  {
    id: 'awareness',
    title: 'Awareness',
    description: 'Encouraging people to participate in social and environmental activities.',
    longDescription:
      'Spreading awareness is a powerful form of seva. We organize and participate in campaigns that educate people about social issues, environmental conservation, health, hygiene, and the importance of community service. Every person we inspire becomes a carrier of positive change.',
    icon: 'megaphone',
    image: '/assets/images/awareness.jpg',
    activities: [
      'Social awareness campaigns',
      'Health and hygiene drives',
      'Environmental education',
      'Volunteer recruitment drives',
    ],
  },
];
