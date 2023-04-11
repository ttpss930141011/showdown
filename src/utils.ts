import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export const rl = readline.createInterface({ input, output });

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
