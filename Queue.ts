import * as servly from "servly"
import * as azure from "@azure/functions"
import { Context } from "./Context"

export function eject<T, S>(handler: servly.Queue<T, S>): azure.FunctionHandler {
	return async (item: T, context: azure.InvocationContext) => {
		const log: servly.Log = {
			invocation: context.invocationId,
			point: context.functionName,
			entries: [],
		}
		const callback: servly.Request[] = []
		const c = Context.create(context, log, callback)
		await handler(c, item)
		const meta = servly.Meta.freeze(c.meta)
		if (log.entries.length > 0)
			context.extraInputs.set("servlyLog", { ...log, ...meta })
		if (callback.length > 0)
			context.extraInputs.set(
				"servlyCallback",
				callback.map(cb => ({ ...cb, meta }))
			)
	}
}
