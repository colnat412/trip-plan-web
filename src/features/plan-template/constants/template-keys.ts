const root = ['plan-template'] as const;
export const templateQueryKeys = {
  library: (
    search: string,
    duration: string,
    tag: string,
    sort: string,
    page: number,
    size: number,
  ) => [...root, 'library', search, duration, tag, sort, page, size] as const,
  mine: (page: number, size: number) => [...root, 'mine', page, size] as const,
};
export const templateMutationKeys = {
  preview: (tripId: string | number) => [...root, 'preview', tripId] as const,
  publish: (tripId: string | number) => [...root, 'publish', tripId] as const,
  copy: (templateId: string) => [...root, 'copy', templateId] as const,
  unpublish: [...root, 'unpublish'] as const,
};
