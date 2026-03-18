// api/modules/ticket.ts
import http from '@/utils/http'
import type { 
  SearchParams,
  SearchResult,
} from '@/types/event'

export default {
	
  // 获取列表
  getTicketList(data: SearchParams): Promise<SearchResult> {
	  return http.get<SearchResult>('/discovery/v2/events.json', data)
  },
  
  // 获取详情
  getEventDetails(id: string): Promise<SearchResult> {
	  return http.get<SearchResult>(`/discovery/v2/events/${id}`)
  },

}