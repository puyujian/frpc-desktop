const fs = require("node:fs");
const path = require("node:path");

const lockfilePath = path.resolve(process.cwd(), "package-lock.json");
const checkOnly = process.argv.includes("--check");

if (!fs.existsSync(lockfilePath)) {
  console.error(`package-lock.json not found: ${lockfilePath}`);
  process.exit(1);
}

const replacements = [
  ["https://registry.npmmirror.com/", "https://registry.npmjs.org/"],
  [
    "https://nexus.cyanrain.com:8443/repository/npm-public/",
    "https://registry.npmjs.org/"
  ],
  [
    "git+ssh://git@github.com/electron/node-gyp.git",
    "git+https://github.com/electron/node-gyp.git"
  ]
];

const blockedSources = [
  "registry.npmmirror.com",
  "nexus.cyanrain.com:8443",
  "git+ssh://git@github.com/electron/node-gyp.git"
];

const original = fs.readFileSync(lockfilePath, "utf8");
let normalized = original;

for (const [from, to] of replacements) {
  normalized = normalized.split(from).join(to);
}

if (!checkOnly && normalized !== original) {
  fs.writeFileSync(lockfilePath, normalized, "utf8");
  console.log("package-lock.json normalized for CI sources");
}

const contentToValidate = checkOnly ? original : normalized;
const remainingBlocked = blockedSources.filter(source =>
  contentToValidate.includes(source)
);

if (remainingBlocked.length > 0) {
  console.error(
    `Blocked lockfile sources found: ${remainingBlocked.join(", ")}`
  );
  process.exit(1);
}

console.log("package-lock.json source validation passed");
