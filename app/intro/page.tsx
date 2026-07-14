import Image from "next/image";
import Link from "next/link";

export default function IntroPage() {
  return (
    <main className="page-shell">
      <div className="app-card">
        <div className="intro-grid">
          <section className="content-card">
            <div className="kicker">센터 소개</div>
            <h1 className="title-xl">학생부 분석 · 입시 상담 안내</h1>
            <p className="desc">
              학생 정보 입력부터 학생부 분석, 탐구·독서·세특 제안, 입시 위치 진단까지 한 흐름으로 이어지는
              4단계 진단 서비스입니다.
            </p>
            <div className="badge-row">
              <span className="mini-badge">수프리마 제공</span>
              <span className="mini-badge">첫 화면 → 시작 → 1단계 이동</span>
              <span className="mini-badge">어려운 용어 최소화</span>
            </div>
            <div className="list">
              <div className="list-item">
                <strong>1단계</strong>
                <span>사용자 정보 입력과 학생부 자료 등록</span>
              </div>
              <div className="list-item">
                <strong>2단계</strong>
                <span>학생부 상세 분석 결과 확인</span>
              </div>
              <div className="list-item">
                <strong>3단계</strong>
                <span>탐구, 독서, 세특 주제와 문장 정리</span>
              </div>
              <div className="list-item">
                <strong>4단계</strong>
                <span>지원 판단과 입시 위치 진단 결과 정리</span>
              </div>
            </div>
            <div className="cta-row">
              <Link className="btn-primary" href="/diagnosis/step1">
                시작하기
              </Link>
            </div>
          </section>

          <div className="stack">
            <section className="image-card">
              <Image
                src="/reference/intro/landing-reference.jpg"
                alt="인트로 참조 화면"
                width={1400}
                height={900}
                priority
                className="reference-image"
              />
            </section>

            <section className="split-card">
              <article className="info-card">
                <div className="kicker">센터장</div>
                <h2 className="section-title">이기욱</h2>
                <p className="desc">센터 운영 방향과 상담 흐름을 소개합니다.</p>
              </article>
              <section className="image-card">
                <Image
                  src="/reference/intro/center-director.JPG"
                  alt="센터장 소개 이미지"
                  width={640}
                  height={640}
                  className="reference-image"
                />
              </section>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
