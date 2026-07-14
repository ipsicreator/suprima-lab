import Image from "next/image";
import Link from "next/link";

export default function IntroPage() {
  return (
    <main className="page-shell">
      <div className="app-card">
        <div className="intro-grid">
          <section className="content-card">
            <div className="kicker">센터 소개</div>
            <h1 className="title-xl">학생부 분석부터 입시 위치 진단까지</h1>
            <p className="desc">
              학생정보 입력, 학생부 분석, 탐구주제와 세특 정리, 입시 위치 진단까지 이어지는 4단계 서비스를 한 화면에서 시작합니다.
            </p>
            <div className="badge-row">
              <span className="mini-badge">수프리마 랩</span>
              <span className="mini-badge">첫 화면에서 시작</span>
              <span className="mini-badge">1단계로 바로 이동</span>
            </div>
            <div className="list">
              <div className="list-item">
                <strong>1단계</strong>
                <span>학생정보 입력과 학생부 업로드</span>
              </div>
              <div className="list-item">
                <strong>2단계</strong>
                <span>학생부 분석 결과 확인</span>
              </div>
              <div className="list-item">
                <strong>3단계</strong>
                <span>탐구, 독서, 세특 정리</span>
              </div>
              <div className="list-item">
                <strong>4단계</strong>
                <span>입시 위치 진단 결과 정리</span>
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
                alt="첫 화면 참고 이미지"
                width={1400}
                height={900}
                priority
                className="reference-image"
              />
            </section>

            <section className="split-card">
              <article className="info-card">
                <div className="kicker">센터장 소개</div>
                <h2 className="section-title">대치수프리마 입시&코칭센터</h2>
                <p className="desc">수프리마 랩은 학생부 분석과 입시 진단을 한 번에 연결하는 서비스입니다.</p>
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
