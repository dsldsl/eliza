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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pfpUpdatePlugin = void 0;
var child_process_1 = require("child_process");
var util_1 = require("util");
var fs_1 = require("fs");
var path_1 = require("path");
var node_crypto_1 = require("node:crypto");
var execAsync = (0, util_1.promisify)(child_process_1.exec);
var generatePfpAction = {
    name: "GENERATE_IMAGE",
    similes: ["CHANGE_PROFILE_PICTURE", "UPDATE_PROFILE_PHOTO", "MAKE_CHRISTMAS_PFP"],
    description: "Generates a holiday-themed profile picture",
    validate: function (runtime, message) { return __awaiter(void 0, void 0, void 0, function () {
        var text;
        var _a, _b;
        return __generator(this, function (_c) {
            text = ((_b = (_a = message.content) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
            return [2 /*return*/, (text.includes("profile picture") ||
                    text.includes("pfp") ||
                    text.includes("avatar"))];
        });
    }); },
    handler: function (runtime, message, state, options, callback) { return __awaiter(void 0, void 0, void 0, function () {
        var userAccount, username, currentAvatarUrl, pythonScript, scriptArgs, scriptCwd, _a, stdout, stderr, generatedImagePath, imageBuffer, error_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, runtime.databaseAdapter.getAccountById(message.userId)];
                case 1:
                    userAccount = _b.sent();
                    if (!userAccount) {
                        throw new Error("Could not find account for the user");
                    }
                    username = userAccount.username;
                    console.log("Generating profile picture for user:", username);
                    currentAvatarUrl = userAccount.avatarUrl;
                    console.log("Current avatar URL:", currentAvatarUrl);
                    pythonScript = "/Users/dan/poof/DiscordIlluminator/venv3.10/bin/python";
                    scriptArgs = __spreadArray([
                        "selenium_service.py",
                        "--username", username
                    ], (currentAvatarUrl ? ["--current-avatar", currentAvatarUrl] : []), true);
                    scriptCwd = "/Users/dan/poof/DiscordIlluminator/xmasPfpAi/";
                    console.log("Generating profile picture...");
                    // Send an immediate response that we're working on it
                    callback({
                        text: "I'm working on generating a festive profile picture for you! This might take a minute... 🎨"
                    });
                    // Execute the Python script
                    console.log("Running Python script with args:", scriptArgs);
                    return [4 /*yield*/, execAsync("".concat(pythonScript, " ").concat(scriptArgs.join(" ")), {
                            cwd: scriptCwd
                        })];
                case 2:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    if (stderr) {
                        console.error("Python script stderr:", stderr);
                        throw new Error("Error running Python script");
                    }
                    console.log("Python script stdout:", stdout);
                    generatedImagePath = path_1.default.join("/Users/dan/poof/DiscordIlluminator/xmasPfpAi/pfps", "pfp-".concat(username, "-new.png"));
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, fs_1.promises.access(generatedImagePath)];
                case 4:
                    _b.sent();
                    console.log("Generated image exists at:", generatedImagePath);
                    return [4 /*yield*/, fs_1.promises.readFile(generatedImagePath)];
                case 5:
                    imageBuffer = _b.sent();
                    // Send the image
                    callback({
                        text: "#YoHoHo #ARRRRR 🏴‍☠️🎄✨",
                        attachments: [
                            {
                                id: (0, node_crypto_1.randomUUID)(),
                                url: generatedImagePath,
                                title: "Holiday Profile Picture",
                                source: "profilePictureGeneration",
                                description: "A festive holiday-themed profile picture.",
                                text: "Enjoy your new holiday look!",
                            },
                        ],
                    }, [
                        {
                            attachment: generatedImagePath,
                            name: "pfp-".concat(username, "-new.png"),
                        },
                    ]);
                    return [2 /*return*/, {
                            success: true,
                            message: "Profile picture generated successfully!"
                        }];
                case 6:
                    error_1 = _b.sent();
                    console.error("Error accessing generated image:", error_1);
                    throw new Error("Generated image not found");
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_2 = _b.sent();
                    console.error("Error in handler:", error_2);
                    throw error_2;
                case 9: return [2 /*return*/];
            }
        });
    }); },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Can you make me a holiday profile picture?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll generate a festive holiday-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "I'd like a Christmas profile picture" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create a Christmas-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
    ],
};
exports.pfpUpdatePlugin = {
    name: "pfpUpdate",
    description: "Plugin for generating holiday-themed profile pictures",
    actions: [generatePfpAction]
};
