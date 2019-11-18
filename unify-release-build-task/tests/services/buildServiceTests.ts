//# Imports Default
import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { stubObject as Stub, StubbedInstance, stubInterface } from "ts-sinon";

//# Imports
import AzureDevOpsClientWrapper from "../../src/azureDevOpsClientWrapper";
import { Build, BuildStatus, BuildResult } from "azure-devops-node-api/interfaces/BuildInterfaces";
import AzureDevOpsClient from "../../src/buildService";

//# Tests
describe('AzureDevOpsBuildService', () => {
    let azureDevOpsClientWrapperStub: StubbedInstance<AzureDevOpsClientWrapper>;
    beforeEach(() => {
        azureDevOpsClientWrapperStub = Stub<AzureDevOpsClientWrapper>(new AzureDevOpsClientWrapper());
    })

    describe('getBuildInfo', () => {
        it('Should call the API and return the Build Info', async () => {
            var buildStub: Build = {}

            azureDevOpsClientWrapperStub.getBuild.withArgs("organizationUrl", "token", "project", 0).returns(Promise.resolve(buildStub))

            let azureDevOpsClient = new AzureDevOpsClient(azureDevOpsClientWrapperStub)

            var build = await azureDevOpsClient.getBuildInfo("organizationUrl", "token", "project", 0);

            expect(build).equal(buildStub);
        });
    });

    describe('getRelatedBuilds', () => {
        it("Should return last Build from definitions triggered from the same Source Version", async () => {
            let build1Definition0: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(1); return date; })(),
                definition: {
                    id: 0,
                },
                sourceVersion: "sourceVersion"
            };

            let build2Definition0: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(2); return date; })(),
                definition: {
                    id: 0,
                },
                sourceVersion: "sourceVersion"
            };

            let build1Definition1: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(1); return date; })(),
                definition: {
                    id: 1,
                },
                sourceVersion: "sourceVersion"
            }

            let build2Definition1: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(2); return date; })(),
                definition: {
                    id: 1,
                },
                sourceVersion: "sourceVersion"
            }

            let build1Definition2: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(1); return date; })(),
                definition: {
                    id: 2,
                },
                sourceVersion: "otherSource"
            }

            var buildStubs: Build[] = [build1Definition0, build2Definition0, build1Definition1, build2Definition1, build1Definition2];
            azureDevOpsClientWrapperStub.getBuilds.withArgs("organizationUrl", "token", "project", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null).returns(Promise.resolve(buildStubs))

            let azureDevOpsClient = new AzureDevOpsClient(azureDevOpsClientWrapperStub);

            var relatedBuilds = await azureDevOpsClient.listRelatedBuilds("organizationUrl", "token", "project", "sourceVersion", true, null);

            expect(relatedBuilds.get("0")).equal(build2Definition0);
            expect(relatedBuilds.get("1")).equal(build2Definition1);
            expect(relatedBuilds.size).equal(2);
        });

        it("Should return last Build from definitions triggered from the same Source Version only for the Build Definitons specified", async () => {
            let build1Definition0: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(1); return date; })(),
                definition: {
                    id: 0,
                },
                sourceVersion: "sourceVersion"
            };

            let build2Definition0: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(2); return date; })(),
                definition: {
                    id: 0,
                },
                sourceVersion: "sourceVersion"
            };

            let build1Definition1: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(1); return date; })(),
                definition: {
                    id: 1,
                },
                sourceVersion: "sourceVersion"
            }

            let build2Definition1: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(2); return date; })(),
                definition: {
                    id: 1,
                },
                sourceVersion: "sourceVersion"
            }

            let build1Definition2: Build = {
                queueTime: (() => { let date = new Date(); date.setDate(1); return date; })(),
                definition: {
                    id: 2,
                },
                sourceVersion: "otherSource"
            }

            var buildStubs: Build[] = [build1Definition0, build2Definition0, build1Definition1, build2Definition1, build1Definition2];
            azureDevOpsClientWrapperStub.getBuilds.withArgs("organizationUrl", "token", "project", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null).returns(Promise.resolve(buildStubs))

            let azureDevOpsClient = new AzureDevOpsClient(azureDevOpsClientWrapperStub)

            var relatedBuilds = await azureDevOpsClient.listRelatedBuilds("organizationUrl", "token", "project", "sourceVersion", false, ["0"]);

            expect(relatedBuilds.get("0")).equal(build2Definition0);
            expect(relatedBuilds.size).equal(1);
        });
    });

    describe('addBuildTag', () => {
        it('Should call the API to set build Tags', async () => {
            azureDevOpsClientWrapperStub.addBuildTag.withArgs("organizationUrl", "token", "project", 0, "create_release");

            let azureDevOpsClient = new AzureDevOpsClient(azureDevOpsClientWrapperStub);

            await azureDevOpsClient.addBuildTag("organizationUrl", "token", "project", 0, "create_release");
            expect(azureDevOpsClientWrapperStub.addBuildTag.calledOnce).to.true;
        });
    });
});