// utils/http.ts
import config from '@/config'
import type { RequestOptions } from '@/types/api'

class HttpRequest {
  private baseURL: string
  private timeout: number
  private apikey: string

  constructor() {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
	this.apikey = config.apikey
  }

  // 请求拦截
  private interceptRequest<T = any>(options: RequestOptions): Promise<RequestOptions> {
    return new Promise((resolve) => {
      // 添加token
        options.header = {
          ...options.header,
        }

      // 添加时间戳防止缓存
      if (options.method === 'GET' && options.url) {
        const timestamp = `_t=${Date.now()}`
        options.url += options.url.includes('?') ? `&${timestamp}` : `?${timestamp}`
      }

      // 显示加载动画
      if (!options.hideLoading) {
        uni.showLoading({
          title: options.loadingText || '加载中...',
          mask: true
        })
      }

      resolve(options)
    })
  }

  // 响应拦截
  private interceptResponse<T = any>(response: UniApp.RequestSuccessCallbackResult & { config?: RequestOptions }): Promise<T> {
    return new Promise((resolve, reject) => {
      // 隐藏加载动画
      if (response.config && !response.config.hideLoading) {
        uni.hideLoading()
      }

      const { statusCode, data } = response
      const responseData = data as T
      console.log(responseData, statusCode);
      // 请求成功
      if (statusCode === 200) {
        // 业务状态码判断
          resolve(responseData)
      } else {
        // HTTP错误
        this.handleHttpError(statusCode)
        reject({ statusCode, data: responseData })
      }
    })
  }

  // HTTP错误处理
  private handleHttpError(statusCode: number): void {
    switch (statusCode) {
      case 401:
        this.showError('登录已过期，请重新登录')
        break
      case 403:
        this.showError('没有权限访问')
        break
      case 404:
        this.showError('请求的资源不存在')
        break
      case 500:
        this.showError('服务器错误')
        break
      default:
        this.showError(`网络错误：${statusCode}`)
    }
  }

  // 显示错误提示
  private showError(message: string): void {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  }

  // 基础请求方法
  public request<T = any>(options: RequestOptions): Promise<T> {
    return this.interceptRequest(options)
      .then(interceptedOptions => {
        return new Promise<T>((resolve, reject) => {
          uni.request({
            url: this.baseURL + options.url,
            method: options.method || 'GET',
            data: {apikey: this.apikey, ...options.data},
            header: {
              'Content-Type': 'application/json',
              ...options.header
            } as any,
            timeout: this.timeout,
            success: (res) => {
              // 保存配置到响应对象，用于拦截器
              const response = res as typeof res & { config?: RequestOptions }
              response.config = interceptedOptions
              this.interceptResponse<T>(response)
                .then(resolve)
                .catch(reject)
            },
            fail: (err) => {
              uni.hideLoading()
              this.showError('网络连接失败，请检查网络')
              reject(err)
            }
          })
        })
      })
  }

  // GET请求
  public get<T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      data,
      ...options
    })
  }

  // POST请求
  public post<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  // PUT请求
  public put<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  // DELETE请求
  public delete<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }
}

export default new HttpRequest()