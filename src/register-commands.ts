import "dotenv/config";
import { COMMAND_REGISTRY } from "./commands/index";
import { REST, Routes } from "discord.js";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT);

export const initCommands = async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.SERVER_ID), {
      body: COMMAND_REGISTRY,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
