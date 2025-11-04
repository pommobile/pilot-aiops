# Create incident in ServiceNow

incident=$(curl -X POST 'https://dev294930.service-now.com/api/now/table/incident' \
--user 'admin:c10eQ=BVeDf*' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data "{ \"short_description\": \"$short_description\",
          \"urgency\": \"3\",
          \"impact\": \"3\",
          \"caller_id\": \"$user\"
}")
snin=$(echo $incident | jq -r '.result.number')

# Patch alert with ServiceNow incident number

route=aiops-cpd.lb-axa-aiops.dev.fyre.ibm.com
epath=aiops/api/issue-resolution/v1/alerts
x_tenant_id=cfd95b7e-3bc7-4006-a4a8-a73a79c71255
api_key=A6x917ZVZdzrxtRbCJXlwABfzOQqxFvClNt5EFQl
zen_api_key=$(echo "cpadmin:$api_key" | base64 -w 0)

alert=$(curl -k -s \
    https://$route/$epath/$alert_id \
        --header 'Content-Type: application/json' \
        --header "Authorization: ZenApiKey $zen_api_key" \
        --header "X-TenantID: $x_tenant_id")

old_details=$(echo $alert | jq '. | .details')
details=$(echo { \"SNIN\": \"$snin\"} )

curl -k -s \
        -X PATCH \
        https://$route/$epath/$alert_id?wait_for_commit=false \
        --header 'Content-Type: application/json' \
        --header "Authorization: ZenApiKey $zen_api_key" \
        --header "X-TenantID: $x_tenant_id" \
        -d "{ \"details\": $details }"

