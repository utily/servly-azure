import { Context, HttpRequest } from "@azure/functions"
import { Request } from "./Request"

describe("servly.Request", () => {

	it("toJSON", () => {
		const req: HttpRequest = {
			method: "GET",
			url: "http://localhost:7071/version",
			headers: {
				accept: "*/*",
				host: "localhost:7071",
				"user-agent": "insomnia/7.1.1",
			},
			query: {},
			params: {},
		}
		const context: Context = {
			invocationId: "e5716318-19c4-498f-b00d-c734fe08c13c",
			executionContext: {
				invocationId: "e5716318-19c4-498f-b00d-c734fe08c13c",
				functionName: "version",
				functionDirectory: "/home/smika/versioned/github/payfunc/backend/version"
			},
			bindings: {
				req: {
					method: "GET",
					url: "http://localhost:7071/version",
					originalUrl: "http://localhost:7071/version",
					headers: {
						accept: "*/*",
						host: "localhost:7071",
						"user-agent": "insomnia/7.1.1"
					},
					query: {},
					params: {},
				},
			},
			bindingData: {
				invocationId: "e5716318-19c4-498f-b00d-c734fe08c13c",
				query: {},
				headers: {
					accept: "*/*",
					host: "localhost:7071",
					"user-Agent": "insomnia/7.1.1"
				},
				sys: {
					methodName: "version",
					utcNow: "2020-04-21T22:37:56.9830681Z",
					randGuid: "6dc1feef-d620-496e-b29e-b5799024f6c3"
				},
				req: {
					http: {
						identities: [
							{
								claims: [
									{
										value: "Admin",
										type: "http://schemas.microsoft.com/2017/07/functions/claims/authlevel"
									}
								],
								authenticationType: {
									value: "WebJobsAuthLevel",
									string: "value"
								},
								nameClaimType: {
									value: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
									string: "value"
								},
								roleClaimType: {
									value: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
									string: "value"
								}
							}
						],
						cookies: [],
						headers: {
							accept: "*/*",
							host: "localhost:7071",
							"user-agent": "insomnia/7.1.1"
						},
						params: {},
						query: {},
						method: "GET",
						url: "http://localhost:7071/version",
						body: null,
						statusCode: "",
						enableContentNegotiation: false,
						rawBody: null
					},
					data: "http"
				},
				$request: {
					http: {
						identities: [
							{
								claims: [
									{
										value: "Admin",
										type: "http://schemas.microsoft.com/2017/07/functions/claims/authlevel"
									}
								],
								authenticationType: {
									value: "WebJobsAuthLevel",
									string: "value"
								},
								nameClaimType: {
									value: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
									string: "value"
								},
								roleClaimType: {
									value: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
									string: "value"
								}
							}
						],
						cookies: [],
						headers: {
							accept: "*/*",
							host: "localhost:7071",
							"user-agent": "insomnia/7.1.1"
						},
						params: {},
						query: {},
						method: "GET",
						url: "http://localhost:7071/version",
						body: undefined,
						statusCode: "",
						enableContentNegotiation: false,
						rawBody: undefined
					},
					data: "http"
				}
			},
			bindingDefinitions: [
				{
					name: "req",
					type: "httpTrigger",
					direction: "in"
				},
				{
					name: "res",
					type: "http",
					direction: "out"
				},
				{
					name: "log",
					type: "queue",
					direction: "out"
				},
				{
					name: "callback",
					type: "queue",
					direction: "out"
				}
			],
			req,
			res: {
				headers: {},
				cookies: []
			},
			traceContext: {
				traceparent: undefined,
				tracestate: undefined,
				attributes: undefined,
			},
			log: {
				...Object.assign((..._: any[]) => { }),
				error: (..._: any[]) => { },
				warn: (..._: any[]) => { },
				info: (..._: any[]) => { },
				verbose: (..._: any[]) => { },
			},
			done: (_?: string | Error | null, result?: any) => Promise.resolve(result),
		}
		const request = new Request(context, req)
		expect(JSON.stringify(request)).toEqual("{\"method\":\"GET\",\"url\":\"http://localhost:7071/version\",\"query\":{},\"parameter\":{},\"header\":{\"accept\":\"*/*\",\"host\":\"localhost:7071\",\"user-agent\":\"insomnia/7.1.1\"}}")
	})
})
