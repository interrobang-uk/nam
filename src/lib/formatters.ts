import { DateTime } from "luxon"

export const relativeDate = (date: string): string => {
  const string = DateTime?.fromISO(date)?.toRelative()

  return string?.includes("seconds") ? "Just now" : string || ""
}
