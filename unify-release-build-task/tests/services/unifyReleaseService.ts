//# Imports Default
import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { stubObject as Stub, StubbedInstance, stubInterface } from "ts-sinon";

//# Imports
import AzureDevOpsClientWrapper from "../../src/helpers/azureDevOpsClientWrapper";
import { Build, BuildStatus, BuildResult } from "azure-devops-node-api/interfaces/BuildInterfaces";
import AzureDevOpsClient from "../../src/services/buildService";
import BuildService from "../../src/services/buildService";

//# Tests
describe('UnifyReleaseService', () => {
    const organizationUrl = "organizationUrl";
    const token = "token";
    const project = "project";

    beforeEach(() => {
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

            let buildServiceStub: StubbedInstance<BuildService> = Stub(new BuildService(null));

            buildServiceStub.getBuildInfo.withArgs(organizationUrl, token, project, buildId).returns(Promise.resolve(triggeredBuild));
            buildServiceStub.listRelatedBuilds.withArgs(organizationUrl, token, project, "sourceVersion", true, ["1", "2", "3", "4", "5"]).returns(Promise.resolve(relatedBuildsStub));

            throw new Error("Not Implemented");

        });

        it("Should return last Build from definitions triggered from the same Source Version only for the Build Definitons specified", async () => {

        });
    });
});