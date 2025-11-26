import axios from "axios";

// const url = 'https://apistudio-fathqulbc.karyakreasi.id'
const url = 'http://192.168.0.16:3001'

export const API = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true
})
 