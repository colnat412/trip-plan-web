export const POLICY_VERSION = '2026-10-14';
export const POLICY_IDS = ['terms', 'content', 'privacy'] as const;
export type PolicyId = (typeof POLICY_IDS)[number];
