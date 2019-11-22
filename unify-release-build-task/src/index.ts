import "./helpers/dependency-injection";
import tl = require('azure-pipelines-task-lib/task');
import { container } from "tsyringe";
import { IUnifyReleaseService } from "./interfaces/types";
async function run() {
    try {
        let unifyReleaseService = container.resolve<IUnifyReleaseService>("IUnifyReleaseService");
        await unifyReleaseService.unifyRelease();
        console.log("Test");
        tl.setResult(tl.TaskResult.Succeeded, "Task Completed");
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, JSON.stringify(err));
    }
}
run();