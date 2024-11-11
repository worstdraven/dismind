const IS_PRODUCT = false;

function createSchedule() {
  const VALID_CALENDAR_IDS = PropertiesService.getScriptProperties()
    .getProperty("VALID_CALENDAR_IDS")
    .split(",");
  console.log(VALID_CALENDAR_IDS);

  let message = "";
  let startTime: string;
  let endTime: string;
  console.log(getDate(1));
}

function eventStartAt(
  event: GoogleAppsScript.Calendar.CalendarEvent,
  date: Date
) {
  return event.getStartTime().getDate() === date.getDate();
}

function eventEndAt(event: GoogleAppsScript.Calendar.CalendarEvent, date) {
  return event.getEndTime().getDate() === date.getDate();
}

function getDate(dateDiff: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + dateDiff);
  return date;
}

function getJapaneseDay(date: Date): string {
  const dayNum = Number(Utilities.formatDate(date, "Asia/Tokyo", "u"));
  const japaneseDays = ["月", "火", "水", "木", "金", "土", "日"];
  return japaneseDays[dayNum - 1] + "曜日";
}
