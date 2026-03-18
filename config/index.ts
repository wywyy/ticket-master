// config/index.ts
interface Config {
  baseURL: string
  timeout: number
  imageUrl: string
  apikey: string
}

const config: Record<string, Config> = {
  development: {
    baseURL: 'https://app.ticketmaster.com',
    timeout: 10000,
    imageUrl: 'http://localhost:3000',
    apikey: 'jl0BepGEYc8POnHeU6Kufos4NmmI3ZuS'
  },
  production: {
    baseURL: 'https://app.ticketmaster.com',
    timeout: 15000,
    imageUrl: 'https://api.example.com',
    apikey: 'jl0BepGEYc8POnHeU6Kufos4NmmI3ZuS'
  }
}

// 获取当前环境
const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'

export default config[env]