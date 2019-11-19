import "reflect-metadata";
import { container, Lifecycle } from "tsyringe";
import * as TaskLib from "azure-pipelines-task-lib/task";
import VariableManager from "./variableManager";
import BuildService from "../services/buildService";
import AzureDevOpsWrapper from "./azureDevOpsClientWrapper";
import UnifyReleaseService from "../services/unifyReleaseService";
import AzureDevOpsConfiguration from "../models/AzureDevOpsConfiguration";

// Services
container.register("IBuildService", { useClass: BuildService })
container.register("IUnifyReleaseService", { useClass: UnifyReleaseService })

// Models
container.register("IAzureDevOpsConfiguration", { useClass: AzureDevOpsConfiguration }, { lifecycle: Lifecycle.Singleton })
// Helpers
container.register("IVariableManager", { useClass: VariableManager }, { lifecycle: Lifecycle.Singleton })
container.register("IAzureDevOpsWrapper", { useClass: AzureDevOpsWrapper }, { lifecycle: Lifecycle.Singleton })

// Others
container.register("TaskLib", { useValue: TaskLib });