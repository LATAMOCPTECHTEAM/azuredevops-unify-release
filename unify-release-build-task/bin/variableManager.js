"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var path_1 = require("path");
var dotenv_1 = require("dotenv");
dotenv_1.config({ path: path_1.resolve(__dirname, "../.env") });
var VariableManager = /** @class */ (function () {
    function VariableManager() {
    }
    VariableManager.prototype.getInput = function (key, required) {
        if (process.env.NODE_ENV = "development") {
            if (required && !process.env[key]) {
                throw new Error("Required Parameter " + key + " not supplied.");
            }
            return process.env[key];
        }
        else {
            var value = tl.getInput(key, required);
            return value;
        }
    };
    VariableManager.prototype.getBooleanInput = function (key, required) {
        var value = this.getInput(key, required);
        return value == "true" ? true : false;
    };
    VariableManager.prototype.getVariable = function (key) {
        if (process.env.NODE_ENV = "development") {
            return process.env[key];
        }
        else {
            var value = tl.getVariable(key);
            return value;
        }
    };
    return VariableManager;
}());
exports.default = VariableManager;
var variableManager = new VariableManager();
exports.variableManager = variableManager;
//# sourceMappingURL=variableManager.js.map