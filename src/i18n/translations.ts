import type { Lang } from '@/types';
import en from './en';
import hi from './hi';

export type Dictionary = typeof en;

export const translations: Record<Lang, Dictionary> = { en, hi };

type Primitive = string | number | boolean;
type PathsOf<T> = {
  [K in keyof T & string]: T[K] extends Primitive ? K : T[K] extends Array<infer U> ? (U extends object ? `${K}` : K) : `${K}.${PathsOf<T[K]>}`;
}[keyof T & string];

export type TranslationKey = PathsOf<Dictionary>;

export function resolve(dict: unknown, key: string): unknown {
  let current: unknown = dict;
  for (const part of key.split('.')) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}
