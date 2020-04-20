import * as azure from "@azure/functions"
import * as servly from "servly"
import { Context } from "./Context"

export function eject<T, S>(handler: servly.Queue<T, S>): azure.AzureFunction {
	return async (context: azure.Context, item: T) => {
		const log: servly.Log = {
			invocation: context.executionContext.invocationId,
			point: context.executionContext.functionName,
			entries: []
		}
		const callback: servly.Request[] = []
		await handler(item, Context.create(context, log, callback))
		context.bindings.log = log
		context.bindings.callback = callback
	}
}
