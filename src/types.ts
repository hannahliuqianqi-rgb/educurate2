export type AgeGroup = 'junior' | 'aspirator' | 'teen' | 'adult';

export type AppView = 
  | 'landing'
  | 'junior'
  | 'junior_mentor'
  | 'aspirators'
  | 'quest_player'
  | 'curator_ai'
  | 'learning_plan'
  | 'parent_dashboard'
  | 'api_explorer';

export interface LessonResource {
  id: string;
  title: string;
  type: 'video' | 'book' | 'interactive' | 'article';
  duration: string;
  source: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  summary: string;
  completed?: boolean;
}

export interface QuestStep {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'locked';
  duration: string;
  summary: string;
}

export interface ParentAdaptationLog {
  id: string;
  time: string;
  title: string;
  description: string;
  metric: string;
  status: 'active' | 'review';
}

export interface ApprovedContentItem {
  id: string;
  title: string;
  category: string;
  ageRating: string;
  duration: string;
  approvedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  curatedPlanDraft?: {
    title: string;
    description: string;
    level: string;
    commitment: string;
    modules: LessonResource[];
  };
}
