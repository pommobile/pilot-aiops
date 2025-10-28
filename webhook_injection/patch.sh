route=aiops-cpd.lb-axa-aiops.dev.fyre.ibm.com
path=aiops/api/issue-resolution/v1/alerts
x_tenant_id=cfd95b7e-3bc7-4006-a4a8-a73a79c71255
api_key=A6x917ZVZdzrxtRbCJXlwABfzOQqxFvClNt5EFQl
zen_api_key=$(echo "cpadmin:$api_key" | base64 -w 0)

alert=$(curl -k -s \
    https://$route/$path/$alertid \
        --header 'Content-Type: application/json' \
        --header "Authorization: ZenApiKey $zen_api_key" \
        --header "X-TenantID: $x_tenant_id")


old_details=$(echo $alert | jq '. | .details')
details=$(echo { \"SNIN\": \"$snin\"} )

curl -k -s \
        -X PATCH \
        https://$route/$path/$alertid?wait_for_commit=false \
        --header 'Content-Type: application/json' \
        --header "Authorization: ZenApiKey $zen_api_key" \
        --header "X-TenantID: $x_tenant_id" \
        -d "{ \"details\": $details }"
