import React, { useEffect, useState } from 'react';
import paymentsService from '../../services/payments';
import PaymentForm from '../../components/PaymentForm';
import PaymentList from '../../components/PaymentList';
import './pagamentos.css';
import axios from '../../services/api';

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  // sem seed automático - dados só via API ou via botão de dev (removido)

  useEffect(() => {
    loadPayments();
  }, []);

  const applySimpleFilters = (list) => {
    return list.filter(p => {
      if (filter === 'PAGO' && (p.status || '').toUpperCase() !== 'PAGO') return false;
      if (filter === 'PENDENTE' && (p.status || '').toUpperCase() === 'PAGO') return false;
      if (dateFrom) {
        const d = new Date(p.dataPagamento || p.data || 0);
        if (d < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        const d = new Date(p.dataPagamento || p.data || 0);
        // include entire day
        const toDayEnd = new Date(dateTo);
        toDayEnd.setHours(23,59,59,999);
        if (d > toDayEnd) return false;
      }
      return true;
    });
  };

  // Ajustar loadPayments para aplicar filtros
  const loadPayments = async () => {
    setLoading(true);
    try {
      const list = await paymentsService.list();
      const filteredList = applySimpleFilters(list || []);
      setPagamentos(filteredList);
    } catch (err) {
      console.error(err);
      setPagamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    const created = await paymentsService.create(data);
    setPagamentos(prev => [created, ...prev]);
    setShowForm(false);
  };

  const handleEdit = (payment) => {
    setSelected(payment);
    setShowForm(true);
  };

  const handleDelete = async (payment) => {
    if (!window.confirm('Confirmar exclusão deste pagamento?')) return;
    await paymentsService.remove(payment.id || payment.paymentId);
    setPagamentos(prev => prev.filter(p => String(p.id || p.paymentId) !== String(payment.id || payment.paymentId)));
  };

  const handleSaveEdit = async (payload) => {
    if (!selected) return;
    const updated = await paymentsService.update(selected.id || selected.paymentId, payload);
    setPagamentos(prev => prev.map(p => (String(p.id || p.paymentId) === String(updated.id || updated.paymentId) ? updated : p)));
    setSelected(null);
    setShowForm(false);
  };

  const filtered = pagamentos.filter(p => {
    if (filter === 'ALL') return true;
    if (filter === 'PAGO') return (p.status || '').toUpperCase() === 'PAGO';
    if (filter === 'PENDENTE') return (p.status || '').toUpperCase() !== 'PAGO';
    return true;
  });

  const exportCSV = () => {
    const rows = [ ['id','agendamentoId','clienteId','valor','formaPagamento','dataPagamento','status','observacao'] ];
    for (const p of filtered) {
      rows.push([p.id || '', p.agendamentoId || '', p.clienteId || '', p.valor || '', p.formaPagamento || '', p.dataPagamento || '', p.status || '', (p.observacao || '').replace(/\n/g,' ')]);
    }
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagamentos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pagamentos-container">
      <div className="pagamentos-header">
        <h1>Pagamentos</h1>
        <div>
          <button className="btn-primary" onClick={() => { setSelected(null); setShowForm(true); }}>Registrar Pagamento</button>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{marginLeft: 8}}>
             <option value="ALL">Todos</option>
             <option value="PAGO">Pagos</option>
             <option value="PENDENTE">Pendentes</option>
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ marginLeft: 8 }} />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ marginLeft: 8 }} />
          <button className="btn-cancelar" style={{marginLeft: 8}} onClick={() => loadPayments()}>Aplicar</button>
        </div>
      </div>

      {showForm && (
        <PaymentForm
          initial={selected}
          onCancel={() => setShowForm(false)}
          onSave={selected ? handleSaveEdit : handleCreate}
        />
      )}

      {loading ? <div>Carregando...</div> : (
          <PaymentList payments={filtered} onEdit={handleEdit} onDelete={handleDelete} editingId={selected?.id} onRefresh={loadPayments} />
        )}

      {/* toast removed - keeping UI minimal */}
    </div>
  );
}
