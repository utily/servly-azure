import { Context, HttpRequest, Logger } from "@azure/functions"
import * as servly from "servly"
import * as azure from "./index"

describe("servly-azure", () => {
	const endpoint = servly.Endpoint.create(async request => ({
		body: { name: "servly" },
	}))
	const run = azure.eject(endpoint)
	it("test", async () => {
		const req: HttpRequest = { url: "test.com", method: "GET", headers: {}, query: {}, params: {} }
		const context: Context = {
			req,
			invocationId: "1337",
			executionContext: {
				invocationId: "1337",
				functionName: "run",
				functionDirectory: "./",
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
		await run(context, req)
		expect(context.res).toEqual({
			body: {
				name: "servly",
			},
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			status: 200,
		})
	})
})
