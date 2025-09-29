import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { Headers, Response } from "@remix-run/web-fetch";

type HandlerContext = {
  request: Request;
  responseStatusCode: number;
  responseHeaders: Headers;
  remixContext: EntryContext;
};

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest({ request, responseStatusCode, responseHeaders, remixContext })
    : handleBrowserRequest({ request, responseStatusCode, responseHeaders, remixContext });
}

function handleBotRequest({
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
}: HandlerContext) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          const body = new PassThrough();
          const headers = new Headers(responseHeaders);
          headers.set("Content-Type", "text/html");
          
          resolve(
            new Response(body, {
              headers: Object.fromEntries(headers.entries()),
              status: responseStatusCode,
            })
          );
          
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );
    
    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest({
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
}: HandlerContext) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          const body = new PassThrough();
          const headers = new Headers(responseHeaders);
          headers.set("Content-Type", "text/html");
          
          resolve(
            new Response(body, {
              headers: Object.fromEntries(headers.entries()),
              status: responseStatusCode,
            })
          );
          
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );
    
    setTimeout(abort, ABORT_DELAY);
  });
}
