"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const fs = __importStar(require("fs"));
const commands = __importStar(require("./commands"));
const config_1 = require("./config");
const helper_1 = require("./commands/helper");
const db_1 = require("./utils/db");
const token = config_1.BotToken;
let botName;
let editCarrier = [];
let editCarrierStatus = [];
let editClient = [];
(0, db_1.connectDB)();
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
const run = () => {
    try {
        const currentUTCDate = new Date().toISOString();
        fs.appendFileSync('log.txt', `${currentUTCDate} : Bot started\n`);
        console.log("Bot started");
        bot.getMe().then(user => {
            botName = user.username.toString();
        });
        bot.setMyCommands(commands.commandList);
        (0, helper_1.init)();
        bot.on(`message`, async (msg) => {
            const chatId = msg.chat.id;
            console.log("username ==> ", msg.chat.username);
            const text = msg.text;
            const msgId = msg.message_id;
            console.log(`message : ${chatId} : ${text}`);
            let result;
            try {
                switch (text) {
                    case `/start`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId))
                            return;
                        // should check role
                        result = commands.start();
                        if (result) {
                            await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                        }
                        break;
                }
            }
            catch (e) {
                const currentUTCDate = new Date().toISOString();
                const log = `${currentUTCDate} : ${chatId} : error -> ${e}\n`;
                fs.appendFileSync('log.txt', log);
                console.log(log);
                bot.stopPolling();
                run();
            }
        });
        bot.on('callback_query', async (query) => {
            var _a, _b;
            const chatId = (_a = query.message) === null || _a === void 0 ? void 0 : _a.chat.id;
            const msgId = (_b = query.message) === null || _b === void 0 ? void 0 : _b.message_id;
            const action = query.data;
            const callbackQueryId = query.id;
            const currentUTCDate = new Date().toISOString();
            const log = `${currentUTCDate} : query : ${chatId} -> ${action}\n`;
            fs.appendFileSync('log.txt', log);
            console.log(log);
            try {
                let result;
                switch (action) {
                    case 'role:carrier':
                        if (editCarrier.includes(chatId) || editClient.includes(chatId))
                            return;
                        result = await commands.checkCarrier(chatId);
                        if (result) {
                            await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                            // await deleteSync(bot, chatId, msgId)
                        }
                        break;
                    case 'role:client':
                        if (editCarrier.includes(chatId) || editClient.includes(chatId))
                            return;
                        result = await commands.checkClient(chatId);
                        if (result)
                            await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                        // await deleteSync(bot, chatId, msgId)
                        break;
                    case `address`:
                    case `name`:
                    case `mc`:
                    case `fleetSize`:
                    case `popularRoute`:
                    case `price`:
                    case `carrierDispatchName`:
                    case `carrierDispatchPhone`:
                        if (!editCarrier.includes(chatId))
                            editCarrier.push(chatId);
                        console.log('editCarrierStatus', editCarrierStatus);
                        if (editCarrierStatus.includes(chatId))
                            return;
                        else
                            editCarrierStatus.push(chatId);
                        const titleMsg = await (0, helper_1.sendSyncTitle)(bot, chatId, `Input ${commands.carrierCategoryList[action]}`);
                        bot.once('message', async (msg) => {
                            if (msg.text) {
                                // await deleteSync(bot, chatId, msgId)
                                // await deleteSync(bot, chatId, titleMsg.message_id)
                                // const flag = editCarrier.includes(chatId)
                                await (0, helper_1.saveCarrierInfo)(chatId, action, msg.text);
                                // editCarrier = editCarrier.filter(val => val != chatId)
                                result = await commands.checkCarrier(chatId, !editCarrier.includes(chatId));
                                if (result) {
                                    editCarrierStatus = editCarrierStatus.filter(item => item != chatId);
                                    await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                                }
                                // await deleteSync(bot, chatId, msg.message_id)
                            }
                        });
                        break;
                    case `carrierDriver`:
                        if (!editCarrier.includes(chatId))
                            editCarrier.push(chatId);
                        if (editCarrierStatus.includes(chatId))
                            return;
                        else
                            editCarrierStatus.push(chatId);
                        const titleMsg2 = await (0, helper_1.sendSyncTitle)(bot, chatId, `Input ${commands.carrierCategoryList[action]}`);
                        bot.once('message', async (msg) => {
                            if (msg.text) {
                                const data = msg.text.split(',');
                                const arr = [];
                                data.map((val) => {
                                    arr.push({ name: val.split('_')[0], phone: val.split('_')[1] });
                                });
                                // await deleteSync(bot, chatId, msgId)
                                // await deleteSync(bot, chatId, titleMsg2.message_id)
                                // const flag = editCarrier.includes(chatId)
                                await (0, helper_1.saveCarrierInfo)(chatId, action, arr);
                                // editCarrier = editCarrier.filter(val => val != chatId)
                                result = await commands.checkCarrier(chatId, !editCarrier.includes(chatId));
                                if (result) {
                                    editCarrierStatus = editCarrierStatus.filter(item => item != chatId);
                                    await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                                }
                                // await deleteSync(bot, chatId, msg.message_id)
                            }
                        });
                        break;
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
                        if (editCarrier.includes(chatId))
                            return;
                        await (0, helper_1.sendSyncTitle)(bot, chatId, `Input ${commands.clientCategoryList[action]}`);
                        bot.once('message', async (msg) => {
                            if (msg.text) {
                                // await deleteSync(bot, chatId, msgId)
                                // await deleteSync(bot, chatId, titleMsg.message_id)
                                const flag = editClient.includes(chatId);
                                const res = await (0, helper_1.saveClientInfo)(chatId, action, msg.text);
                                result = await commands.checkClient(chatId);
                                if (result) {
                                    await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                                }
                                // await deleteSync(bot, chatId, msg.message_id)
                            }
                        });
                        break;
                    case `edit_carrier_info`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId))
                            return;
                        // await saveCarrierDBtoJson(chatId)
                        result = await commands.checkCarrier(chatId, false);
                        if (result) {
                            await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                            // await deleteSync(bot, chatId, msgId)
                        }
                        break;
                    case `load_info`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId))
                            return;
                        result = await commands.loadInfo();
                        await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                        break;
                    case `remove_carrier_info`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId))
                            return;
                        const removeFlag = await (0, helper_1.removeCarrierDB)(chatId);
                        if (removeFlag)
                            result = await commands.success('removed');
                        else
                            result = await commands.fail('Removed');
                        await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                        break;
                    case `reset_carrier_info`:
                        if (editCarrierStatus.includes(chatId) || editClient.includes(chatId))
                            return;
                        const resetCarrierJsonData = await (0, helper_1.resetCarrierJson)(chatId);
                        // await deleteSync(bot, chatId, msgId)
                        editCarrier = editCarrier.filter(val => val != chatId);
                        result = await commands.checkCarrier(chatId);
                        if (result) {
                            await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                        }
                        break;
                    case `finish_carrier`:
                        if (editCarrierStatus.includes(chatId) || editClient.includes(chatId))
                            return;
                        const resCarrier = await (0, helper_1.saveCarriertoDB)(chatId);
                        // await deleteSync(bot, chatId, msgId)
                        editCarrier = editCarrier.filter(val => val != chatId);
                        if (resCarrier)
                            result = await commands.success('saved');
                        else
                            result = await commands.fail('Save');
                        await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                        break;
                    case `finish_client`:
                        if (editCarrier.includes(chatId))
                            return;
                        const resClient = await (0, helper_1.saveClienttoDB)(chatId);
                        console.log('resClient', resClient);
                        // await deleteSync(bot, chatId, msgId)
                        if (resClient)
                            result = await commands.success('saved');
                        else
                            result = await commands.fail('Save');
                        await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                        break;
                    case `cancel`:
                        if (editCarrier.includes(chatId) || editClient.includes(chatId))
                            return;
                        await (0, helper_1.deleteSync)(bot, chatId, msgId);
                        break;
                }
                if (action.startsWith('load_num:')) {
                    if (editCarrier.includes(chatId) || editClient.includes(chatId))
                        return;
                    const jobId = action.split(':')[1];
                    result = await commands.getLoadInfo(jobId);
                    await (0, helper_1.sendSyncMsg)(bot, chatId, result);
                }
            }
            catch (e) {
                const currentUTCDate = new Date().toISOString();
                const log = `${currentUTCDate} : ${chatId} : error -> ${e}\n`;
                fs.appendFileSync('log.txt', log);
                console.log(log);
                bot.stopPolling();
                run();
            }
        });
    }
    catch (e) {
        const currentUTCDate = new Date().toISOString();
        const log = `${currentUTCDate} : error -> ${e}\n`;
        fs.appendFileSync('log.txt', log);
        console.log(log);
        bot.stopPolling();
        run();
    }
};
run();
//# sourceMappingURL=index.js.map