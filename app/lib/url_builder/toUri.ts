import type { UrlBuildParamsType } from './types';

export const toSegments = (uri: string): string[] => {
  return uri.split('/').filter(Boolean);
};

export const replaceSegmentByData = (
  segments: string[],
  data: UrlBuildParamsType
): string[] => {
  return segments.map(el => {
    if (el.startsWith(':')) {
      const key = el.slice(1);
      if (!data[key]) {
        throw new Error(`Key ${key} not found in data`);
      }
      return data[key]!.toString();
    }
    return el;
  });
};

export const toUri = (uri: string, params: UrlBuildParamsType = {}) => {
  const segments = toSegments(uri);
  const replacedSegments = replaceSegmentByData(segments, params);

  return `/${replacedSegments.join('/')}`;
};
