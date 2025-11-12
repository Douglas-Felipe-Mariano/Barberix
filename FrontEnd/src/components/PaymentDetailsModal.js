import React from 'react';
import './paymentDetailsModal.css';
import paymentsService from '../services/payments';

export default function PaymentDetailsModal({ payment, onClose, onUpdated }) {
  if (!payment) return null;

  const handleDownload = () => {
    const data = payment.comprovanteBase64;
    if (!data) return;
    const parts = data.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const blob = new Blob([u8arr], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante_${payment.id || payment.paymentId || 'pag'}.` + (mime.split('/')[1] || 'bin');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const html = `
      <html>
        <head>
          <title>Recibo</title>
          <style>body{font-family: Arial; background:#111;color:#eee;padding:20px}</style>
        </head>
        <body>
          <h2>Recibo de Pagamento</h2>
          <p><strong>ID:</strong> ${payment.id || payment.paymentId || ''}</p>
          <p><strong>Agendamento:</strong> ${payment.agendamentoId || '-'}</p>
          <p><strong>Cliente:</strong> ${payment.clienteId || '-'}</p>
          <p><strong>Valor:</strong> R$ ${Number(payment.valor || 0).toFixed(2)}</p>
          <p><strong>Forma:</strong> ${payment.formaPagamento || '-'}</p>
          <p><strong>Data:</strong> ${payment.dataPagamento ? new Date(payment.dataPagamento).toLocaleString() : '-'}</p>
          <p><strong>Observação:</strong> ${payment.observacao || ''}</p>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleRefund = async () => {
    if (!window.confirm('Confirmar estorno/cancelamento deste pagamento?')) return;
    try {
      const updated = { ...payment, status: 'CANCELADO' };
      await paymentsService.update(payment.id || payment.paymentId, updated);
      if (onUpdated) onUpdated(updated);
      alert('Pagamento marcado como CANCELADO');
    } catch (err) {
      console.error(err);
      alert('Erro ao cancelar pagamento');
    }
  };

  return (
    <div className="payment-details-overlay">
      <div className="payment-details-modal">
        <div className="payment-details-header">
          <h3>Detalhes do Pagamento</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="payment-details-body">
          <div className="detail-row"><strong>ID:</strong> {payment.id || payment.paymentId}</div>
          <div className="detail-row"><strong>Agendamento:</strong> {payment.agendamentoId || '-'}</div>
          <div className="detail-row"><strong>Cliente:</strong> {payment.clienteId || '-'}</div>
          <div className="detail-row"><strong>Valor:</strong> R$ {Number(payment.valor || 0).toFixed(2)}</div>
          <div className="detail-row"><strong>Forma:</strong> {payment.formaPagamento || '-'}</div>
          <div className="detail-row"><strong>Data:</strong> {payment.dataPagamento ? new Date(payment.dataPagamento).toLocaleString() : '-'}</div>
          <div className="detail-row"><strong>Status:</strong> {payment.status || '-'}</div>
          {payment.observacao && <div className="detail-row"><strong>Observação:</strong> <em>{payment.observacao}</em></div>}

          {payment.comprovanteBase64 ? (
            <div className="comprovante-preview">
              {payment.comprovanteBase64.startsWith('data:image') ? (
                <img src={payment.comprovanteBase64} alt="Comprovante" />
              ) : (
                <div className="comprovante-file">Arquivo anexado</div>
              )}
              <div className="comprovante-actions">
                <button className="btn-primary" onClick={handleDownload}>Download</button>
                <button className="btn-cancelar" onClick={handlePrint}>Imprimir Recibo</button>
              </div>
            </div>
          ) : (
            <div style={{marginTop: 12, color: 'var(--color-text-secondary)'}}>Nenhum comprovante anexado.</div>
          )}
        </div>
        <div className="payment-details-actions">
          <button className="btn-editar" onClick={() => { if (onUpdated) onUpdated(payment, { openEdit: true }); }}>Editar</button>
          <button className="btn-excluir" onClick={handleRefund}>Estornar / Cancelar</button>
          <button className="btn-cancelar" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
