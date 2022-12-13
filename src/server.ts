import fastify, {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
} from "fastify";
import { initClient } from "./bot-client";
import { initCommands } from "./register-commands";

const startServer = async (): Promise<FastifyInstance> => {
  const app = fastify();

  app.get(
    "/",
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<FastifyReply> => {
      return reply.code(200);
    }
  );

  return app;
};

startServer()
  .then((app) => app.listen({ port: 3333 }))
  .then(() => initClient())
  .then(() => initCommands())
  .catch(console.error);
