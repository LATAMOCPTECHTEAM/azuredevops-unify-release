import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { stubObject } from "ts-sinon";
import VariableManager from "../src/variableManager";
import { container } from "tsyringe";
import * as TaskLib from "azure-pipelines-task-lib/task";

describe('Variable Manager', () => {
    beforeEach(() => {
        container.reset();
    })
    describe('Development Mode', () => {
        beforeEach(() => {
            process.env.NODE_ENV = "development";
            delete process.env.key;
            const taskLibMock = stubObject(TaskLib);
            container.register("TaskLib", { useValue: taskLibMock });
        })
        describe("getInput", () => {
            it('should return environment input', () => {
                process.env.key = "value";
                var variableManager = container.resolve(VariableManager);
                let value = variableManager.getInput("key", true);
                expect(value).to.equal("value");
            });
            it('should return null when input is not found and not required', () => {
                var variableManager = container.resolve(VariableManager);
                let value = variableManager.getInput("key", false);
                expect(value).to.equal(undefined);
            });
            it('should return undefined when input is not found and required', (done) => {
                var variableManager = container.resolve(VariableManager);
                expect(() => {
                    variableManager.getInput("key-not-found", true)
                }).to.throw(`Required Parameter key-not-found not supplied.`);
                done();
            });
        });
        describe("getVariable", () => {
            it('should return environment variable', () => {
                process.env.key = "value";
                var variableManager = container.resolve(VariableManager);
                let value = variableManager.getVariable("key");
                expect(value).to.equal("value");
            });
            it('should return undefined when variable is not found', () => {
                var variableManager = container.resolve(VariableManager);
                let value = variableManager.getVariable("getVariable");
                expect(value).to.equal(undefined);
            });
        })
    });

    describe('Production Mode', () => {
        var taskLibMock = null;
        beforeEach(() => {
            process.env.NODE_ENV = "production"
            taskLibMock = taskLibMock = stubObject(TaskLib);
            container.register("TaskLib", { useValue: taskLibMock });
        })

        describe('getInput', () => {
            it('should return a TaskLib input', () => {
                taskLibMock.getInput.withArgs("key", true).returns("value");

                var variableManager = container.resolve(VariableManager);
                var resultInput = variableManager.getInput("key", true);

                expect(resultInput).to.equal("value");
            });
        });

        describe('getVariable', () => {
            it('should return a TaskLib variable', () => {
                taskLibMock.getVariable.withArgs("key").returns("value");

                var variableManager = container.resolve(VariableManager);
                var resultInput = variableManager.getVariable("key");

                expect(resultInput).to.equal("value");
            });
        });


    });
});