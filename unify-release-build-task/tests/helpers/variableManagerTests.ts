import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { stubObject } from "ts-sinon";
import VariableManager from "../../src/variableManager";
import * as TaskLib from "azure-pipelines-task-lib/task";

describe('Variable Manager', () => {
    describe('Development Mode', () => {
        var taskLibMock = null;
        beforeEach(() => {
            process.env.NODE_ENV = "development";
            delete process.env.key;
            delete process.env.boolean;
            taskLibMock = stubObject(TaskLib);
        })
        describe("getInput", () => {
            it('should return environment input', () => {
                process.env.key = "value";
                var variableManager = new VariableManager(taskLibMock);
                let value = variableManager.getInput("key", true);
                expect(value).to.equal("value");
            });
            it('should return null when input is not found and not required', () => {
                var variableManager = new VariableManager(taskLibMock);
                let value = variableManager.getInput("key", false);
                expect(value).to.equal(undefined);
            });
            it('should throw error when input is not found and required', (done) => {
                var variableManager = new VariableManager(taskLibMock);
                expect(() => {
                    variableManager.getInput("key-not-found", true)
                }).to.throw(`Required Parameter key-not-found not supplied.`);
                done();
            });
        });
        
        describe("getVariable", () => {
            it('should return environment variable', () => {
                process.env.key = "value";
                var variableManager = new VariableManager(taskLibMock);
                let value = variableManager.getVariable("key");
                expect(value).to.equal("value");
            });
            it('should return undefined when variable is not found', () => {
                var variableManager = new VariableManager(taskLibMock);
                let value = variableManager.getVariable("getVariable");
                expect(value).to.equal(undefined);
            });
        })
        describe("getBooleanInput", () => {
            it('should return environment input', () => {
                process.env.boolean = "true";
                var variableManager = new VariableManager(taskLibMock);
                let value = variableManager.getBooleanInput("boolean", true);
                expect(value).to.equal(true);
            });
            it('should return false when input is not found and not required', () => {
                var variableManager = new VariableManager(taskLibMock);
                let value = variableManager.getBooleanInput("boolean", false);
                expect(value).to.equal(false);
            });
            it('should throw error when input is not found and required', (done) => {
                var variableManager = new VariableManager(taskLibMock);
                expect(() => {
                    variableManager.getBooleanInput("boolean", true)
                }).to.throw(`Required Parameter boolean not supplied.`);
                done();
            });
        });
    });

    describe('Production Mode', () => {
        var taskLibMock = null;
        beforeEach(() => {
            process.env.NODE_ENV = "production"
            taskLibMock = stubObject(TaskLib);
        })

        describe('getInput', () => {
            it('should return a TaskLib input', () => {
                taskLibMock.getInput.withArgs("key", true).returns("value");

                var variableManager = new VariableManager(taskLibMock);
                var resultInput = variableManager.getInput("key", true);

                expect(resultInput).to.equal("value");
            });
        });

        describe('getVariable', () => {
            it('should return a TaskLib variable', () => {
                taskLibMock.getVariable.withArgs("key").returns("value");

                var variableManager = new VariableManager(taskLibMock);
                var resultInput = variableManager.getVariable("key");

                expect(resultInput).to.equal("value");
            });
        });
    });
});