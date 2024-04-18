import { carrierDataPath, clientDataPath } from '../config';
import { ICarrierCategory, IClientCategory, } from '../utils/type';
import { readData, writeData } from '../utils';
import TelegramBot from "node-telegram-bot-api";
import { carrierModel, loadModel } from "../models";

export let carrierData: ICarrierCategory = {}
export let clientData: IClientCategory = {}

type TelegramErrorResponse = {
  response: {
    statusCode: number;
  };
}

export const sendSyncMsg = async (bot: TelegramBot, chatId: number, result: any) => {
  await bot.sendMessage(
    chatId,
    result.title, {
    reply_markup: {
      inline_keyboard: result.content,
      resize_keyboard: true
    },
    parse_mode: 'HTML'
  }
  )
    .then(msg => msg)
    .catch((error: TelegramErrorResponse) => {
      if (error.response && error.response.statusCode === 429) {
        setTimeout(async () => {
          await sendSyncMsg(bot, chatId, result);
        }, 1000);
      }
      if (error.response && error.response.statusCode === 403) {
        return
      }
    })
}

export const sendSyncTitle = async (bot: TelegramBot, chatId: number, title: string) => {
  while (true) {
    try {
      const msg = await bot.sendMessage(chatId, title);
      return msg;
    } catch (error) {
      setTimeout(async () => {
      }, 1000)
    }
  }
}

export const deleteSync = async (bot: TelegramBot, chatId: number, msgId: number) => {
  await bot.deleteMessage(chatId, msgId)
    .catch((error: TelegramErrorResponse) => { })
}

export const saveCarrierInfo = async (chatId: number, cate: string, data: string | any, save: boolean = false) => {
  if (save) carrierData = await readData(carrierDataPath)
  if (!(chatId in carrierData)) carrierData[chatId] = {}
  let temp: any = carrierData[chatId]
  temp[cate] = data
  carrierData[chatId] = temp
  if (save) await saveCarriertoDB(chatId)
  await writeData(carrierData, carrierDataPath)
}

export const saveClientInfo = async (chatId: number, cate: string, data: string | any, save: boolean = false) => {
  clientData = await readData(clientDataPath)
  if (!(chatId in clientData)) clientData[chatId] = {}
  let temp: any = clientData[chatId]
  temp[cate] = data
  clientData[chatId] = temp
  await writeData(clientData, clientDataPath)
}

export const saveCarriertoDB = async (chatId: number) => {
  const data = carrierData[chatId]
  if (Object.keys(data).length == 9) {
    await carrierModel.findOneAndUpdate({ chatId }, {
      chatId,
      popularRoute: data.popularRoute,
      fleetSize: data.fleetSize,
      address: data.address,
      name: data.name,
      mc: data.mc,
      price: data.price,
      carrierDispatchName: data.carrierDispatchName,
      carrierDispatchPhone: data.carrierDispatchPhone,
      carrierDriver: data.carrierDriver,
    }, { upsert: true })
    writeData(carrierData, carrierDataPath)
    return true
  }
  return false
}


export const removeCarrierDB = async (chatId: number) => {
  try {
    await carrierModel.findOneAndDelete({ chatId })
    if (chatId in carrierData) delete carrierData[chatId]
    writeData(carrierData, carrierDataPath)
    return true
  } catch (e) {
    return false
  }
}

export const resetCarrierJson = async (chatId: number) => {
  try {
    delete carrierData[chatId]
    writeData(carrierData, carrierDataPath)
    return true
  } catch (e) {
    return false
  }
}

export const saveClienttoDB = async (chatId: number) => {
  const data = clientData[chatId]
  if (Object.keys(data).length == 17) {
    await loadModel.create({
      chatId,
      pickUpLocation: data.pickUpLocation,
      dropOffLocation: data.dropOffLocation,
      pickUpDate: data.pickUpDate,
      dropOffDate: data.dropOffDate,
      trailor: data.trailor,
      cargo: data.cargo,
      rate: data.rate,
      weight: data.weight,
      mcNumber: data.mcNumber,
      hazmat: data.hazmat,
      pickUpTime: data.pickUpTime,
      dropOffTime: data.dropOffTime,
      temperature: data.temperature,
      dockNumber: data.dockNumber,
      terms: data.terms,
      trackingId: data.trackingId,
      tolerance: data.tolerance,
    })
    delete clientData[chatId]
    writeData(clientData, clientDataPath)
    return true
  }
  return false
}

export const init = async () => {
  carrierData = await readData(carrierDataPath)
  clientData = await readData(carrierDataPath)
}
