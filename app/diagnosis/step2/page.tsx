"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DiagnosisShell from "@/app/components/DiagnosisShell";
import { loadDiagnosisState, saveDiagnosisStateRemote } from "../client-state";
import { buildStep2Summary, defaultDiagnosisState, type DiagnosisState } from "../diagnosis-data";
import { diagnosisEmailSubjects, diagnosisLabels } from "../messages";

export default function DiagnosisStep2Page() {
  const state = useMemo<DiagnosisState>(
    () => (typeof window === "undefined" ? defaultDiagnosisState : loadDiagnosisState()),
    [],
  );
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void saveDiagnosisStateRemote(2, state);
  }, [state]);

  const summary = useMemo(() => buildStep2Summary(state.formData, state.pdfAnalysis), [state]);

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
          subject: diagnosisEmailSubjects.step2,
          reportData: { step: 2, summary, pdfAnalysis: state.pdfAnalysis },
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
    <DiagnosisShell currentStep={2} title="학생부 분석" subtitle="학생부 핵심 내용과 분석 결과를 한 화면에서 확인하는 단계입니다.">
      <div className="stack">
        <section className="content-card" style={{ padding: 24 }}>
          <div className="kicker">기준 정보</div>
          <h2 className="section-title">{summary.profileLine}</h2>
          <p className="desc">{summary.keywordLine}</p>
        </section>

        {state.pdfAnalysis ? (
          <section className="split-card">
            <article className="content-card" style={{ padding: 24 }}>
              <div className="kicker">학생부 분석 결과</div>
              <h2 className="section-title">핵심 문장</h2>
              <div className="placeholder-panel">{state.pdfAnalysis.highlights.map((item) => <div key={item} className="placeholder-box">{item}</div>)}</div>
            </article>
            <article className="content-card" style={{ padding: 24 }}>
              <div className="kicker">추출 정보</div>
              <h2 className="section-title">주요 내용과 요약</h2>
              <div className="placeholder-panel">
                <div className="placeholder-box">주요 단어: {state.pdfAnalysis.keywords.join(", ") || "없음"}</div>
                <div className="placeholder-box">요약: {state.pdfAnalysis.summary}</div>
                <div className="placeholder-box">내용 일부: {state.pdfAnalysis.preview.slice(0, 320)}</div>
              </div>
            </article>
          </section>
        ) : (
          <section className="content-card" style={{ padding: 24 }}>
            <div className="kicker">학생부 분석 대기</div>
            <h2 className="section-title">아직 분석 결과가 없습니다.</h2>
            <p className="desc">1단계에서 학생부 파일을 올리고 분석을 시작하면 이 단계에서 결과를 볼 수 있습니다.</p>
          </section>
        )}

        <section className="content-card" style={{ padding: 24 }}>
          <div className="kicker">분석 메모</div>
          <h2 className="section-title">함께 볼 내용</h2>
          <div className="placeholder-panel">{summary.memoItems.map((item) => <div key={item} className="placeholder-box">{item}</div>)}</div>
        </section>

        {status ? <div className="info-box">{status}</div> : null}

        <div className="action-row" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="btn-primary" onClick={() => window.print()}>{diagnosisLabels.print}</button>
            <button type="button" className="btn-primary" onClick={handleSendEmail} disabled={sending}>{sending ? diagnosisLabels.sending : diagnosisLabels.sendEmail}</button>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn-primary" href="/diagnosis/step1">{diagnosisLabels.previous}</Link>
            <Link className="btn-primary" href="/diagnosis/step3">{diagnosisLabels.next}</Link>
          </div>
        </div>
      </div>
    </DiagnosisShell>
  );
}
