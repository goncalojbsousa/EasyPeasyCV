"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useDismissable } from "../../utils/useDismissable";
import { FIELD_CLASS } from "./text_input";

const MONTH_KEYS = [
	"calendar.month.january",
	"calendar.month.february",
	"calendar.month.march",
	"calendar.month.april",
	"calendar.month.may",
	"calendar.month.june",
	"calendar.month.july",
	"calendar.month.august",
	"calendar.month.september",
	"calendar.month.october",
	"calendar.month.november",
	"calendar.month.december",
];

const WEEKDAY_KEYS = [
	"calendar.day.sun",
	"calendar.day.mon",
	"calendar.day.tue",
	"calendar.day.wed",
	"calendar.day.thu",
	"calendar.day.fri",
	"calendar.day.sat",
];

/**
 * Calendar date picker for ISO (YYYY-MM-DD) values.
 * Lives in `ui/` rather than inside the certifications section so any form can
 * reuse it.
 */
export function DatePicker({
	value,
	onChange,
	placeholder,
}: {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
}) {
	const { t } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(
		value ? new Date(value) : null,
	);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useDismissable(dropdownRef, isOpen, () => setIsOpen(false));

	// Format date to ISO string format (YYYY-MM-DD)
	const formatDate = (date: Date) => {
		return date.toISOString().split("T")[0];
	};

	// Format date for display in Portuguese locale
	const formatDisplayDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("pt-PT");
	};

	// Generate array of days for the current month including empty cells for alignment
	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDay = firstDay.getDay();

		const days = [];

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < startingDay; i++) {
			days.push(null);
		}

		// Add all days of the month
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(new Date(year, month, i));
		}

		return days;
	};

	// Handle date selection and close dropdown
	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
		onChange(formatDate(date));
		setIsOpen(false);
	};

	// Navigate to previous month
	const goToPreviousMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
		);
	};

	const [showYearPicker, setShowYearPicker] = useState(false);
	const [yearRange, setYearRange] = useState(() => {
		const currentYear = new Date().getFullYear();
		return { start: currentYear - 10, end: currentYear + 10 };
	});

	// Navigate to next month
	const goToNextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
		);
	};

	// Navigate to previous decade in year picker
	const goToPreviousYear = () => {
		setYearRange((prev) => ({ start: prev.start - 10, end: prev.end - 10 }));
	};

	// Navigate to next decade in year picker
	const goToNextYear = () => {
		setYearRange((prev) => ({ start: prev.start + 10, end: prev.end + 10 }));
	};

	// Set current date to today and close dropdowns
	const goToToday = () => {
		const today = new Date();
		setCurrentDate(today);
		setSelectedDate(today);
		onChange(formatDate(today));
		setIsOpen(false);
		setShowYearPicker(false);
	};

	// Clear selected date and close dropdowns
	const clearDate = () => {
		setSelectedDate(null);
		onChange("");
		setIsOpen(false);
		setShowYearPicker(false);
	};

	// Select year and close year picker
	const selectYear = (year: number) => {
		setCurrentDate(new Date(year, currentDate.getMonth(), 1));
		setShowYearPicker(false);
	};

	const days = getDaysInMonth(currentDate);

	// Generate array of years for the year picker
	const generateYearRange = () => {
		const years = [];
		for (let year = yearRange.start; year <= yearRange.end; year++) {
			years.push(year);
		}
		return years;
	};

	return (
		<div ref={dropdownRef} className="relative">
			<div className="relative">
				<input
					type="text"
					className={`${FIELD_CLASS} pr-14`}
					placeholder={placeholder}
					value={formatDisplayDate(value)}
					readOnly
					onClick={() => setIsOpen(!isOpen)}
				/>
				<button
					type="button"
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors w-11 h-11 flex items-center justify-center rounded-md"
					onClick={() => setIsOpen(!isOpen)}
					aria-label="Open calendar"
				>
					<Calendar className="w-5 h-5" />
				</button>
			</div>

			{isOpen && (
				<div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 p-4 z-50">
					{/* Calendar Header */}
					<div className="flex items-center justify-between mb-4">
						<button
							type="button"
							onClick={goToPreviousMonth}
							className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300"
							aria-label="Previous month"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setShowYearPicker(!showYearPicker)}
								className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300 px-2 py-1 rounded"
								aria-label="Change month"
							>
								{t(MONTH_KEYS[currentDate.getMonth()])}
							</button>
							<button
								type="button"
								onClick={() => setShowYearPicker(!showYearPicker)}
								className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300 px-2 py-1 rounded"
								aria-label="Change year"
							>
								{currentDate.getFullYear()}
							</button>
						</div>
						<button
							type="button"
							onClick={goToNextMonth}
							className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300"
							aria-label="Next month"
						>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>

					{/* Year Picker */}
					{showYearPicker && (
						<div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
							<div className="flex items-center justify-between mb-3">
								<button
									type="button"
									onClick={goToPreviousYear}
									className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-600 rounded transition-colors duration-300"
									aria-label="Previous years"
								>
									<ChevronLeft className="w-4 h-4" />
								</button>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									{yearRange.start} - {yearRange.end}
								</span>
								<button
									type="button"
									onClick={goToNextYear}
									className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-600 rounded transition-colors duration-300"
									aria-label="Next years"
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
							<div className="grid grid-cols-5 gap-1">
								{generateYearRange().map((year) => (
									<button
										key={year}
										type="button"
										onClick={() => selectYear(year)}
										className={`
                      p-2 text-sm rounded transition-all duration-150
                      ${
												year === currentDate.getFullYear()
													? "bg-sky-600 text-white font-semibold shadow-md"
													: "hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
											}
                    `}
									>
										{year}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Days of Week */}
					<div className="grid grid-cols-7 gap-1 mb-2">
						{WEEKDAY_KEYS.map((day) => (
							<div
								key={day}
								className="text-center text-sm font-medium text-gray-500 dark:text-zinc-400 py-2"
							>
								{t(day)}
							</div>
						))}
					</div>

					{/* Calendar Grid */}
					<div className="grid grid-cols-7 gap-1">
						{days.map((day, index) => (
							<button
								key={day ? day.toString() : `empty-${index}`}
								type="button"
								className={`
                  p-2 text-sm rounded-lg transition-all duration-150
                  ${!day ? "invisible" : ""}
                  ${
										day &&
										selectedDate &&
										day.toDateString() === selectedDate.toDateString()
											? "bg-sky-600 text-white font-semibold shadow-md"
											: day && day.toDateString() === new Date().toDateString()
												? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 font-semibold hover:bg-sky-200 dark:hover:bg-sky-900/50"
												: day
													? "hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
													: ""
									}
                `}
								onClick={() => day && handleDateSelect(day)}
								disabled={!day}
							>
								{day ? day.getDate() : ""}
							</button>
						))}
					</div>

					{/* Calendar Footer */}
					<div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
						<button
							type="button"
							onClick={clearDate}
							className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded transition-colors"
						>
							{t("calendar.clear")}
						</button>
						<button
							type="button"
							onClick={goToToday}
							className="px-3 py-1 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded transition-colors"
						>
							{t("calendar.today")}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
