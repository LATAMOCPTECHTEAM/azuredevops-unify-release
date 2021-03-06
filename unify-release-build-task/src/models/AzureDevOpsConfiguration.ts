import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { IAzureDevOpsConfiguration, IVariableManager } from "../interfaces/types";

@injectable()
export default class AzureDevOpsConfiguration implements IAzureDevOpsConfiguration {
    public releaseTag: string;
    public waitForAllTriggeredBuilds: boolean;
    public definition1: string;
    public definition2: string;
    public definition3: string;
    public definition4: string;
    public definition5: string;
    public releaseOnCancel: boolean;
    public releaseOnError: boolean;
    public teamFoundationCollectionUri: string;
    public teamFoundationProject: string;
    public accessToken: string;
    public currentBuildId: number;

    constructor(@inject("IVariableManager") private variableManager: IVariableManager) {
        this.releaseTag = variableManager.getInput('releaseTag', true)!;
        this.waitForAllTriggeredBuilds = variableManager.getBooleanInput('waitForAllBuilds', false)!;
        this.definition1 = variableManager.getInput('definition1', false)!;
        this.definition2 = variableManager.getInput('definition2', false)!;
        this.definition3 = variableManager.getInput('definition3', false)!;
        this.definition4 = variableManager.getInput('definition4', false)!;
        this.definition5 = variableManager.getInput('definition5', false)!;
        this.releaseOnCancel = variableManager.getBooleanInput('releaseOnCancel', true)!;
        this.releaseOnError = variableManager.getBooleanInput('releaseOnError', true)!;
        this.teamFoundationCollectionUri = variableManager.getVariable("System.TeamFoundationCollectionUri")!;
        this.teamFoundationProject = variableManager.getVariable("System.TeamProject")!;
        this.accessToken = variableManager.getVariable("System.AccessToken")!;
        this.currentBuildId = parseInt(variableManager.getVariable("Build.BuildId")!);
    }
}