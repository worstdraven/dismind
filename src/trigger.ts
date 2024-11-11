function setTrigger() {
  // remove existing triggers
  const initialTriggers = ScriptApp.getProjectTriggers();
  console.log(`${initialTriggers.length} triggers existing.`);
  initialTriggers.map((t) => ScriptApp.deleteTrigger(t));

  console.log(`${ScriptApp.getProjectTriggers().length} triggers remaining.`);

  // simple reminder
  ScriptApp.newTrigger("simpleReminder").timeBased().atHour(7).everyDays(1).create();
  ScriptApp.newTrigger("simpleReminder").timeBased().atHour(21).everyDays(1).create();

  // prune simple reminder
  ScriptApp.newTrigger("fetchSheet").timeBased().everyHours(1).create();

  // schedule reminder
  ScriptApp.newTrigger("discordHook").timeBased().atHour(22).everyDays(1).create();

  console.log(`Now, ${ScriptApp.getProjectTriggers().length} triggers working.`);
}
