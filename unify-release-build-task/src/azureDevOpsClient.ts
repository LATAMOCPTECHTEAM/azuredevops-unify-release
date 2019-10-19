import * as azdev from "azure-devops-node-api";
import * as ba from "azure-devops-node-api/BuildApi";
import { Build, BuildStatus, BuildResult } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { stringify } from "querystring";

export default class AzureDevOpsClient {

    private orgUrl: string;
    private token: string;

    constructor(orgUrl: string, token: string) {
        this.orgUrl = orgUrl;
        this.token = token;
    }

    public async getBuildInfo(project: string, buildId: number): Promise<Build> {
        let authHandler = azdev.getPersonalAccessTokenHandler(this.token);
        let connection = new azdev.WebApi(this.orgUrl, authHandler);

        let build: ba.IBuildApi = await connection.getBuildApi();

        return build.getBuild(project, buildId)

    }

    public async listRelatedBuilds(project: string, sourceVersion: string): Promise<Map<string, Build>> {
        let authHandler = azdev.getPersonalAccessTokenHandler(this.token);
        let connection = new azdev.WebApi(this.orgUrl, authHandler);

        let build: ba.IBuildApi = await connection.getBuildApi();

        let allBuilds = await build.getBuilds(project, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        let relatedBuilds = allBuilds
            .filter(build => build.sourceVersion == sourceVersion)
            .sort((a, b) => b.queueTime.getDate() - a.queueTime.getDate());

        // Only the last Build Run for each definition is considered
        let lastDefinitions = new Map<string, Build>();
        let allBuildDefinitions = new Map<string,Build>();

        for (var relatedBuild of relatedBuilds) {
            allBuildDefinitions.set(relatedBuild.definition.id.toString(), relatedBuild);

            if (lastDefinitions.has(relatedBuild.definition.id.toString())) {
                continue;
            } else {
                lastDefinitions.set(relatedBuild.definition.id.toString(), relatedBuild);
                console.log(lastDefinitions)
            }
        }


        return lastDefinitions;
    }

    public async addBuildTag(project: string, buildId: number, tag: string) {
        let authHandler = azdev.getPersonalAccessTokenHandler(this.token);
        let connection = new azdev.WebApi(this.orgUrl, authHandler);

        let build: ba.IBuildApi = await connection.getBuildApi();

        return build.addBuildTag(project, buildId, tag);
    }
}