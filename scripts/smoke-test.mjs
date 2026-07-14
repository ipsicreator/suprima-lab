const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3200";

function escapePdfText(value) {
  return value.replace(/[()\\]/g, "\\$&");
}

function createPdfBuffer(lines) {
  const safeLines = lines.length > 0 ? lines : ["Suprema Lab PDF Smoke Test"];
  const content = [
    "BT",
    "/F1 18 Tf",
    "72 760 Td",
    ...safeLines.flatMap((line, index) =>
      index === 0
        ? [`(${escapePdfText(line)}) Tj`]
        : ["0 -24 Td", `(${escapePdfText(line)}) Tj`],
    ),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

async function checkRoute(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  if (!response.ok) {
    throw new Error(`Route failed: ${pathname} -> ${response.status}`);
  }
  return { pathname, status: response.status };
}

async function checkSendEmail() {
  const response = await fetch(`${baseUrl}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "smoke@example.com",
      subject: "Smoke Test",
      reportData: { ok: true, step: 4 },
    }),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(`send-email failed: ${response.status}`);
  }
  return { endpoint: "/api/send-email", message: json.message };
}

async function checkSave() {
  const response = await fetch(`${baseUrl}/api/diagnosis/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      step: 2,
      state: {
        sessionId: "diag-smoke-test",
        formData: {
          consultantName: "tester",
          studentName: "홍길동",
          schoolName: "테스트고",
          grade: "3학년",
          studentPhone: "010-0000-0000",
          parentPhone: "010-1111-1111",
          email: "smoke@example.com",
          careerTrack: "건축공학",
        },
        pdfAnalysis: null,
      },
    }),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(`diagnosis/save failed: ${response.status}`);
  }
  return { endpoint: "/api/diagnosis/save", message: json.message };
}

async function checkPdfAnalyze() {
  const formData = new FormData();
  const pdfBuffer = createPdfBuffer([
    "Suprema Lab PDF Smoke Test",
    "Student record analysis summary",
    "Keyword engineering portfolio",
  ]);

  formData.append(
    "file",
    new File([pdfBuffer], "smoke-test.pdf", { type: "application/pdf" }),
  );

  const response = await fetch(`${baseUrl}/api/pdf-analyze`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      `pdf-analyze failed: ${response.status} ${json?.error ?? "unknown"}`,
    );
  }

  if (
    json.fileName !== "smoke-test.pdf" ||
    typeof json.textLength !== "number" ||
    json.textLength <= 0 ||
    typeof json.preview !== "string" ||
    json.preview.length === 0 ||
    !Array.isArray(json.highlights) ||
    json.highlights.length === 0 ||
    !Array.isArray(json.keywords) ||
    json.keywords.length === 0 ||
    typeof json.summary !== "string" ||
    json.summary.length === 0
  ) {
    throw new Error("pdf-analyze returned incomplete data");
  }

  return {
    endpoint: "/api/pdf-analyze",
    fileName: json.fileName,
    textLength: json.textLength,
    summary: json.summary,
  };
}

async function main() {
  const routeChecks = await Promise.all([
    checkRoute("/intro"),
    checkRoute("/diagnosis/step1"),
    checkRoute("/diagnosis/step2"),
    checkRoute("/diagnosis/step3"),
    checkRoute("/diagnosis/step4"),
  ]);

  const apiChecks = await Promise.all([
    checkSendEmail(),
    checkSave(),
    checkPdfAnalyze(),
  ]);

  console.log(
    JSON.stringify(
      {
        ok: true,
        baseUrl,
        routeChecks,
        apiChecks,
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
        baseUrl,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
