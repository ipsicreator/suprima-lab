# 수프리마 랩 오픈 체크리스트

## 일정

- 이번 주: 테스트
- 다음 주 화요일: 정식 오픈

## 테스트 우선순위

### 1. 문자열 깨짐 확인

- `/intro`
- `/diagnosis/step1`
- `/diagnosis/step2`
- `/diagnosis/step3`
- `/diagnosis/step4`
- 버튼, 배지, 안내 문구, 이메일 상태 문구 확인

### 2. 단계 흐름 확인

- 인트로에서 시작하기 클릭
- 1단계 입력 후 2단계 이동
- 2단계에서 3단계 이동
- 3단계에서 4단계 이동
- 각 단계에서 이전 단계 이동 확인

### 3. PDF 분석 확인

- 1단계에서 PDF 선택
- PDF 분석 실행
- 2단계에서 핵심 문장, 키워드, 요약 표시 확인
- 분석 실패 시 에러 문구 확인

### 4. 서버 저장 확인

- `data/diagnosis-sessions.json` 누적 확인
- 단계별 저장 여부 확인
- `sessionId`별 갱신 여부 확인

### 5. 출력과 이메일 확인

- 2단계 인쇄
- 3단계 인쇄
- 4단계 인쇄
- 2단계 이메일 발송 응답 확인
- 3단계 이메일 발송 응답 확인
- 4단계 이메일 발송 응답 확인

### 6. 자동 점검 확인

- `npm run smoke`
- `npm run smoke:clean`
- 주요 화면 5개 응답 확인
- `send-email` API 응답 확인
- `diagnosis/save` API 응답 확인
- `pdf-analyze` API 응답 확인
- 테스트 세션 삭제 확인

## 오픈 전 고정 원칙

- 문자열은 `app/diagnosis/messages.ts`에서만 관리
- 단계 데이터는 `app/diagnosis/client-state.ts`와 `/api/diagnosis/save` 기준으로 저장
- 화면 문구를 각 페이지 파일에 분산 추가하지 않음
- 임시 테스트 데이터는 오픈 전 비움
- 큰 구조 변경 금지

## 최종 확인 명령

```powershell
npm run build
npm run start -- --port 3200
npm run smoke
npm run smoke:clean
```

## 확인 파일

- `app/diagnosis/messages.ts`
- `app/diagnosis/client-state.ts`
- `app/diagnosis/diagnosis-data.ts`
- `app/api/diagnosis/save/route.ts`
- `app/api/pdf-analyze/route.ts`
- `app/api/send-email/route.ts`
- `data/diagnosis-sessions.json`
- `scripts/smoke-test.mjs`
- `scripts/cleanup-smoke-data.mjs`
