import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { commands } from "./commands/index";

export const initClient = async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag ?? "frickin nobody"}!`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    for (const command in commands) {
      const cmnd = commands[command as keyof typeof commands]; // ugh, TS hates some iterators, apparently
      if (interaction.commandName === cmnd.name) {
        if ("subCommands" in cmnd) {
          const subCommand = interaction.options.getSubcommand();

          return Object.keys(cmnd.subCommands).includes(subCommand)
            ? await cmnd.subCommands[subCommand](interaction)
            : undefined;
        } else {
          await cmnd.handler(interaction);
        }
      }
    }
  });

  await client.login(process.env.DISCORD_BOT);
};
