"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = exports.getLoadInfo = exports.loadInfo = exports.checkClient = exports.checkCarrier = exports.start = exports.clientCategoryList = exports.carrierCategoryList = exports.commandList = void 0;
const models_1 = require("../models");
const helper_1 = require("./helper");
exports.commandList = [
    { command: `start`, description: `Start the bot` },
];
exports.carrierCategoryList = {
    address: 'Carrier Address',
    name: 'Carrier Name',
    mc: 'Carrier MC',
    fleetSize: 'Fleet Size',
    popularRoute: 'Most Popular Route',
    price: 'Average Price Per Mile',
    carrierDispatchName: 'Dispatch Name',
    carrierDispatchPhone: 'Dispatch Phone Number',
    carrierDriver: 'Drivers name and Drivers number with _ in between as array using ,\nex: john_123456789,james_987654321,jack_0123456'
};
exports.clientCategoryList = {
    pickUpLocation: 'Pick up location',
    dropOffLocation: 'Drop off location',
    pickUpDate: 'Pick up date',
    dropOffDate: 'Drop off date',
    trailor: 'Trailor type',
    cargo: 'Cargo type',
    rate: 'Rate',
    weight: 'Weight',
    mcNumber: 'MC number',
    hazmat: 'hazmat possibility',
    pickUpTime: 'Pick up time',
    dropOffTime: 'Drop off time',
    temperature: 'Temperature controlled',
    dockNumber: 'Dock number',
    terms: 'Payment terms',
    trackingId: 'Tracking ID',
    tolerance: 'Negotiation tolerancel',
};
const start = () => {
    const title = `Select your role`;
    const content = [[{
                text: `Carrier`, callback_data: `role:carrier`
            }, { text: `Client`, callback_data: `role:client` }]];
    return { title, content };
};
exports.start = start;
const checkCarrier = async (chatId, check = true) => {
    var _a, _b, _c, _d, _e;
    const info = await models_1.carrierModel.findOne({ chatId });
    if (info && check) {
        const title = `Your carrier Information
Carrier Name: ${info.name}
Carrier Address: ${info.address}
Popular Route: ${info.popularRoute}
Fleet Size: ${info.fleetSize}
Carrier MC: ${info.mc}
Price per mile: ${info.price}
Carrier Dispatch Name: ${info.carrierDispatchName}
Carrier Dispatch Phone Number: ${info.carrierDispatchPhone}
Carrier Drivers: ${JSON.stringify(info.carrierDriver.map((item) => { return { name: item.name, phone: item.phone }; }), null, 4)}
Verification: ${(_a = info.verification) !== null && _a !== void 0 ? _a : ''}
On time percentage: ${(_b = info.onTime) !== null && _b !== void 0 ? _b : ''}
Loads run: ${(_c = info.loadRun) !== null && _c !== void 0 ? _c : ''}
Crash or Thefts: ${(_d = info.crash) !== null && _d !== void 0 ? _d : ''}
Fraud flags: ${(_e = info.fraud) !== null && _e !== void 0 ? _e : ''}
`;
        const content = [
            [{ text: `Remove information`, callback_data: 'remove_carrier_info' }],
            [{ text: `Load information`, callback_data: 'load_info' }],
            [{ text: `Edit your information`, callback_data: 'edit_carrier_info' }]
        ];
        return { title, content };
    }
    else {
        const result = chatId in helper_1.carrierData ? helper_1.carrierData[chatId] : {};
        const objectLength = Object.keys(result).length;
        const title = `Please register your information`;
        const content = [
            [{ text: `Carrier Address ${`address` in result ? '✅' : '🖊️'} `, callback_data: `address` }],
            [{ text: `Carrier Name ${`name` in result ? '✅' : '🖊️'} `, callback_data: `name` }],
            [{ text: `Carrier MC ${`mc` in result ? '✅' : '🖊️'} `, callback_data: `mc` }],
            [{ text: `Fleet Size ${`fleetSize` in result ? '✅' : '🖊️'} `, callback_data: `fleetSize` }],
            [{ text: `Most Popular Route ${`popularRoute` in result ? '✅' : '🖊️'} `, callback_data: `popularRoute` }],
            [{ text: `Average Price Per Mile ${`price` in result ? '✅' : '🖊️'} `, callback_data: `price` }],
            [{ text: `Dispatch Name ${`carrierDispatchName` in result ? '✅' : '🖊️'} `, callback_data: `carrierDispatchName` }],
            [{ text: `Dispatch Phone Number ${`carrierDispatchPhone` in result ? '✅' : '🖊️'} `, callback_data: `carrierDispatchPhone` }],
            [{ text: `Drivers ${`carrierDriver` in result ? '✅' : '🖊️'} `, callback_data: `carrierDriver` }],
            [{ text: `Reset`, callback_data: 'reset_carrier_info' }],
        ];
        if (objectLength == 9)
            content.push([{ text: `Finish 🏁`, callback_data: `finish_carrier` }]);
        return { title, content };
    }
};
exports.checkCarrier = checkCarrier;
const checkClient = async (chatId) => {
    const result = helper_1.clientData[chatId];
    console.log('result', result);
    const title = `Please register load information`;
    const content = [
        [{ text: `Pick up Location ${result && `pickUpLocation` in result ? '✅' : '🖊️'} `, callback_data: `pickUpLocation` }],
        [{ text: `Drop off Location ${result && `dropOffLocation` in result ? '✅' : '🖊️'} `, callback_data: `dropOffLocation` }],
        [{ text: `Pick up Date ${result && `pickUpDate` in result ? '✅' : '🖊️'} `, callback_data: `pickUpDate` }],
        [{ text: `Drop off Date ${result && `dropOffDate` in result ? '✅' : '🖊️'} `, callback_data: `dropOffDate` }],
        [{ text: `Trailor Type ${result && `trailor` in result ? '✅' : '🖊️'} `, callback_data: `trailor` }],
        [{ text: `Cargo Type ${result && `cargo` in result ? '✅' : '🖊️'} `, callback_data: `cargo` }],
        [{ text: `Rate ${result && `rate` in result ? '✅' : '🖊️'} `, callback_data: `rate` }],
        [{ text: `Weight ${result && `weight` in result ? '✅' : '🖊️'} `, callback_data: `weight` }],
        [{ text: `MC Number ${result && `mcNumber` in result ? '✅' : '🖊️'} `, callback_data: `mcNumber` }],
        [{ text: `Hazmat ${result && `hazmat` in result ? '✅' : '🖊️'} `, callback_data: `hazmat` }],
        [{ text: `Pick up Time ${result && `pickUpTime` in result ? '✅' : '🖊️'} `, callback_data: `pickUpTime` }],
        [{ text: `Drop off Time ${result && `dropOffTime` in result ? '✅' : '🖊️'} `, callback_data: `dropOffTime` }],
        [{ text: `Temperature Controlled ${result && `temperature` in result ? '✅' : '🖊️'} `, callback_data: `temperature` }],
        [{ text: `Dock Number ${result && `dockNumber` in result ? '✅' : '🖊️'} `, callback_data: `dockNumber` }],
        [{ text: `Payment Terms ${result && `terms` in result ? '✅' : '🖊️'} `, callback_data: `terms` }],
        [{ text: `Tracking ID ${result && `trackingId` in result ? '✅' : '🖊️'} `, callback_data: `trackingId` }],
        [{ text: `Negotiation Tolerance ${result && `tolerance` in result ? '✅' : '🖊️'} `, callback_data: `tolerance` }],
    ];
    if (result) {
        const objectLength = Object.keys(result).length;
        if (objectLength == 17)
            content.push([{ text: `Finish 🏁`, callback_data: `finish_client` }]);
    }
    return { title, content };
};
exports.checkClient = checkClient;
const loadInfo = async () => {
    const loadList = await models_1.loadModel.distinct('_id');
    const title = `Loads list`;
    const content = [];
    loadList.map((val, idx) => {
        content.push([{ text: `Job ID : ${val.toString()}`, callback_data: `load_num:${val.toString()}` }]);
    });
    return { title, content };
};
exports.loadInfo = loadInfo;
const getLoadInfo = async (jobId) => {
    const load = await models_1.loadModel.findById(jobId);
    const title = `Load information (Job ID : ${jobId})
Pick up location : ${load === null || load === void 0 ? void 0 : load.pickUpLocation}
Drop off location : ${load === null || load === void 0 ? void 0 : load.dropOffLocation}
Pick up date : ${load === null || load === void 0 ? void 0 : load.pickUpDate}
Drop off date : ${load === null || load === void 0 ? void 0 : load.dropOffDate}
Trailor type : ${load === null || load === void 0 ? void 0 : load.trailor}
Cargo type : ${load === null || load === void 0 ? void 0 : load.cargo}
rate: Rate : ${load === null || load === void 0 ? void 0 : load.rate}
weight: Weight : ${load === null || load === void 0 ? void 0 : load.weight}
MC number : ${load === null || load === void 0 ? void 0 : load.mcNumber}
hazmat possibility : ${load === null || load === void 0 ? void 0 : load.hazmat}
Pick up time : ${load === null || load === void 0 ? void 0 : load.pickUpTime}
Drop off time : ${load === null || load === void 0 ? void 0 : load.dropOffTime}
Temperature controlled : ${load === null || load === void 0 ? void 0 : load.temperature}
Dock number : ${load === null || load === void 0 ? void 0 : load.dockNumber}
Payment terms : ${load === null || load === void 0 ? void 0 : load.terms}
Tracking ID : ${load === null || load === void 0 ? void 0 : load.trackingId}
Negotiation tolerancel : ${load === null || load === void 0 ? void 0 : load.tolerance}
`;
    const content = [[{ text: 'Close', callback_data: 'cancel' }]];
    return { title, content };
};
exports.getLoadInfo = getLoadInfo;
const success = async (info) => {
    const title = `Successfully ${info} `;
    const content = [[{ text: `Close`, callback_data: `cancel` }]];
    return { title, content };
};
exports.success = success;
const fail = async (info) => {
    const title = `${info} failed`;
    const content = [[{ text: `Close`, callback_data: `cancel` }]];
    return { title, content };
};
exports.fail = fail;
//# sourceMappingURL=index.js.map