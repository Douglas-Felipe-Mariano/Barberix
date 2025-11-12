import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import paymentsService from '../../services/payments';
import PaymentList from '../../components/PaymentList';
import './pagamentos.css';

export default function ClientePagamentos() {
  const { id } = useParams(); // clienteId
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const list = await paymentsService.list();
      setPayments(list.filter(p => String(p.clienteId) === String(id)));
    } catch (err) {
      console.error(err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagamentos-container">
      <div className="pagamentos-header">
        <h1>Pagamentos do Cliente {id}</h1>
      </div>
      <PaymentList pagamentos={payments} loading={loading} onRefresh={load} />
    </div>
  );
}
