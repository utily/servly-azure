import * as isoly from "isoly"
import * as servly from "servly"
import * as azure from "@azure/functions"

export namespace Context {
	export function create(context: azure.InvocationContext, log: servly.Log, callback: servly.Request[]) {
		const result = servly.Context.create({
			id: context.invocationId,
			function: {
				name: context.functionName,
				path: `${context.extraOutputs?.get("path")}` || "unknown",
			},
			log: (step: string, level: servly.Log.Level, content: any) => {
				let l: (...args: any[]) => void = context.log
				switch (level) {
					case "trace":
						l = context.info
						break
					case "debug":
						l = context.debug
						break
					case "warning":
						l = context.warn
						break
					case "error":
					case "fatal":
						l = context.error
						break
				}
				l(step, level, JSON.stringify(result.meta), JSON.stringify(content))
				log.entries.push({
					created: isoly.DateTime.now(),
					step,
					level,
					content: servly.Content.freeze(content),
				})
			},
			callback: (r: servly.Request) => callback.push(r),
		})
		return result
	}
}
