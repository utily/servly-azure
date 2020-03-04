import { Context, HttpRequest, Logger } from "@azure/functions"
import * as servly from "servly"
import * as azure from "./index"

describe("servly-azure", () => {
	const endpoint = servly.Endpoint.create(async request => ({
		body: { name: "servly", url: request.url, baseUrl: request.baseUrl },
	}))
	const run = azure.eject(endpoint)
	const req: HttpRequest = { url: "http://test.com/folder/file.extension", method: "GET", headers: {}, query: {}, params: {} }
	const context: Context = {
		req,
		invocationId: "1337",
		executionContext: {
			invocationId: "1337",
			functionName: "run",
			functionDirectory: "./",
		},
		traceContext: {
			traceparent: undefined,
			tracestate: undefined,
			attributes: undefined,
		},
		bindings: {},
		bindingData: {},
		bindingDefinitions: [],
		log: {
			...Object.assign((..._: any[]) => { }),
			error: (..._: any[]) => { },
			warn: (..._: any[]) => { },
			info: (..._: any[]) => { },
			verbose: (..._: any[]) => { },
		},
		done: (_?: string | Error | null, result?: any) => Promise.resolve(result),
	}
	it("http", async () => {
		await run(context, req)
		expect(context.res).toEqual({
			body: {
				name: "servly",
				url: "https://test.com/folder/file.extension",
				baseUrl: "https://test.com",
			},
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			isRaw: true,
			status: 200,
		})
	})
	it("http://localhost", async () => {
		await run(context, { ...req, url: "http://localhost:1337/folder/file.extension" })
		expect(context.res).toEqual({
			body: {
				name: "servly",
				url: "http://localhost:1337/folder/file.extension",
				baseUrl: "http://localhost:1337",
			},
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			isRaw: true,
			status: 200,
		})
	})
	it("http://localhost", async () => {
		process.env.baseUrl = "https://example.com"
		await run(context, { ...req, url: "http://localhost:1337/folder/file.extension" })
		expect(context.res).toEqual({
			body: {
				name: "servly",
				url: "https://example.com/folder/file.extension",
				baseUrl: "https://example.com",
			},
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			isRaw: true,
			status: 200,
		})
		delete process.env.baseUrl
	})
})
