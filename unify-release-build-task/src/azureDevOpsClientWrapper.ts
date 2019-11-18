import * as azdev from "azure-devops-node-api";
import { IBuildApi } from "azure-devops-node-api/BuildApi";
import { BuildReason, BuildStatus, BuildResult, BuildQueryOrder, QueryDeletedOption, Build } from "azure-devops-node-api/interfaces/BuildInterfaces"
import { injectable, inject } from "tsyringe";

@injectable()
export default class AzureDevOpsWrapper {
    constructor() { }

    async getBuildApi(organizationUrl: string, token: string): Promise<IBuildApi> {
        let authHandler = azdev.getPersonalAccessTokenHandler(token);
        let connection = new azdev.WebApi(organizationUrl, authHandler);
        return await connection.getBuildApi();
    }

    async getBuild(organizationUrl: string, token: string, project: string, buildId: number) {
        let buildApi = await this.getBuildApi(organizationUrl, token);
        return buildApi.getBuild(project, buildId);
    }

    async getBuilds(organizationUrl: string, token: string, project: string, definitions?: number[], queues?: number[], buildNumber?: string, minTime?: Date, maxTime?: Date, requestedFor?: string, reasonFilter?: BuildReason, statusFilter?: BuildStatus, resultFilter?: BuildResult, tagFilters?: string[], properties?: string[], top?: number, continuationToken?: string, maxBuildsPerDefinition?: number, deletedFilter?: QueryDeletedOption, queryOrder?: BuildQueryOrder, branchName?: string, buildIds?: number[], repositoryId?: string, repositoryType?: string): Promise<Build[]> {
        let buildApi = await this.getBuildApi(organizationUrl, token);
        return buildApi.getBuilds(project, definitions, queues, buildNumber, minTime, maxTime, requestedFor, reasonFilter, statusFilter, resultFilter, tagFilters, properties, top, continuationToken, maxBuildsPerDefinition, deletedFilter, queryOrder, branchName, buildIds, repositoryId, repositoryType);
    }

    async addBuildTag(organizationUrl: string, token: string, project: string, buildId: number, tag: string) {
        let buildApi = await this.getBuildApi(organizationUrl, token);
        return buildApi.addBuildTag(project, buildId, tag)
    }
}