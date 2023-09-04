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
var discord_js_1 = require("discord.js");
var conoha_1 = require("./lib/conoha");
var env_1 = require("./lib/env");
var AUTO_SHUTDOWN = true;
var SHUTDOWN_TIME = 15 * 60 * 1000;
var timeWithoutPlayers = 0;
var client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds],
});
client.on('ready', function () {
    console.log("Logged in as ".concat(client.user.tag, "!"));
    setInterval(function () {
        (0, conoha_1.getStatus)().then(function (status) {
            if (status == 'ACTIVE') {
                client.user.setStatus('online');
                fetch("https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=".concat(env_1.env.STEAM_WEB_API_KEY, "&filter=addr\\").concat(env_1.env.SERVER_IP)).then(function (res) {
                    res.json().then(function (json) {
                        if (Object.keys(json.response).length === 0) {
                            return client.user.setActivity('サーバーを起動中...', { type: discord_js_1.ActivityType.Playing });
                        }
                        else {
                            var onlinePlayers = json.response.servers[0].players;
                            var maxPlayers = json.response.servers[0].max_players;
                            client.user.setActivity("".concat(onlinePlayers, "/").concat(maxPlayers, "\u4EBA\u304C\u30B5\u30FC\u30D0\u30FC"), {
                                type: discord_js_1.ActivityType.Playing,
                            });
                            if (onlinePlayers === 0) {
                                timeWithoutPlayers += 5000;
                            }
                            else {
                                timeWithoutPlayers = 0;
                            }
                            if (SHUTDOWN_TIME !== null && timeWithoutPlayers >= SHUTDOWN_TIME && AUTO_SHUTDOWN) {
                                (0, conoha_1.doAction)('stop');
                                console.log('サーバーを停止しました');
                                timeWithoutPlayers = 0;
                            }
                        }
                    });
                });
            }
            if (status == 'SHUTOFF') {
                client.user.setStatus('idle');
                client.user.setActivity("\u30B5\u30FC\u30D0\u30FC\u306F\u505C\u6B62\u4E2D", { type: discord_js_1.ActivityType.Playing });
            }
        });
    }, 5000);
});
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var resAutoShutdown_1, resShutdownTime_1, message, e_1, cheakIntervalId_1, message, e_2, message, e_3, cheakIntervalId_2, status_1, statusText, res, json, onlinePlayers, maxPlayers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isChatInputCommand())
                    return [2 /*return*/];
                if (!(interaction.commandName === 'start')) return [3 /*break*/, 6];
                resAutoShutdown_1 = interaction.options.getBoolean('auto_shutdown');
                resShutdownTime_1 = interaction.options.getInteger('shutdown_time');
                return [4 /*yield*/, interaction.reply('サーバーを起動しています...')];
            case 1:
                message = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, conoha_1.doAction)('start')];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                message.edit("\u274C\u30B5\u30FC\u30D0\u30FC\u306E\u8D77\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n".concat(e_1.message));
                return [2 /*return*/];
            case 5:
                message.edit('サーバーを起動しています\n参加できるようになるまで数分かかる場合があります\n参加が可能になったら、メンションでお知らせします');
                client.user.setStatus('online');
                client.user.setActivity('サーバーを起動中...', { type: discord_js_1.ActivityType.Playing });
                cheakIntervalId_1 = setInterval(function () {
                    fetch("https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=".concat(env_1.env.STEAM_WEB_API_KEY, "&filter=addr\\").concat(env_1.env.SERVER_IP)).then(function (res) {
                        res.json().then(function (json) {
                            if (Object.keys(json.response).length === 0) {
                                return;
                            }
                            else {
                                var channel = client.channels.cache.get(interaction.channelId);
                                if (channel) {
                                    if (resShutdownTime_1)
                                        SHUTDOWN_TIME = resShutdownTime_1 * 60 * 1000;
                                    if (resAutoShutdown_1 === null)
                                        AUTO_SHUTDOWN = true;
                                    else
                                        AUTO_SHUTDOWN = resAutoShutdown_1;
                                    channel.send("<@".concat(interaction.user.id, "> \u2705\u30B5\u30FC\u30D0\u30FC\u304C\u8D77\u52D5\u3057\u307E\u3057\u305F\n").concat(resAutoShutdown_1
                                        ? "".concat((SHUTDOWN_TIME / 60) * 1000, "\u9593\u30D7\u30EC\u30A4\u30E4\u30FC\u304C\u3044\u306A\u3044\u5834\u5408\u306F\u505C\u6B62\u3057\u307E\u3059")
                                        : 'サーバーは自動で停止しません', "}"));
                                    clearInterval(cheakIntervalId_1);
                                }
                            }
                        });
                    });
                }, 5000);
                return [3 /*break*/, 27];
            case 6:
                if (!(interaction.commandName === 'stop')) return [3 /*break*/, 12];
                return [4 /*yield*/, interaction.reply('サーバーを停止しています...')];
            case 7:
                message = _a.sent();
                _a.label = 8;
            case 8:
                _a.trys.push([8, 10, , 11]);
                return [4 /*yield*/, (0, conoha_1.doAction)('stop')];
            case 9:
                _a.sent();
                return [3 /*break*/, 11];
            case 10:
                e_2 = _a.sent();
                message.edit("\u274C\u30B5\u30FC\u30D0\u30FC\u306E\u505C\u6B62\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n".concat(e_2.message));
                return [2 /*return*/];
            case 11:
                message.edit('✅サーバーを停止しました');
                client.user.setStatus('idle');
                client.user.setActivity('サーバーは停止中', { type: discord_js_1.ActivityType.Playing });
                return [3 /*break*/, 27];
            case 12:
                if (!(interaction.commandName === 'reboot')) return [3 /*break*/, 18];
                return [4 /*yield*/, interaction.reply('サーバーを再起動しています...')];
            case 13:
                message = _a.sent();
                _a.label = 14;
            case 14:
                _a.trys.push([14, 16, , 17]);
                return [4 /*yield*/, (0, conoha_1.doAction)('reboot')];
            case 15:
                _a.sent();
                return [3 /*break*/, 17];
            case 16:
                e_3 = _a.sent();
                message.edit("\u274C\u30B5\u30FC\u30D0\u30FC\u306E\u518D\u8D77\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n".concat(e_3.message));
                return [2 /*return*/];
            case 17:
                message.edit('✅サーバーを再起動しました');
                client.user.setStatus('online');
                client.user.setActivity('サーバーを起動中...', { type: discord_js_1.ActivityType.Playing });
                cheakIntervalId_2 = setInterval(function () {
                    fetch("https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=".concat(env_1.env.STEAM_WEB_API_KEY, "&filter=addr\\").concat(env_1.env.SERVER_IP)).then(function (res) {
                        res.json().then(function (json) {
                            if (Object.keys(json.response).length === 0) {
                                return;
                            }
                            else {
                                var channel = client.channels.cache.get(interaction.channelId);
                                if (channel) {
                                    channel.send("<@".concat(interaction.user.id, "> \u2705\u30B5\u30FC\u30D0\u30FC\u304C\u8D77\u52D5\u3057\u307E\u3057\u305F"));
                                    clearInterval(cheakIntervalId_2);
                                }
                            }
                        });
                    });
                }, 5000);
                return [3 /*break*/, 27];
            case 18:
                if (!(interaction.commandName === 'status')) return [3 /*break*/, 21];
                return [4 /*yield*/, (0, conoha_1.getStatus)()];
            case 19:
                status_1 = _a.sent();
                statusText = '';
                if (status_1 == 'ACTIVE')
                    statusText = '起動中🟢';
                else if (status_1 == 'SHUTOFF')
                    statusText = '停止中🔴';
                return [4 /*yield*/, interaction.reply('サーバーの状態は' + statusText + 'です')];
            case 20:
                _a.sent();
                return [3 /*break*/, 27];
            case 21:
                if (!(interaction.commandName === 'players')) return [3 /*break*/, 27];
                return [4 /*yield*/, fetch("https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=".concat(env_1.env.STEAM_WEB_API_KEY, "&filter=addr\\").concat(env_1.env.SERVER_IP))];
            case 22:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 23:
                json = _a.sent();
                if (!(Object.keys(json.response).length === 0)) return [3 /*break*/, 25];
                return [4 /*yield*/, interaction.reply('サーバーが起動していないか、SteamのAPIがダウンしています')];
            case 24:
                _a.sent();
                return [2 /*return*/];
            case 25:
                onlinePlayers = json.response.servers[0].players;
                maxPlayers = json.response.servers[0].max_players;
                return [4 /*yield*/, interaction.reply("\u73FE\u5728".concat(onlinePlayers, "/").concat(maxPlayers, "\u4EBA\u304C\u30D7\u30EC\u30A4\u4E2D\u3067\u3059"))];
            case 26:
                _a.sent();
                _a.label = 27;
            case 27: return [2 /*return*/];
        }
    });
}); });
client.login(env_1.env.DISCORD_TOKEN);
