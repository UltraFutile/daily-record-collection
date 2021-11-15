/**
 * Utility class for datetime functionality.
 * 
 * NOTE: For any references to format, this is for the likely event where
 * we make displayed formats customizable since people can prefer different
 * date formats.
 */
export interface DateTimeUtility {
    /**
     * Return ISO8061 date string for today in UTC time.
     * Used primarily for SQL query purposes.
     * @return ISO8061 string
     */
    getTodayUtcIso(): string;

    /**
     * @param format Date string format. Default format should be: MM/DD/YYYY 
     * @return formatted date string
     */
     getTodayFormatted(format: string): string;

    /**
     * @param userInput Raw user inputed datetime string
     * @param format Format string that includes parsing tokens.
     * for day.js parse formats, see: https://day.js.org/docs/en/parse/string-format
     * @return ISO8061 string 
     */
    parseDateStringIso(userInput: string, format: string): string;
}