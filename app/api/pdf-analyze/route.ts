import path from "node:path";
import { pathToFileURL } from "node:url";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

PDFParse.setWorker(
  pathToFileURL(
    path.join(process.cwd(), "node_modules", "pdf-parse", "dist", "worker", "pdf.worker.mjs"),
  ).href,
);

function pickKeywords(text: string) {
  const words = text
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2);

  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function pickHighlights(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 12)
    .slice(0, 5);
}

export async function POST(request: Request) {
  let parser: PDFParse | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF 파일이 필요합니다." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text.replace(/\s+\n/g, "\n").trim();
    const preview = text.slice(0, 1200);
    const keywords = pickKeywords(text);
    const highlights = pickHighlights(text);

    return NextResponse.json({
      fileName: file.name,
      textLength: text.length,
      preview,
      highlights,
      keywords,
      summary: highlights[0] || "추출된 핵심 문장이 없습니다.",
    });
  } catch (error) {
    console.error("[pdf-analyze]", error);
    return NextResponse.json({ error: "PDF 분석 중 오류가 발생했습니다." }, { status: 500 });
  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
}
