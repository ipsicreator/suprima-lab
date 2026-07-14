"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { loadDiagnosisState, saveDiagnosisStateLocal, saveDiagnosisStateRemote } from "../client-state";
import { defaultDiagnosisState, type DiagnosisFormData, type DiagnosisState, type PdfAnalysisResult } from "../diagnosis-data";
import { diagnosisLabels, diagnosisSteps, diagnosisTitles } from "../messages";

export default function DiagnosisStep1Page() {
  const router = useRouter();
  const [state, setState] = useState<DiagnosisState>(() =>
    typeof window === "undefined" ? defaultDiagnosisState : loadDiagnosisState(),
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisState, setAnalysisState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [analysisMessage, setAnalysisMessage] = useState("");

  const canMoveNext = useMemo(() => {
    const formData = state.formData;
    return Boolean(formData.studentName && formData.schoolName && formData.grade && formData.careerTrack);
  }, [state]);

  async function persist(nextFormData: DiagnosisFormData, nextPdfAnalysis: PdfAnalysisResult | null, step: number) {
    const nextState: DiagnosisState = {
      ...state,
      formData: nextFormData,
      pdfAnalysis: nextPdfAnalysis,
    };
    setState(nextState);
    saveDiagnosisStateLocal(nextState);
    await saveDiagnosisStateRemote(step, nextState);
  }

  function updateField(key: keyof DiagnosisFormData) {
    return async (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const nextFormData = { ...state.formData, [key]: event.target.value };
      await persist(nextFormData, state.pdfAnalysis, 1);
    };
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setAnalysisMessage(`${file.name} 파일이 선택되었습니다.`);
      setAnalysisState("idle");
    }
  }

  async function handleAnalyzePdf() {
    if (!selectedFile) {
      setAnalysisState("error");
      setAnalysisMessage("먼저 학생부 파일을 선택해 주세요.");
      return;
    }

    const body = new FormData();
    body.append("file", selectedFile);

    setAnalysisState("loading");
    setAnalysisMessage("학생부 파일을 분석하고 있습니다.");

    try {
      const response = await fetch("/api/pdf-analyze", { method: "POST", body });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "학생부 분석에 실패했습니다.");
      }

      setAnalysisState("done");
      setAnalysisMessage(`${result.fileName} 분석이 완료되었습니다.`);
      await persist(state.formData, result, 1);
    } catch (error) {
      setAnalysisState("error");
      setAnalysisMessage(error instanceof Error ? error.message : "학생부 분석 중 오류가 발생했습니다.");
    }
  }

  async function handleNext() {
    await persist(state.formData, state.pdfAnalysis, 1);
    router.push("/diagnosis/step2");
  }

  return (
    <main className="app-shell">
      <div className="app-card">
        <header className="app-header">
          <div className="brand-link">
            <span className="brand-mark" />
            <span className="brand-text">
              <strong>{diagnosisLabels.serviceTitle}</strong>
              <span>{diagnosisLabels.serviceSubtitle}</span>
            </span>
          </div>
          <div className="shell-badge">{diagnosisLabels.badge}</div>
        </header>

        <section className="shell-hero">
          <div className="shell-step">01</div>
          <div>
            <h1>{diagnosisTitles.step1Title}</h1>
            <p>{diagnosisTitles.step1Description}</p>
          </div>
        </section>

        <nav className="step-strip" aria-label="진행 단계">
          {diagnosisSteps.map((step, index) => (
            <div key={step.no} className={index === 0 ? "step-chip active" : "step-chip"}>
              <span>{step.no}</span>
              <strong>{step.title}</strong>
              <em>{step.description}</em>
            </div>
          ))}
        </nav>

        <section className="shell-content">
          <div className="stack">
            <section className="image-card">
              <Image src="/reference/step1/step1-reference.png" alt="1단계 참조 화면" width={1440} height={960} className="reference-image" />
            </section>

            <section className="content-card" style={{ padding: 24 }}>
              <h2 className="section-title">사용자 기본 정보</h2>
              <div className="form-grid">
                <label className="field"><span>컨설턴트명</span><input value={state.formData.consultantName} onChange={updateField("consultantName")} placeholder="이름 입력" /></label>
                <label className="field"><span>학생 이름</span><input value={state.formData.studentName} onChange={updateField("studentName")} placeholder="학생 이름 입력" /></label>
                <label className="field"><span>학교명</span><input value={state.formData.schoolName} onChange={updateField("schoolName")} placeholder="학교명 입력" /></label>
                <label className="field"><span>학년</span><select value={state.formData.grade} onChange={updateField("grade")}><option>1학년</option><option>2학년</option><option>3학년</option></select></label>
                <label className="field"><span>학생 연락처</span><input value={state.formData.studentPhone} onChange={updateField("studentPhone")} placeholder="010-0000-0000" /></label>
                <label className="field"><span>부모 연락처</span><input value={state.formData.parentPhone} onChange={updateField("parentPhone")} placeholder="010-0000-0000" /></label>
                <label className="field"><span>이메일</span><input value={state.formData.email} onChange={updateField("email")} placeholder="example@domain.com" /></label>
                <label className="field"><span>희망 진로/계열</span><input value={state.formData.careerTrack} onChange={updateField("careerTrack")} placeholder="예: 건축공학" /></label>
              </div>

              <div className="info-box">입력한 정보와 학생부 분석 결과는 저장되며 다음 단계 안내에 함께 사용합니다.</div>

              <section className="content-card" style={{ padding: 20, marginTop: 20, boxShadow: "none" }}>
                <div className="kicker">학생부 파일 분석</div>
                <h3 className="section-title" style={{ marginTop: 8 }}>파일 올리기와 분석</h3>
                <div className="form-grid">
                  <label className="field" style={{ gridColumn: "1 / -1" }}>
                    <span>학생부 파일</span>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                  </label>
                </div>
                <div className="action-row" style={{ justifyContent: "flex-start", marginTop: 16 }}>
                  <button type="button" className="btn-primary" onClick={handleAnalyzePdf}>
                    {analysisState === "loading" ? "분석 중" : "학생부 분석 시작"}
                  </button>
                </div>
                {analysisMessage ? <div className="info-box" style={{ marginTop: 16 }}>{analysisMessage}</div> : null}
                {state.pdfAnalysis ? (
                  <div className="placeholder-panel" style={{ marginTop: 16 }}>
                    <div className="placeholder-box">파일명: {state.pdfAnalysis.fileName}</div>
                    <div className="placeholder-box">텍스트 길이: {state.pdfAnalysis.textLength.toLocaleString()}자</div>
                    <div className="placeholder-box">주요 단어: {state.pdfAnalysis.keywords.join(", ") || "없음"}</div>
                  </div>
                ) : null}
              </section>

              <div className="action-row" style={{ justifyContent: "space-between" }}>
                <Link className="btn-primary" href="/intro">{diagnosisLabels.backToIntro}</Link>
                <button type="button" className="btn-primary" onClick={handleNext} disabled={!canMoveNext}>{diagnosisLabels.next}</button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
