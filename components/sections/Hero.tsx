import { Container } from "../ui/Container";
import { profile } from "@/data/profile";
import { DotGrid } from "../fx/DotGrid";
import { ScrambleText } from "../fx/ScrambleText";
import { TypeLine } from "../fx/TypeLine";
import { MagneticButton } from "../fx/MagneticButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-40 sm:pb-28">
      <DotGrid />
      <Container className="relative">
        <p className="mb-6 font-mono text-lg text-muted sm:text-xl">
          <span className="text-terminal">$</span> whoami
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          <ScrambleText text={profile.name} />
        </h1>
        <p className="mt-4 text-xl text-muted sm:text-2xl">{profile.title}</p>
        <p className="mt-6 max-w-xl font-mono text-sm text-muted">
          <span className="text-terminal">&gt;</span> <TypeLine text={profile.tagline} />
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton
            href="#work"
            className="inline-block rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg"
          >
            See the work
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="inline-block rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-fg"
          >
            Get in touch
          </MagneticButton>
        </div>
        <p className="mt-8 text-sm text-muted">{profile.location}</p>
      </Container>
    </section>
  );
}
