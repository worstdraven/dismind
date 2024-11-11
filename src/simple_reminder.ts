function simpleReminder() {
  const response = sendMessage();
  const parsedResponse = JSON.parse(response.getContentText());
  const messageID = parsedResponse.id;
  const messageTimestamp = parsedResponse.timestamp;

  // スプレッドシートに保存
  getSheet().appendRow([messageID, messageTimestamp]);
}

function sendMessage(): GoogleAppsScript.URL_Fetch.HTTPResponse {
  const STATUS = PropertiesService.getScriptProperties().getProperty("STATUS");
  const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty(`WEBHOOK_URL_${STATUS}`);
  const USER_ID = PropertiesService.getScriptProperties().getProperty(`USER_ID_${STATUS}`);

  const message = {
    username: "おくすりりまいんど",
    avatar_url:
      "https://static.wikia.nocookie.net/leagueoflegends/images/1/1d/Mana_Potion_item.png/revision/latest?cb=20171223002624",
    content: `<@${USER_ID}> お薬は飲んだか？`,
    allowed_mentions: {
      parse: ["users"],
    },
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: { "Content-type": "application/json" },
    payload: JSON.stringify(message),
  };

  const response = UrlFetchApp.fetch(`${WEBHOOK_URL}?wait=true`, options);
  return response;
}

function getMessage(messageID: string): any {
  const STATUS = PropertiesService.getScriptProperties().getProperty("STATUS");
  const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty(`WEBHOOK_URL_${STATUS}`);

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = { method: "get" };
  const response = UrlFetchApp.fetch(`${WEBHOOK_URL}/messages/${messageID}`, options);

  const parsedResponse = JSON.parse(response.getContentText());
  // console.log(parsedResponse);
  return parsedResponse;
}

function deleteMessage(messageID: string) {
  const STATUS = PropertiesService.getScriptProperties().getProperty("STATUS");
  const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty(`WEBHOOK_URL_${STATUS}`);

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "delete",
  };
  const response = UrlFetchApp.fetch(`${WEBHOOK_URL}/messages/${messageID}`, options);
  console.log("successfully deleted message", response);
}

function fetchSheet() {
  // シートからIDを読み取る → Webhookでメッセージを取得 → エモートされてたらメッセージ削除＆レコード削除
  const sheet = getSheet();
  const range = sheet.getRange(1, 1, sheet.getLastRow());
  const messageIDList = range.getValues().flat();
  console.log(messageIDList);

  for (const [row, messageID] of [...messageIDList.entries()].reverse()) {
    let message = getMessage(messageID);
    let isReacted = Boolean(message.reactions);
    if (!isReacted) {
      continue;
    }
    deleteMessage(messageID);
    sheet.deleteRow(row + 1);
  }
}

function getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const SHEET_URL = PropertiesService.getScriptProperties().getProperty("SHEET_URL");
  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getActiveSheet();
  return sheet;
}
