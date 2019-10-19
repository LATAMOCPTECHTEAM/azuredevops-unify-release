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
        while (_) try {
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var variableManager_1 = require("./variableManager");
var azureDevOpsClient_1 = require("./azureDevOpsClient");
var BuildInterfaces_1 = require("azure-devops-node-api/interfaces/BuildInterfaces");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var releaseTag, releaseOnCancel, releaseOnError, teamfoundationCollectionUri, teamfoundationProject, accessToken, currentBuildId, devOpsClient, buildDetails, relatedBuilds, shouldCreateTag, _a, _b, build, err_1;
        var e_1, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    releaseTag = variableManager_1.variableManager.getInput('releaseTag', true);
                    releaseOnCancel = variableManager_1.variableManager.getBooleanInput('releaseOnCancel', true);
                    releaseOnError = variableManager_1.variableManager.getBooleanInput('releaseOnError', true);
                    teamfoundationCollectionUri = variableManager_1.variableManager.getVariable("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI");
                    teamfoundationProject = variableManager_1.variableManager.getVariable("SYSTEM_TEAMPROJECT");
                    accessToken = variableManager_1.variableManager.getVariable("SYSTEM_ACCESSTOKEN");
                    currentBuildId = variableManager_1.variableManager.getVariable("BUILD_BUILDID");
                    devOpsClient = new azureDevOpsClient_1.default(teamfoundationCollectionUri, accessToken);
                    return [4 /*yield*/, devOpsClient.getBuildInfo(teamfoundationProject, parseInt(currentBuildId))];
                case 1:
                    buildDetails = _d.sent();
                    console.log("Processing Build " + buildDetails.id + " from Source Version " + buildDetails.sourceVersion);
                    return [4 /*yield*/, devOpsClient.listRelatedBuilds(teamfoundationProject, buildDetails.sourceVersion)];
                case 2:
                    relatedBuilds = _d.sent();
                    shouldCreateTag = true;
                    try {
                        for (_a = __values(relatedBuilds.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                            build = _b.value;
                            console.log("Checking the last Build Run for Definition " + build.definition.name);
                            console.log("---> Build Id: " + build.id + ". Build Status " + BuildInterfaces_1.BuildStatus[build.status] + ". Build Result " + BuildInterfaces_1.BuildResult[build.result]);
                            if (buildDetails.id == build.id) {
                                console.log("---> Build " + build.id + " is the same of current build " + buildDetails.id);
                                continue;
                            }
                            if (build.status == BuildInterfaces_1.BuildStatus.Completed) {
                                continue;
                            }
                            if (build.result == BuildInterfaces_1.BuildResult.Canceled && !releaseOnCancel) {
                                shouldCreateTag = false;
                                break;
                            }
                            if (build.result == BuildInterfaces_1.BuildResult.Failed && !releaseOnError) {
                                shouldCreateTag = false;
                                break;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (!shouldCreateTag) return [3 /*break*/, 4];
                    return [4 /*yield*/, devOpsClient.addBuildTag(teamfoundationProject, buildDetails.id, releaseTag)];
                case 3:
                    _d.sent();
                    console.log("No Concurrent Builds, Creating tag " + releaseTag + ". Please remember to add this tag as a condition in your release pipeline trigger.");
                    _d.label = 4;
                case 4:
                    /*  if (inputString == 'bad') {
                          tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
                          return;
                      }*/
                    console.log('Hello', teamfoundationCollectionUri);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _d.sent();
                    tl.setResult(tl.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
run();
//# sourceMappingURL=index.js.map