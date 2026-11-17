import { useState } from 'react';
import { SectionTitle } from '../components/Ui.jsx';
import { api } from '../services/api.js';

/**
 * Página Mi cuenta: cambiar el nombre, cambiar la contraseña y cerrar sesión.
 * - user: usuario conectado.
 * - onUserUpdate: avisa a la app de que el usuario cambió (por ejemplo, el nombre).
 * - onLogout: cierra la sesión.
 */
export default function Profile({ user, onUserUpdate, onLogout }) {
  const [name, setName] = useState(user.name);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  /** Ejecuta una acción mostrando "guardando", y luego el mensaje de éxito o el error. */
  async function save(action, successMessage) {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await action();
      setSuccess(successMessage);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function updateProfile(event) {
    event.preventDefault();
    save(async () => {
      const response = await api('/auth/me', { method: 'PATCH', body: { name } });
      onUserUpdate(response.user);
    }, 'Perfil actualizado.');
  }

  function changePassword(event) {
    event.preventDefault();
    save(async () => {
      if (next !== confirm) throw new Error('Las contraseñas no coinciden.');
      await api('/auth/change-password', {
        method: 'POST',
        body: { currentPassword: current, newPassword: next },
      });
      setCurrent('');
      setNext('');
      setConfirm('');
    }, 'Contraseña actualizada. Las otras sesiones quedaron cerradas.');
  }

  return (
    <div className="two-col layout-form">
      <section className="card">
        <SectionTitle
          title="Datos de tu cuenta"
          description="En modo de prueba, los datos solo se guardan en este navegador. No es una cuenta real."
        />
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="notice-text">
            {success}
          </p>
        )}
        <form className="form-stack" onSubmit={updateProfile}>
          <label htmlFor="profile-name">Nombre</label>
          <input
            id="profile-name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={120}
          />
          <label htmlFor="profile-email">Correo registrado</label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            aria-describedby="fixed-email"
          />
          <small id="fixed-email">En esta fase el correo no puede cambiarse.</small>
          <button className="btn primary" disabled={saving}>
            Guardar cambios
          </button>
        </form>
      </section>

      <section className="card">
        <SectionTitle
          title="Seguridad"
          description="Actualiza tu contraseña. Debe tener al menos 12 caracteres."
        />
        <form className="form-stack" onSubmit={changePassword}>
          <label htmlFor="profile-current">Contraseña actual</label>
          <input
            id="profile-current"
            type="password"
            autoComplete="current-password"
            required
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <label htmlFor="profile-next">Nueva contraseña</label>
          <input
            id="profile-next"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <label htmlFor="profile-confirm">Confirmar nueva contraseña</label>
          <input
            id="profile-confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button className="btn secondary" disabled={saving}>
            Cambiar contraseña
          </button>
        </form>
        <button className="inline-link profile-logout" onClick={onLogout}>
          Cerrar sesión en este dispositivo
        </button>
      </section>
    </div>
  );
}
