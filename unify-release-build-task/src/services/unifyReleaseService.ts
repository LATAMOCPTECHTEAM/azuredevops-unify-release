import { inject, injectable } from "tsyringe";
import { IUnifyReleaseService, IBuildService, IAzureDevOpsConfiguration } from "../interfaces/types";
import { BuildStatus, BuildResult } from "azure-devops-node-api/interfaces/BuildInterfaces";

@injectable()
export default class UnifyReleaseService implements IUnifyReleaseService {

    constructor(
        @inject("IBuildService") private buildService: IBuildService,
        @inject("IAzureDevOpsConfiguration") private configuration: IAzureDevOpsConfiguration) { };

    async unifyRelease() {
        var buildDetails = await this.buildService.getBuildInfo(this.configuration.teamFoundationCollectionUri, this.configuration.accessToken, this.configuration.teamFoundationProject, this.configuration.currentBuildId);

        console.log(`Processing Build ${buildDetails.id} (${buildDetails.definition.name}) from Source Version ${buildDetails.sourceVersion}`);
        console.log(`Task Parameters: 
            ReleaseTag: ${this.configuration.releaseTag}, 
            ReleaseOnCancel: ${this.configuration.releaseOnCancel}, 
            ReleaseOnError ${this.configuration.releaseOnError}
            WaitForAllDefinitions: ${this.configuration.waitForAllTriggeredBuilds}`);

        var relatedBuilds = await this.buildService.listRelatedBuilds(this.configuration.teamFoundationCollectionUri, this.configuration.accessToken,
            this.configuration.teamFoundationProject, buildDetails.sourceVersion,
            this.configuration.waitForAllTriggeredBuilds,
            [this.configuration.definition1, this.configuration.definition2, this.configuration.definition3, this.configuration.definition4, this.configuration.definition5]);

        let shouldCreateTag = true;
        for (let build of relatedBuilds.values()) {
            console.log(`Checking the last Build Run for Definition ${build.definition.name}`);
            console.log(`---> Build Id: ${build.id}. Build Status ${BuildStatus[build.status]}. Build Result ${BuildResult[build.result]}`)
            if (buildDetails.id == build.id) {
                console.log(`---> Build ${build.id} is the same of current build ${buildDetails.id}`)
                continue;
            }

            if (build.status == BuildStatus.Completed && (build.result == BuildResult.Succeeded || build.result == BuildResult.PartiallySucceeded)) {
                console.log(`Build Succeeded, continue.`)
                continue;
            }

            if (build.result == BuildResult.Canceled && !this.configuration.releaseOnCancel) {
                shouldCreateTag = false;
                break;
            }


            if (build.result == BuildResult.Failed && !this.configuration.releaseOnError) {
                shouldCreateTag = false;
                break;
            }
        }

        if (shouldCreateTag) {
            await this.buildService.addBuildTag(this.configuration.teamFoundationCollectionUri, this.configuration.teamFoundationProject, this.configuration.accessToken, this.configuration.currentBuildId, this.configuration.releaseTag);
            console.log(`No Concurrent Builds, Creating tag ${this.configuration.releaseTag}. Please remember to add this tag as a condition in your release pipeline trigger.`)
        }
    }

}