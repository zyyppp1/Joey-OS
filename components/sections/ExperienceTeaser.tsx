import Link from "next/link";
import { Section } from "../ui/Section";
import { experience } from "@/data/resume";

export function ExperienceTeaser() {
  return (
    <Section id="experience" eyebrow="background" title="Where I've worked">
      <div className="space-y-4">
        {experience.map((job) => (
          <div
            key={job.company}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-4 last:border-b-0"
          >
            <p className="font-medium">
              {job.role} · {job.company}
            </p>
            <span className="font-mono text-xs text-muted">{job.period}</span>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/about" className="font-mono text-sm text-accent hover:underline">
          More about me →
        </Link>
      </div>
    </Section>
  );
}
