import { describe, it, expect } from 'vitest';
import { isLocalMode } from '../localMode';

describe('isLocalMode', () => {
  it('returns false when flag is not true', () => {
    const original = import.meta.env.VITE_LOCAL_MODE;
    import.meta.env.VITE_LOCAL_MODE = 'false';
    expect(isLocalMode()).toBe(false);
    import.meta.env.VITE_LOCAL_MODE = original;
  });

  it('returns true when flag is true', () => {
    const original = import.meta.env.VITE_LOCAL_MODE;
    import.meta.env.VITE_LOCAL_MODE = 'true';
    expect(isLocalMode()).toBe(true);
    import.meta.env.VITE_LOCAL_MODE = original;
  });
});
