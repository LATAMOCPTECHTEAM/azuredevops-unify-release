import { inject } from "tsyringe";
import BuildService from "../services/buildService";
import AzureDevopsConfiguration from "../models/AzureDevOpsConfiguration";

export default class UnifyReleaseService {

    constructor(@inject(BuildService) private buildService: BuildService, @inject(AzureDevopsConfiguration) private configuration: AzureDevopsConfiguration) {

    }

    async unifyRelease() {
        var buildDetails = await this.buildService.getBuildInfo(this.configuration.teamFoundationCollectionUri, this.configuration.accessToken, this.configuration.teamFoundationProject, this.configuration.currentBuildId);

        console.log(`Processing Build ${buildDetails.id} (${buildDetails.definition.name}) from Source Version ${buildDetails.sourceVersion}`);
        console.log(`Task Parameters: 
            ReleaseTag: ${this.configuration.releaseTag}, 
            ReleaseOnCancel: ${this.configuration.releaseOnCancel}, 
            ReleaseOnError ${this.configuration.releaseOnError}
            WaitForAllDefinitions: ${this.configuration.waitForAllTriggeredBuilds}`);


    }

}