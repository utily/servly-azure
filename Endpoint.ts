import * as azure from "@azure/functions"
import * as servly from "servly"
import { Context } from "./Context"
import { Request } from "./Request"

export const eject: servly.Function.Ejector<azure.AzureFunction> = (handler: servly.Endpoint) => {
	return async (context: azure.Context, request: azure.HttpRequest) => {
		const log: servly.Log = {
			invocation: context.executionContext.invocationId,
			point: context.executionContext.functionName,
			entries: []
		}
		const callback: servly.Request[] = []
		const c = Context.create(context, log, callback)
		const response = await handler(new Request(context, request), c)
		context.res = {
			status: response.status,
			headers: servly.Response.Header.to(response.header),
			body: response.body,
			isRaw: true,
		}
		context.bindings.log = log.entries.length > 0 ? log : undefined
		context.bindings.callback = callback.length > 0 ? callback : undefined
	}
}
