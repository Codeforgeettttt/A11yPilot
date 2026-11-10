import { describe, expect, it, vi } from 'vitest';
import { submitAndRefresh } from './submitAndRefresh.js';

describe('guardado seguro de formularios', () => {
  it('no informa éxito ni refresca cuando falla la operación', async () => {
    const action = vi.fn().mockRejectedValue(new Error('Sin conexión'));
    const refresh = vi.fn();
    const success = vi.fn();
    const error = vi.fn();
    expect(await submitAndRefresh(action, refresh, success, error, 'Guardado')).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith('Sin conexión');
  });

  it('refresca y confirma tras guardar correctamente', async () => {
    const action = vi.fn().mockResolvedValue(undefined);
    const refresh = vi.fn().mockResolvedValue(undefined);
    const success = vi.fn();
    const error = vi.fn();
    expect(await submitAndRefresh(action, refresh, success, error, 'Proyecto creado.')).toBe(true);
    expect(refresh).toHaveBeenCalledOnce();
    expect(success).toHaveBeenCalledWith('Proyecto creado.');
    expect(error).not.toHaveBeenCalled();
  });

  it('evita repetir una operación ya guardada si falla la recarga de datos', async () => {
    const action = vi.fn().mockResolvedValue(undefined);
    const refresh = vi.fn().mockRejectedValue(new Error('Tiempo agotado'));
    const success = vi.fn();
    const error = vi.fn();
    expect(await submitAndRefresh(action, refresh, success, error, 'Guardado')).toBe(true);
    expect(action).toHaveBeenCalledOnce();
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Los cambios se guardaron'));
  });
});
