import * as servly from "servly"
import * as azure from "@azure/functions"
import { Context } from "./Context"

type AzureTimer = {
	readonly TimerSchedule: {
		readonly AdjustForDST: boolean
		GetNextOccurence: (now: Date) => Date
		GetNextOccurences: (count: number, now?: Date) => Enumerator<Date>
	}
	readonly ScheduleStatus: {
		Last: Date
		Next: Date
		LastUpdated: Date
	}
	readonly IsPastDue: boolean
	FormatNextOccurences: (count: number, now?: Date) => string
}

export const eject: servly.Function.Ejector<azure.FunctionHandler> =
	(handler: servly.Timer) =>
	async (timer: AzureTimer, context: azure.InvocationContext): Promise<void> => {
		const log: servly.Log = {
			invocation: context.invocationId,
			point: context.functionName,
			entries: [],
		}
		const callback: servly.Request[] = []
		const c = Context.create(context, log, callback)
		await handler(c)
		const meta = servly.Meta.freeze(c.meta)
		if (log.entries.length > 0)
			context.extraInputs.set("servlyLog", { ...log, ...meta })
		if (callback.length > 0)
			context.extraInputs.set(
				"servlyCallback",
				callback.map(cb => ({ ...cb, meta }))
			)
	}
