import React from 'react';

export default function PaymentEditNotice() {
  return (
    <div style={{padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: 10}}>
      <strong>Atenção:</strong> Edições em pagamentos devem ser feitas com cuidado. O sistema usa fallback localStorage até o backend ser implementado.
    </div>
  );
}
