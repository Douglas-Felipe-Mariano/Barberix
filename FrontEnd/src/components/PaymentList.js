import React, { useEffect, useState } from 'react';
import './paymentList.css';
import PaymentActions from './PaymentActions';
import PaymentDetailsModal from './PaymentDetailsModal';

export default function PaymentList({ pagamentos, payments, loading, onEdit, onDelete, editingId, onRefresh }) {
  const [viewPayment, setViewPayment] = useState(null);

  // supports both props: 'pagamentos' (pt) or 'payments' (en)
  const list = pagamentos || payments || [];

  useEffect(() => {
    if (!editingId) return;
    const el = document.querySelector(`[data-payment-id="${editingId}"]`);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editingId]);

  const handleView = (p) => setViewPayment(p);
  const handleCloseView = () => setViewPayment(null);

  const handleUpdated = (updated, options) => {
    if (options && options.openEdit) {
      onEdit && onEdit(updated);
      setViewPayment(null);
      return;
    }
    onRefresh && onRefresh();
    setViewPayment(null);
  };

  if (loading) return <div>Carregando pagamentos...</div>;
  if (!list || list.length === 0) return <div className="empty-list">Nenhum pagamento registrado.</div>;

  return (
    <div className="payment-list">
      {list.map(p => (
        <div
          key={p.id || p.paymentId}
          data-payment-id={p.id || p.paymentId}
          className={`payment-card ${String(p.id || p.paymentId) === String(editingId) ? 'editing' : ''}`}
        >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <div><strong>Valor:</strong> R$ {Number(p.valor || 0).toFixed(2)}</div>
              <div><strong>Forma:</strong> {p.formaPagamento}</div>
              <div><strong>Data:</strong> {p.dataPagamento ? new Date(p.dataPagamento).toLocaleString() : '-'}</div>
            </div>
            <div>
              <div><strong>Agendamento:</strong> {p.agendamentoId || '-'}</div>
              <div><strong>Cliente:</strong> {p.clienteId || '-'}</div>
            </div>
          </div>
          {p.observacao && <div style={{marginTop: 8}}><em>{p.observacao}</em></div>}
          <div style={{marginTop: 8}}>
            <PaymentActions payment={p} onEdit={onEdit} onDelete={onDelete} onView={() => handleView(p)} />
          </div>
        </div>
      ))}

      {viewPayment && <PaymentDetailsModal payment={viewPayment} onClose={handleCloseView} onUpdated={handleUpdated} />}
    </div>
  );
}
