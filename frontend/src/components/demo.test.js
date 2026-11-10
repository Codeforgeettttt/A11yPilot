import { describe, expect, it } from 'vitest';
import { impactKind } from './Ui.jsx';
describe('impactos visibles',()=>{it('diferencia impacto crítico',()=>expect(impactKind('Crítico')).toBe('error'));it('conserva estado neutro',()=>expect(impactKind('Menor')).toBe('muted'))});
