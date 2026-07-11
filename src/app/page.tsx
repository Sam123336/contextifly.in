import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import LiveGraphComparison from "@/components/LiveGraphComparison";
import Metrics from "@/components/Metrics";
import Pipeline from "@/components/Pipeline";
import TraceFlow from "@/components/TraceFlow";
import Features from "@/components/Features";
import Versus from "@/components/Versus";
import Install from "@/components/Install";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <LiveGraphComparison />
        <Metrics />
        <Pipeline />
        <TraceFlow />
        <Features />
        <Versus />
        <Install />
      </main>
      <Footer />
    </>
  );
}
