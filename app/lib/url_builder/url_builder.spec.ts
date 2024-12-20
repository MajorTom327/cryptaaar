import { describe, expect, test } from "vitest";
import { url_builder } from "./url_builder";

describe("url_builder", () => {
  test("Should build a complete url", () => {
    const uri = "/posts/1";
    const params = {};
    const url = url_builder(uri, params);
    expect(url.toString()).toBe("/posts/1");
  });

  test("Should build a complete url (ignore params)", () => {
    const uri = "/posts/1";
    const url = url_builder(uri);
    expect(url.toString()).toBe("/posts/1");
  });

  test("Should build a complete url with replacement", () => {
    const uri = "/posts/:id";
    const params = { id: "1" };
    const url = url_builder(uri, params);
    expect(url.toString()).toBe("/posts/1");
  });

  test("Should be a URI", () => {
    const uri = "/posts/1";

    expect(url_builder("/posts/1")).equal(uri);
    expect(url_builder(`/posts/:id`, { id: 1 })).equal(uri);
  });

  test("Should add query params", () => {
    const uri = "/posts/1";
    const queryParams = { limit: "10" };
    const url = url_builder(uri, {}, queryParams);

    const searchParams = new URLSearchParams(url.split("?")[1]);
    expect(searchParams.get("limit")).toBe("10");
    expect(url).toBe("/posts/1?limit=10");
  });

  test("Should add multiples query params", () => {
    const uri = "/posts/1";
    const params = {};
    const queryParams = { limit: "10", page: "1" };
    const url = url_builder(uri, params, queryParams);
    const searchParams = new URLSearchParams(url.split("?")[1]);

    expect(searchParams.get("limit")).toBe("10");
    expect(searchParams.get("page")).toBe("1");
  });
});
