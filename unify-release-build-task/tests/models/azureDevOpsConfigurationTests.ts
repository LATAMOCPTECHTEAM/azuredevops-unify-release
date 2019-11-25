//# Imports Default
import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { StubbedInstance, stubInterface as StubInterface } from "ts-sinon";

//# Imports
import AzureDevOpsConfiguration from "../../src/models/AzureDevOpsConfiguration";
import { IVariableManager } from "../../src/interfaces/types";

//# Tests
describe('AzureDevOpsConfiguration', () => {
    beforeEach(() => {
    })

    describe('constructor', () => {
        it('Should get variables from variable manager', async () => {
            let variableManagerStub: StubbedInstance<IVariableManager> = StubInterface<IVariableManager>();
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
            variableManagerStub.getVariable.withArgs("BUILD_BUILDID").returns("1");

            var azureDevOpsConfiguration = new AzureDevOpsConfiguration(variableManagerStub);

            expect(azureDevOpsConfiguration.releaseTag).equal("releaseTag");
            expect(azureDevOpsConfiguration.definition1).equal("definition1");
            expect(azureDevOpsConfiguration.definition2).equal("definition2");
            expect(azureDevOpsConfiguration.definition3).equal("definition3");
            expect(azureDevOpsConfiguration.definition4).equal("definition4");
            expect(azureDevOpsConfiguration.definition5).equal("definition5");
            expect(azureDevOpsConfiguration.releaseTag).equal("releaseTag");
            expect(azureDevOpsConfiguration.waitForAllTriggeredBuilds).equal(true);
            expect(azureDevOpsConfiguration.releaseOnCancel).equal(true);
            expect(azureDevOpsConfiguration.releaseOnError).equal(true);
            expect(azureDevOpsConfiguration.teamFoundationCollectionUri).equal("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI");
            expect(azureDevOpsConfiguration.teamFoundationProject).equal("SYSTEM_TEAMPROJECT");
            expect(azureDevOpsConfiguration.accessToken).equal("SYSTEM_ACCESSTOKEN");
            expect(azureDevOpsConfiguration.currentBuildId).equal(1);
        });
    });
});