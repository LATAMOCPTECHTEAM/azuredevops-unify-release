import "reflect-metadata";
import { container } from "tsyringe";
import  * as TaskLib from "azure-pipelines-task-lib/task";

container.register("TaskLib", {useValue: TaskLib});