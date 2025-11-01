import axios from 'axios'

const api = axios.create({

    //Define a URL base para todas as requisições feitas para a api
    baseURL: 'http://localhost:8080/api'
});

export default api;