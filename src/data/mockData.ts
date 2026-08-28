import { QuestStep, LessonResource, ParentAdaptationLog, ApprovedContentItem } from '../types';

export const QUEST_STEPS: QuestStep[] = [
  {
    id: 1,
    title: 'The Birth of a Nebula',
    status: 'completed',
    duration: '10 mins',
    summary: 'How giant clouds of hydrogen dust condense under gravity to ignite nuclear fusion.'
  },
  {
    id: 2,
    title: 'Life of a Star: Main Sequence',
    status: 'active',
    duration: '15 mins',
    summary: 'The balance of inward gravitational pull and outward thermonuclear pressure.'
  },
  {
    id: 3,
    title: 'Supernovas & Stellar Endings',
    status: 'locked',
    duration: '12 mins',
    summary: 'What happens when fuel runs out: white dwarfs, neutron stars, and black holes.'
  },
  {
    id: 4,
    title: 'Final Astro-Quiz & Journal Check',
    status: 'locked',
    duration: '8 mins',
    summary: 'Interactive assessment to claim your Cosmic Explorer Gold Badge.'
  }
];

export const QUANTUM_PLAN_RESOURCES: LessonResource[] = [
  {
    id: 'res-1',
    title: 'Crash Course Astronomy: Star Formation & Nuclear Fusion',
    type: 'video',
    duration: '11:45',
    source: 'PBS / Crash Course',
    summary: 'Phil Plait explores the ignition of protostars and how hydrogen fuses into helium under millions of degrees.',
    completed: true
  },
  {
    id: 'res-2',
    title: 'Astrophysics in a Hurry: Chapter 3 Stellar Cycles',
    type: 'book',
    duration: '18 mins read',
    source: 'Curator Select Digest',
    summary: 'Core breakdown of stellar lifespans, Hertzsprung-Russell diagram analysis, and stellar classifications (O, B, A, F, G, K, M).',
    completed: false
  },
  {
    id: 'res-3',
    title: 'Interactive 3D Stellar Furnace Simulator',
    type: 'interactive',
    duration: '10 mins play',
    source: 'EduCurate Labs',
    summary: 'Adjust gravity and core mass to watch a proto-star become a yellow dwarf, red giant, or supernova.',
    completed: false
  }
];

export const JUNIOR_ACTIVITIES = [
  {
    id: 'j-1',
    title: 'Friendly Lions',
    category: 'Wild Animals',
    level: 'Easy Peasy',
    icon: '🦁',
    bgColor: 'from-amber-400 to-orange-500',
    duration: '5 min',
    stars: 3,
    description: 'Learn how lion cubs roar, play, and live in the savannah pride!'
  },
  {
    id: 'j-2',
    title: 'The Color Blue',
    category: 'Colors & Shapes',
    level: 'Quick Play',
    icon: '🐳',
    bgColor: 'from-sky-400 to-blue-600',
    duration: '4 min',
    stars: 2,
    description: 'Discover oceans, blueberries, and clear blue skies together.'
  },
  {
    id: 'j-3',
    title: 'Numbers 1 - 5',
    category: 'Early Math',
    level: 'Interactive',
    icon: '🔢',
    bgColor: 'from-emerald-400 to-teal-600',
    duration: '6 min',
    stars: 3,
    description: 'Count five playful jumping frogs on green lily pads!'
  },
  {
    id: 'j-4',
    title: 'Space Rocket Adventure',
    category: 'Space Exploration',
    level: 'Fun Story',
    icon: '🚀',
    bgColor: 'from-purple-400 to-indigo-600',
    duration: '5 min',
    stars: 3,
    description: 'Count down 3-2-1 and blast off past the moon!'
  }
];

export const PARENT_ADAPTATION_LOGS: ParentAdaptationLog[] = [
  {
    id: 'log-1',
    time: 'Today, 2:15 PM',
    title: 'Adaptive Math Pacing Slowed Down',
    description: 'After 2 consecutive hesitations on regrouping addition, AI switched to visual ten-frame counters.',
    metric: 'Accuracy improved by +34%',
    status: 'active'
  },
  {
    id: 'log-2',
    time: 'Yesterday, 4:30 PM',
    title: 'Advanced Vocabulary Introduced',
    description: 'Leo mastered basic animal terms, so AI introduced words like "Habitat", "Nocturnal", and "Herbivore".',
    metric: '12 new words retained',
    status: 'active'
  },
  {
    id: 'log-3',
    time: '2 days ago',
    title: 'Attention Span Modulation',
    description: 'Prompted a 2-minute physical movement break during the 20th minute of the Space Quest.',
    metric: 'Engagement restored to 95%',
    status: 'review'
  }
];

export const APPROVED_CONTENT_QUEUE: ApprovedContentItem[] = [
  {
    id: 'app-1',
    title: 'How Deep Sea Creatures Glow (Bioluminescence)',
    category: 'Marine Biology',
    ageRating: 'Ages 7-10',
    duration: '12 min video',
    approvedDate: 'Approved today'
  },
  {
    id: 'app-2',
    title: 'Simple Machines: Levers, Pulleys & Wheels',
    category: 'Physics for Kids',
    ageRating: 'Ages 6-9',
    duration: '15 min interactive',
    approvedDate: 'Approved yesterday'
  },
  {
    id: 'app-3',
    title: 'Ancient Egypt: Building the Pyramids',
    category: 'World History',
    ageRating: 'Ages 8-12',
    duration: '18 min quest',
    approvedDate: 'Approved 3d ago'
  }
];
