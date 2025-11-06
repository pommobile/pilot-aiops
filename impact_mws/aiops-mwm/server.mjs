import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();
app.use(express.urlencoded({ extended: true }));

const BACKEND_URL = process.env.BACKEND_URL || "https://localhost:9081/restui/policyui/policy/MWM_Create_From_AIOPS/runwithinputparameters";
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 5000);
const BASIC_USER = process.env.BASIC_USER || "impactadmin";
const BASIC_PASS = process.env.BASIC_PASS || "netcool";
const insecureAgent = new https.Agent({ rejectUnauthorized: false });

const FORM_HTML = `
<!doctype html>
<title>Maintenance window</title>
<h3>Maintenance windows</h3>
<form method="POST">
  <label>resource: <input name="resource" value="resource_value" required></label><br>
  <label>Start time: <input name="startTime" value="2025-11-12 00:00:00" required></label><br>
  <label>End time: <input name="endTime" value="2025-11-12 02:00:00" required></label><br>
  <button type="submit">Send</button>
</form>
`;

app.get("/", (req, res) => {
    const resource = req.query.resource;
    res.send(FORM_HTML.replace("resource_value", resource))
});

app.post("/", async (req, res) => {
    const { resource = "", startTime = "", endTime = "" } = req.body;
    const basicToken = Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString("base64");
    const headers = { "Content-Type": "application/json", "Authorization": `Basic ${basicToken}` };
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(headers));
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const backendResp = await fetch(BACKEND_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({ resource, startTime, endTime }),
            signal: controller.signal,
            agent: insecureAgent
        });
        clearTimeout(timer);
        const text = await backendResp.text();
        res.send(
            FORM_HTML.replace("resource_value", resource) +
            `<p><b>Backend response (status ${backendResp.status}):</b></p><pre>${text.replace(/</g, "&lt;")}</pre>`
        );
    } catch (e) {
        res.status(500).send(FORM_HTML + `<p><b>Error:</b> ${String(e)}</p>`);
    }
});

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.listen(8080, "127.0.0.1", () => console.log("Listening on http://127.0.0.1:8080"));