import { resolve } from "path"
import { config } from "dotenv"
import { singleton, injectable, inject } from "tsyringe";
import { IVariableManager } from "../interfaces/types";

config({ path: resolve(__dirname, "../.env") })



@singleton()
export default class VariableManager implements IVariableManager {
    constructor(@inject("TaskLib") private taskLib: any) {
    }

    getInput(key: string, required: boolean): string | undefined {
        if (process.env.NODE_ENV == "development") {
            if (required && !process.env[key]) {
                throw new Error(`Required Parameter ${key} not supplied.`)
            }
            return process.env[key];
        } else {
            return this.taskLib.getInput(key, required)!;
        }
    }

    getBooleanInput(key: string, required: boolean): boolean | undefined {
        let value = this.getInput(key, required);
        return value == "true" ? true : false;
    }

    getVariable(key: string): string | undefined {
        if (process.env.NODE_ENV == "development") {
            return process.env[key];
        } else {
            return this.taskLib.getVariable(key)!;
        }
    }
}