"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const List_1 = require("../entity/List");
const createListLoader = () => new dataloader_1.default((listIds) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield List_1.List.findByIds(listIds);
    const listIdToList = {};
    lists.forEach((l) => {
        listIdToList[l.id] = l;
    });
    return listIds.map((userId) => listIdToList[userId]);
}));
exports.createListLoader = createListLoader;
//# sourceMappingURL=createListLoader.js.map