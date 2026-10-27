export interface TemplateCardData {
  sourceTripId?: string;
  id: string;
  title: string;
  destination: string;
  description: string | null;
  tags: string;
  durationDays: number;
  activityCount: number;
  estimatedCost: number;
  currency: string;
  status: 'PUBLISHED' | 'UNPUBLISHED';
  contentVersion: number;
  authorName: string;
  usageCount: number;
}
export interface TemplateSnapshot {
  schemaVersion: number;
  days: {
    dayNumber: number;
    title: string | null;
    note: string | null;
    activities: {
      title: string;
      startTime: string | null;
      endTime: string | null;
      location: string | null;
      category: string;
      estimatedCost: number;
      orderIndex: number;
      note: string | null;
    }[];
  }[];
  checklists: { title: string; category: string }[];
}
export interface TemplateDetailData {
  template: TemplateCardData;
  snapshot: TemplateSnapshot;
}
export interface TemplateListing {
  content: TemplateCardData[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
export interface PublishPayload {
  title: string;
  destination: string;
  description: string;
  tags: string[];
  includeNotes: boolean;
  checklistIds: string[];
  sourceFingerprint?: string;
  expectedContentVersion?: number;
}
export interface TemplatePreview {
  snapshot: TemplateSnapshot;
  sourceFingerprint: string;
  contentVersion: number;
}
export interface CopyPayload {
  name: string;
  startDate: string;
  includeChecklist: boolean;
  expectedContentVersion: number;
}
export interface CopyResult {
  tripId: string;
  sourceTemplateId: string;
  sourceTemplateVersion: number;
}
export const TEMPLATE_TAGS = [
  'RELAXED',
  'ADVENTURE',
  'FOOD',
  'CULTURE',
  'FAMILY',
  'NATURE',
] as const;
