import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-screen">
      <div className="home-shell">
        <section className="home-left">
          <div className="home-top-dot" />
          <div className="home-step-pills">
            <span className="home-pill active">1</span>
            <span className="home-pill" />
            <span className="home-pill" />
          </div>
          <div className="home-lines">
            <div className="home-line">1</div>
            <div className="home-line">2</div>
            <div className="home-line">3</div>
            <div className="home-line">4</div>
          </div>
          <Link href="/diagnosis/step1" className="home-start-button">
            시작하기
          </Link>
        </section>

        <section className="home-right">
          <article className="home-hero-card">
            <div className="home-card-head">
              <span>수프리마</span>
              <span>센터소개</span>
            </div>
            <Image
              src="/5_16_IMAGE.png"
              alt="수프리마 랩 서비스 소개"
              fill
              priority
              className="home-hero-image"
              sizes="(max-width: 900px) 100vw, 520px"
            />
          </article>

          <div className="home-bottom-grid">
            <article className="home-small-card">
              <div className="home-card-copy">
                <div className="home-mini-title">센터소개</div>
                <p>학생부 AI분석 · 입시전략 플랫폼</p>
              </div>
            </article>
            <article className="home-profile-card">
              <Image
                src="/reference/intro/center-director.JPG"
                alt="센터장 프로필"
                fill
                className="home-profile-image"
                sizes="(max-width: 900px) 100vw, 260px"
              />
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
