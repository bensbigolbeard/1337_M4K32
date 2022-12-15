import { pipe } from "froebel";
import { fastify } from "fastify";
import { initClient } from "./bot-client";
import { initCommands } from "./register-commands";

const startServer = async (huh) => {
  const app = fastify();

  app.get("/", async (request, reply) => {
    return reply.code(200);
  });

  return app;
};

try {
  pipe(
    /* @ts-ignore: no clue why it thinks this arg is type `never`. still works */
    startServer,
    (app) => app.listen({ port: 3333 }),
    initClient,
    initCommands
  )();
} catch (e) {
  console.error("startupError:", e);
}
