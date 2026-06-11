const SHEET_SYNC_LIMIT = 25;

function json(status, body) {
  return Response.json(body, { status });
}

function requireEnv() {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "").trim();
  const googleWebhookUrl = (process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || "").trim();

  const missing = [];
  if (!supabaseUrl) missing.push("SUPABASE_URL or VITE_SUPABASE_URL");
  if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!googleWebhookUrl) missing.push("GOOGLE_SHEETS_WEBHOOK_URL or VITE_GOOGLE_SHEETS_WEBHOOK_URL");

  return { supabaseUrl, serviceKey, googleWebhookUrl, missing };
}

function ukDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Europe/Warsaw"
  }).format(new Date(value));
}

function moneyNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : "";
}

function formatFixed(value, digits) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "";
}

function buildSheetRow(caseRow) {
  const input = caseRow.input_data || {};
  const scoring = caseRow.scoring_result || {};
  const total = caseRow.total_score ?? scoring.total ?? "";
  const approved = caseRow.approved ?? scoring.approved ?? false;
  const risk = caseRow.risk_level || scoring.risk || "";
  const offer = scoring.offer || "";
  const amountAdvice = scoring.amountAdvice || "";
  const verification = scoring.verification || "";

  return [
    ukDate(caseRow.created_at),
    caseRow.source || "",
    caseRow.local_card_id || caseRow.id || "",
    caseRow.client_name || "",
    caseRow.contact || "",
    input.age ?? "",
    input.maritalStatus || "",
    input.nationality || "",
    input.residence || "",
    input.employmentType || "",
    input.seniorityMonths ?? "",
    moneyNumber(input.netIncome),
    moneyNumber(input.otherIncome),
    moneyNumber(input.currentPayments),
    input.creditHistory || "",
    input.housing || "",
    moneyNumber(input.savings),
    moneyNumber(input.loanAmount),
    input.loanTermMonths ?? "",
    input.purpose || "",
    input.notes || "",
    formatFixed(scoring.currentDti, 1),
    formatFixed(caseRow.total_dti ?? scoring.totalDti, 1),
    formatFixed(caseRow.monthly_payment ?? scoring.monthlyPayment, 2),
    total,
    approved ? "Так" : "Ні",
    risk,
    offer,
    [amountAdvice, verification].filter(Boolean).join("; ")
  ];
}

async function supabaseFetch(path, options, config) {
  let response;
  try {
    response = await fetch(`${config.supabaseUrl}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {})
      }
    });
  } catch (error) {
    throw new Error(`Supabase network request failed: ${error.message}`);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function markSynced(caseId, config) {
  await supabaseFetch(`client_scoring_cases?id=eq.${encodeURIComponent(caseId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      google_sheet_synced: true,
      google_sheet_synced_at: new Date().toISOString(),
      google_sheet_error: null
    })
  }, config);
}

async function markFailed(caseId, error, config) {
  await supabaseFetch(`client_scoring_cases?id=eq.${encodeURIComponent(caseId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      google_sheet_error: String(error.message || error).slice(0, 1000)
    })
  }, config);
}

async function appendToGoogleSheet(caseRow, config) {
  let response;
  try {
    response = await fetch(config.googleWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        row: buildSheetRow(caseRow),
        supabaseId: caseRow.id
      })
    });
  } catch (error) {
    throw new Error(`Google Sheets network request failed: ${error.message}`);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Google Sheets webhook failed: ${response.status}`);
  }

  return response.json();
}

async function readLimit(request) {
  if (request.method !== "POST") return SHEET_SYNC_LIMIT;
  try {
    const body = await request.json();
    return Math.min(Number(body?.limit) || SHEET_SYNC_LIMIT, SHEET_SYNC_LIMIT);
  } catch {
    return SHEET_SYNC_LIMIT;
  }
}

async function handle(request) {
  if (request.method !== "POST" && request.method !== "GET") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  const config = requireEnv();
  if (config.missing.length > 0) {
    return json(500, { ok: false, error: "Missing server environment variables", missing: config.missing });
  }

  const limit = await readLimit(request);
  const select = [
    "select=*",
    "google_sheet_synced=eq.false",
    "order=created_at.asc",
    `limit=${limit}`
  ].join("&");

  try {
    const rows = await supabaseFetch(`client_scoring_cases?${select}`, { method: "GET" }, config);
    const results = [];

    for (const caseRow of rows || []) {
      try {
        await appendToGoogleSheet(caseRow, config);
        await markSynced(caseRow.id, config);
        results.push({ synced: true });
      } catch (error) {
        await markFailed(caseRow.id, error, config);
        results.push({ synced: false });
      }
    }

    return json(200, {
      ok: true,
      checked: rows?.length || 0,
      synced: results.filter((item) => item.synced).length,
      failed: results.filter((item) => !item.synced).length
    });
  } catch (error) {
    return json(500, { ok: false, error: error.message });
  }
}

export function GET(request) {
  return handle(request);
}

export function POST(request) {
  return handle(request);
}

export default {
  fetch(request) {
    return handle(request);
  }
};
