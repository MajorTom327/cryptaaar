import type { KyInstance, Options } from "ky";
import ky from "ky";
import { match, P } from "ts-pattern";
import { url_builder, type UrlBuildParamsType } from "~/lib/url_builder";

type BaseServiceOptions = {
  baseApiUrl: string;
  accessToken: string;
};

type UrlType =
  | string
  | {
      path: string;
      params?: UrlBuildParamsType;
      query?: UrlBuildParamsType;
    };

type FetcherOptions = {
  skipError?: boolean;
};

export class BaseService {
  baseApiUrl: string;
  accessToken: string;
  private fetcher: KyInstance;

  constructor({ baseApiUrl, accessToken }: BaseServiceOptions) {
    this.baseApiUrl = baseApiUrl;
    this.accessToken = accessToken;

    this.fetcher = ky.create({
      prefixUrl: this.baseApiUrl,
      headers: {
        ["X-API-KEY"]: `${this.accessToken}`,
        accept: "application/json",
      },
    });
  }

  private endpointToUrl(endpoint: UrlType) {
    const url =
      typeof endpoint === "string"
        ? endpoint
        : url_builder(endpoint.path, endpoint.params, endpoint.query);

    // const endpointUrl = new URL(url).toString();
    const endpointUrl = url.startsWith("/") ? url.slice(1) : url;

    return endpointUrl;
  }

  private handleError(errorCode: number | undefined | null) {
    const error = match(errorCode)
      .with(401, () => new Error("Unauthorized"))
      .with(403, () => new Error("Forbidden"))
      .otherwise(() => new Error("Unknown error"));

    throw error;
  }

  protected get<T>(
    endpoint: UrlType,
    fetcherOptions: FetcherOptions = { skipError: false }
  ): Promise<T> {
    const endpointUrl = this.endpointToUrl(endpoint);

    return this.fetcher
      .get(endpointUrl)
      .json<T>()
      .catch(async (e) => {
        const response = e.response?.json() ?? Promise.reject();
        const errorData = await response.catch((e: unknown) => {
          console.log("ERROR", e);
          return { statusCode: 500 };
        });

        const { statusCode } = errorData;

        console.log(JSON.stringify(errorData, null, 2));

        if (!fetcherOptions.skipError)
          console.log(`[${statusCode ?? "Unknown"}] - ${e.message}`);

        const error = match(statusCode)
          .with(401, () => new Error("Unauthorized"))
          .with(403, () => new Error("Forbidden"))
          .otherwise(() => new Error("Unknown error"));

        throw error;
      });
  }

  protected post<T>(
    endpoint: UrlType,
    data?: unknown,
    fetcherOptions: FetcherOptions = { skipError: false }
  ) {
    const endpointUrl = this.endpointToUrl(endpoint);
    console.log(`[POST] ${endpointUrl}`);

    const options: Options = match(data)
      .with(P.instanceOf(File), (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return { body: formData };
      })
      .otherwise(() => ({
        json: data,
      }));

    return this.fetcher
      .post(endpointUrl, options)
      .json<T>()
      .catch(async (e) => {
        const { statusCode } = await e.response.json();
        if (!fetcherOptions.skipError)
          console.log(`[${statusCode}] - ${e.message}`);

        const error = match(statusCode)
          .with(401, () => new Error("Unauthorized"))
          .with(403, () => new Error("Forbidden"))
          .otherwise(() => new Error("Unknown error"));

        throw error;
      });
  }

  protected delete<T>(
    endpoint: UrlType,
    data?: unknown,
    fetcherOptions: FetcherOptions = { skipError: false }
  ) {
    const endpointUrl = this.endpointToUrl(endpoint);
    console.log(`[DELETE] ${endpointUrl}`);

    const options: Options = match(data)
      .with(P.instanceOf(File), (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return { body: formData };
      })
      .otherwise(() => ({
        json: data,
      }));

    return this.fetcher
      .delete(endpointUrl, options)
      .json<T>()
      .catch(async (e) => {
        const { statusCode } = await e.response.json();
        if (!fetcherOptions.skipError)
          console.log(`[${statusCode}] - ${e.message}`);

        const error = match(statusCode)
          .with(401, () => new Error("Unauthorized"))
          .with(403, () => new Error("Forbidden"))
          .otherwise(() => new Error("Unknown error"));

        throw error;
      });
  }
}
