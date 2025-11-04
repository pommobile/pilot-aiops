Log("-> Impact alert injection...");

Load('AIOPS_Utils');

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
}

var aiopsMetadata = {
  dataSourceName: "AIOps-impact-364bf8d5-0bc0-41ec-b289-466ad56d83c6"
};

var id = uuid();

var alert = {
  id: id,
  severity: 1,
  type: { eventType: "problem", classification: "Impact service" },
  resource: { name: "Impact service" },
  deduplicationKey: "null",
  summary: "MW CRUD"
};

aiopsUtils.postAlert(alert, true);

Log("<- Impact alert injection.");
