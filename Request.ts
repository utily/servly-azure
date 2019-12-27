import { HttpRequest } from "@azure/functions"
import * as servly from "servly"

export class Request implements servly.Request {
	readonly method: servly.Request.Method | undefined
	readonly url: string
	readonly query: { [key: string]: string; }
	readonly parameter: { [key: string]: string; }
	get remote(): string | undefined { return (this.backend.params.MS_HttpContext as any as { request: { userHostAddress: string } })?.request?.userHostAddress }
	readonly header: servly.Request.Header
	readonly raw: Promise<any>
	constructor(private readonly backend: HttpRequest) {
		this.method = this.backend && this.backend.method || undefined
		this.url = this.backend && this.backend.url || ""
		if (this.url.startsWith("http://") && !this.url.startsWith("http://localhost")) // TODO: Fix for bug in Azure
			this.url = "https:" + this.url.slice(5)
		this.query = this.backend && this.backend.query || {}
		this.parameter = this.backend && this.backend.params || {}
		this.header = this.backend && servly.Request.Header.from(this.backend.headers) || {}
		this.raw = this.backend && Promise.resolve(this.backend.rawBody)
	}
}
