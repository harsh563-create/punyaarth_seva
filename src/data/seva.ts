import type { SevaCategory } from '@/types';

export const sevaCategories: SevaCategory[] = [
  {
    id: 'dana-pani',
    title: { en: 'Dana Pani', hi: 'दाना पानी' },
    description: {
      en: 'Providing food and water to people and animals who need it.',
      hi: 'ज़रूरतमंद लोगों और पशु-पक्षियों को भोजन और जल उपलब्ध कराना।',
    },
    longDescription: {
      en: 'Dana Pani Seva is at the heart of our mission. We believe that no person or animal should go hungry. Our volunteers regularly distribute meals, drinking water, and basic food supplies to those in need — from street vendors and daily wage workers to stray animals suffering in the heat.',
      hi: 'दाना पानी सेवा हमारे मिशन के केंद्र में है। हमारा मानना है कि कोई भी इंसान या जानवर भूखा न रहे। हमारे स्वयंसेवक नियमित रूप से ज़रूरतमंदों को भोजन, पीने का पानी और बुनियादी राशन वितरित करते हैं — रेहड़ी-पटरी वालों और दिहाड़ी मज़दूरों से लेकर गर्मी में तड़पते आवारा जानवरों तक।',
    },
    icon: 'utensils',
    image: '/assets/images/food-seva.jpg',
    activities: [
      { en: 'Meal distribution in localities', hi: 'मोहल्लों में भोजन वितरण' },
      { en: 'Water distribution during summer', hi: 'गर्मियों में जल वितरण' },
      { en: 'Food packets for daily wage workers', hi: 'दिहाड़ी मज़दूरों के लिए राशन पैकेट' },
      { en: 'Feeding stray animals', hi: 'आवारा पशुओं को भोजन' },
    ],
  },
  {
    id: 'nature-seva',
    title: { en: 'Nature Seva', hi: 'प्रकृति सेवा' },
    description: {
      en: 'Working towards a cleaner, greener and healthier environment.',
      hi: 'स्वच्छ, हरित और स्वस्थ पर्यावरण की दिशा में कार्य।',
    },
    longDescription: {
      en: 'Nature Seva focuses on creating a cleaner and greener environment for everyone. Through tree plantations, cleanliness drives, and environmental awareness campaigns, we work to protect and restore the natural world around us.',
      hi: 'प्रकृति सेवा सबके लिए स्वच्छ और हरित पर्यावरण बनाने पर केंद्रित है। वृक्षारोपण, स्वच्छता अभियानों और पर्यावरण जागरूकता अभियानों के माध्यम से हम अपने आस-पास की प्राकृतिक दुनिया की रक्षा और पुनर्स्थापन का कार्य करते हैं।',
    },
    icon: 'leaf',
    image: '/assets/images/nature-seva.jpg',
    activities: [
      { en: 'Tree plantation drives', hi: 'वृक्षारोपण अभियान' },
      { en: 'Neighborhood cleanliness campaigns', hi: 'मोहल्ला स्वच्छता अभियान' },
      { en: 'River and lake clean-up', hi: 'नदी और झील सफ़ाई' },
      { en: 'Environmental awareness programs', hi: 'पर्यावरण जागरूकता कार्यक्रम' },
    ],
  },
  {
    id: 'community-support',
    title: { en: 'Community Support', hi: 'सामुदायिक सहायता' },
    description: {
      en: 'Helping people through small but meaningful acts of kindness.',
      hi: 'छोटे पर सार्थक दयालुता के कामों से लोगों की मदद।',
    },
    longDescription: {
      en: 'Our Community Support initiatives focus on helping individuals and families facing difficult times. From distributing essential supplies to organizing support for the elderly and underprivileged, we aim to strengthen the fabric of our community through compassion.',
      hi: 'हमारी सामुदायिक सहायता पहलें मुश्किल दौर से गुज़र रहे लोगों और परिवारों की मदद पर केंद्रित हैं। आवश्यक सामग्री वितरण से लेकर वृद्धों और वंचितों के लिए सहायता आयोजन तक — हम करुणा के माध्यम से समुदाय का ताना-बाना मज़बूत करना चाहते हैं।',
    },
    icon: 'heart-handshake',
    image: '/assets/images/community-support.jpg',
    activities: [
      { en: 'Essential supply distribution', hi: 'आवश्यक सामग्री वितरण' },
      { en: 'Support for elderly citizens', hi: 'वरिष्ठ नागरिकों की सहायता' },
      { en: 'Helping families in need', hi: 'ज़रूरतमंद परिवारों की मदद' },
      { en: 'Community gathering and support', hi: 'सामुदायिक मेलजोल और सहयोग' },
    ],
  },
  {
    id: 'animal-care',
    title: { en: 'Animal & Bird Care', hi: 'पशु-पक्षी सेवा' },
    description: {
      en: 'Providing food and water and caring for animals and birds.',
      hi: 'पशु-पक्षियों को भोजन, जल और देखभाल उपलब्ध कराना।',
    },
    longDescription: {
      en: 'Every living being deserves care. Our Animal & Bird Care initiative provides food, water, and basic medical support to stray animals and birds. From setting up water bowls in summer to feeding stray dogs and cats, we work to make our neighborhoods safer for all creatures.',
      hi: 'हर जीव देखभाल का हक़दार है। हमारी पशु-पक्षी सेवा पहल आवारा जानवरों और पक्षियों को भोजन, पानी और बुनियादी चिकित्सा सहायता उपलब्ध कराती है। गर्मियों में पानी के कटोरे लगाने से लेकर आवारा कुत्तों-बिल्लियों को खिलाने तक — हम हर प्राणी के लिए अपने मोहल्ले को सुरक्षित बनाने का प्रयास करते हैं।',
    },
    icon: 'paw-print',
    image: '/assets/images/animal-care.jpg',
    activities: [
      { en: 'Feeding stray animals', hi: 'आवारा पशुओं को भोजन' },
      { en: 'Setting up water bowls for birds', hi: 'पक्षियों के लिए जल कटोरे' },
      { en: 'Animal awareness campaigns', hi: 'पशु जागरूकता अभियान' },
      { en: 'Collaborating with local shelters', hi: 'स्थानीय आश्रयों के साथ सहयोग' },
    ],
  },
  {
    id: 'awareness',
    title: { en: 'Awareness', hi: 'जागरूकता' },
    description: {
      en: 'Encouraging people to participate in social and environmental activities.',
      hi: 'सामाजिक और पर्यावरणीय गतिविधियों में भाग लेने के लिए प्रेरित करना।',
    },
    longDescription: {
      en: 'Spreading awareness is a powerful form of seva. We organize and participate in campaigns that educate people about social issues, environmental conservation, health, hygiene, and the importance of community service. Every person we inspire becomes a carrier of positive change.',
      hi: 'जागरूकता फैलाना सेवा का एक शक्तिशाली रूप है। हम ऐसे अभियानों का आयोजन करते हैं और उनमें भाग लेते हैं जो लोगों को सामाजिक मुद्दों, पर्यावरण संरक्षण, स्वास्थ्य, स्वच्छता और सामुदायिक सेवा के महत्व के बारे में शिक्षित करते हैं। हमारे द्वारा प्रेरित हर व्यक्ति सकारात्मक बदलाव का वाहक बन जाता है।',
    },
    icon: 'megaphone',
    image: '/assets/images/awareness.jpg',
    activities: [
      { en: 'Social awareness campaigns', hi: 'सामाजिक जागरूकता अभियान' },
      { en: 'Health and hygiene drives', hi: 'स्वास्थ्य और स्वच्छता अभियान' },
      { en: 'Environmental education', hi: 'पर्यावरण शिक्षा' },
      { en: 'Volunteer recruitment drives', hi: 'स्वयंसेवक भर्ती अभियान' },
    ],
  },
];
