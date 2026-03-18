// types/api.ts
export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  hideLoading?: boolean
  loadingText?: string
}