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
    var configStub: IAzureDevOpsConfiguration = null;
    beforeEach(() => {
        configStub = {
            teamFoundationCollectionUri: "organizationUrl",
            teamFoundationProject: "project",
            accessToken: "token",
            waitForAllTriggeredBuilds: true,
            currentBuildId: 1,
            releaseTag: "releaseTag",
            definition1: "1",
            definition2: "2",
            definition3: "3",
            definition4: "4",
            definition5: "5",
            releaseOnCancel: false,
            releaseOnError: false
        }
    })

    describe('unifyRelease', () => {
        var buildServiceStub: StubbedInstance<IBuildService> = null
        beforeEach(() => {
            buildServiceStub = StubInterface<IBuildService>();
        })

        function setBuildServiceStubs(relatedBuilds: Build[]) {
            let triggeredBuild: Build = {
                id: 1,
                definition: {
                    id: 1,
                },
                status: BuildStatus.InProgress,
                sourceVersion: "sourceVersion"
            };
            var relatedBuildsStub = new Map<string, Build>();
            relatedBuildsStub.set(triggeredBuild.definition.id.toString(), triggeredBuild);
            relatedBuilds.forEach(build => {
                relatedBuildsStub.set(build.definition.id.toString(), build);
            });

            buildServiceStub.getBuildInfo
                .withArgs(
                    configStub.teamFoundationCollectionUri, configStub.accessToken, configStub.teamFoundationProject, configStub.currentBuildId)
                .returns(Promise.resolve(triggeredBuild));

            buildServiceStub.listRelatedBuilds
                .withArgs(
                    configStub.teamFoundationCollectionUri, configStub.accessToken, configStub.teamFoundationProject, "sourceVersion", configStub.waitForAllTriggeredBuilds, [configStub.definition1, configStub.definition2, configStub.definition3, configStub.definition4, configStub.definition5])
                .returns(Promise.resolve(relatedBuildsStub));
        }

        it("Should create tag if all last related builds are Completed and Succeeded or Partially Suceeded", async () => {

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

            setBuildServiceStubs([build2, build3]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(true);
        });

        it("Should create tag if there's a last Build Cancelling and with flag release on cancel on", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                status: BuildStatus.Cancelling,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            configStub.releaseOnCancel = true;
            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(true);
        });

        it("Should not create tag if there's a last Build Cancelling and with flag release on cancel off", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                status: BuildStatus.Cancelling,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            configStub.releaseOnCancel = false;
            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(false);
        });

        it("Should create tag if there's a last Build Cancelled and with flag release on cancel on", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                result: BuildResult.Canceled,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            configStub.releaseOnCancel = true;
            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(true);
        });

        it("Should not create tag if there's a last Build Cancelled and with flag release on cancel off", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                result: BuildResult.Canceled,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            configStub.releaseOnCancel = false;
            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(false);
        });

        it("Should create tag if there's a last Build failed and with flag release on failure on", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                result: BuildResult.Failed,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            configStub.releaseOnError = true;
            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(true);
        });

        it("Should not create tag if there's a last Build failed and with flag release on failure off", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                result: BuildResult.Failed,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            configStub.releaseOnError = false;
            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(false);
        });


        it("Should not create tag if there's a last Build with Status NotStarted", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                status: BuildStatus.NotStarted,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(false);
        });

        it("Should not create tag if there's a last Build with Status InProgress", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                status: BuildStatus.InProgress,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(false);
        });

        it("Should not create tag if there's a last Build with Status PostPoned", async () => {
            let build2: Build = {
                id: 2,
                definition: {
                    id: 2,
                },
                status: BuildStatus.Postponed,
                sourceVersion: "sourceVersion"
            };

            setBuildServiceStubs([build2]);

            let buildServiceCreateTagSpy = buildServiceStub.addBuildTag
                .withArgs(configStub.teamFoundationCollectionUri, configStub.teamFoundationProject, configStub.accessToken, configStub.currentBuildId, configStub.releaseTag);

            var unifyReleaseService = new UnifyReleaseService(buildServiceStub, configStub);

            await unifyReleaseService.unifyRelease();

            expect(buildServiceCreateTagSpy.calledOnce).equal(false);
        });
    });
});