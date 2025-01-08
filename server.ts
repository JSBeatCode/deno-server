// import { serve } from 'https://deno.land/std/http/server.ts'
import { serve } from "server";
import "dotenv"
import { staticRoutes, dyanmicRoutes } from './router.ts'
import { handleNotFound } from "./pageNotFound.ts";
// console.log(Deno.env.get("PORT"))
// console.log(Deno.env.get("TOKEN"))
// console.log(process.env)
// console.log('jsdno0 debug1', port)
// 

const PORT = Deno.env.get("PORT") || 8003

function matchDynamicRoute(method: String, pathname: String, req: Request): any {
  let dynamicHandler;
  let params: any = new Object();
  params.req = req;
  for (let i = 0; i < dyanmicRoutes.length; i++) {
    const o = dyanmicRoutes[i]
    params.url = pathname.match(o.url)
      if (params.url && method === o.method) {
        dynamicHandler = o.func
        break;
      }
  }
  return {dynamicHandler, params}
}

async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname
  const method = req.method
  const routeKey = `${method} ${pathname}`;

  const staticHandler = staticRoutes[routeKey];
  if (staticHandler) {
    return await staticHandler(req)
  }

  const {dynamicHandler, params} = matchDynamicRoute(method, pathname, req)
  if (dynamicHandler) {
    return await dynamicHandler(params)
  }
 

  return handleNotFound();
}

serve(router, { port: +PORT })