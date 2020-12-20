import * as isoly from "isoly"
import * as servly from "servly"
import * as azure from "@azure/functions"

export namespace Context {
	export function create(context: azure.Context, log: servly.Log, callback: servly.Request[]) {
		const result = servly.Context.create({
			id: context.executionContext.invocationId,
			function: {
				name: context.executionContext.functionName,
				path: context.executionContext.functionDirectory,
			},
			log: (step: string, level: servly.Log.Level, content: any) => {
				let l: (...args: any[]) => void = context.log
				switch (level) {
					case "trace":
						l = context.log.info
						break
					case "debug":
						l = context.log.verbose
						break
					case "warning":
						l = context.log.warn
						break
					case "error":
					case "fatal":
						l = context.log.error
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
