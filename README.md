# Guardrail Samples Study – Interactive Visualization User Study

This repository contains the configuration and materials for our interactive, web-based user study on **guardrails in data visualization**. The study investigates how different guardrail techniques (e.g., statistical summaries, representative samples, clusters) affect participants’ interpretation of stock market performance visualizations.  

The study is built with [reVISit](https://revisit.dev), a framework for creating and deploying interactive visualization studies via declarative configuration.  

## Build Instructions

To run this demo experiment locally, you will need to install node on your computer. 

* Clone `https://github.com/revisit-studies/study`
* Run `yarn install`. If you don't have yarn installed, run `npm i -g yarn`. 
* To run locally, run `yarn serve`.
* Go to [http://localhost:8080](http://localhost:8080) to view it in your browser. The page will reload when you make changes. 

## Release Instructions

Releasing reVISit.dev happens automatically when a PR is merged into the `main` branch. The name of the pull request should be the title of the release, e.g. `v1.0.0`. Releasing creates a tag with the same name as the PR, but the official GitGub release should be created manually. The `main` branch is protected and requires two reviews before merging.

The workflow for release looks as follows:
Develop features on feature branch
| PRs
Dev branch
| PR (1 per release)
Main branch
| Run release workflow on merge
References are updated and commit is tagged
