import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as servly from "servly"
import { Request } from "./Request"

export const eject: servly.Endpoint.Ejector<AzureFunction> = (endpoint: servly.Endpoint) => {
	return async (context: Context, request: HttpRequest) => {
		const response = await endpoint(new Request(context, request))
		context.res = {
			status: response.status,
			headers: servly.Response.Header.to(response.header),
			body: response.body,
		}
	}
}
