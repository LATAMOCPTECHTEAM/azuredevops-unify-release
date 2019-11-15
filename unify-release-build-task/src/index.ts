import "reflect-metadata";
import tl = require('azure-pipelines-task-lib/task');
import * as request from "request-promise";
import VariableManager from "./variableManager";
import AzureDevOpsClient from "./azureDevOpsClient";
import { BuildResult, BuildStatus } from 'azure-devops-node-api/interfaces/BuildInterfaces';
import {container} from "tsyringe";

async function run() {
    try {
        console.log("hel")
        const variableManager = container.resolve(VariableManager);
        const releaseTag: string = variableManager.getInput('releaseTag', true)!;
        const waitForAllTriggeredBuilds: boolean = variableManager.getBooleanInput('waitForAllBuilds', false)!;
        const definition1: string = variableManager.getInput('definition1', false)!;
        const definition2: string = variableManager.getInput('definition2', false)!;
        const definition3: string = variableManager.getInput('definition3', false)!;
        const definition4: string = variableManager.getInput('definition4', false)!;
        const definition5: string = variableManager.getInput('definition5', false)!;
        const releaseOnCancel: boolean = variableManager.getBooleanInput('releaseOnCancel', true)!;
        const releaseOnError: boolean = variableManager.getBooleanInput('releaseOnError', true)!;
        const teamfoundationCollectionUri: string = variableManager.getVariable("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI")!;
        const teamfoundationProject: string = variableManager.getVariable("SYSTEM_TEAMPROJECT")!;
        const accessToken: string = variableManager.getVariable("SYSTEM_ACCESSTOKEN")!;
        const currentBuildId: string = variableManager.getVariable("BUILD_BUILDID")!;

        var devOpsClient = new AzureDevOpsClient(teamfoundationCollectionUri, accessToken);

        var buildDetails = await devOpsClient.getBuildInfo(teamfoundationProject, parseInt(currentBuildId));



        console.log(`Task Parameters: ReleaseTag: ${releaseTag}, ReleaseOnCancel: ${releaseOnCancel}, ReleaseOnError ${releaseOnError}`)
        console.log(`Processing Build ${buildDetails.id} from Source Version ${buildDetails.sourceVersion}`);

        var relatedBuilds = await devOpsClient.listRelatedBuilds(teamfoundationProject, buildDetails.sourceVersion, waitForAllTriggeredBuilds, [definition1, definition2, definition3, definition4, definition5]);



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

            if (build.result == BuildResult.Canceled && !releaseOnCancel) {
                shouldCreateTag = false;
                break;
            }


            if (build.result == BuildResult.Failed && !releaseOnError) {
                shouldCreateTag = false;
                break;
            }
        }

        if (shouldCreateTag) {
            await devOpsClient.addBuildTag(teamfoundationProject, buildDetails.id, releaseTag);
            console.log(`No Concurrent Builds, Creating tag ${releaseTag}. Please remember to add this tag as a condition in your release pipeline trigger.`)
        }

        /*  if (inputString == 'bad') {
              tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
              return;
          }*/
        console.log('Hello', teamfoundationCollectionUri);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();