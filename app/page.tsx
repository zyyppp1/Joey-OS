import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AiShowcase } from "@/components/sections/AiShowcase";
import { ExperienceTeaser } from "@/components/sections/ExperienceTeaser";
import { Writing } from "@/components/sections/Writing";
import { Contact } from "@/components/sections/Contact";
import { Section } from "@/components/ui/Section";
import { SystemStatus } from "@/components/SystemStatus";
import { Reveal } from "@/components/fx/Reveal";
import { ScrollProgress } from "@/components/fx/ScrollProgress";

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Hero />
      <FeaturedWork />
      <AiShowcase />

      <Section eyebrow="proof" title="This page is alive">
        <Reveal>
          <SystemStatus />
        </Reveal>
      </Section>

      <ExperienceTeaser />
      <Writing />

      <Section eyebrow="easter egg" title="Where it started">
        <Reveal>
          <Link href="/joey-os" className="group block">
            <div className="rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-fg">
              <p className="font-mono text-sm">
                <span className="text-terminal">$</span> ./launch joey-os --original
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The first version of this site was a draggable retro desktop OS.
                I rebuilt the portfolio — but kept the original as a playable
                exhibit. Drag the windows around.
              </p>
              <span className="mt-4 inline-block font-mono text-xs text-accent">
                Launch the original Joey OS →
              </span>
            </div>
          </Link>
        </Reveal>
      </Section>

      <Contact />
    </main>
  );
}
