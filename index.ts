import { logger, DiscordAPI, Filesystem } from "@vendetta";
import Settings from "./Settings";

const settingsFile = "animated-statuses.json";

let animatedStatuses = [];

export default {
  onLoad: () => {
    logger.log("Animated Status plugin loaded!");

    // Load animated statuses from settings file
    try {
      const data = Filesystem.readFileSync(settingsFile);
      animatedStatuses = JSON.parse(data.toString());
    } catch(err) {
      logger.error(`Failed to load animated statuses. Error: ${err.message}`);
    }

    // Fetch user account information
    const user = DiscordAPI.getCurrentUser();

    // Set default status if no animated statuses are available
    if(animatedStatuses.length === 0) {
      DiscordAPI.setStatus({
        type: "PLAYING",
        name: "Vendetta Cord",
        emojis: [],
        url: "",
        instance: true,
        flags: {},
      });
      return;
    }

    // Set user's status with the first animated status from the list
    const customStatus = animatedStatuses[0];
    DiscordAPI.setStatus({
      type: "CUSTOM_STATUS",
      name: customStatus.name,
      emojis: [],
      url: customStatus.url,
      instance: true,
      flags: {
        width: customStatus.width,
        height: customStatus.height,
        frames: customStatus.frames,
        loop: customStatus.loop,
        duration: customStatus.duration
      }
    });
  },
  onUnload: () => {
    logger.log("Animated Status plugin unloaded!");
  },
  settings: Settings,

  addAnimatedStatus: (name, url, width, height, frames, loop, duration) => {
    const newStatus = {
      name,
      url,
      width,
      height,
      frames,
      loop,
      duration
    };

    // Add new status to list
    animatedStatuses.push(newStatus);

    // Save list to settings file
    try {
      Filesystem.writeFileSync(settingsFile, JSON.stringify(animatedStatuses));
    } catch(err) {
      logger.error(`Failed to save animated statuses. Error: ${err.message}`);
    }

    // Set user's status with the new animated status
    DiscordAPI.setStatus({
      type: "CUSTOM_STATUS",
      name: newStatus.name,
      emojis: [],
      url: newStatus.url,
      instance: true,
      flags: {
        width: newStatus.width,
        height: newStatus.height,
        frames: newStatus.frames,
        loop: newStatus.loop,
        duration: newStatus.duration
      }
    });
  }
};
