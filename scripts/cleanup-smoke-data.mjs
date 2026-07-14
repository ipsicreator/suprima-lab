import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataFile = path.join(process.cwd(), "data", "diagnosis-sessions.json");
const smokeSessionId = "diag-smoke-test";

async function main() {
  let sessions = [];

  try {
    const raw = await readFile(dataFile, "utf8");
    sessions = JSON.parse(raw);
  } catch {
    sessions = [];
  }

  const filtered = Array.isArray(sessions)
    ? sessions.filter((item) => item?.sessionId !== smokeSessionId)
    : [];

  await writeFile(dataFile, JSON.stringify(filtered, null, 2), "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        removedSessionId: smokeSessionId,
        remainingCount: filtered.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
