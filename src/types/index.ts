export type PostStatus = 'scheduled' | 'posted';
export type ViewType = 'calendar' | 'newpost' | 'trends' | 'demo';

export interface RecruitPost {
  id: string;
  imageIndex: number;
  caption: string;
  scheduledAt: string;
  status: PostStatus;
  createdAt: string;
  theme: string;
}

export interface TrendReport {
  generatedAt: string;
  patternIndex: number;
}

export interface AppState {
  posts: RecruitPost[];
  trendReport: TrendReport;
  mockCurrentDate: string;
}

export type AppAction =
  | { type: 'ADD_POST'; post: RecruitPost }
  | { type: 'ADVANCE_DAY' }
  | { type: 'UPDATE_TRENDS' }
  | { type: 'LOAD_STATE'; state: AppState };
