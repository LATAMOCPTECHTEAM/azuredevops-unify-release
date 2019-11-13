"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var path_1 = require("path");
var dotenv_1 = require("dotenv");
var tsyringe_1 = require("tsyringe");
dotenv_1.config({ path: path_1.resolve(__dirname, "../.env") });
var VariableManager = /** @class */ (function () {
    function VariableManager(taskLib) {
        this.taskLib = taskLib;
    }
    VariableManager.prototype.getInput = function (key, required) {
        if (process.env.NODE_ENV == "development") {
            if (required && !process.env[key]) {
                throw new Error("Required Parameter " + key + " not supplied.");
            }
            return process.env[key];
        }
        else {
            return this.taskLib.getInput(key, required);
        }
    };
    VariableManager.prototype.getBooleanInput = function (key, required) {
        var value = this.getInput(key, required);
        return value == "true" ? true : false;
    };
    VariableManager.prototype.getVariable = function (key) {
        if (process.env.NODE_ENV == "development") {
            return process.env[key];
        }
        else {
            return tl.getVariable(key);
        }
    };
    VariableManager = __decorate([
        tsyringe_1.injectable(),
        __param(0, tsyringe_1.inject("TaskLib")),
        __metadata("design:paramtypes", [Object])
    ], VariableManager);
    return VariableManager;
}());
exports.default = VariableManager;
//# sourceMappingURL=variableManager.js.map