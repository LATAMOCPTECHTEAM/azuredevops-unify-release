//# Imports Default
import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { stubObject as Stub, StubbedInstance, stubInterface, stubObject } from "ts-sinon";

//# Imports
import VariableManager from "../../src/variableManager";
import AzureDevOpsConfiguration from "../../src/models/AzureDevOpsConfiguration";

//# Tests
describe('AzureDevOpsConfiguration', () => {
    beforeEach(() => {
    })

    describe('constructor', () => {
        it('Should get variables from variable manager', async () => {
            let variableManagerStub: StubbedInstance<VariableManager> = Stub(new VariableManager(null));
            variableManagerStub.getInput.withArgs('releaseTag', true).returns("releaseTag");
            variableManagerStub.getInput.withArgs('definition1', false).returns("definition1");
            variableManagerStub.getInput.withArgs('definition2', false).returns("definition2");
            variableManagerStub.getInput.withArgs('definition3', false).returns("definition3");
            variableManagerStub.getInput.withArgs('definition4', false).returns("definition4");
            variableManagerStub.getInput.withArgs('definition5', false).returns("definition5");
            variableManagerStub.getBooleanInput.withArgs('waitForAllBuilds', false).returns(true);
            variableManagerStub.getBooleanInput.withArgs('releaseOnCancel', true).returns(true);
            variableManagerStub.getBooleanInput.withArgs('releaseOnError', true).returns(true);
            variableManagerStub.getVariable.withArgs("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI").returns("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI");
            variableManagerStub.getVariable.withArgs("SYSTEM_TEAMPROJECT").returns("SYSTEM_TEAMPROJECT");
            variableManagerStub.getVariable.withArgs("SYSTEM_ACCESSTOKEN").returns("SYSTEM_ACCESSTOKEN");
            variableManagerStub.getVariable.withArgs("BUILD_BUILDID").returns("BUILD_BUILDID");

            var azureDevOpsConfiguration = new AzureDevOpsConfiguration(variableManagerStub);

            expect(azureDevOpsConfiguration.releaseTag).equal("releaseTag")
            expect(azureDevOpsConfiguration.definition1).equal("definition1")
            expect(azureDevOpsConfiguration.definition2).equal("definition2")
            expect(azureDevOpsConfiguration.definition3).equal("definition3")
            expect(azureDevOpsConfiguration.definition4).equal("definition4")
            expect(azureDevOpsConfiguration.definition5).equal("definition5")
            expect(azureDevOpsConfiguration.releaseTag).equal("releaseTag")

        });
    });
});