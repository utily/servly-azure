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

export const eject: servly.Function.Ejector<azure.AzureFunction> = (handler: servly.Timer) => (context: azure.Context, timer: AzureTimer) => {
	const log: servly.Log = {
		invocation: context.executionContext.invocationId,
		point: context.executionContext.functionName,
		entries: []
	}
	const callback: servly.Request[] = []
	handler(Context.create(context, log, callback))
	context.bindings.log = log.entries.length > 0 ? log : undefined
	context.bindings.callback = callback.length > 0 ? callback : undefined
}
