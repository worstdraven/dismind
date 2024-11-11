const IS_PRODUCT = false;

function schedule_reminder() {
  const VALID_CALENDAR_IDS = PropertiesService.getScriptProperties()
    .getProperty("VALID_CALENDAR_IDS")
    .split(",");
  console.log(VALID_CALENDAR_IDS);
}
