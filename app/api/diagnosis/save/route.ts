import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type StoredStep = {
  step: number;
  updatedAt: string;
  state: unknown;
};

type StoredSession = {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  latestStep: number;
  steps: StoredStep[];
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "diagnosis-sessions.json");

async function readSessions(): Promise<StoredSession[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    return JSON.parse(raw) as StoredSession[];
  } catch {
    return [];
  }
}

async function writeSessions(sessions: StoredSession[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(sessions, null, 2), "utf8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const step = Number(body?.step || 0);
    const state = body?.state;
    const sessionId = String(state?.sessionId || "").trim();

    if (!sessionId || !step) {
      return NextResponse.json({ error: "저장에 필요한 정보가 없습니다." }, { status: 400 });
    }

    const sessions = await readSessions();
    const now = new Date().toISOString();
    const nextStep: StoredStep = { step, updatedAt: now, state };
    const existing = sessions.find((item) => item.sessionId === sessionId);

    if (existing) {
      existing.updatedAt = now;
      existing.latestStep = Math.max(existing.latestStep, step);
      const stepIndex = existing.steps.findIndex((item) => item.step === step);
      if (stepIndex >= 0) {
        existing.steps[stepIndex] = nextStep;
      } else {
        existing.steps.push(nextStep);
      }
    } else {
      sessions.push({
        sessionId,
        createdAt: now,
        updatedAt: now,
        latestStep: step,
        steps: [nextStep],
      });
    }

    await writeSessions(sessions);

    return NextResponse.json({
      success: true,
      message: `${step}단계 결과가 저장되었습니다.`,
    });
  } catch {
    return NextResponse.json({ error: "진단 결과 저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
