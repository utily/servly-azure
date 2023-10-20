/* eslint-disable @typescript-eslint/no-empty-function */
import * as servly from "servly"
import { HttpRequest, InvocationContext } from "@azure/functions"
import * as azure from "./index"

describe("servly-azure", () => {
	const endpoint = servly.Endpoint.create(async (_, request) => ({
		body: { name: "servly", url: request.url, baseUrl: request.baseUrl },
	}))
	const run = azure.eject(endpoint)
	const request = new HttpRequest({
		url: "http://test.com/folder/file.extension",
		method: "GET",
		headers: {},
		query: {},
		params: {},
	})

	const extraInputs: Record<string, any> = {}
	const extraOutputs: Record<string, any> = {}

	const context: InvocationContext = {
		invocationId: "1337",
		functionName: "run",
		traceContext: {
			traceParent: undefined,
			traceState: undefined,
			attributes: undefined,
		},
		log: (..._: any[]) => {},
		error: (..._: any[]) => {},
		warn: (..._: any[]) => {},
		info: (..._: any[]) => {},
		trace: (..._: any[]) => {},
		debug: (..._: any[]) => {},
		extraInputs: {
			...new InvocationContext(),
			get: (input: any): any => (typeof input == "string" ? extraInputs[input] : undefined),
			set: (inputOrName: any, value: unknown): any =>
				typeof inputOrName == "string" ? (extraInputs[inputOrName] = value) : undefined,
		},
		extraOutputs: {
			...new InvocationContext(),
			get: (input: any): any => extraOutputs[input],
			set: (inputOrName: any, value: unknown): any => (extraOutputs[inputOrName] = value),
		},
		options: { extraInputs: [], extraOutputs: [], trigger: { type: "http", name: "test" } },
		// done: (_?: string | Error | null, result?: any) => Promise.resolve(result), ?????
	}
	it("http", async () => {
		const response = await run(request, context)
		expect(response).toEqual({
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
		const response = await run({ ...request, url: "http://localhost:1337/folder/file.extension" }, context)
		expect(response).toEqual({
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
		const response = await run({ ...request, url: "http://localhost:1337/folder/file.extension" }, context)
		expect(response).toEqual({
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
