import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";
import IAzureDevOpsClientWrapper from "../helpers/azureDevOpsClientWrapper";
import { injectable, inject } from "tsyringe";
import { IBuildService } from "../interfaces/types";


@injectable()
export default class BuildService implements IBuildService {

    constructor(@inject("IAzureDevOpsClientWrapper") private azureDevOpsClient: IAzureDevOpsClientWrapper) {

    }

    public async getBuildInfo(organizationUrl: string, token: string, project: string, buildId: number): Promise<Build> {
        return await this.azureDevOpsClient.getBuild(organizationUrl, token, project, buildId);
    }

    public async listRelatedBuilds(organizationUrl: string, token: string, project: string, sourceVersion: string, waitForAllBuilds: Boolean = true, definitionFilters?: string[]): Promise<Map<string, Build>> {
        let allBuilds = await this.azureDevOpsClient.getBuilds(organizationUrl, token, project, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        var relatedBuilds = this.filterBuildsFromSameSourceVersion(allBuilds, sourceVersion);
        relatedBuilds = this.sortBuildsByQueueTimeDescending(relatedBuilds);

        if (!waitForAllBuilds) {
            relatedBuilds = this.filterBuildsByDefinition(relatedBuilds, definitionFilters);
        }

        // Only the last Build Run for each definition is considered
        let lastBuildsFromRelatedDefinitions = new Map<string, Build>();
        for (var relatedBuild of relatedBuilds) {
            if (lastBuildsFromRelatedDefinitions.has(relatedBuild.definition.id.toString())) {
                continue;
            }
            lastBuildsFromRelatedDefinitions.set(relatedBuild.definition.id.toString(), relatedBuild);
        }

        return lastBuildsFromRelatedDefinitions;
    }

    private filterBuildsByDefinition(builds: Build[], definitions?: string[]) {
        return builds.filter(x => definitions.some(definition => definition == x.definition.id.toString()));
    }

    private filterBuildsFromSameSourceVersion(builds: Build[], sourceVersion: string): Build[] {
        return builds.filter(build => build.sourceVersion == sourceVersion);
    }

    private sortBuildsByQueueTimeDescending(builds: Build[]): Build[] {
        return builds.sort((a, b) => b.queueTime.getDate() - a.queueTime.getDate());
    }

    public async addBuildTag(organizationUrl: string, project: string, token: string, buildId: number, tag: string) {
        return await await this.azureDevOpsClient.addBuildTag(organizationUrl, token, project, buildId, tag);
    }
}