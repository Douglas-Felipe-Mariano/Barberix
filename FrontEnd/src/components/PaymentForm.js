import React, { useState, useEffect } from 'react';
import './paymentForm.css';

const defaultForm = {
  agendamentoId: '',
  clienteId: '',
  valor: '',
  formaPagamento: 'DINHEIRO',
  dataPagamento: new Date().toISOString().slice(0, 16),
  observacao: ''
};

export default function PaymentForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial || defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...defaultForm, ...initial });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Sempre registrar a data/hora atual no momento do registro (se for edição, mantém dataPagamento existente)
      const nowISO = new Date().toISOString();
      const payload = { ...form, valor: parseFloat(form.valor), dataPagamento: form.dataPagamento || nowISO };
      await onSave(payload);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar pagamento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="payment-form-overlay">
      <form className="payment-form" onSubmit={handleSubmit}>
        <h3>{initial ? 'Editar Pagamento' : 'Registrar Pagamento'}</h3>

        <label>Agendamento ID (opcional)</label>
        <input name="agendamentoId" value={form.agendamentoId} onChange={handleChange} />

        <label>Cliente ID (opcional)</label>
        <input name="clienteId" value={form.clienteId} onChange={handleChange} />

        <label>Valor (R$)</label>
        <input name="valor" type="number" step="0.01" value={form.valor} onChange={handleChange} required />

        <label>Forma de Pagamento</label>
        <select name="formaPagamento" value={form.formaPagamento} onChange={handleChange}>
          <option value="DINHEIRO">Dinheiro</option>
          <option value="PIX">PIX</option>
          <option value="CARTAO">Cartão</option>
          <option value="OUTRO">Outro</option>
        </select>

        {initial && (
          <>
            <label>Status</label>
            <select name="status" value={form.status || 'PAGO'} onChange={handleChange}>
              <option value="PAGO">PAGO</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </>
        )}

        <label>Data/Hora do Pagamento</label>
        <input type="datetime-local" value={new Date().toISOString().slice(0,16)} disabled />
        <small>Será registrada automaticamente no momento em que o pagamento for salvo.</small>

        <label>Observação</label>
        <textarea name="observacao" value={form.observacao} onChange={handleChange} />

        <label>Comprovante (imagem ou PDF) - opcional</label>
        <input type="file" accept="image/*,application/pdf" onChange={async (e) => {
          const f = e.target.files && e.target.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            setForm(prev => ({ ...prev, comprovanteBase64: reader.result }));
          };
          reader.readAsDataURL(f);
        }} />

        {form.comprovanteBase64 && (
          <div style={{marginTop:8}}>
            <small style={{color: 'var(--color-text-secondary)'}}>Comprovante anexado</small>
          </div>
        )}

        <div className="payment-form-actions">
          <button type="button" className="btn-cancelar" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  );
}
