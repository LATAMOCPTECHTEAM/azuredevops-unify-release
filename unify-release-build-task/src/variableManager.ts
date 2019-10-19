import tl = require('azure-pipelines-task-lib/task');
import { resolve } from "path"
import { config } from "dotenv"

config({ path: resolve(__dirname, "../.env") })
export default class VariableManager {

    getInput(key: string, required: boolean): string | undefined {
        if (process.env.NODE_ENV = "development") {
            if (required && !process.env[key]) {
                throw new Error(`Required Parameter ${key} not supplied.`)
            }
            return process.env[key];

        } else {
            const value: string = tl.getInput(key, required)!;
            return value;
        }
    }

    getBooleanInput(key: string, required: boolean): boolean | undefined {
        let value = this.getInput(key, required);

        return value == "true" ? true : false;
    }

    getVariable(key: string): string | undefined {
        if (process.env.NODE_ENV = "development") {
            return process.env[key];
        } else {
            const value: string = tl.getVariable(key)!;
            return value;
        }
    }
}
var variableManager = new VariableManager();
export { variableManager };