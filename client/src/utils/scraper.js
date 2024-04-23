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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeTableData = exports.scrapeFinVizData = void 0;
var axios_1 = require("axios");
var parse5_1 = require("parse5");
var fetchFinancialData = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get("https://stockanalysis.com/stocks/".concat(ticker, "/financials/"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, (0, parse5_1.parse)(result.data)];
        }
    });
}); };
var fetchBalanceSheetData = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get("https://stockanalysis.com/stocks/".concat(ticker, "/financials/balance-sheet/"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, (0, parse5_1.parse)(result.data)];
        }
    });
}); };
var fetchCashFlowData = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get("https://stockanalysis.com/stocks/".concat(ticker, "/financials/cash-flow-statement/"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, (0, parse5_1.parse)(result.data)];
        }
    });
}); };
var fetchFinVizData = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get("https://finviz.com/quote.ashx?t=".concat(ticker, "&p=d"), { headers: headers })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, (0, parse5_1.parse)(result.data)];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var scrapeFinVizData = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var document, traverse, tableClassName, table;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchFinVizData(ticker)];
            case 1:
                document = _a.sent();
                traverse = function (node, callback) {
                    if (node.childNodes) {
                        for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
                            var childNode = _a[_i];
                            traverse(childNode, callback);
                        }
                    }
                    callback(node);
                };
                tableClassName = 'js-snapshot-table snapshot-table2 screener_snapshot-table-body';
                table = [];
                traverse(document, function (node) {
                    if (node.tagName === 'table' && node.attrs) {
                        var classAttr = node.attrs.find(function (attr) { return attr.name === 'class'; });
                        if (classAttr && classAttr.value === tableClassName) {
                            node.childNodes.forEach(function (childNode) {
                                if (childNode.tagName === 'tbody') {
                                    childNode.childNodes.forEach(function (rowNode) {
                                        if (rowNode.tagName === 'tr') {
                                            var row_1 = [];
                                            rowNode.childNodes.forEach(function (cellNode) {
                                                if (cellNode.tagName === 'td') {
                                                    if (cellNode.childNodes[0].value === undefined) {
                                                        if (cellNode.childNodes[0].childNodes[0].value === undefined) {
                                                            row_1.push(cellNode.childNodes[0].childNodes[0].childNodes[0].value);
                                                        }
                                                        else {
                                                            row_1.push(cellNode.childNodes[0].childNodes[0].value);
                                                        }
                                                    }
                                                    else {
                                                        row_1.push(cellNode.childNodes[0].value);
                                                    }
                                                }
                                            });
                                            table.push(row_1);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                return [2 /*return*/, table];
        }
    });
}); };
exports.scrapeFinVizData = scrapeFinVizData;
var scrapeTableData = function (document) { return __awaiter(void 0, void 0, void 0, function () {
    var traverse, tableClassName, table;
    return __generator(this, function (_a) {
        traverse = function (node, callback) {
            if (node.childNodes) {
                for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
                    var childNode = _a[_i];
                    traverse(childNode, callback);
                }
            }
            callback(node);
        };
        tableClassName = 'w-full border-separate border-spacing-0 whitespace-nowrap';
        table = [];
        traverse(document, function (node) {
            if (node.tagName === 'table' && node.attrs) {
                var classAttr = node.attrs.find(function (attr) { return attr.name === 'class'; });
                if (classAttr && classAttr.value === tableClassName) {
                    node.childNodes.forEach(function (childNode) {
                        if (childNode.tagName === 'tbody') {
                            childNode.childNodes.forEach(function (rowNode) {
                                if (rowNode.tagName === 'tr') {
                                    var row_2 = [];
                                    rowNode.childNodes.forEach(function (cellNode) {
                                        if (cellNode.tagName === 'td') {
                                            var found = false;
                                            for (var i = 0; i < cellNode.childNodes.length; i++) {
                                                if (cellNode.childNodes[i].tagName == 'span') {
                                                    row_2.push(cellNode.childNodes[i].childNodes[0].value);
                                                    found = true;
                                                }
                                            }
                                            if (!found) {
                                                row_2.push(cellNode.childNodes[0].value);
                                            }
                                        }
                                    });
                                    table.push(row_2);
                                }
                            });
                        }
                        else if (childNode.tagName === 'thead') {
                            var row = [];
                            for (var i = 0; i < childNode.childNodes.length; i++) {
                                for (var x = 0; childNode.childNodes[i] !== undefined && x < childNode.childNodes[i].childNodes.length - 1; x++) {
                                    if (childNode.childNodes[i].childNodes[x].childNodes === undefined) {
                                        continue;
                                    }
                                    row.push(childNode.childNodes[i].childNodes[x].childNodes[0].value);
                                }
                            }
                            table.push(row);
                        }
                    });
                }
            }
        });
        return [2 /*return*/, table];
    });
}); };
exports.scrapeTableData = scrapeTableData;
var main = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, cashFlowTable, _a, incomeTable, _b, balanceSheetTable, _c, finvizData, x, row, i, key, value;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                obj = {};
                _a = exports.scrapeTableData;
                return [4 /*yield*/, fetchCashFlowData(ticker)];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent()])];
            case 2:
                cashFlowTable = _d.sent();
                _b = exports.scrapeTableData;
                return [4 /*yield*/, fetchFinancialData(ticker)];
            case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()])];
            case 4:
                incomeTable = _d.sent();
                _c = exports.scrapeTableData;
                return [4 /*yield*/, fetchBalanceSheetData(ticker)];
            case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()])];
            case 6:
                balanceSheetTable = _d.sent();
                return [4 /*yield*/, (0, exports.scrapeFinVizData)(ticker)];
            case 7:
                finvizData = _d.sent();
                for (x = 0; x < finvizData.length; x++) {
                    row = finvizData[x];
                    for (i = 0; i < row.length; i += 2) {
                        key = row[i];
                        value = row[i + 1];
                        if (key === 'Sales' && value.endsWith('B')) {
                            value = parseFloat(value) * 1e9;
                        }
                        if (!isNaN(parseFloat(value))) {
                            value = parseFloat(value);
                            if (value.toString().includes('%')) {
                                value = value / 100;
                            }
                        }
                        obj[key] = value;
                    }
                }
                addInfoToObj(obj, cashFlowTable);
                addInfoToObj(obj, incomeTable);
                addInfoToObj(obj, balanceSheetTable);
                console.log(obj["Sales"]);
                return [2 /*return*/];
        }
    });
}); };
var addInfoToObj = function (obj, infoTable) {
    var years = infoTable[0];
    for (var i = 1; i < infoTable.length; i++) {
        var rowName = infoTable[i][0];
        if (rowName === undefined) {
            continue;
        }
        obj[rowName] = {};
        for (var x = 1; x < years.length; x++) {
            obj[rowName][years[x]] = infoTable[i][x];
        }
    }
};
main("tsla");
