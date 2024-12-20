import { describe, expect, test } from "vitest";
import { replaceSegmentByData, toSegments, toUri } from "./toUri";

describe("toSegments", () => {
  test("should return an array of segments", () => {
    const uri = "/posts/1";
    const segments = toSegments(uri);
    expect(segments).toEqual(["posts", "1"]);
  });
});

describe("replaceSegmentByData", () => {
  test("Should return base segment if nothing to replace", () => {
    const segments = ["posts", "1"];
    const data = {};
    const replacedSegments = replaceSegmentByData(segments, data);
    expect(replacedSegments).toEqual(segments);
  });

  test("should return an array of segments with replaced data", () => {
    const segments = ["posts", ":id"];
    const data = { id: "1" };
    const replacedSegments = replaceSegmentByData(segments, data);
    expect(replacedSegments).toEqual(["posts", "1"]);
  });

  test("Should throw an error if replaced segment is not in data", () => {
    const segments = ["posts", ":id"];
    const data = {};
    expect(() => replaceSegmentByData(segments, data)).toThrowError();
  });
});

describe("toUri", () => {
  test("If nothing to change return the same uri", () => {
    const uri = "/posts";
    const params = {};
    const url = toUri(uri, params);
    expect(url).toBe(uri);
  });

  test("If nothing to change return the same uri (ignore params)", () => {
    const uri = "/posts";
    const url = toUri(uri);
    expect(url).toBe(uri);
  });

  test("If uri has a segment to replace, replace it", () => {
    const uri = "/posts/:id";
    const params = { id: "1" };
    const url = toUri(uri, params);
    expect(url).toBe("/posts/1");
  });
});
