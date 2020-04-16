import { AzureFunction, Context } from "@azure/functions"
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

export const eject: servly.Function.Ejector<AzureFunction> = (handler: servly.Timer) => (context: Context, timer: AzureTimer) => handler()
