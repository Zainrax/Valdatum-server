export function getContentType(file: string): string {
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
      return "image/jpeg";
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
}

export async function getResponse(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  const requestedFile = pathname === "/" ? "/index.html" : pathname;
  const contentType = getContentType(requestedFile);
  const path = `./dist${requestedFile}`;
  try {
    console.log(
      `Serving ${requestedFile} with ${contentType} from ${path}`,
    );
    const file = Deno.readFileSync(
      path,
    );
    const response = new Response(file, {
      headers: new Headers({
        "content-type": contentType,
      }),
    });
    return response;
  } catch (error) {
    console.warn(`Error serving ${requestedFile}: ${error}`);
    const response = new Response(
      "404: File not found",
      {
        status: 404,
        headers: new Headers({
          "content-type": "text/plain",
        }),
      },
    );
    return response;
  }
}
