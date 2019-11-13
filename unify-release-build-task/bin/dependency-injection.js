"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var tsyringe_1 = require("tsyringe");
var TaskLib = require("azure-pipelines-task-lib/task");
tsyringe_1.container.register("TaskLib", { useValue: TaskLib });
//# sourceMappingURL=dependency-injection.js.map