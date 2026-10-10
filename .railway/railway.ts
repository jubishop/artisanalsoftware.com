import { defineRailway, github, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "artisanalsoftware";
export default defineRailway(() => {
  const artisanalsoftware = service("artisanalsoftware", {
    source: github("jubishop/artisanalsoftware.com", { branch: "main", checkSuites: true }),
    build: {
      buildCommand: "npm install",
      // GitHub pushes deploy only when a release input changes. Railway does not
      // read .railway/ during deploys; `railway config apply` applies this file
      // and starts its own deployment, so .railway/ is not watched.
      watchPatterns: [
        "/*.js",
        "/config/**",
        "/controllers/**",
        "/middleware/**",
        "/services/**",
        "/content/**",
        "/views/**",
        "/public/**",
        "/package*.json",
        "/.npmrc",
        "/.nvmrc",
        "/.env.example",
        "/bin/check-node.cjs",
        "/Dockerfile*",
        "/Procfile",
        "/.dockerignore",
      ],
    },
    start: "node app.js",
    healthcheck: "/health",
    replicas: { "us-west2": 1 },
    domains: ["artisanalsoftware.com", "www.artisanalsoftware.com"],
  });

  return project("artisanal", {
    variables: { managed: false },
    resources: [artisanalsoftware],
  });
});
