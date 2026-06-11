"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { waLink, WA_MESSAGES, trackWAClick } from "@/lib/whatsapp";

export default function ParallaxHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      heroRef.current.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.45}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: "url(/images/portada-hero-medimundo.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center 50%",
        backgroundRepeat: "no-repeat",
        minHeight: "580px",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(2,132,199,0.32) 0%, rgba(56,189,248,0.18) 45%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      <div className="absolute top-0 right-0 z-10" style={{ transform: "translateY(-8%)" }}>
        <Image
          src="/logo-medimundo-v2.webp"
          alt="MediMundo"
          width={512}
          height={163}
          className="w-72 sm:w-[26rem] lg:w-[32rem]"
          style={{
            filter:
              "drop-shadow(0 3px 8px rgba(0,0,0,1)) drop-shadow(0 0 20px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(0,0,0,0.5))",
          }}
          priority
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div
          className="max-w-2xl rounded-2xl px-6 py-6"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
        >
          <h1
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)" }}
          >
            Equipo médico en renta
            <span className="block text-blue-100">a domicilio en Querétaro</span>
          </h1>
          <p
            className="mt-5 text-lg text-blue-50 sm:text-xl"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
          >
            Camas hospitalarias, concentradores de oxígeno, sillas de ruedas y más.
            Sanitizados, con entrega rápida y soporte continuo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rentas"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Productos en renta
            </Link>
            <a
              href={waLink(WA_MESSAGES.rentas)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWAClick("home_hero")}
              className="btn-whatsapp text-base px-7 py-3"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
