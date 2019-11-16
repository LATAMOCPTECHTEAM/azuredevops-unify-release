import * as azdev from "azure-devops-node-api";
import * as ba from "azure-devops-node-api/BuildApi";
import { Build, BuildStatus, BuildResult } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { stringify } from "querystring";
import { IBuildApi } from "azure-devops-node-api/BuildApi";
import AzureDevOpsClientWrapper from "./azureDevOpsClientWrapper";
import { injectable, inject } from "tsyringe";

@injectable()
export default class AzureDevOpsClient {

    private orgUrl: string;
    private token: string;

    constructor(@inject(AzureDevOpsClientWrapper) private azureDevOpsClient: AzureDevOpsClientWrapper) {

    }

    public async getBuildInfo(organizationUrl: string, token: string, project: string, buildId: number): Promise<Build> {
        return await this.azureDevOpsClient.getBuild(organizationUrl, token, project, buildId);
    }

    public async listRelatedBuilds(organizationUrl: string, token: string, project: string, sourceVersion: string, waitForAllBuilds: Boolean = true, definitionFilters?: string[]): Promise<Map<string, Build>> {
        let allBuilds = await this.azureDevOpsClient.getBuilds(organizationUrl, token, project, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        let relatedBuilds = allBuilds
            .filter(build => build.sourceVersion == sourceVersion)
            .sort((a, b) => b.queueTime.getDate() - a.queueTime.getDate());

        if (!waitForAllBuilds) {
            relatedBuilds = relatedBuilds.filter(x => definitionFilters.some(definition => definition == x.definition.id.toString()))
        }

        // Only the last Build Run for each definition is considered
        let lastDefinitions = new Map<string, Build>();
        for (var relatedBuild of relatedBuilds) {
            if (lastDefinitions.has(relatedBuild.definition.id.toString())) {
                continue;
            } else {
                lastDefinitions.set(relatedBuild.definition.id.toString(), relatedBuild);
            }
        }

        return lastDefinitions;
    }

    public async addBuildTag(organizationUrl: string, token: string, project: string, buildId: number, tag: string) {
        return await await this.azureDevOpsClient.addBuildTag(organizationUrl, token, project, buildId, tag);
    }
}