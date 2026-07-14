export const diagnosisSteps = [
  {
    no: "1",
    title: "사용자 정보",
    description: "사용자 정보와 학생부 자료를 입력합니다.",
    href: "/diagnosis/step1",
  },
  {
    no: "2",
    title: "학생부 분석",
    description: "학생부 내용을 살펴보고 핵심 내용을 확인합니다.",
    href: "/diagnosis/step2",
  },
  {
    no: "3",
    title: "탐구 · 독서 · 세특",
    description: "학생부를 바탕으로 주제와 문장을 정리합니다.",
    href: "/diagnosis/step3",
  },
  {
    no: "4",
    title: "입시 위치 진단",
    description: "지원 판단 내용을 단계별로 정리합니다.",
    href: "/diagnosis/step4",
  },
] as const;

export const diagnosisLabels = {
  serviceTitle: "수프리마 랩",
  serviceSubtitle: "학생부 분석 · 입시 진단",
  badge: "학생부 진단 서비스",
  print: "인쇄",
  sendEmail: "이메일 보내기",
  sending: "보내는 중",
  previous: "이전 단계",
  next: "다음 단계",
  first: "처음으로",
  backToIntro: "첫 화면으로 돌아가기",
  noEmail: "이메일 주소를 먼저 입력해 주세요.",
  emailSent: "이메일 요청을 보냈습니다.",
  emailFailed: "이메일을 보내는 중 오류가 발생했습니다.",
} as const;

export const diagnosisTitles = {
  step1Title: "사용자 정보 입력",
  step1Description: "사용자 정보와 학생부 자료를 정확하게 입력하는 첫 단계입니다.",
} as const;

export const diagnosisEmailSubjects = {
  step2: "수프리마 랩 학생부 분석 결과",
  step3: "수프리마 랩 탐구·독서·세특 결과",
  step4: "수프리마 랩 입시 위치 진단 결과",
} as const;
