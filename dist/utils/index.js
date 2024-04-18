"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeData = exports.readData = void 0;
const fs_1 = __importDefault(require("fs"));
const readData = async (Path) => {
    return JSON.parse(fs_1.default.readFileSync(Path, `utf8`));
};
exports.readData = readData;
const writeData = async (data, path) => {
    try {
        const dataJson = JSON.stringify(data, null, 4);
        fs_1.default.writeFile(path, dataJson, (err) => {
            if (err) {
                console.log('Error writing file:', err);
            }
            else {
                console.log(`wrote file ${path}`);
            }
        });
    }
    catch (e) {
        return true;
    }
};
exports.writeData = writeData;
//# sourceMappingURL=index.js.map