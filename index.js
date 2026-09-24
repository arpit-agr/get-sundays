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
		const plainDateObj = Temporal.PlainDate.from({
			year: year,
			month: month,
			day: 1,
		});

		const numberOfDays = plainDateObj.daysInMonth;

		let firstSunday;

		for (let dayOfMonth = 1; dayOfMonth <= 7; dayOfMonth++) {
			const dateObj = Temporal.PlainDate.from({
				year: year,
				month: month,
				day: dayOfMonth,
			});
			const dayOfWeek = dateObj.dayOfWeek;
			const isSunday = dayOfWeek === 7;

			if (isSunday) {
				firstSunday = dayOfMonth;
				break;
			}
		}

		for (
			let dayOfMonth = firstSunday;
			dayOfMonth <= numberOfDays;
			dayOfMonth = dayOfMonth + 7
		) {
			const dateObj = Temporal.PlainDate.from({
				year: year,
				month: month,
				day: dayOfMonth,
			});
			const dateString = dateObj.toString();
			sundaysArr.push(dateString);
		}
	} else {
		const date = new Date(0);
		date.setUTCFullYear(year, month, 0);
		const numberOfDays = date.getUTCDate();
		let firstSunday;

		for (let dayOfMonth = 1; dayOfMonth <= 7; dayOfMonth++) {
			const date = new Date(0);
			date.setUTCFullYear(year, month - 1, dayOfMonth);
			const dayOfWeek = date.getUTCDay();
			const isSunday = dayOfWeek === 0;

			if (isSunday) {
				firstSunday = dayOfMonth;
				break;
			}
		}

		for (
			let dayOfMonth = firstSunday;
			dayOfMonth <= numberOfDays;
			dayOfMonth = dayOfMonth + 7
		) {
			const date = new Date(0);
			date.setUTCFullYear(year, month - 1, dayOfMonth);
			const dateString = date.toISOString();
			const formattedDateString = dateString.split("T")[0];
			sundaysArr.push(formattedDateString);
		}
	}

	return sundaysArr;
}
