import { exec } from "child_process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import prompts from "prompts";

const PACKAGES: Record<string, { name: string; dir: string }> = {
  plugin: {
    name: "eslint-plugin-tmdr-nuxt",
    dir: "packages/eslint-plugin-nuxt",
  },
  config: {
    name: "eslint-config-tmdr-nuxt",
    dir: "packages/eslint-config-nuxt",
  },
};

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 [command] [options]")
  .command("build", "Build a package")
  .command("release", "Release a package")
  .option("package", {
    alias: "p",
    describe: "Target package",
    choices: ["plugin", "config", "all"],
  })
  .option("bump", {
    alias: "b",
    describe: "Version bump type (release only)",
    choices: ["patch", "minor", "major"],
  })
  .example("$0 build --package plugin", "Build the eslint-plugin package")
  .example(
    "$0 release --package config --bump patch",
    "Patch release the eslint-config package",
  )
  .help()
  .alias("help", "h")
  .parse() as Awaited<ReturnType<typeof yargs.parse>>;

async function main() {
  let action = argv._[0];

  if (!action) {
    const res = await prompts(
      {
        type: "select",
        name: "action",
        message: "What do you want to do?",
        choices: [
          { title: "Build", value: "build" },
          { title: "Release", value: "release" },
        ],
      },
      { onCancel },
    );
    action = res.action;
  }

  let pkg = argv.package as string;

  if (!pkg) {
    const res = await prompts(
      {
        type: "select",
        name: "pkg",
        message: "Which package?",
        choices: [
          { title: `plugin  (${PACKAGES.plugin.name})`, value: "plugin" },
          { title: `config  (${PACKAGES.config.name})`, value: "config" },
          ...(action === "build"
            ? [{ title: "all     (both packages)", value: "all" }]
            : []),
        ],
      },
      { onCancel },
    );
    pkg = res.pkg;
  }

  if (action === "build") {
    const targets = pkg === "all" ? Object.values(PACKAGES) : [PACKAGES[pkg]];
    for (const target of targets) {
      run(`cd ${target.dir} && npx tsc --build`);
    }
    return;
  }

  // Release: need version bump type
  let bump = argv.bump;

  if (!bump) {
    const res = await prompts(
      {
        type: "select",
        name: "bump",
        message: "Version bump type?",
        choices: [
          { title: "Patch  (x.x.+1)", value: "patch" },
          { title: "Minor  (x.+1.0)", value: "minor" },
          { title: "Major  (+1.0.0)", value: "major" },
        ],
      },
      { onCancel },
    );
    bump = res.bump;
  }

  const pkgDir = PACKAGES[pkg].dir;
  run(`cd ${pkgDir}`);
  run(`pnpm version ${bump}`);
  run(`pnpm publish --access=public`);
}

function run(cmd: string) {
  console.log(`\n> ${cmd}\n`);
  exec(cmd, (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    if (error) {
      console.error(`\nError (exit code ${error.code}): ${error.message}`);
      process.exit(error.code ?? 1);
    }
  });
}

function onCancel() {
  console.log("\nCancelled.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
