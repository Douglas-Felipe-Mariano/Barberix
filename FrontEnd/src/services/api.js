// ...existing code...
// Axios global configuration and response/error normalizer
import axios from 'axios';

// Default base URL (can be overridden with REACT_APP_API_BASE_URL)
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Attach a normalized message to successful responses when backend includes one
axios.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data === 'object') {
      if (data.message) {
        response.normalizedMessage = data.message;
      }
    }
    return response;
  },
  (error) => {
    const resp = error.response;
    let normalizedMessage = null;
    let normalizedErrors = null;

    if (resp && resp.data !== undefined) {
      const d = resp.data;
      if (typeof d === 'string') {
        normalizedMessage = d;
      } else if (d && typeof d === 'object') {
        normalizedMessage = d.message || d.msg || null;
        normalizedErrors = d.errors || null;
      }
    }

    if (!normalizedMessage) {
      if (resp && resp.status === 401) normalizedMessage = 'Não autorizado. Faça login novamente.';
      else if (resp && resp.status === 403) normalizedMessage = 'Acesso negado.';
      else if (resp && resp.status >= 500) normalizedMessage = 'Erro interno do servidor.';
      else normalizedMessage = 'Erro de comunicação com o servidor.';
    }

    // Attach normalized fields for callers to use
    error.normalizedMessage = normalizedMessage;
    error.normalizedErrors = normalizedErrors;

    return Promise.reject(error);
  }
);

export default axios;
