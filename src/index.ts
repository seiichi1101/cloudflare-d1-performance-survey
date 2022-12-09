/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from "itty-router";

export interface Env {
  DB: D1Database;
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const router = Router();

router.get(
  "/read",
  async (request: Request, env: Env, ctx: ExecutionContext) => {
    const startTime = Date.now();
    const { results, lastRowId, changes, duration, error } =
      await env.DB.prepare("SELECT * FROM test LIMIT 1;").all();
    const endTime = Date.now();
    const json = JSON.stringify(
      {
        results,
        lastRowId,
        changes,
        duration,
        error,
        startTime,
        endTime,
        startend: endTime - startTime,
      },
      null,
      2
    );
    return new Response(json, {
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  }
);

router.get(
  "/write",
  async (request: Request, env: Env, ctx: ExecutionContext) => {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const startTime = Date.now();
    const { results, lastRowId, changes, duration, error } =
      await env.DB.prepare(
        `INSERT INTO test (timestamp, region) VALUES (STRFTIME('%s', 'now'), '${region}')`
      ).all();
    const endTime = Date.now();
    const json = JSON.stringify(
      {
        message: `Hello worker!`,
        lastRowId,
        changes,
        duration,
        error,
        startTime,
        endTime,
        startend: endTime - startTime,
      },
      null,
      2
    );
    return new Response(json, {
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  }
);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env, ctx);
  },
};
