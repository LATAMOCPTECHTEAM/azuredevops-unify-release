import { IBuildApi } from "azure-devops-node-api/BuildApi";
import { BuildReason, BuildStatus, BuildResult, QueryDeletedOption, BuildQueryOrder, Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

// Models
export interface IAzureDevOpsConfiguration {
    releaseTag: string;
    waitForAllTriggeredBuilds: boolean;
    definition1: string;
    definition2: string;
    definition3: string;
    definition4: string;
    definition5: string;
    releaseOnCancel: boolean;
    releaseOnError: boolean;
    teamFoundationCollectionUri: string;
    teamFoundationProject: string;
    accessToken: string;
    currentBuildId: number;
}

// Services
export interface IBuildService {

    getBuildInfo(organizationUrl: string, token: string, project: string, buildId: number): Promise<Build>;

    listRelatedBuilds(organizationUrl: string, token: string, project: string, sourceVersion: string, waitForAllBuilds: Boolean, definitionFilters?: string[]): Promise<Map<string, Build>>;

    addBuildTag(organizationUrl: string, project: string, token: string, buildId: number, tag: string);

}

export interface IUnifyReleaseService {
    unifyRelease(): void;
}

// Helpers
export interface IAzureDevOpsWrapper {
    getBuildApi(organizationUrl: string, token: string): Promise<IBuildApi>;

    getBuild(organizationUrl: string, token: string, project: string, buildId: number);

    getBuilds(organizationUrl: string, token: string, project: string, definitions?: number[],
        queues?: number[], buildNumber?: string, minTime?: Date, maxTime?: Date,
        requestedFor?: string, reasonFilter?: BuildReason, statusFilter?: BuildStatus,
        resultFilter?: BuildResult, tagFilters?: string[], properties?: string[],
        top?: number, continuationToken?: string, maxBuildsPerDefinition?: number,
        deletedFilter?: QueryDeletedOption, queryOrder?: BuildQueryOrder,
        branchName?: string, buildIds?: number[], repositoryId?: string,
        repositoryType?: string): Promise<Build[]>;

    addBuildTag(organizationUrl: string, token: string, project: string, buildId: number, tag: string);
}

export interface IVariableManager {
    getInput(key: string, required: boolean): string | undefined;
    getBooleanInput(key: string, required: boolean): boolean | undefined;
    getVariable(key: string): string | undefined;
}
