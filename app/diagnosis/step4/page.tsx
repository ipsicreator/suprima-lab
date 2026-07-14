"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DiagnosisShell from "@/app/components/DiagnosisShell";
import { loadDiagnosisState, saveDiagnosisStateRemote } from "../client-state";
import { buildStep2Summary, buildStep3Topics, buildStep4Targets, defaultDiagnosisState, type DiagnosisState } from "../diagnosis-data";
import { diagnosisEmailSubjects, diagnosisLabels } from "../messages";

export default function DiagnosisStep4Page() {
  const state = useMemo<DiagnosisState>(
    () => (typeof window === "undefined" ? defaultDiagnosisState : loadDiagnosisState()),
    [],
  );
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void saveDiagnosisStateRemote(4, state);
  }, [state]);

  const summary = useMemo(() => buildStep2Summary(state.formData, state.pdfAnalysis), [state]);
  const topics = useMemo(() => buildStep3Topics(state.formData, state.pdfAnalysis), [state]);
  const targets = useMemo(() => buildStep4Targets(state.formData, state.pdfAnalysis), [state]);

  async function handleSendEmail() {
    if (!state.formData.email) {
      setStatus(diagnosisLabels.noEmail);
      return;
    }
    setSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.formData.email,
          subject: diagnosisEmailSubjects.step4,
          reportData: { step: 4, summary, topics, targets },
        }),
      });
      const result = await response.json();
      setStatus(result?.message || diagnosisLabels.emailSent);
    } catch {
      setStatus(diagnosisLabels.emailFailed);
    } finally {
      setSending(false);
    }
  }

  return (
    <DiagnosisShell currentStep={4} title="입시 위치 진단" subtitle="앞 단계 내용을 모아 지원 판단과 최종 안내를 정리하는 마지막 단계입니다.">
      <div className="stack">
        <section className="content-card" style={{ padding: 24 }}>
          <div className="kicker">요약</div>
          <h2 className="section-title">한눈에 보는 요약</h2>
          <div className="split-card">
            <div className="placeholder-box">{summary.profileLine}</div>
            <div className="placeholder-box">{summary.keywordLine}</div>
            <div className="placeholder-box">{topics.map((topic) => topic.title).join(", ")}</div>
            <div className="placeholder-box">{state.formData.careerTrack || "희망 계열"} 기준 지원 판단 요약</div>
          </div>
        </section>

        <section className="content-card" style={{ padding: 24 }}>
          <div className="kicker">지원 판단</div>
          <h2 className="section-title">지원 방향 정리</h2>
          <div className="placeholder-panel">
            {targets.map((target) => (
              <div key={target.level} className="placeholder-box">
                <strong>{target.level}</strong>
                <p className="desc">{target.name}</p>
                <p className="desc">{target.description}</p>
                <p className="desc">{target.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {status ? <div className="info-box">{status}</div> : null}

        <div className="action-row" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="btn-primary" onClick={() => window.print()}>{diagnosisLabels.print}</button>
            <button type="button" className="btn-primary" onClick={handleSendEmail} disabled={sending}>{sending ? diagnosisLabels.sending : diagnosisLabels.sendEmail}</button>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn-primary" href="/diagnosis/step3">{diagnosisLabels.previous}</Link>
            <Link className="btn-primary" href="/intro">{diagnosisLabels.first}</Link>
          </div>
        </div>
      </div>
    </DiagnosisShell>
  );
}
