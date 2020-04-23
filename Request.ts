import * as process from "process"
import { HttpRequest } from "@azure/functions"
import * as servly from "servly"

export class Request implements servly.Request {
	readonly method: servly.Request.Method | undefined
	readonly url: string
	readonly baseUrl: string
	readonly query: { [key: string]: string; }
	readonly parameter: { [key: string]: string; }
	readonly remote: string | undefined
	readonly header: servly.Request.Header
	readonly raw: Promise<any>
	constructor(backend: HttpRequest) {
		this.method = backend && backend.method || undefined
		this.url = backend && backend.url || ""
		if (process.env.baseUrl)
			this.url = process.env.baseUrl + (this.url && this.url.slice(this.url.split("/", this.url.includes("//") ? 3 : 1).join("/").length))
		else if (this.url.startsWith("http://") && !this.url.startsWith("http://localhost")) // TODO: Fix for bug in Azure
			this.url = "https:" + this.url.slice(5)
		this.baseUrl = this.url.split("/", this.url.includes("//") ? 3 : 1).join("/")
		this.query = backend && backend.query || {}
		this.parameter = backend && backend.params || {}
		this.remote = (backend.params.MS_HttpContext as any as { request: { userHostAddress: string } })?.request?.userHostAddress
		this.header = backend && servly.Request.Header.from(backend.headers) || {}
		this.raw = backend && Promise.resolve(backend.rawBody)
	}
	toJSON(): Omit<servly.Request, "baseUrl"> {
		return {
			method: this.method,
			url: this.url,
			query: this.query,
			parameter: this.parameter,
			remote: this.remote,
			header: this.header,
		}
	}
}
