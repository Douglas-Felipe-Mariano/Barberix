// Arquivo de serviço de pagamentos
// Temporariamente forçamos uso do fallback localStorage para testes manuais.
// Para reativar chamadas à API, remova/alterar FORCE_LOCAL_FALLBACK para false
// e reintroduza as chamadas axios (ex.: axios.get('/api/pagamentos')...).

const STORAGE_KEY = 'barberix_pagamentos_fallback';
const FORCE_LOCAL_FALLBACK = true; // <-- define true para testes sem API

// Helper: lê a lista do localStorage
function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    console.error('Erro ao ler localStorage de pagamentos', e);
    return [];
  }
}

// Helper: grava a lista no localStorage
function writeLocal(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Erro ao gravar localStorage de pagamentos', e);
  }
}

// Serviço exportado (usa localStorage enquanto FORCE_LOCAL_FALLBACK=true)
const paymentsService = {
  list: async () => {
    if (!FORCE_LOCAL_FALLBACK) {
      // Aqui normalmente iria a chamada à API, ex:
      // return axios.get('/api/pagamentos').then(r => r.data);
    }
    return readLocal();
  },

  create: async (payload) => {
    if (!FORCE_LOCAL_FALLBACK) {
      // return axios.post('/api/pagamentos', payload).then(r => r.data);
    }

    const list = readLocal();
    const id = payload.id || `local_${Date.now()}`;
    const item = { ...payload, id };
    list.push(item);
    writeLocal(list);
    return item;
  },

  update: async (id, payload) => {
    if (!FORCE_LOCAL_FALLBACK) {
      // return axios.put(`/api/pagamentos/${id}`, payload).then(r => r.data);
    }

    const list = readLocal();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error('Pagamento não encontrado');
    list[idx] = { ...list[idx], ...payload, id };
    writeLocal(list);
    return list[idx];
  },

  remove: async (id) => {
    if (!FORCE_LOCAL_FALLBACK) {
      // return axios.delete(`/api/pagamentos/${id}`).then(r => r.data);
    }

    const list = readLocal();
    const newList = list.filter(p => String(p.id) !== String(id));
    writeLocal(newList);
    return;
  }
};

export default paymentsService;
