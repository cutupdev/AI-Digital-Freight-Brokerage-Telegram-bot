import mongoose from "mongoose";

const LoadSchema = new mongoose.Schema({
    chatId: { type: String },
    pickUpLocation: { type: String, require: true },
    dropOffLocation: { type: String, require: true },
    pickUpDate: { type: String, require: true },
    dropOffDate: { type: String, require: true },
    trailor: { type: String, require: true },
    cargo: { type: String, require: true },
    rate: { type: String, require: true },
    weight: { type: String, require: true },
    mcNumber: { type: String, require: true },
    hazmat: { type: String, require: true },
    pickUpTime: { type: String, require: true },
    dropOffTime: { type: String, require: true },
    temperature: { type: String, require: true },
    dockNumber: { type: String, require: true },
    terms: { type: String, require: true },
    openPickup: { type: Boolean, require: true, default: true },
    openDropoff: { type: Boolean, require: true, default: false },
    trackingId: { type: String, require: true },
    tolerance: { type: String, require: true },
});

const carrierSchema = new mongoose.Schema({
    verification: { type: String, default: undefined },
    onTime: { type: String, default: undefined },
    loadRun: { type: String, default: undefined },
    crash: { type: String, default: undefined },
    fraud: { type: String, default: undefined },
    popularRoute: { type: String, require: true, },
    chatId: { type: String, require: true, unique: true },
    fleetSize: { type: String, require: true },
    address: { type: String, require: true },
    name: { type: String, require: true },
    mc: { type: String, require: true },
    price: { type: String, require: true },
    carrierDispatchName: { type: String, require: true },
    carrierDispatchPhone: { type: String, require: true },
    carrierDriver: [{ name: { type: String, require: true }, phone: { type: String, require: true }, }],
});

const jobSchema = new mongoose.Schema({
    jobId: { type: String, require: true },
    carrierAddress: { type: String, require: true },
    dispatchName: { type: String, require: true },
    dispatchPhone: { type: String, require: true },
    driver: [{ name: { type: String, require: true }, phone: { type: String, require: true }, }],
    distance: { type: String, require: true },
    driverEmpty: { type: String, require: true }
})

export const loadModel = mongoose.model("load", LoadSchema);
export const carrierModel = mongoose.model("carrier", carrierSchema);
export const jobModel = mongoose.model("job", jobSchema);
