import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8080', // IP padrão para acessar o Java no emulador Android
});

export default api;