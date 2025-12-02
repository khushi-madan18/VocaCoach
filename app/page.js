
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mic, MessageCircle, Brain, Languages } from "lucide-react";
import { motion } from "framer-motion";
import AppHeader from "./(main)/components/AppHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ---------- header (use your AppHeader component) ---------- */}
      <AppHeader />

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-bold tracking-tight"
          >
            Master Communication with
            <span className="text-blue-600"> VocaCoach</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-gray-600 text-xl mt-4 max-w-2xl mx-auto"
          >
            AI-powered coaching for public speaking, interviews, skill development & languages —
            designed uniquely for you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-6 text-lg">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>

            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Hero media (video or image) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="mt-16"
          >
            {/* 
              Replace /landing-hero.png with your chosen hero asset.
              For a video you can swap this <Image> for a <video> element.
            */}
            <Image
              src="/landing-hero.png"
              alt="VocaCoach Hero"
              width={900}
              height={500}
              className="rounded-2xl shadow-xl mx-auto border"
            />
          </motion.div>
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">What You Can Do with VocaCoach</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <AnimatedCard icon={<Mic className="h-10 w-10 text-blue-600" />} title="AI Voice Coaching" desc="Speak naturally with real-time AI feedback and speech analysis." />
            <AnimatedCard icon={<MessageCircle className="h-10 w-10 text-blue-600" />} title="Mock Interviews" desc="Practice interviews with expert AI to boost confidence." />
            <AnimatedCard icon={<Languages className="h-10 w-10 text-blue-600" />} title="Language Learning" desc="Improve pronunciation, fluency, and vocabulary instantly." />
            <AnimatedCard icon={<Brain className="h-10 w-10 text-blue-600" />} title="Skill Training" desc="Topic-based lectures to boost your communication skills." />
            <AnimatedCard icon={<MessageCircle className="h-10 w-10 text-blue-600" />} title="Q/A Coach" desc="Get instant responses to improve clarity & thinking." />
            <AnimatedCard icon={<Mic className="h-10 w-10 text-blue-600" />} title="Meditation Mode" desc="Practice mindful speaking & reduce anxiety." />
          </div>
        </div>
      </section>

      {/* ---------------- CTA SECTION ---------------- */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold">Start Your Speaking Journey Today</h2>
        <p className="text-lg mt-3 opacity-90">Join thousands improving their skills with AI-powered coaching</p>

        <Link href="/dashboard">
          <Button size="lg" className="bg-white text-blue-600 mt-8 font-semibold px-10 py-6 text-lg">
            Go to Dashboard
          </Button>
        </Link>
      </section>
    </div>
  );
}

/* ------------ Animated Card Component ------------ */
function AnimatedCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-500 mt-2">{desc}</p>
    </motion.div>
  );
}

