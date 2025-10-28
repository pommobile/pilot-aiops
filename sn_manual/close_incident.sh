# Get incident in ServiceNow

incident=$(curl -X GET "https://dev294930.service-now.com/api/now/table/incident?sysparm_query=number=$incident_number" --user 'admin:c10eQ=BVeDf*' --header 'Accept: application/json')
snsi=$(echo $incident | jq -r '.result[0].sys_id')

# Patch incident with user input cause

curl -X PATCH "https://dev294930.service-now.com/api/now/table/incident/$snsi" --user 'admin:c10eQ=BVeDf*' --header 'Content-Type: application/json' --header 'Accept: application/json' --data "{ \"state\": \"7\", \"close_code\": \"$code\", \"close_notes\": \"$notes\", \"resolution_code\": \"$code\", \"resolution_notes\": \"$notes\" }"
