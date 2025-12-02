"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Mic, MessageCircle, Brain, Languages, Sparkles, Star, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import AppHeader from "./(main)/components/AppHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  const handleDashboardClick = () => {
    if (!user) {
      toast("You are not signed in", {
        description: "Please sign in to access the dashboard.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/handler/sign-in"), // Assuming stackframe sign-in route or just let them find the button
        },
      });
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Restored AppHeader */}
      <AppHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            AI-Powered Communication Coach
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          >
            Master the art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              conversation.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Elevate your speaking skills with real-time AI feedback.
            From public speaking to daily conversations, we've got you covered.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" className="h-12 px-8 text-lg rounded-full" onClick={handleDashboardClick}>
              Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<Mic className="h-6 w-6" />}
              title="Voice Analysis"
              desc="Get instant feedback on your tone, pace, and clarity."
              delay={0.1}
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Mock Interviews"
              desc="Practice with realistic AI interviewers tailored to your field."
              delay={0.2}
            />
            <FeatureCard
              icon={<Languages className="h-6 w-6" />}
              title="Language Learning"
              desc="Immersive conversations to boost fluency and confidence."
              delay={0.3}
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="Skill Development"
              desc="Structured lessons to improve specific communication areas."
              delay={0.4}
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Smart Suggestions"
              desc="Real-time vocabulary and phrasing improvements."
              delay={0.5}
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Q&A Practice"
              desc="Sharpen your critical thinking with rapid-fire questions."
              delay={0.6}
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Loved by Communicators</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="VocaCoach helped me ace my job interview. The AI feedback was spot on!"
              author="Sarah J."
              role="Software Engineer"
            />
            <TestimonialCard
              quote="I finally feel confident speaking in public. The practice sessions are amazing."
              author="Michael C."
              role="Marketing Director"
            />
            <TestimonialCard
              quote="A game changer for learning new languages. It feels like a real conversation."
              author="Elena R."
              role="Student"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FaqItem
              question="How does the AI coaching work?"
              answer="Our AI analyzes your speech in real-time, providing feedback on tone, pace, and vocabulary to help you improve instantly."
            />
            <FaqItem
              question="Is VocaCoach free to use?"
              answer="We offer a free tier with basic features. For advanced analytics and unlimited practice, check out our pro plans."
            />
            <FaqItem
              question="Can I practice for specific interview types?"
              answer="Yes! You can select from various interview scenarios, including behavioral, technical, and situational questions."
            />
            <FaqItem
              question="What languages are supported?"
              answer="Currently, we support English - more languages coming soon."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              VocaCoach
            </div>
            <p className="text-muted-foreground max-w-xs">
              Empowering voices everywhere with AI-driven communication coaching.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Features</Link></li>
              <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary">Testimonials</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 VocaCoach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group p-8 rounded-2xl bg-card border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="p-8 rounded-2xl bg-card border shadow-sm">
      <div className="flex gap-1 text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>
      <p className="text-lg mb-6 italic">"{quote}"</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}

function FaqItem({ question, answer }) {
  return (
    <div className="border rounded-lg px-4 py-3 bg-card">
      <details className="group">
        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
          <span>{question}</span>
          <span className="transition group-open:rotate-180">
            <ChevronDown className="h-4 w-4" />
          </span>
        </summary>
        <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
          {answer}
        </p>
      </details>
    </div>
  )
}
