// used Claude to create a lot of the edge cases and write the test runner

import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import { getSundays } from "./index.js";

const cases = [
	[
		"typical month",
		[2026, 9],
		["2026-09-06", "2026-09-13", "2026-09-20", "2026-09-27"],
	],
	[
		"leap February",
		[2024, 2],
		["2024-02-04", "2024-02-11", "2024-02-18", "2024-02-25"],
	],
	[
		"month starts on a Sunday",
		[2026, 3],
		["2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29"],
	],
	[
		"month ends on a Sunday (31st)",
		[2026, 5],
		["2026-05-03", "2026-05-10", "2026-05-17", "2026-05-24", "2026-05-31"],
	],
	[
		"30-day month ending on a Sunday",
		[2024, 6],
		["2024-06-02", "2024-06-09", "2024-06-16", "2024-06-23", "2024-06-30"],
	],
	[
		"non-leap February starting on a Sunday",
		[2026, 2],
		["2026-02-01", "2026-02-08", "2026-02-15", "2026-02-22"],
	],
	[
		"leap February with Sunday the 29th",
		[2004, 2],
		["2004-02-01", "2004-02-08", "2004-02-15", "2004-02-22", "2004-02-29"],
	],
	[
		"century leap year",
		[2000, 2],
		["2000-02-06", "2000-02-13", "2000-02-20", "2000-02-27"],
	],
	[
		"century non-leap year",
		[1900, 2],
		["1900-02-04", "1900-02-11", "1900-02-18", "1900-02-25"],
	],
	[
		"January (month index off-by-one trap)",
		[2027, 1],
		["2027-01-03", "2027-01-10", "2027-01-17", "2027-01-24", "2027-01-31"],
	],
	[
		"December (month index off-by-one trap)",
		[2025, 12],
		["2025-12-07", "2025-12-14", "2025-12-21", "2025-12-28"],
	],
	[
		"US daylight saving starts (Sun 10th)",
		[2024, 3],
		["2024-03-03", "2024-03-10", "2024-03-17", "2024-03-24", "2024-03-31"],
	],
	[
		"US daylight saving ends (Sun 3rd)",
		[2024, 11],
		["2024-11-03", "2024-11-10", "2024-11-17", "2024-11-24"],
	],
	[
		"before the Unix epoch",
		[1969, 12],
		["1969-12-07", "1969-12-14", "1969-12-21", "1969-12-28"],
	],
	[
		"last 4-digit year",
		[9999, 12],
		["9999-12-05", "9999-12-12", "9999-12-19", "9999-12-26"],
	],
	[
		"2-digit year must not become 19xx",
		[50, 6],
		["0050-06-05", "0050-06-12", "0050-06-19", "0050-06-26"],
	],
	[
		"year 0 is a leap year, but Date.UTC maps it to 1900, which isn't",
		[0, 2],
		["0000-02-06", "0000-02-13", "0000-02-20", "0000-02-27"],
	],
];

const badInputCases = [
	["no arguments", [], TypeError],
	["month missing", [2026], TypeError],
	["year is not a number", ["abc", 9], TypeError],
	["empty strings must not become 0", ["", ""], TypeError],
	["null must not become 0", [null, null], TypeError],
	["true must not become 1", [true, 9], TypeError],
	["year is not a whole number", [2026.5, 9], TypeError],
	["month is not a whole number", [2026, 9.5], TypeError],
	["month above 12", [2026, 13], RangeError],
	["month 0", [2026, 0], RangeError],
	["negative month", [2026, -1], RangeError],
];

function runCases() {
	for (const [name, input, expected] of cases) {
		test(`${name}: getSundays(${input.join(", ")})`, () => {
			assert.deepEqual(getSundays(...input), expected);
		});
	}

	for (const [name, input, errorType] of badInputCases) {
		const args = input.map((arg) => JSON.stringify(arg)).join(", ");
		test(`${name}: getSundays(${args}) throws ${errorType.name}`, () => {
			assert.throws(() => getSundays(...input), errorType);
		});
	}
}

describe(
	"Temporal branch",
	{ skip: typeof Temporal === "undefined" && "Temporal not available" },
	() => {
		runCases();
	},
);

describe("Date branch", () => {
	const originalTemporal = globalThis.Temporal;

	before(() => {
		globalThis.Temporal = undefined;
	});

	after(() => {
		globalThis.Temporal = originalTemporal;
	});

	runCases();
});
