## Context

The current app requires Firebase and Supabase environment variables to boot. This blocks local UI development for contributors who do not have project credentials. We need an explicit local mode that swaps real services for mock data/providers.

## Goals / Non-Goals

**Goals:**

- Allow `npm run dev` to start without Firebase/Supabase credentials when local mode is enabled.
- Provide mock data for resources, documents, and guests to exercise UI flows.
- Keep production behavior unchanged when local mode is off.

**Non-Goals:**

- Implement full offline persistence or sync.
- Replace Firebase in production.

## Decisions

- **Introduce a `VITE_LOCAL_MODE` flag.**
  - Decision: Gate service initialization and providers based on `import.meta.env.VITE_LOCAL_MODE === 'true'`.
  - Rationale: Minimal surface area change, easy for contributors.
  - Alternative: Use Firebase emulator suite. Rejected for simplicity (still requires setup).

- **Add mock data providers for core collections.**
  - Decision: Provide mock resource/document/guest data and stub auth state when local mode is enabled.
  - Rationale: Allows UI to render key screens without network.

## Risks / Trade-offs

- **[Risk]** Local mode diverges from production behavior → **Mitigation:** keep mocks minimal and clearly labeled in code.
