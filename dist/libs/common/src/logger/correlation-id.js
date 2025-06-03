"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorrelationId = addCorrelationId;
exports.getCorrelationId = getCorrelationId;
const node_async_hooks_1 = require("node:async_hooks");
const asyncLocalStorage = new node_async_hooks_1.AsyncLocalStorage();
function addCorrelationId(id) {
    asyncLocalStorage.enterWith(new Map([['correlationId', id]]));
}
function getCorrelationId() {
    return asyncLocalStorage.getStore()?.get('correlationId');
}
//# sourceMappingURL=correlation-id.js.map