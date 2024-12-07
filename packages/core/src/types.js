"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingLevel = exports.ServiceType = exports.Service = exports.Clients = exports.ModelProviderName = exports.ModelClass = exports.GoalStatus = void 0;
/**
 * Status enum for goals
 */
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["DONE"] = "DONE";
    GoalStatus["FAILED"] = "FAILED";
    GoalStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(GoalStatus || (exports.GoalStatus = GoalStatus = {}));
/**
 * Model size/type classification
 */
var ModelClass;
(function (ModelClass) {
    ModelClass["SMALL"] = "small";
    ModelClass["MEDIUM"] = "medium";
    ModelClass["LARGE"] = "large";
    ModelClass["EMBEDDING"] = "embedding";
    ModelClass["IMAGE"] = "image";
})(ModelClass || (exports.ModelClass = ModelClass = {}));
/**
 * Available model providers
 */
var ModelProviderName;
(function (ModelProviderName) {
    ModelProviderName["OPENAI"] = "openai";
    ModelProviderName["ETERNALAI"] = "eternalai";
    ModelProviderName["ANTHROPIC"] = "anthropic";
    ModelProviderName["GROK"] = "grok";
    ModelProviderName["GROQ"] = "groq";
    ModelProviderName["LLAMACLOUD"] = "llama_cloud";
    ModelProviderName["TOGETHER"] = "together";
    ModelProviderName["LLAMALOCAL"] = "llama_local";
    ModelProviderName["GOOGLE"] = "google";
    ModelProviderName["CLAUDE_VERTEX"] = "claude_vertex";
    ModelProviderName["REDPILL"] = "redpill";
    ModelProviderName["OPENROUTER"] = "openrouter";
    ModelProviderName["OLLAMA"] = "ollama";
    ModelProviderName["HEURIST"] = "heurist";
    ModelProviderName["GALADRIEL"] = "galadriel";
    ModelProviderName["FAL"] = "falai";
    ModelProviderName["GAIANET"] = "gaianet";
    ModelProviderName["ALI_BAILIAN"] = "ali_bailian";
    ModelProviderName["VOLENGINE"] = "volengine";
})(ModelProviderName || (exports.ModelProviderName = ModelProviderName = {}));
/**
 * Available client platforms
 */
var Clients;
(function (Clients) {
    Clients["DISCORD"] = "discord";
    Clients["DIRECT"] = "direct";
    Clients["TWITTER"] = "twitter";
    Clients["TELEGRAM"] = "telegram";
})(Clients || (exports.Clients = Clients = {}));
var Service = /** @class */ (function () {
    function Service() {
    }
    Object.defineProperty(Service, "serviceType", {
        get: function () {
            throw new Error("Service must implement static serviceType getter");
        },
        enumerable: false,
        configurable: true
    });
    Service.getInstance = function () {
        if (!Service.instance) {
            Service.instance = new this();
        }
        return Service.instance;
    };
    Object.defineProperty(Service.prototype, "serviceType", {
        get: function () {
            return this.constructor.serviceType;
        },
        enumerable: false,
        configurable: true
    });
    Service.instance = null;
    return Service;
}());
exports.Service = Service;
var ServiceType;
(function (ServiceType) {
    ServiceType["IMAGE_DESCRIPTION"] = "image_description";
    ServiceType["TRANSCRIPTION"] = "transcription";
    ServiceType["VIDEO"] = "video";
    ServiceType["TEXT_GENERATION"] = "text_generation";
    ServiceType["BROWSER"] = "browser";
    ServiceType["SPEECH_GENERATION"] = "speech_generation";
    ServiceType["PDF"] = "pdf";
    ServiceType["BUTTPLUG"] = "buttplug";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var LoggingLevel;
(function (LoggingLevel) {
    LoggingLevel["DEBUG"] = "debug";
    LoggingLevel["VERBOSE"] = "verbose";
    LoggingLevel["NONE"] = "none";
})(LoggingLevel || (exports.LoggingLevel = LoggingLevel = {}));
