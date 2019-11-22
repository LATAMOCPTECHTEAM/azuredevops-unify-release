![Azure DevOps tests](https://github.com/psbds/azuredevops-unify-release/blob/master/images/extension-icon.png)
# Azure Devops Unify Release Task


### Develop Branch: 
[![Build status](https://dev.azure.com/padasil/AzureDevOps%20-%20Unify%20Release/_apis/build/status/Develop%20Build)](https://dev.azure.com/padasil/AzureDevOps%20-%20Unify%20Release/_build/latest?definitionId=9)
![Azure DevOps tests](https://img.shields.io/azure-devops/tests/padasil/AzureDevOps%20-%20Unify%20Release/9)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/padasil/AzureDevOps%20-%20Unify%20Release/9)

Unify Relase is a simple build task for Azure DevOps to enable two or more builds from the same source code to trigger a single Release.

By default if you have a release that get triggered by two different builds, this release will be run for each time one of this builds are completed

![Azure DevOps tests](https://github.com/psbds/azuredevops-unify-release/blob/master/docs/unify-release-before.png)

With the unify release task, you are able to control the releases in a way that two builds triggered from the same source version can generate only one release.

![Azure DevOps tests](https://github.com/psbds/azuredevops-unify-release/blob/master/docs/unify-release-after.png)

This scenario is common especially with Mono Repository approach, where you need to make changes in two different applications that must go live in the same release.

## How does it works
1. The Unify release tasks when executed from a Build pipeline, checks the other builds triggered from the same source version.

2.  If no builds are pending it will create a build tag that you can use to filter in your release pipeline.

3. If there's a build pending, it will not create the build tag, so your release pipeline (with the build tag filter enable) will not be triggered.

In this way, only the last build to finish will create the build tag and the pipeline will be run.

## How to Use It

1. Install the Unify Release Task from the Azure DevOps Marketplace.
   
2. Put the Unify release task in your build pipelines as the last task to be executed.
 
4. In your Release Artifacts, put a Build Tag filter for the build tag you configured on the Unify Release Task (default to create_release).


## Task Options

|Parameter   |Description   | Default Value   | 
|---|---|---|---|---|
| a  |   b|  c |  d |
| a  |   b|  c |  d |
| a  |   b|  c |  d |
| a  |   b|  c |  d |
| a  |   b|  c |  d |