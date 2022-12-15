import { fastify } from "fastify";
import { initClient } from "./bot-client";
import { initCommands } from "./register-commands";

const startServer = async () => {
  const app = fastify();

  app.get("/", async (request, reply) => {
    return reply.code(200);
  });

  return app;
};

startServer()
  .then((app) => app.listen({ port: 3333 }))
  .then(() => initClient())
  .then(() => initCommands())
  .catch(console.error);
