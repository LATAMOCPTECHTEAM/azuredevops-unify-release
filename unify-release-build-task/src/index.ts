import "./helpers/dependency-injection";
import tl = require('azure-pipelines-task-lib/task');
import AzureDevOpsClient from "./services/buildService";
import { container } from "tsyringe";
import AzureDevopsConfiguration from "./models/AzureDevOpsConfiguration"
async function run() {
    try {

        var configuration = container.resolve(AzureDevopsConfiguration)
        var devOpsClient = container.resolve(AzureDevOpsClient);

        var buildDetails = await devOpsClient.getBuildInfo(configuration.teamFoundationCollectionUri, configuration.accessToken, configuration.teamFoundationProject, configuration.currentBuildId);



        console.log(`Task Parameters: ReleaseTag: ${configuration.releaseTag}, ReleaseOnCancel: ${configuration.releaseOnCancel}, ReleaseOnError ${configuration.releaseOnError}`)
        console.log(`Processing Build ${buildDetails.id} from Source Version ${buildDetails.sourceVersion}`);

        var relatedBuilds = await devOpsClient.listRelatedBuilds(configuration.teamFoundationCollectionUri, configuration.accessToken, 
            configuration.teamFoundationProject, buildDetails.sourceVersion, 
            configuration.waitForAllTriggeredBuilds, 
            [configuration.definition1, configuration.definition2, configuration.definition3, configuration.definition4, configuration.definition5]);


/*
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
            await devOpsClient.addBuildTag(teamfoundationCollectionUri, accessToken, teamfoundationProject, buildDetails.id, releaseTag);
            console.log(`No Concurrent Builds, Creating tag ${releaseTag}. Please remember to add this tag as a condition in your release pipeline trigger.`)
        }

        /*  if (inputString == 'bad') {
              tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
              return;
          }*/
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();