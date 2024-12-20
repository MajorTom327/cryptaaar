import { DateTime } from "luxon";
import { match, P } from "ts-pattern";

import { toUri } from "./toUri";
import type { UrlBuildParamsType } from "./types";

export const url_builder = (
  uri: string,
  params: UrlBuildParamsType = {},
  queryParams: UrlBuildParamsType = {}
) => {
  const url = toUri(uri, params);

  const searchParams = new URLSearchParams();

  for (const key in queryParams) {
    const value = queryParams[key];
    if (value === undefined || value === null) continue;

    const toBeSet = match(value)
      .with(P.instanceOf(Date), (date) => {
        const v = DateTime.fromJSDate(date);
        if (v.isValid) return v.toISO();
        return DateTime.local().toISO();
      })
      .otherwise(() => value.toString());

    searchParams.set(key, toBeSet);
  }

  if (searchParams.toString() === "") {
    return url;
  }

  return `${url}?${searchParams.toString()}`;
};
