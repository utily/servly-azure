import * as azure from "@azure/functions"
import * as servly from "servly"
import { Context } from "./Context"

export function eject<T, S>(handler: servly.Queue<T, S>): azure.AzureFunction {
	return async (context: azure.Context, item: T) => {
		const log: servly.Log = {
			invocation: context.executionContext.invocationId,
			point: context.executionContext.functionName,
			entries: [],
		}
		const callback: servly.Request[] = []
		const c = Context.create(context, log, callback)
		await handler(c, item)
		const meta = servly.Meta.freeze(c.meta)
		context.bindings.log = log.entries.length > 0 ? { ...log, ...meta } : undefined
		context.bindings.callback = callback.length > 0 ? callback.map(cb => ({ ...cb, meta })) : undefined
	}
}
