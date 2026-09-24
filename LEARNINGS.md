# Learnings: Get Sundays

- `Number("")`, `Number(null)` and `Number(true)` give 0, 0 and 1. Check `typeof` first.
- **`Date.UTC` treats years 0–99 as 1900–1999.** `setUTCFullYear` doesn't.
- **Day 0 of next month is the last day of this month.** `date.setUTCFullYear(year, month, 0)` then `date.getUTCDate()` gives the number of days in `month`. `Date` months count from 0, so passing my 1-based `month` already points at next month. Temporal just has `daysInMonth`.
- **`Date` and Temporal number weekdays differently.** `getUTCDay()` starts the week on Sunday (Sunday = 0); Temporal's `dayOfWeek` starts on Monday (Sunday = 7). Only Sunday differs, so it's easy to miss.
