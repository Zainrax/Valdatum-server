// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });
const siteFileLocation = "../dist";
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

const contentType = (file: string) => {
  const extension = "." + file.split(".").pop();
  switch (extension) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".json":
      return "application/json";
    case ".pdf":
      return "application/pdf";
    case ".zip":
      return "application/zip";
    case ".mp4":
      return "video/mp4";
    case ".mp3":
      return "audio/mp3";
    case ".wav":
      return "audio/wav";
    case ".ogg":
      return "audio/ogg";
    case ".webm":
      return "video/webm";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    case ".ttf":
      return "font/ttf";
    case ".otf":
      return "font/otf";
    case ".eot":
      return "application/vnd.ms-fontobject";
    default:
      return "text/plain";
  }
};

const handleRequest = async (request: Deno.RequestEvent): Promise<void> => {
  const url = new URL(request.request.url);
  const requestedFile = url.pathname;
  if (requestedFile === "/") {
    console.log(`Serving index.html`);
    const index = Deno.readFileSync(`${siteFileLocation}/index.html`);
    const response = new Response(index, {
      headers: new Headers({
        "content-type": "text/html",
      }),
    });
    return await request.respondWith(response);
  } else {
    try {
      console.log(
        `Serving ${requestedFile} with ${contentType(requestedFile)}`,
      );
      const file = Deno.readFileSync(`${siteFileLocation}${requestedFile}`);
      const response = new Response(file, {
        headers: new Headers({
          "content-type": contentType(requestedFile),
        }),
      });
      return await request.respondWith(response);
    } catch (error) {
      console.log(`Error serving ${requestedFile}`);
      const response = new Response(
        "404: File not found",
        {
          status: 404,
          headers: new Headers({
            "content-type": "text/plain",
          }),
        },
      );
      return await request.respondWith(response);
    }
  }
};

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      await handleRequest(requestEvent);
    }
  })();
}
