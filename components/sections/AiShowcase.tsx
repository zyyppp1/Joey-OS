import { Section } from "../ui/Section";
import { AiShowcaseInteractive } from "./AiShowcaseInteractive";

export function AiShowcase() {
  return (
    <Section id="ask" eyebrow="try it" title="Interrogate my AI">
      <p className="max-w-xl text-muted">
        I built an AI assistant grounded in a real knowledge base — with guardrails
        against making things up. Ask it anything about my background, or tap an
        example to see it answer.
      </p>
      <div className="mt-6">
        <AiShowcaseInteractive />
      </div>
    </Section>
  );
}
