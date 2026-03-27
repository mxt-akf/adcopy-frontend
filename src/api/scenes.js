import axios from 'axios'

const http = axios.create({ timeout: 10000 })

export const getScenes = () => http.get('/api/scenes').then(r => r.data)