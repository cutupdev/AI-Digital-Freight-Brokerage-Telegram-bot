import dotenv from "dotenv";
dotenv.config();

export const BotToken = process.env.TOKEN!
export const carrierDataPath = './carrier.json'
export const clientDataPath = './client.json'