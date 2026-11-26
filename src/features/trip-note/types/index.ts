export interface TripNote {
  id: string;
  tripId: string;
  authorId: string;
  authorName: string | null;
  authorAvatarUrl: string | null;
  content: string;
  imageUrl: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  canDelete: boolean;
}

export interface TripNoteDraft {
  content: string;
  imageUploadId?: string;
  removeImage?: boolean;
}

export interface TripNoteRevision {
  id: string;
  noteId: string;
  editorId: string;
  editorName: string | null;
  editorAvatarUrl: string | null;
  content: string;
  imageUrl: string | null;
  noteVersion: number;
  createdAt: string;
  baseline: boolean;
}
