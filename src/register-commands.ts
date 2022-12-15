import "dotenv/config";
import { REST, Routes } from "discord.js";
import { COMMAND_REGISTRY } from "./commands/index";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT);

export const initCommands = async () => {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.SERVER_ID), {
    body: COMMAND_REGISTRY,
  });

  console.log("Successfully reloaded application (/) commands.");
};
