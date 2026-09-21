// Given a year and month, return an array containing every date in that month that falls on a Sunday. Return each date in YYYY-MM-DD format.

function getSundays(year, month) {
	let sundaysArr = [];

	const hasTemporal = typeof Temporal !== "undefined";

	if (hasTemporal) {
		// for every date in the given month in the given year
		// get the day of the week for that date then
		// check if that day of the week is divisible by 7 (sunday)
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
			const dateString = dateObj.toString();
			const dayOfWeek = dateObj.dayOfWeek;
			const isSunday = dayOfWeek % 7 === 0;

			if (isSunday) {
				sundaysArr.push(dateString);
			}
		}
	} else {
		const date = new Date(Date.UTC(year, month, 0));
		const numberOfDays = date.getDate();

		for (let day = 1; day <= numberOfDays; day++) {
			const date = new Date(Date.UTC(year, month - 1, day));
			// console.log(date.toString());
			const dayOfWeek = date.getDay();
			const isSunday = dayOfWeek === 0;

			if (isSunday) {
				sundaysArr.push(date.toISOString().slice(0, -14));
			}
		}
	}

	console.log(sundaysArr);
	return sundaysArr;
}

getSundays(2026, 9);
getSundays(2024, 2);

// Test cases:

// > getSundays(2026, 9)
// > [ '2026-09-06', '2026-09-13', '2026-09-20', '2026-09-27' ]

// > getSundays(2024, 2)
// > [ '2024-02-04', '2024-02-11', '2024-02-18', '2024-02-25' ]
