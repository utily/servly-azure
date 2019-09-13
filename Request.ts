import { HttpRequest } from "@azure/functions"
import * as servly from "servly"

export class Request implements servly.Request {
	readonly method: servly.Request.Method | undefined
	readonly url: string
	readonly query: { [key: string]: string; }
	readonly parameter: { [key: string]: string; }
	readonly header: servly.Request.Header
	readonly raw: Promise<any>
	constructor(private readonly backend: HttpRequest) {
		this.method = this.backend && this.backend.method || undefined
		this.url = this.backend && this.backend.url || ""
		this.query = this.backend && this.backend.query || {}
		this.parameter = this.backend && this.backend.params || {}
		this.header = this.backend && servly.Request.Header.from(this.backend.headers) || {}
		this.raw = this.backend && Promise.resolve(this.backend.rawBody)
	}
}
