"use client";

import {
  createDiagnosisSessionId,
  defaultDiagnosisState,
  DIAGNOSIS_STORAGE_KEY,
  normalizeDiagnosisState,
  type DiagnosisState,
} from "./diagnosis-data";

export function loadDiagnosisState(): DiagnosisState {
  try {
    const raw = window.sessionStorage.getItem(DIAGNOSIS_STORAGE_KEY);
    const state = raw ? normalizeDiagnosisState(JSON.parse(raw)) : defaultDiagnosisState;
    if (!state.sessionId) {
      state.sessionId = createDiagnosisSessionId();
    }
    return state;
  } catch {
    return { ...defaultDiagnosisState, sessionId: createDiagnosisSessionId() };
  }
}

export function saveDiagnosisStateLocal(state: DiagnosisState) {
  try {
    window.sessionStorage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export async function saveDiagnosisStateRemote(step: number, state: DiagnosisState) {
  try {
    await fetch("/api/diagnosis/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, state }),
    });
  } catch {}
}
