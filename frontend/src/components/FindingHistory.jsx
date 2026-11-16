import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { formatDate } from '../utils/format.js';

/**
 * Historial de seguimiento de un hallazgo: cada cambio de estado y cada observación.
 * - findingId: número del hallazgo.
 * - version: cambia cada vez que se guarda algo, para volver a cargar la lista.
 */
export default function FindingHistory({ findingId, version }) {
  const [updates, setUpdates] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api(`/findings/${findingId}/updates`)
      .then((result) => active && setUpdates(result))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [findingId, version]);

  if (error) return <p className="field-error">No se pudo cargar el seguimiento: {error}</p>;
  if (!updates) return <p className="muted">Cargando seguimiento…</p>;

  return (
    <div className="finding-history">
      <h4>Seguimiento</h4>
      {updates.length === 0 ? (
        <p className="muted">Todavía no hay cambios registrados.</p>
      ) : (
        <ol>
          {updates.map((update) => (
            <li key={update.id}>
              <span>
                {update.previousStatus === update.newStatus ? (
                  <>Observación ({update.newStatus})</>
                ) : (
                  <>
                    {update.previousStatus} → <strong>{update.newStatus}</strong>
                  </>
                )}
              </span>
              <span className="muted"> · {formatDate(update.createdAt)}</span>
              {update.note && <p>{update.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
