import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

/**
 * Utility class for datetime functionality.
 * 
 * NOTE: For any references to format, this is for the likely event where
 * we make displayed formats customizable since people can prefer different
 * date formats.
 */
export class DateTimeUtility {
    /**
     * Return ISO8061 date string for today in UTC time.
     * Used primarily for SQL query purposes.
     * @return ISO8061 string
     */
    static getTodayUtcIso(): string {
        // dayjs.extend(utc)
        return dayjs.utc().format();
    }

    /**
     * @param format Date string format. Default format should be: MM/DD/YYYY 
     * @return formatted date string
     */
     static getTodayFormatted(format: string = "MM/DD/YYYY"): string {
         // TODO: validation of format string OR limit possible formats to common formats
        return dayjs().format(format);
     }

    /**
     * @param userInput Raw user inputed datetime string
     * @param format Format string that includes parsing tokens.
     * for day.js parse formats, see: https://day.js.org/docs/en/parse/string-format
     * @return ISO8061 string 
     */
     static parseDateStringIso(userInput: string, format: string = "MM/DD/YYYY"): string {
        return dayjs(userInput, format).format();
    }
    private static weekDayMap = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    }

    static getDayOfWeek(date: string): string {
        return this.weekDayMap[dayjs(date).day()];
    }
}