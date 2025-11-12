import React from 'react';

export default function PaymentActions({ payment, onEdit, onDelete, onView }) {
  return (
    <div style={{display: 'flex', gap: 8}}>
      <button className="btn-editar" onClick={() => onEdit(payment)}>Editar</button>
      <button className="btn-excluir" onClick={() => onDelete(payment)}>Excluir</button>
      <button className="btn-cancelar" onClick={() => onView && onView(payment)}>Visualizar</button>
    </div>
  );
}
