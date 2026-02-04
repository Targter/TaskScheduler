"use client"

import { useLayoutEffect, useRef, useState } from "react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

import { Swiper, SwiperSlide } from "swiper/react"
import { Mousewheel } from "swiper/modules"
import "swiper/css"

import Link from "next/link"

import {
  CheckCircle2,
  CalendarClock,
  Share2,
  Linkedin,
  Twitter,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layout,
  Menu,
  Command,
  ArrowUpRight,
} from "lucide-react"

export const dynamic = "force-static"

export default function LandingPage() {
  const navInnerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!navInnerRef.current) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px)", () => {
      gsap.to(navInnerRef.current!, {
        scale: 0.94,
        y: -5,
        backgroundColor: "rgba(9,9,11,0.85)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        ease: "power2.out",
        scrollTrigger: {
          start: "top+=60 top",
          end: "top+=140 top",
          scrub: 1.2,
        },
      })
    })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      })

      tl.from(".hero-badge", {
        y: 12,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          ".hero-title span",
          {
            y: 70,
            opacity: 0,
            stagger: 0.14,
            duration: 0.9,
          },
          "-=0.3",
        )
        .from(
          ".hero-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".hero-actions",
          {
            y: 18,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          ".hero-platforms",
          {
            opacity: 0,
            duration: 0.6,
          },
          "-=0.2",
        )
    }, heroRef)

    return () => ctx.revert()

    return () => mm.revert()
  }, [])

  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans selection:bg-blue-500/30">
      {/* --- SLIM NAVBAR --- */}
      <nav className="fixed top-5 left-0 right-0 z-50 pointer-events-none">
        <div
          ref={navInnerRef}
          className="
            pointer-events-auto
            mx-auto max-w-6xl
            h-12 px-6
            flex items-center justify-between
            rounded-full
            bg-zinc-900/70 backdrop-blur-xl
            ring-1 ring-white/10
            shadow-lg shadow-black/40
            transition-colors duration-300
          "
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center">
              <Command className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">
              Schedulr
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Workflow", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="
                  text-[11px] font-medium uppercase tracking-widest
                  text-zinc-400
                  hover:text-white
                  transition-colors
                "
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="
              h-8 px-4
              flex items-center
              rounded-full
              bg-blue-600 text-white
              text-[10px] font-bold uppercase tracking-widest
              hover:bg-blue-500
              transition
              active:scale-[0.96]
            "
          >
            Open App
          </Link>
        </div>
      </nav>

      <main className="lg:pt-44 pt-24 lg:pb-24 relative overflow-hidden">
        {/* glow */}
        <div className="hero-glow absolute top-0 left-1/2 -translate-x-1/2 w-130 h-65 bg-blue-500/20 blur-[140px] rounded-full pointer-events-none" />

        <div
          ref={heroRef}
          className="max-w-5xl mx-auto px-6 relative z-10 text-center"
        >
          {/* badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">
            <span className="text-emerald-400">v1.0</span> X · LinkedIn
            <span className="opacity-40">→</span>
            <span className="flex items-center gap-1 text-blue-400">
              v2.0 Meta
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-blue-500 opacity-40 animate-ping" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-blue-500" />
              </span>
            </span>
          </div>

          {/* headline */}
          <h1 className="hero-title text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6 leading-[1.05]">
            <span className="block">Build Your Posting Pipeline.</span>
            <span className="block text-zinc-500">
              We’ll Handle the Timing.
            </span>
          </h1>

          {/* description */}
          <p className="hero-desc text-sm md:text-base text-zinc-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Schedule and queue tweets and LinkedIn posts by date. Maintain a
            consistent posting rhythm without logging in every time.
          </p>

          {/* actions */}
          <div className="hero-actions flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
            <Link
              href="/dashboard"
              className="h-10 px-6 flex items-center justify-center bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-500 hover:shadow-blue-900/40 transition shadow-md shadow-blue-900/20 active:scale-[0.97]"
            >
              Start Free Trial
            </Link>

            <a
              href="#workflow"
              className="h-10 px-6 flex items-center justify-center bg-zinc-900/60 border border-white/10 text-zinc-400 text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 hover:border-white/20 hover:text-white transition active:scale-[0.97]"
            >
              View Workflow
            </a>
          </div>

          {/* platforms */}
          <div className="hero-platforms flex justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-white transition">
              <Twitter size={14} /> X
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-white transition">
              <Linkedin size={14} /> LinkedIn
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-blue-400/70">
              <MessageCircle size={14} />
              WhatsApp
              <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-[9px] tracking-widest">
                SOON
              </span>
            </div>
          </div>
        </div>
      </main>

      <section className="py-32 bg-[#09090b] relative overflow-hidden">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="w-175 h-87.5 bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          {/* context */}
          <div className="mb-14 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 mb-4">
              Live System Preview
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              See the scheduler doing real work
            </h3>
            <p className="mt-3 text-sm text-zinc-500 max-w-xl mx-auto">
              This is not a mockup. Every action you see here is part of the actual scheduling pipeline.
            </p>
          </div>

          {/* video frame */}
          <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/70">

            {/* chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>

              <span className="text-[10px] uppercase tracking-widest text-zinc-500 opacity-0 group-hover:opacity-100 transition">
                Click to expand
              </span>
            </div>

            {/* video */}
            <div className="relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                onClick={() => setOpen(true)}
              >
                <source src="/preview.mp4" type="video/mp4" />
              </video>

              {/* play overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition">
                  <div className="h-14 w-14 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10">
                    <span className="ml-1 text-white text-xl">▶</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* trust line */}
          <p className="mt-10 text-center text-sm text-zinc-500">
            Real queues. Real execution. Logged in real time.
          </p>
        </div>

        {/* fullscreen modal */}
        {open && (
          <div
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => setOpen(false)}
          >
            <video
              controls
              autoPlay
              className="max-w-5xl w-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <source src="/preview.mp4" type="video/mp4" />
            </video>
          </div>
        )}
      </section>

      <section id="features" className="py-25 bg-[#09090b] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-20 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 mb-4">
              Core Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
              A scheduling system, not a posting tool
            </h2>
            <p className="mt-5 text-base text-zinc-500">
              Each feature removes a decision. What to post, when to post, and
              where — handled once, executed automatically.
            </p>
          </div>

          {/* Swiper */}
          <Swiper
            modules={[Mousewheel]}
            spaceBetween={32}
            slidesPerView={1.1}
            mousewheel={{ forceToAxis: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.5 },
            }}
            className="pb-10"
          >
            <SwiperSlide>
              <FeatureSlide
                icon={<CalendarClock size={18} />}
                title="Pipeline Queue"
                desc="Posts move through a deterministic queue instead of relying on reminders or alarms."
                detail="Dates in. Execution guaranteed."
              />
            </SwiperSlide>

            <SwiperSlide>
              <FeatureSlide
                icon={<Share2 size={18} />}
                title="Multi-Channel Publishing"
                desc="Publish to X and LinkedIn from a single pipeline without duplicating work."
                detail="One system. Multiple platforms."
              />
            </SwiperSlide>

            <SwiperSlide>
              <FeatureSlide
                icon={<Zap size={18} />}
                title="Zero-Latency Interface"
                desc="Every interaction is instant. No spinners. No waiting states."
                detail="Speed is part of reliability."
              />
            </SwiperSlide>

            <SwiperSlide>
              <FeatureSlide
                icon={<Layout size={18} />}
                title="Writer Mode"
                desc="Batch ideas, draft content, and schedule later without breaking flow."
                detail="Designed for long sessions."
              />
            </SwiperSlide>

            <SwiperSlide>
              <FeatureSlide
                icon={<ShieldCheck size={18} />}
                title="Secure OAuth"
                desc="Official integrations keep your accounts safe and compliant."
                detail="No credential shortcuts."
              />
            </SwiperSlide>

            <SwiperSlide>
              <FeatureSlide
                icon={<Command size={18} />}
                title="Execution Logs"
                desc="Every scheduled post is tracked from queue to publish."
                detail="Nothing happens silently."
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <section className="py-25 bg-[#09090b] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-4">
              System Overview
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              Your content runs on a schedule — not reminders
            </h3>
            <p className="mt-4 text-base text-zinc-500 max-w-xl mx-auto">
              Every post enters a pipeline, waits its turn, and publishes
              exactly when scheduled.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Queue Status */}
            <div className="group relative rounded-2xl border border-white/5 bg-zinc-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10">
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
                Queue Status
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
                  <span className="relative rounded-full bg-emerald-400 h-2 w-2" />
                </span>
                <p className="text-lg font-semibold text-white">Active</p>
              </div>

              <p className="text-sm text-zinc-500">
                Posts waiting for scheduled execution
              </p>
            </div>

            {/* Last Delivery */}
            <div className="group relative rounded-2xl border border-white/5 bg-zinc-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10">
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
                Last Delivery
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />
                  <span className="relative rounded-full bg-blue-400 h-2 w-2" />
                </span>
                <p className="text-lg font-semibold text-white">Successful</p>
              </div>

              <p className="text-sm text-zinc-500">
                Published without delay or retries
              </p>
            </div>

            {/* Platforms */}
            <div className="group relative rounded-2xl border border-white/5 bg-zinc-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10">
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
                Platforms
              </p>

              <p className="text-lg font-semibold text-white mb-1">
                X · LinkedIn
              </p>

              <p className="text-sm text-zinc-500 flex items-center gap-2">
                WhatsApp channels
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 tracking-widest">
                  SOON
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-25 bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-6">
          {/* header */}
          <div className="text-center mb-24">
            <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500 mb-4">
              Pricing
            </h2>
            <p className="text-3xl md:text-4xl font-semibold text-white">
              Pick a plan that fits how you publish
            </p>
            <p className="mt-4 text-base text-zinc-500 max-w-xl mx-auto">
              Start free. Upgrade when consistency becomes your advantage.
            </p>
          </div>

          {/* pricing layout */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
            {/* Starter */}
            <div className="opacity-80 hover:opacity-100 transition">
              <div className="p-8 rounded-2xl bg-zinc-900/40 flex flex-col h-full">
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-3">
                    Starter
                  </p>
                  <p className="text-4xl font-semibold text-white mb-1">$0</p>
                  <p className="text-sm text-zinc-500">For trying things out</p>
                </div>

                <ul className="space-y-4 text-sm text-zinc-400 mb-10">
                  <li>Up to 3 social accounts</li>
                  <li>10 scheduled posts / month</li>
                  <li>Manual publishing control</li>
                  <li>Basic activity overview</li>
                </ul>

                {/* CTA */}
                <button className="mt-auto h-11 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Pro */}
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-blue-500 text-white">
                Most Popular
              </div>

              <div className="p-10 rounded-3xl bg-linear-to-b from-blue-500/10 to-zinc-900/80 border border-blue-500/30 shadow-2xl shadow-blue-900/30 flex flex-col h-full">
                <div className="mb-10">
                  <p className="text-xs uppercase tracking-widest text-blue-400 mb-3">
                    Pro
                  </p>
                  <p className="text-5xl font-semibold text-white mb-1">$15</p>
                  <p className="text-sm text-zinc-400">
                    For creators who post consistently
                  </p>
                </div>

                <ul className="space-y-4 text-sm text-zinc-300 mb-12">
                  <li>Unlimited social accounts</li>
                  <li>Unlimited scheduled posts</li>
                  <li>Email notifications</li>
                  <li>WhatsApp channel support</li>
                  <li>Priority delivery & execution</li>
                </ul>

                {/* CTA */}
                <button className="mt-auto h-11 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold text-sm text-white">
                  Start Pro Trial
                </button>
              </div>
            </div>

            {/* Agency */}
            <div className="opacity-80 hover:opacity-100 transition">
              <div className="p-8 rounded-2xl bg-zinc-900/40 flex flex-col h-full">
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-3">
                    Agency
                  </p>
                  <p className="text-4xl font-semibold text-white mb-1">$49</p>
                  <p className="text-sm text-zinc-500">
                    For teams & client work
                  </p>
                </div>

                <ul className="space-y-4 text-sm text-zinc-400 mb-10">
                  <li>Everything in Pro</li>
                  <li>Up to 5 team members</li>
                  <li>Role-based access</li>
                  <li>Collaborative scheduling</li>
                  <li>Shared dashboards</li>
                  <li>API access</li>
                </ul>

                {/* CTA */}
                <button className="mt-auto h-11 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition">
                  Start Agency Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-25 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400 mb-4">
              System Confidence
            </p>
            <h3 className="text-3xl md:text-4xl font-semibold text-white">
              Built like infrastructure, not a reminder app
            </h3>
            <p className="mt-4 text-base text-zinc-400 max-w-2xl">
              Schedulr behaves like a delivery system — posts move through
              states, get validated, executed, and logged.
            </p>
          </div>

          {/* Panel */}
          <div className="rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-md overflow-hidden">
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-3 px-8 py-5 border-b border-white/10 text-[11px] uppercase tracking-widest text-zinc-400">
              <span>Component</span>
              <span>Status</span>
              <span>Notes</span>
            </div>

            {/* Item */}
            <div className="px-6 md:px-8 py-6 border-b border-white/5">
              <div className="md:grid md:grid-cols-3 md:gap-4">
                <div className="text-white font-medium">Scheduling Engine</div>
                <div className="mt-1 md:mt-0 text-emerald-400 font-medium">
                  Operational
                </div>
                <div className="mt-2 md:mt-0 text-sm text-zinc-400">
                  Queue processing active
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 py-6 border-b border-white/5">
              <div className="md:grid md:grid-cols-3 md:gap-4">
                <div className="text-white font-medium">Post Queue</div>
                <div className="mt-1 md:mt-0 text-emerald-400 font-medium">
                  Stable
                </div>
                <div className="mt-2 md:mt-0 text-sm text-zinc-400">
                  Waiting for execution
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 py-6 border-b border-white/5">
              <div className="md:grid md:grid-cols-3 md:gap-4">
                <div className="text-white font-medium">Delivery Workers</div>
                <div className="mt-1 md:mt-0 text-emerald-400 font-medium">
                  Running
                </div>
                <div className="mt-2 md:mt-0 text-sm text-zinc-400">
                  Automatic retries enabled
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 py-6">
              <div className="md:grid md:grid-cols-3 md:gap-4">
                <div className="text-white font-medium">Audit Logs</div>
                <div className="mt-1 md:mt-0 text-blue-400 font-medium">
                  Recording
                </div>
                <div className="mt-2 md:mt-0 text-sm text-zinc-400">
                  Every post tracked
                </div>
              </div>
            </div>
          </div>

          {/* Footer line */}
          <div className="mt-8">
            <p className="text-sm text-zinc-400">
              This is why posts go out even when you’re offline.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between gap-10">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Command size={16} className="text-white" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  Schedulr
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">
                  v1.0.4-stable
                </span>
              </div>

              <p className="text-sm text-zinc-500 max-w-xs">
                A scheduling system for creators who value consistency over
                reminders.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
              {/* Product */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Product
                </p>
                <a
                  href="#features"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Pricing
                </a>
                <a
                  href="/dashboard"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Dashboard
                </a>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Legal
                </p>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Security
                </a>
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Contact
                </p>
                <a
                  href="mailto:abhaybansal@.com"
                  className="text-zinc-400 hover:text-white transition"
                >
                  abhaybansal@.com
                </a>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition"
                >
                  System Status
                </a>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-zinc-600">
              © 2026 Schedulr. All rights reserved.
            </p>

            <p className="text-[11px] text-zinc-600">
              Built for creators · Designed for reliability
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureSlide({
  icon,
  title,
  desc,
  detail,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  detail: string
}) {
  return (
    <div className="h-full rounded-2xl bg-[#0b0b10] border border-white/5 p-8 transition-all duration-300 hover:border-blue-500/30 hover:-translate-y-1">
      {/* Icon */}
      <div className="mb-6 flex h-8 w-16 lg:h-10 lg:w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>

      {/* Main description */}
      <p className="text-sm text-zinc-400 leading-relaxed mb-4">{desc}</p>

      {/* Supporting line */}
      <p className="text-xs uppercase tracking-widest text-blue-400/80">
        {detail}
      </p>
    </div>
  )
}

function PricingCard({ tier, price, features, highlight = false }: any) {
  return (
    <div
      className={`
        flex flex-col h-full p-8 rounded-2xl border transition-all duration-300
        ${
          highlight
            ? "bg-zinc-900 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-[1.03]"
            : "bg-zinc-900/40 border-white/5 hover:border-white/15 hover:-translate-y-1"
        }
      `}
    >
      {/* Header */}
      <div className="mb-8">
        <span
          className={`text-[11px] font-bold uppercase tracking-[0.25em] ${
            highlight ? "text-blue-400" : "text-zinc-500"
          }`}
        >
          {tier}
        </span>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-4xl font-semibold text-white tracking-tight">
            ${price}
          </span>
          <span className="text-sm text-zinc-500">/mo</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-10">
        {features.map((f: string) => (
          <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
            <CheckCircle2
              size={14}
              className={highlight ? "text-blue-400" : "text-zinc-600"}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={`
          mt-auto h-11 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all
          ${
            highlight
              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30"
              : "border border-white/10 text-white hover:bg-white/5"
          }
          active:scale-[0.97]
        `}
      >
        Get Started
      </button>
    </div>
  )
}
