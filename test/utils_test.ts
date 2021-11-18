import { assertEquals } from "asserts";
import { getContentType, getResponse } from "../server/utils.ts";

Deno.test("getContentType returns correct content-type for given file", () => {
  const testFiles = {
    "index.html": "text/html",
    "test.css": "text/css",
    "test.js": "application/javascript",
    "test.json": "application/json",
    "test.png": "image/png",
    "test.jpg": "image/jpeg",
    "test.gif": "image/gif",
    "test.svg": "image/svg+xml",
  } as { [key: string]: string };
  Object.keys(testFiles).forEach((file: string) => {
    assertEquals(getContentType(file), testFiles[file]);
  });
});

Deno.test("getResponse returns index.html on / request", async () => {
  const url = "http://localhost/";
  const request = new Request(url, {
    method: "GET",
    headers: new Headers(),
  });
  const response = await getResponse(request);
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "text/html");
});

Deno.test("getResponse returns 404 for invalid", async () => {
  const url = "http://localhost/notfound";
  const request = new Request(url, {
    method: "GET",
    headers: new Headers(),
  });
  const response = await getResponse(request);
  assertEquals(response.status, 404);
  assertEquals(response.headers.get("content-type"), "text/plain");
});

Deno.test("getResponse returns request file", async () => {
  const url = "http://localhost/index.html";
  const request = new Request(url, {
    method: "GET",
    headers: new Headers(),
  });
  const response = await getResponse(request);
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "text/html");
});
