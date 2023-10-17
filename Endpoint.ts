import * as servly from "servly"
import * as azure from "@azure/functions"
import { Context } from "./Context"
import { Request } from "./Request"

export const eject: servly.Function.Ejector<azure.FunctionHandler> = (handler: servly.Endpoint) => {
	return async (request: azure.HttpRequest, context: azure.InvocationContext) => {
		const log: servly.Log = {
			invocation: context.invocationId,
			point: context.functionName,
			entries: [],
		}
		const callback: servly.Request[] = []
		const c = Context.create(context, log, callback)
		const response = await handler(c, new Request(request))
		const meta = servly.Meta.freeze(c.meta)
		if (log.entries.length > 0)
			context.extraInputs.set("servlyLog", { ...log, ...meta })
		if (callback.length > 0)
			context.extraInputs.set(
				"servlyCallback",
				callback.map(cb => ({ ...cb, meta }))
			)
		return {
			status: response.status,
			headers: servly.Response.Header.to(response.header),
			body: response.body,
			isRaw: true,
		}
	}
}
