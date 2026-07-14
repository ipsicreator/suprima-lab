import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "수프리마 랩 결과 안내");
    const reportData = body?.reportData;

    if (!email) {
      return NextResponse.json({ error: "이메일 주소가 필요합니다." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `"${subject}" 이메일 발송 요청이 접수되었습니다.`,
      preview: JSON.stringify(reportData, null, 2).slice(0, 1000),
    });
  } catch {
    return NextResponse.json({ error: "이메일 발송 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
