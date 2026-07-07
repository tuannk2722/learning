export type QuestType = 'COMPLETE_LESSONS' | 'EARN_XP' | 'PASS_QUIZ' | 'STUDY_TIME';

export interface DailyQuest {
  id: number;
  quest_id: number;
  title: string;
  description: string | null;
  icon_name: string | null;
  quest_type: string;
  target_value: number;
  reward_xp: number;
  current_progress: number;
  is_completed: boolean;
  reward_claimed: boolean;
}

export interface QuestUpdateInfo {
  title: string;
  reward_xp: number;
  current_progress: number;
  target_value: number;
  is_completed: boolean;
}