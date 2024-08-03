import axios from 'axios'
import { config } from 'dotenv'

config()

export const apiWeather = axios.create({
  baseURL: process.env.WEATHER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
