export interface SearchParams {
	keyword: string
	page: number
	size: number
}

export interface Dates {
	start: Date
}

export interface Date {
	localDate: string
	localTime: string
}

export interface Image {
	url: string
}

export interface Event {
	id: string
	name: string
	images: Array<Image>
	dates: Dates
}

export interface SearchResult {
	_embedded: { events: Array<Event> }
}

export interface StatusCodeMap {
	'onsale': string;
	'offsale': string;
}