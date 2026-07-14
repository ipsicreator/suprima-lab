"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DiagnosisShell from "@/app/components/DiagnosisShell";
import { loadDiagnosisState, saveDiagnosisStateRemote } from "../client-state";
import { buildStep3Topics, defaultDiagnosisState, type DiagnosisState } from "../diagnosis-data";
import { diagnosisEmailSubjects, diagnosisLabels } from "../messages";

export default function DiagnosisStep3Page() {
  const state = useMemo<DiagnosisState>(
    () => (typeof window === "undefined" ? defaultDiagnosisState : loadDiagnosisState()),
    [],
  );
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void saveDiagnosisStateRemote(3, state);
  }, [state]);

  const topics = useMemo(() => buildStep3Topics(state.formData, state.pdfAnalysis), [state]);

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
          subject: diagnosisEmailSubjects.step3,
          reportData: { step: 3, topics, pdfAnalysis: state.pdfAnalysis },
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
    <DiagnosisShell currentStep={3} title="탐구 · 독서 · 세특" subtitle="학생부를 바탕으로 탐구 주제와 독서 방향, 세특 문장을 정리하는 단계입니다.">
      <div className="stack">
        <section className="content-card" style={{ padding: 24 }}>
          <div className="kicker">기준 정보</div>
          <h2 className="section-title">{state.formData.studentName || "학생 정보 입력 전"} 기준 안내</h2>
          <p className="desc">{state.formData.careerTrack || "희망 진로 입력 전"} 흐름을 바탕으로 주제를 정리합니다.</p>
        </section>

        <section className="split-card">
          <article className="content-card" style={{ padding: 24 }}>
            <div className="kicker">기본 3개</div>
            <h2 className="section-title">핵심 탐구 주제</h2>
            <div className="placeholder-panel">
              {topics.map((topic) => (
                <div key={topic.title} className="placeholder-box">
                  <strong>{topic.title}</strong>
                  <p className="desc">{topic.description}</p>
                  <p className="desc">{topic.source}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="content-card" style={{ padding: 24 }}>
            <div className="kicker">확장 주제</div>
            <h2 className="section-title">독서와 세특 연결</h2>
            <div className="placeholder-panel">
              <div className="placeholder-box">{state.formData.careerTrack || "희망 계열"} 기준 추천 독서 방향을 함께 검토합니다.</div>
              <div className="placeholder-box">{state.formData.studentName || "학생"}에게 맞는 세특 연결 문장을 정리합니다.</div>
              {state.pdfAnalysis?.summary ? <div className="placeholder-box">학생부 분석 반영 요약: {state.pdfAnalysis.summary}</div> : null}
            </div>
          </article>
        </section>

        <section className="content-card" style={{ padding: 24 }}>
          <div className="kicker">추가 정보</div>
          <h2 className="section-title">개별 주제 확장</h2>
          <div className="form-grid">
            <label className="field"><span>학년</span><input value={state.formData.grade} readOnly /></label>
            <label className="field"><span>희망 진로</span><input value={state.formData.careerTrack} readOnly /></label>
            <label className="field"><span>학생 이름</span><input value={state.formData.studentName} readOnly /></label>
            <label className="field"><span>학교명</span><input value={state.formData.schoolName} readOnly /></label>
          </div>
        </section>

        {status ? <div className="info-box">{status}</div> : null}

        <div className="action-row" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="btn-primary" onClick={() => window.print()}>{diagnosisLabels.print}</button>
            <button type="button" className="btn-primary" onClick={handleSendEmail} disabled={sending}>{sending ? diagnosisLabels.sending : diagnosisLabels.sendEmail}</button>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn-primary" href="/diagnosis/step2">{diagnosisLabels.previous}</Link>
            <Link className="btn-primary" href="/diagnosis/step4">{diagnosisLabels.next}</Link>
          </div>
        </div>
      </div>
    </DiagnosisShell>
  );
}
