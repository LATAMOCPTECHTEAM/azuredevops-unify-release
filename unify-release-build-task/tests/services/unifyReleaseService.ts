//# Imports Default
import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { StubbedInstance, stubInterface as StubInterface } from "ts-sinon";

//# Imports
import { IAzureDevOpsConfiguration, IBuildService } from "../../src/interfaces/types";
import { Build, BuildStatus, BuildResult } from "azure-devops-node-api/interfaces/BuildInterfaces";
import UnifyReleaseService from "../../src/services/unifyReleaseService";

//# Tests
describe('UnifyReleaseService', () => {
    var configStub: StubbedInstance<IAzureDevOpsConfiguration> = null;
    beforeEach(() => {
        configStub = StubInterface<IAzureDevOpsConfiguration>();
        configStub.teamFoundationCollectionUri = "organizationUrl";
        configStub.teamFoundationProject = "project";
        configStub.accessToken = "token";
        configStub.waitForAllTriggeredBuilds = true;
        configStub.currentBuildId = 1;
        configStub.releaseTag = "releaseTag";
        configStub.definition1 = "1";
        configStub.definition2 = "2";
        configStub.definition3 = "3";
        configStub.definition4 = "4";
        configStub.definition5 = "5";
    })

    describe('unifyRelease', () => {
        const buildId = 1;
        it("Should create tag if all last related builds are Completed and Succeeded or Partially Suceeded", async () => {
            let triggeredBuild: Build = {
                id: 1,
                definition: {
                    id: 1,
                },
                status: BuildStatus.InProgress,
                sourceVersion: "sourceVersion"
            };
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                status: BuildStatus.Completed,
                result: BuildResult.Succeeded,
                sourceVersion: "sourceVersion"
            };
            let build3: Build = {
                id: 3,
                definition: {
                    id: 3,
                },
                status: BuildStatus.Completed,
                result: BuildResult.PartiallySucceeded,
                sourceVersion: "sourceVersion"
            };
            var relatedBuildsStub = new Map<string, Build>();
            relatedBuildsStub.set(triggeredBuild.definition.id.toString(), triggeredBuild);
            relatedBuildsStub.set(build2.definition.id.toString(), build2);
            relatedBuildsStub.set(build3.definition.id.toString(), build3);

            let buildServiceStub: StubbedInstance<IBuildService> = StubInterface<IBuildService>();

            buildServiceStub.getBuildInfo
                .withArgs(
                    configStub.teamFoundationCollectionUri, configStub.accessToken, configStub.teamFoundationProject, configStub.currentBuildId)
                .returns(Promise.resolve(triggeredBuild));

            buildServiceStub.listRelatedBuilds
                .withArgs(
                    configStub.teamFoundationCollectionUri, configStub.accessToken, configStub.teamFoundationProject, "sourceVersion", configStub.waitForAllTriggeredBuilds, [configStub.definition1, configStub.definition2, configStub.definition3, configStub.definition4, configStub.definition5])
                .returns(Promise.resolve(relatedBuildsStub));

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            debugger;
            expect(buildServiceCreateTagSpy.calledOnce).equal(true);


            //    throw new Error("Not Implemented");

        });

        it("Should return last Build from definitions triggered from the same Source Version only for the Build Definitons specified", async () => {

        });
    });
});