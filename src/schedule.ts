function createScheduleEmbed(): string {
  const VALID_CALENDAR_IDS = PropertiesService.getScriptProperties()
    .getProperty("VALID_CALENDAR_IDS")
    .split(",");
  console.log(VALID_CALENDAR_IDS);

  let message = "";
  let startTime: string;
  let endTime: string;

  const targetDate = getDate(1);

  const calendarList = CalendarApp.getAllCalendars();

  if (!Array.isArray(calendarList)) {
    console.error("カレンダーが取得できませんでした。");
  }

  for (const calendar of calendarList) {
    // 1日後の予定を取得
    const eventList = calendar.getEventsForDay(targetDate);
    // 予定がない or 有効なカレンダーでない場合スキップ
    if (eventList.length === 0 || !VALID_CALENDAR_IDS.includes(calendar.getId())) {
      continue;
    }
    console.log(calendar.getName());
    message += `### ${calendar.getName()}\n`;
    for (const event of eventList) {
      console.log(event.getTitle(), event.getStartTime());
      if (
        event.isAllDayEvent() ||
        (!eventStartAt(event, targetDate) && !eventEndAt(event, targetDate))
      ) {
        // all day event
        message += "- ` 終 日 `";
      } else if (eventStartAt(event, targetDate)) {
        // event starts today
        startTime = Utilities.formatDate(event.getStartTime(), "Asia/Tokyo", "HH:mm");
        message += `- \`${startTime}~\``;
      } else {
        // event ends today
        endTime = Utilities.formatDate(event.getEndTime(), "Asia/Tokyo", "HH:mm");
        message += `- \`~${endTime}\``;
      }
      message += ` \*\*${event.getTitle()}\*\*\n`;
    }
  }

  if (message.length === 0) {
    message = "予定はありません";
  }

  console.log(message);
  return message;
}

function eventStartAt(event: GoogleAppsScript.Calendar.CalendarEvent, date: Date) {
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

function discordHook() {
  const STATUS = PropertiesService.getScriptProperties().getProperty("STATUS");
  const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty(`WEBHOOK_URL_${STATUS}`);

  const embedTitle =
    Utilities.formatDate(getDate(1), "Asia/Tokyo", "M月d日") +
    "（" +
    getJapaneseDay(getDate(1)) +
    "）の予定";

  const message = {
    username: "B.F. Sword",
    avatar_url:
      "https://static.wikia.nocookie.net/leagueoflegends/images/a/ab/B._F._Sword_item.png/revision/latest?cb=20201029192225",
    embeds: [
      {
        title: embedTitle,
        url: "https://calendar.google.com/calendar",
        type: "rich",
        description: createScheduleEmbed(),
      },
    ],
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: { "Content-type": "application/json" },
    payload: JSON.stringify(message),
  };
  UrlFetchApp.fetch(WEBHOOK_URL, options);
}
