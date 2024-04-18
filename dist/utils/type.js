"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorTitle = exports.initialSetting = void 0;
exports.initialSetting = {
    announcement: false,
    buy1: 0.1,
    buy2: 0.5,
    sell1: 20,
    sell2: 80,
    slippage1: 10,
    slippage2: 20,
    priority: 'Medium',
    priorityAmount: 0.0001 //0.0005 0.001
};
exports.errorTitle = {
    inputBuyTokenAddress: `Token not found. Make sure address is correct.`,
    inputINJAmount: `Invalid amount. Make sure amount is correct.`,
    inputTokenAmount: `Invalid percentage. Make sure percentage is correct.`,
    inputTokenPrice: `Invalid price. Make sure price is correct.`,
    internal: `Invalid action, please try again.`,
    lowINJBalance: `Low balance in your wallet.`,
    invalidPrivKey: `Invalid private key.`,
};
//# sourceMappingURL=type.js.map