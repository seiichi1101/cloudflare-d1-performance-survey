import http from "k6/http";
import { Trend } from "k6/metrics";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const dbExecDuration = new Trend("db_exec_duration");
const dbReqDuration = new Trend("db_req_duration");

export default function () {
  const res = http.get(
    "https://arai-test-cloudflare-wokers.classmethodeurope.workers.dev/read"
  );
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  if (res.status !== 200) {
    console.error(JSON.stringify(res, null, 2));
  }
  const data = res.json();
  dbExecDuration.add(data.d1Result.duration);
  dbReqDuration.add(data.dbReqDuration);
}

export function handleSummary(data) {
  const region = __ENV.REGION;
  return {
    [`out/${region}-read-test-summary.html`]: htmlReport(data),
  };
}
