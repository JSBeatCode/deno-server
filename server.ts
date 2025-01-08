import { serve } from "server"; // Import the `serve` function to create an HTTP server.
import "dotenv"; // Automatically loads environment variables from a `.env` file.
import { staticRoutes, dyanmicRoutes } from './router.ts'; // Import static and dynamic route definitions.
import { handleNotFound } from "./pageNotFound.ts"; // Import the handler for undefined routes (404 Not Found).

const PORT = Deno.env.get("PORT") || 8003; 
// Retrieve the server port from the environment variables or default to 8003 if not defined.

// Matches dynamic routes based on the HTTP method and URL path.
function matchDynamicRoute(method: String, pathname: String, req: Request): any {
  let dynamicHandler; // To store the matched handler function for the dynamic route.
  let params: any = new Object(); // To store parameters extracted from the URL or the request.
  params.req = req; // Include the `Request` object in the params for the handler.

  // Iterate through all defined dynamic routes.
  for (let i = 0; i < dyanmicRoutes.length; i++) {
    const o = dyanmicRoutes[i]; // Current dynamic route object.
    params.url = pathname.match(o.url); // Check if the route's regex matches the current URL.

    // If a match is found and the HTTP method matches:
    if (params.url && method === o.method) {
      dynamicHandler = o.func; // Assign the route's handler function.
      break; // Stop further iteration once a match is found.
    }
  }

  // Return both the matched handler and the extracted parameters.
  return { dynamicHandler, params };
}

// The main router function that handles incoming HTTP requests.
async function router(req: Request): Promise<Response> {
  const url = new URL(req.url); // Parse the request URL to extract path and query parameters.
  const pathname = url.pathname; // Extract the URL path (e.g., `/product/1`).
  const method = req.method; // Extract the HTTP method (e.g., `GET`, `POST`).
  const routeKey = `${method} ${pathname}`; 
  // Create a key combining the HTTP method and path for matching static routes.

  const staticHandler = staticRoutes[routeKey]; 
  // Check if the route matches a predefined static route.

  if (staticHandler) {
    return await staticHandler(req); // If a static route is matched, execute its handler.
  }

  const { dynamicHandler, params } = matchDynamicRoute(method, pathname, req); 
  // Attempt to match the request to a dynamic route.

  if (dynamicHandler) {
    return await dynamicHandler(params); 
    // If a dynamic route is matched, execute its handler with the extracted parameters.
  }

  return handleNotFound(); 
  // If no route matches, return a 404 response using the `handleNotFound` function.
}

// Start the HTTP server with the `router` function and listen on the specified port.
serve(router, { port: +PORT }); 
