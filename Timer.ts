import * as azure from "@azure/functions"
import { Context } from "./Context"
import * as servly from "servly"

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

export const eject: servly.Function.Ejector<azure.AzureFunction> = (handler: servly.Timer) => async (context: azure.Context, timer: AzureTimer): Promise<void> => {
	const log: servly.Log = {
		invocation: context.executionContext.invocationId,
		point: context.executionContext.functionName,
		meta: {},
		entries: [],
	}
	const callback: servly.Request[] = []
	const c = Context.create(context, log, callback)
	await handler(c)
	const meta = servly.Meta.freeze(c.meta)
	context.bindings.log = log.entries.length > 0 ? { ...log, ...meta } : undefined
	context.bindings.callback = callback.length > 0 ? callback.map(cb => ({ ...cb, meta })) : undefined
}
