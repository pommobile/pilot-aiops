curl -v -u impactadmin:netcool \
-k https://localhost:9081/restui/policyui/policy/MWM_Create_From_AIOPS/runwithinputparameters \
-X POST -d '{ "resource" : "VM", "startTime" : "2025-11-05 16:00:00", "endTime" : "2025-11-05 18:00:00" }' \
-H "Content-Type: application/json"