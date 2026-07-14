export const DIAGNOSIS_STORAGE_KEY = "suprima_lab_diagnosis";

export type DiagnosisFormData = {
  consultantName: string;
  studentName: string;
  schoolName: string;
  grade: string;
  studentPhone: string;
  parentPhone: string;
  email: string;
  careerTrack: string;
};

export type PdfAnalysisResult = {
  fileName: string;
  textLength: number;
  preview: string;
  highlights: string[];
  keywords: string[];
  summary: string;
};

export type DiagnosisState = {
  sessionId: string;
  formData: DiagnosisFormData;
  pdfAnalysis: PdfAnalysisResult | null;
};

export type GeneratedTopic = {
  title: string;
  description: string;
  source: string;
};

export type DiagnosisTarget = {
  level: "상향" | "적정" | "안정";
  name: string;
  description: string;
  reason: string;
};

export const defaultDiagnosisFormData: DiagnosisFormData = {
  consultantName: "",
  studentName: "",
  schoolName: "",
  grade: "3학년",
  studentPhone: "",
  parentPhone: "",
  email: "",
  careerTrack: "",
};

export const defaultDiagnosisState: DiagnosisState = {
  sessionId: "",
  formData: defaultDiagnosisFormData,
  pdfAnalysis: null,
};

export function createDiagnosisSessionId() {
  return `diag-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeDiagnosisState(input: unknown): DiagnosisState {
  const raw = typeof input === "object" && input !== null ? (input as Partial<DiagnosisState>) : {};
  return {
    sessionId: String(raw.sessionId || ""),
    formData: { ...defaultDiagnosisFormData, ...(raw.formData || {}) },
    pdfAnalysis: raw.pdfAnalysis || null,
  };
}

export function buildStep2Summary(data: DiagnosisFormData, pdfAnalysis: PdfAnalysisResult | null) {
  const track = data.careerTrack || "진로 정보 입력 전";
  const name = data.studentName || "학생 정보 입력 전";
  const school = data.schoolName || "학교 정보 입력 전";
  const grade = data.grade || "학년 정보 입력 전";

  return {
    profileLine: `${name} · ${school} · ${grade}`,
    keywordLine: pdfAnalysis
      ? `${track} 중심으로 학생부 분석 내용을 정리했습니다.`
      : `${track} 중심으로 학생부 강점과 활동 흐름을 함께 살펴봅니다.`,
    memoItems: [
      `${name} 학생의 학생부에서 ${track}와 연결되는 활동을 우선 확인합니다.`,
      `학기 흐름과 과목 기록을 바탕으로 강점과 보완 포인트를 함께 정리합니다.`,
      pdfAnalysis
        ? `올린 파일 ${pdfAnalysis.fileName} 내용을 바탕으로 핵심 문장과 주요 단어를 반영합니다.`
        : `이 단계 내용은 다음 단계 탐구, 독서, 세특 안내에 함께 사용합니다.`,
    ],
  };
}

export function buildStep3Topics(data: DiagnosisFormData, pdfAnalysis: PdfAnalysisResult | null): GeneratedTopic[] {
  const track = data.careerTrack || "진로 미정";
  const keywords = pdfAnalysis?.keywords?.length ? pdfAnalysis.keywords : [track, "활동", "기록"];
  const highlights = pdfAnalysis?.highlights?.length ? pdfAnalysis.highlights : ["학생부 분석 결과를 기다리는 중입니다."];

  return [
    {
      title: `${keywords[0]} 연계 탐구 주제`,
      description: `${track}와 직접 연결되는 탐구 주제를 먼저 살펴봅니다.`,
      source: `주요 단어: ${keywords[0]}`,
    },
    {
      title: `${keywords[1] || track} 기반 독서 확장`,
      description: "학생부 활동과 연결되는 독서 방향을 구체적으로 안내합니다.",
      source: `관련 단어: ${keywords[1] || track}`,
    },
    {
      title: "세특 문장 강화",
      description: "학생의 활동과 진로를 묶어 세특 문장을 다듬습니다.",
      source: `참고 문장: ${highlights[0]}`,
    },
  ];
}

function scoreByGrade(grade: string) {
  if (grade.startsWith("1")) return 3;
  if (grade.startsWith("2")) return 2;
  return 1;
}

function scoreByPdf(pdfAnalysis: PdfAnalysisResult | null) {
  if (!pdfAnalysis) return 0;
  let score = 1;
  if (pdfAnalysis.keywords.length >= 3) score += 1;
  if (pdfAnalysis.highlights.length >= 3) score += 1;
  if (pdfAnalysis.textLength >= 2000) score += 1;
  return score;
}

export function buildStep4Targets(data: DiagnosisFormData, pdfAnalysis: PdfAnalysisResult | null): DiagnosisTarget[] {
  const track = data.careerTrack || "희망 계열";
  const profileScore = scoreByGrade(data.grade) + scoreByPdf(pdfAnalysis);
  const detailKeyword = pdfAnalysis?.keywords?.[0] || track;

  return [
    {
      level: "상향",
      name: `${track} 상향 지원안`,
      description: "도전해 볼 수 있지만 준비를 더 갖추면 좋은 지원안입니다.",
      reason:
        profileScore >= 5
          ? `${detailKeyword} 관련 기록이 비교적 뚜렷해 도전해 볼 수 있습니다.`
          : "핵심 기록은 있지만 추가 근거가 더 있으면 좋습니다.",
    },
    {
      level: "적정",
      name: `${track} 적정 지원안`,
      description: "현재 학생부 흐름을 기준으로 가장 무리 없이 검토할 수 있는 지원안입니다.",
      reason: `학생부 흐름과 ${track} 연결성이 현재 수준에서 가장 안정적으로 맞는 구간입니다.`,
    },
    {
      level: "안정",
      name: `${track} 안정 지원안`,
      description: "기존 기록을 바탕으로 편하게 검토할 수 있는 지원안입니다.",
      reason: "현재 입력 정보와 학생부 분석 결과를 기준으로 무리 없이 검토할 수 있는 범위입니다.",
    },
  ];
}
