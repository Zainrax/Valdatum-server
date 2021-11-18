import { getResponse } from "./utils.ts";
(async function main() {
  // Start listening on port 8080 of localhost.
  const server = Deno.listen({ port: 8080 });
  console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

  for await (const conn of server) {
    (async () => {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        const response = await getResponse(requestEvent.request);
        try {
          await requestEvent.respondWith(response);
        } catch (error) {
          console.log(
            `Error responding to ${requestEvent.request.url} with ${response}: ${error}`,
          );
        }
      }
    })();
  }
})();
