
import { PromptOptions, TabType } from '../types';

export interface SharedState {
  tab: TabType;
  options: PromptOptions;
  model: string;
  generated?: string;
  enhanced?: string;
}

export const generateShareUrl = (state: SharedState): string => {
  try {
    const json = JSON.stringify(state);
    // Use btoa for base64 encoding, with escaping for unicode support
    const encoded = btoa(unescape(encodeURIComponent(json)));
    const url = new URL(window.location.href);
    url.searchParams.set('s', encoded);
    return url.toString();
  } catch (e) {
    console.error("Error generating share URL", e);
    return window.location.href;
  }
};

export const parseShareUrl = (): SharedState | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('s');
  if (!encoded) return null;

  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse share URL", e);
    return null;
  }
};
