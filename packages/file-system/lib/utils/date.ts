import {DateTime} from 'luxon';

/**
 * Parses an ISO date string and formats it to 'yyyy-MM-dd'.
 * @params isoDate dateString in iso format
 * @return formatted date string in 'yyyy-MM-dd' format
 * @example parseDate('2023-10-01T12:00:00Z') // returns '2023-10-01'
 * See more at https://moment.github.io/luxon/#/formatting
 */
export const ParseDate = (isoDate: string): string => {
  //* Early exit if we have passed an empty string
  if (!isoDate || isoDate.length === 0) return "---";

  const date = DateTime.fromISO(isoDate);
  return date.toFormat('yyyy-MM-dd');
}
