import { HttpRequest } from "@azure/functions"
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

		const request = new Request(req)
		expect(JSON.stringify(request)).toEqual(
			'{"method":"GET","url":"http://localhost:7071/version","query":{},"parameter":{},"header":{"accept":"*/*","host":"localhost:7071","user-agent":"insomnia/7.1.1"}}'
		)
	})
})
