import { spawnSync } from "node:child_process";

function run(command, args) {
  const isWindows = process.platform === "win32";
  const executable = isWindows ? process.env.ComSpec ?? "cmd.exe" : command;
  const executableArgs = isWindows
    ? ["/d", "/s", "/c", [command, ...args].join(" ")]
    : args;
  const result = spawnSync(executable, executableArgs, { stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);

if (process.env.VERCEL === "1" && process.env.DATABASE_URL) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.log("Skipping deployment migrations outside a configured Vercel build.");
}

run("npx", ["next", "build"]);
