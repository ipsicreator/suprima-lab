import Link from "next/link";
import { ReactNode } from "react";
import { diagnosisLabels } from "@/app/diagnosis/messages";
import { diagnosisSteps } from "@/app/diagnosis/steps";

export default function DiagnosisShell({
  currentStep,
  title,
  subtitle,
  children,
}: {
  currentStep: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="app-shell">
      <div className="app-card">
        <header className="app-header">
          <Link href="/intro" className="brand-link">
            <span className="brand-mark" />
            <span className="brand-text">
              <strong>{diagnosisLabels.serviceTitle}</strong>
              <span>{diagnosisLabels.serviceSubtitle}</span>
            </span>
          </Link>
          <div className="shell-badge">{diagnosisLabels.badge}</div>
        </header>

        <section className="shell-hero">
          <div className="shell-step">{String(currentStep).padStart(2, "0")}</div>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </section>

        <nav className="step-strip" aria-label="진행 단계">
          {diagnosisSteps.map((step, index) => (
            <Link key={step.no} href={step.href} className={index + 1 === currentStep ? "step-chip active" : "step-chip"}>
              <span>{step.no}</span>
              <strong>{step.title}</strong>
              <em>{step.description}</em>
            </Link>
          ))}
        </nav>

        <section className="shell-content">{children}</section>
      </div>
    </main>
  );
}
