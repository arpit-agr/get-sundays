export function getSundays(year, month) {
	if (typeof year !== "number" || typeof month !== "number") {
		throw new TypeError(
			`Year and month must be numbers, got ${typeof year} and ${typeof month}`,
		);
	}

	if (!Number.isInteger(year) || !Number.isInteger(month)) {
		throw new TypeError("Year and month must be whole numbers");
	}

	if (month < 1 || month > 12) {
		throw new RangeError(`Month must be between 1 and 12, got ${month}`);
	}

	const sundaysArr = [];

	const hasTemporal = typeof Temporal !== "undefined";

	if (hasTemporal) {
		// for every date in the given month and year get the day of the week
		// check if that day is Sunday (divisible by 7)
		// if true, then push that date to the array

		const plainDateObj = Temporal.PlainDate.from({
			year: year,
			month: month,
			day: 1,
		});

		const numberOfDays = plainDateObj.daysInMonth;

		for (let day = 1; day <= numberOfDays; day++) {
			const dateObj = Temporal.PlainDate.from({
				year: year,
				month: month,
				day: day,
			});
			const dayOfWeek = dateObj.dayOfWeek;
			const isSunday = dayOfWeek % 7 === 0;

			if (isSunday) {
				const dateString = dateObj.toString();
				sundaysArr.push(dateString);
			}
		}
	} else {
		const date = new Date(0);
		date.setUTCFullYear(year, month, 0);
		const numberOfDays = date.getUTCDate();

		for (let day = 1; day <= numberOfDays; day++) {
			const date = new Date(0);
			date.setUTCFullYear(year, month - 1, day);
			const dayOfWeek = date.getUTCDay();
			const isSunday = dayOfWeek === 0;

			if (isSunday) {
				const dateString = date.toISOString();
				const formattedDateString = dateString.split("T")[0];
				sundaysArr.push(formattedDateString);
			}
		}
	}

	return sundaysArr;
}
