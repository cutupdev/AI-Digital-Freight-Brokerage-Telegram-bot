import { carrierModel, loadModel } from "../models";
import { carrierData, clientData } from "./helper";

export const commandList = [
    { command: `start`, description: `Start the bot` },
];

export const carrierCategoryList = {
    address: 'Carrier Address',
    name: 'Carrier Name',
    mc: 'Carrier MC',
    fleetSize: 'Fleet Size',
    popularRoute: 'Most Popular Route',
    price: 'Average Price Per Mile',
    carrierDispatchName: 'Dispatch Name',
    carrierDispatchPhone: 'Dispatch Phone Number',
    carrierDriver: 'Drivers name and Drivers number with _ in between as array using ,\nex: john_123456789,james_987654321,jack_0123456'
}

export const clientCategoryList = {
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
}

export const start = () => {
    const title = `Select your role`
    const content = [[{
        text: `Carrier`, callback_data: `role:carrier`
    }, { text: `Client`, callback_data: `role:client` }]]
    return { title, content }
}

export const checkCarrier = async (chatId: number, check: boolean = true) => {
    const info = await carrierModel.findOne({ chatId })
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
Carrier Drivers: ${JSON.stringify(info.carrierDriver.map((item) => { return { name: item.name, phone: item.phone } }), null, 4)}
Verification: ${info.verification ?? ''}
On time percentage: ${info.onTime ?? ''}
Loads run: ${info.loadRun ?? ''}
Crash or Thefts: ${info.crash ?? ''}
Fraud flags: ${info.fraud ?? ''}
`

        const content = [
            [{ text: `Remove information`, callback_data: 'remove_carrier_info' }],
            [{ text: `Load information`, callback_data: 'load_info' }],
            [{ text: `Edit your information`, callback_data: 'edit_carrier_info' }]
        ]

        return { title, content }
    } else {
        const result = chatId in carrierData ? carrierData[chatId] : {}

        const objectLength = Object.keys(result).length;
        const title = `Please register your information`
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
        ]
        if (objectLength == 9) content.push([{ text: `Finish 🏁`, callback_data: `finish_carrier` }])

        return { title, content }
    }
}

export const checkClient = async (chatId: number) => {
    const result = clientData[chatId]
    console.log('result', result)
    const title = `Please register load information`
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
    ]
    if (result) {
        const objectLength = Object.keys(result).length;
        if (objectLength == 17) content.push([{ text: `Finish 🏁`, callback_data: `finish_client` }])
    }
    return { title, content }
}

export const loadInfo = async () => {
    const loadList = await loadModel.distinct('_id')
    const title = `Loads list`
    const content: { text: string, callback_data: string }[][] = []
    loadList.map((val: any, idx) => {
        content.push([{ text: `Job ID : ${val.toString()}`, callback_data: `load_num:${val.toString()}` }])
    })
    return { title, content }
}

export const getLoadInfo = async (jobId: string) => {
    const load = await loadModel.findById(jobId)
    const title = `Load information (Job ID : ${jobId})
Pick up location : ${load?.pickUpLocation}
Drop off location : ${load?.dropOffLocation}
Pick up date : ${load?.pickUpDate}
Drop off date : ${load?.dropOffDate}
Trailor type : ${load?.trailor}
Cargo type : ${load?.cargo}
rate: Rate : ${load?.rate}
weight: Weight : ${load?.weight}
MC number : ${load?.mcNumber}
hazmat possibility : ${load?.hazmat}
Pick up time : ${load?.pickUpTime}
Drop off time : ${load?.dropOffTime}
Temperature controlled : ${load?.temperature}
Dock number : ${load?.dockNumber}
Payment terms : ${load?.terms}
Tracking ID : ${load?.trackingId}
Negotiation tolerancel : ${load?.tolerance}
`
    const content = [[{ text: 'Close', callback_data: 'cancel' }]]
    return { title, content }
}

export const success = async (info: string) => {
    const title = `Successfully ${info} `
    const content = [[{ text: `Close`, callback_data: `cancel` }]]
    return { title, content }
}

export const fail = async (info: string) => {
    const title = `${info} failed`
    const content = [[{ text: `Close`, callback_data: `cancel` }]]
    return { title, content }
}