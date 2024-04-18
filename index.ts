import "dotenv/config";
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import * as fs from 'fs';

import * as commands from './commands'
import { BotToken } from "./config";
import { deleteSync, init, removeCarrierDB, resetCarrierJson, saveCarrierInfo, saveCarriertoDB, saveClientInfo, saveClienttoDB, sendSyncMsg, sendSyncTitle } from "./commands/helper";
import { connectDB } from "./utils/db";

const token = BotToken
let botName: string
let editCarrier: Array<number> = []
let editCarrierStatus: Array<number> = []
let editClient: Array<number> = []

connectDB()
const bot = new TelegramBot(token!, { polling: true });

const run = () => {
    try {
        const currentUTCDate = new Date().toISOString();
        fs.appendFileSync('log.txt', `${currentUTCDate} : Bot started\n`)
        console.log("Bot started");
        bot.getMe().then(user => {
            botName = user.username!.toString()
        })

        bot.setMyCommands(commands.commandList)

        init()

        bot.on(`message`, async (msg) => {

            const chatId = msg.chat.id!
            console.log("username ==> ", msg.chat.username)
            const text = msg.text!
            const msgId = msg.message_id!
            console.log(`message : ${chatId} : ${text}`)
            let result
            try {
                switch (text) {
                    case `/start`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                        // should check role
                        result = commands.start()
                        if (result) {
                            await sendSyncMsg(bot, chatId, result)
                        }
                        break;
                }
            } catch (e) {
                const currentUTCDate = new Date().toISOString();
                const log = `${currentUTCDate} : ${chatId} : error -> ${e}\n`
                fs.appendFileSync('log.txt', log)
                console.log(log)
                bot.stopPolling()
                run()
            }
        });

        bot.on('callback_query', async (query: CallbackQuery) => {
            const chatId = query.message?.chat.id!
            const msgId = query.message?.message_id!
            const action = query.data!
            const callbackQueryId = query.id;

            const currentUTCDate = new Date().toISOString();
            const log = `${currentUTCDate} : query : ${chatId} -> ${action}\n`
            fs.appendFileSync('log.txt', log)
            console.log(log)

            try {
                let result

                switch (action) {
                    case 'role:carrier':
                        if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                        result = await commands.checkCarrier(chatId)
                        if (result) {
                            await sendSyncMsg(bot, chatId, result)
                            // await deleteSync(bot, chatId, msgId)
                        }
                        break

                    case 'role:client':
                        if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                        result = await commands.checkClient(chatId)
                        if (result) await sendSyncMsg(bot, chatId, result)
                        // await deleteSync(bot, chatId, msgId)
                        break

                    case `address`:
                    case `name`:
                    case `mc`:
                    case `fleetSize`:
                    case `popularRoute`:
                    case `price`:
                    case `carrierDispatchName`:
                    case `carrierDispatchPhone`:
                        if (!editCarrier.includes(chatId)) editCarrier.push(chatId)
                        console.log('editCarrierStatus', editCarrierStatus)
                        if (editCarrierStatus.includes(chatId)) return
                        else editCarrierStatus.push(chatId)
                        const titleMsg = await sendSyncTitle(bot, chatId, `Input ${commands.carrierCategoryList[action]}`)
                        bot.once('message', async (msg: any) => {
                            if (msg.text) {
                                // await deleteSync(bot, chatId, msgId)
                                // await deleteSync(bot, chatId, titleMsg.message_id)
                                // const flag = editCarrier.includes(chatId)
                                await saveCarrierInfo(chatId, action, msg.text)
                                // editCarrier = editCarrier.filter(val => val != chatId)
                                result = await commands.checkCarrier(chatId, !editCarrier.includes(chatId))
                                if (result) {
                                    editCarrierStatus = editCarrierStatus.filter(item => item != chatId)
                                    await sendSyncMsg(bot, chatId, result)
                                }
                                // await deleteSync(bot, chatId, msg.message_id)
                            }
                        })
                        break

                    case `carrierDriver`:
                        if (!editCarrier.includes(chatId)) editCarrier.push(chatId)
                        if (editCarrierStatus.includes(chatId)) return
                        else editCarrierStatus.push(chatId)
                        const titleMsg2 = await sendSyncTitle(bot, chatId, `Input ${commands.carrierCategoryList[action]}`)
                        bot.once('message', async (msg: any) => {
                            if (msg.text) {
                                const data = msg.text.split(',')
                                const arr: Array<any> = []
                                data.map((val: string) => {
                                    arr.push({ name: val.split('_')[0], phone: val.split('_')[1] })
                                })
                                // await deleteSync(bot, chatId, msgId)
                                // await deleteSync(bot, chatId, titleMsg2.message_id)
                                // const flag = editCarrier.includes(chatId)
                                await saveCarrierInfo(chatId, action, arr)
                                // editCarrier = editCarrier.filter(val => val != chatId)
                                result = await commands.checkCarrier(chatId, !editCarrier.includes(chatId))
                                if (result) {
                                    editCarrierStatus = editCarrierStatus.filter(item => item != chatId)
                                    await sendSyncMsg(bot, chatId, result)
                                }
                                // await deleteSync(bot, chatId, msg.message_id)
                            }
                        })
                        break

                    case `pickUpLocation`:
                    case `dropOffLocation`:
                    case `pickUpDate`:
                    case `dropOffDate`:
                    case `trailor`:
                    case `cargo`:
                    case `rate`:
                    case `weight`:
                    case `mcNumber`:
                    case `hazmat`:
                    case `pickUpTime`:
                    case `dropOffTime`:
                    case `temperature`:
                    case `dockNumber`:
                    case `terms`:
                    case `trackingId`:
                    case `tolerance`:
                        if (editCarrier.includes(chatId)) return
                        await sendSyncTitle(bot, chatId, `Input ${commands.clientCategoryList[action]}`)
                        bot.once('message', async (msg: any) => {
                            if (msg.text) {
                                // await deleteSync(bot, chatId, msgId)
                                // await deleteSync(bot, chatId, titleMsg.message_id)
                                const flag = editClient.includes(chatId)

                                const res = await saveClientInfo(chatId, action, msg.text)
                                result = await commands.checkClient(chatId)
                                if (result) {
                                    await sendSyncMsg(bot, chatId, result)
                                }
                                // await deleteSync(bot, chatId, msg.message_id)
                            }
                        })

                        break

                    case `edit_carrier_info`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                        // await saveCarrierDBtoJson(chatId)
                        result = await commands.checkCarrier(chatId, false)
                        if (result) {
                            await sendSyncMsg(bot, chatId, result)
                            // await deleteSync(bot, chatId, msgId)
                        }
                        break

                    case `load_info`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                        result = await commands.loadInfo()
                        await sendSyncMsg(bot, chatId, result)
                        break

                    case `remove_carrier_info`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                        const removeFlag = await removeCarrierDB(chatId)
                        if (removeFlag) result = await commands.success('removed')
                        else result = await commands.fail('Removed')
                        await sendSyncMsg(bot, chatId, result)
                        break

                    case `reset_carrier_info`:
                        if (editCarrierStatus.includes(chatId) || editClient.includes(chatId)) return
                        const resetCarrierJsonData = await resetCarrierJson(chatId)
                        // await deleteSync(bot, chatId, msgId)
                        editCarrier = editCarrier.filter(val => val != chatId)
                        result = await commands.checkCarrier(chatId)
                        if (result ) {
                            await sendSyncMsg(bot, chatId, result)
                        }
                        break

                    case `finish_carrier`:
                        if (editCarrierStatus.includes(chatId) || editClient.includes(chatId)) return
                        const resCarrier = await saveCarriertoDB(chatId)
                        // await deleteSync(bot, chatId, msgId)
                        editCarrier = editCarrier.filter(val => val != chatId)
                        if (resCarrier) result = await commands.success('saved')
                        else result = await commands.fail('Save')
                        await sendSyncMsg(bot, chatId, result)
                        break

                    case `finish_client`:
                        if (editCarrier.includes(chatId)) return
                        const resClient = await saveClienttoDB(chatId)
                        console.log('resClient', resClient)
                        // await deleteSync(bot, chatId, msgId)
                        if (resClient) result = await commands.success('saved')
                        else result = await commands.fail('Save')
                        await sendSyncMsg(bot, chatId, result)
                        break

                    case `cancel`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                        await deleteSync(bot, chatId, msgId)
                        break
                }

                if (action.startsWith('load_num:')) {
                    if (editCarrier.includes(chatId) || editClient.includes(chatId)) return
                    const jobId = action.split(':')[1]
                    result = await commands.getLoadInfo(jobId)
                    await sendSyncMsg(bot, chatId, result)
                }

            } catch (e) {
                const currentUTCDate = new Date().toISOString();
                const log = `${currentUTCDate} : ${chatId} : error -> ${e}\n`
                fs.appendFileSync('log.txt', log)
                console.log(log)
                bot.stopPolling()
                run()
            }
        })
    } catch (e) {
        const currentUTCDate = new Date().toISOString();
        const log = `${currentUTCDate} : error -> ${e}\n`
        fs.appendFileSync('log.txt', log)
        console.log(log)
        bot.stopPolling()
        run()
    }
}

run()