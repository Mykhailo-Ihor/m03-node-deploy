# m03-node-deploy

Module 3 — Secrets, Variables, Environments, Matrix, and Approvals.

A small Express API (`/health`, `/quote`) with a pipeline that tests it on two
Node.js versions and then deploys it to `dev` → `staging` → `production`
through one reusable deploy workflow.

## Workflows

| File | Role |
| --- | --- |
| [`pipeline.yml`](.github/workflows/pipeline.yml) | Entry point: lint, test matrix, build, then deploy to the three environments |
| [`reusable-node-ci.yml`](.github/workflows/reusable-node-ci.yml) | `workflow_call`: checkout → setup-node → `npm ci` → `npm run <script>` |
| [`reusable-deploy.yml`](.github/workflows/reusable-deploy.yml) | `workflow_call`: deploys to the environment named by the `environment` input |

```
lint ─────────────┐
test (matrix) ────┼─► build ─► deploy-dev ─► deploy-staging ─► deploy-production
 node 20, 22      │                                              (needs approval)
 × unit, integr.  ┘
```

Pull requests run lint, test and build only; deployments run on push to `main`
and on manual dispatch.

## Where configuration lives

| Name | Kind | Scope | Why |
| --- | --- | --- | --- |
| `APP_NAME` | variable | repository | Same everywhere, not sensitive |
| `APP_URL` | variable | each environment | Differs per environment, not sensitive |
| `LOG_LEVEL` | variable | each environment | `debug` / `info` / `warn` |
| `REPLICAS` | variable | each environment | `1` / `2` / `3` |
| `DEPLOY_TOKEN` | **secret** | each environment | Sensitive; production's value is only readable by a job that has passed the production approval |

There are no repository-level secrets, and no secret is stored as a variable.

## Environment protection

| Environment | Required reviewers | Deployment branches |
| --- | --- | --- |
| `dev` | — | any |
| `staging` | — | `main` only |
| `production` | `Mykhailo-Ihor` | `main` only |
