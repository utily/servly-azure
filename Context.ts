import * as azure from "@azure/functions"
import * as isoly from "isoly"
import * as servly from "servly"

export namespace Context {
	export function create(context: azure.Context, log: servly.Log, callback: servly.Request[]) {
		return servly.Context.create({
			id: context.executionContext.invocationId,
			function: {
				name: context.executionContext.functionName,
				path: context.executionContext.functionDirectory,
			},
			log: (step: string, level: servly.Log.Level, content: servly.Log.Content) => log.entries.push({
				created: isoly.DateTime.now(),
				step,
				level,
				content,
			}),
			callback: (r: servly.Request) => callback.push(r),
		})
	}
}
