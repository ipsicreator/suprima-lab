"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FDFBF7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: "95vw",
          maxHeight: "90vh",
          backgroundColor: "white",
          borderRadius: "24px",
          boxShadow: "0 30px 80px rgba(60, 20, 10, 0.15)",
          overflow: "hidden",
        }}
      >
        <Image
          src="/5_16_IMAGE.png"
          alt="대치 수프리마 랜딩"
          width={1600}
          height={900}
          priority
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "90vh",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />

        <Link
          href="/diagnosis/step1"
          style={{
            position: "absolute",
            bottom: "1%",
            left: "20%",
            width: "60%",
            height: "20%",
            zIndex: 10,
            cursor: "pointer",
          }}
          aria-label="진단 시작하기"
        />
      </div>
    </div>
  );
}
