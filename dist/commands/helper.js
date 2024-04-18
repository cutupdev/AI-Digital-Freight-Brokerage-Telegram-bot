"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.saveClienttoDB = exports.resetCarrierJson = exports.removeCarrierDB = exports.saveCarriertoDB = exports.saveClientInfo = exports.saveCarrierInfo = exports.deleteSync = exports.sendSyncTitle = exports.sendSyncMsg = exports.clientData = exports.carrierData = void 0;
const config_1 = require("../config");
const utils_1 = require("../utils");
const models_1 = require("../models");
exports.carrierData = {};
exports.clientData = {};
const sendSyncMsg = async (bot, chatId, result) => {
    await bot.sendMessage(chatId, result.title, {
        reply_markup: {
            inline_keyboard: result.content,
            resize_keyboard: true
        },
        parse_mode: 'HTML'
    })
        .then(msg => msg)
        .catch((error) => {
        if (error.response && error.response.statusCode === 429) {
            setTimeout(async () => {
                await (0, exports.sendSyncMsg)(bot, chatId, result);
            }, 1000);
        }
        if (error.response && error.response.statusCode === 403) {
            return;
        }
    });
};
exports.sendSyncMsg = sendSyncMsg;
const sendSyncTitle = async (bot, chatId, title) => {
    while (true) {
        try {
            const msg = await bot.sendMessage(chatId, title);
            return msg;
        }
        catch (error) {
            setTimeout(async () => {
            }, 1000);
        }
    }
};
exports.sendSyncTitle = sendSyncTitle;
const deleteSync = async (bot, chatId, msgId) => {
    await bot.deleteMessage(chatId, msgId)
        .catch((error) => { });
};
exports.deleteSync = deleteSync;
const saveCarrierInfo = async (chatId, cate, data, save = false) => {
    if (save)
        exports.carrierData = await (0, utils_1.readData)(config_1.carrierDataPath);
    if (!(chatId in exports.carrierData))
        exports.carrierData[chatId] = {};
    let temp = exports.carrierData[chatId];
    temp[cate] = data;
    exports.carrierData[chatId] = temp;
    if (save)
        await (0, exports.saveCarriertoDB)(chatId);
    await (0, utils_1.writeData)(exports.carrierData, config_1.carrierDataPath);
};
exports.saveCarrierInfo = saveCarrierInfo;
const saveClientInfo = async (chatId, cate, data, save = false) => {
    exports.clientData = await (0, utils_1.readData)(config_1.clientDataPath);
    if (!(chatId in exports.clientData))
        exports.clientData[chatId] = {};
    let temp = exports.clientData[chatId];
    temp[cate] = data;
    exports.clientData[chatId] = temp;
    await (0, utils_1.writeData)(exports.clientData, config_1.clientDataPath);
};
exports.saveClientInfo = saveClientInfo;
const saveCarriertoDB = async (chatId) => {
    const data = exports.carrierData[chatId];
    if (Object.keys(data).length == 9) {
        await models_1.carrierModel.findOneAndUpdate({ chatId }, {
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
        }, { upsert: true });
        (0, utils_1.writeData)(exports.carrierData, config_1.carrierDataPath);
        return true;
    }
    return false;
};
exports.saveCarriertoDB = saveCarriertoDB;
const removeCarrierDB = async (chatId) => {
    try {
        await models_1.carrierModel.findOneAndDelete({ chatId });
        if (chatId in exports.carrierData)
            delete exports.carrierData[chatId];
        (0, utils_1.writeData)(exports.carrierData, config_1.carrierDataPath);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.removeCarrierDB = removeCarrierDB;
const resetCarrierJson = async (chatId) => {
    try {
        delete exports.carrierData[chatId];
        (0, utils_1.writeData)(exports.carrierData, config_1.carrierDataPath);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.resetCarrierJson = resetCarrierJson;
const saveClienttoDB = async (chatId) => {
    const data = exports.clientData[chatId];
    if (Object.keys(data).length == 17) {
        await models_1.loadModel.create({
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
        });
        delete exports.clientData[chatId];
        (0, utils_1.writeData)(exports.clientData, config_1.clientDataPath);
        return true;
    }
    return false;
};
exports.saveClienttoDB = saveClienttoDB;
const init = async () => {
    exports.carrierData = await (0, utils_1.readData)(config_1.carrierDataPath);
    exports.clientData = await (0, utils_1.readData)(config_1.carrierDataPath);
};
exports.init = init;
//# sourceMappingURL=helper.js.map