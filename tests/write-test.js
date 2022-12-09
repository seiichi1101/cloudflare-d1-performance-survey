import http from "k6/http";
import { Trend } from "k6/metrics";

const dbDuration = new Trend("db_duration");

export default function () {
  const region = __ENV.REGION;
  const res = http.get(
    `https://arai-test-cloudflare-wokers.classmethodeurope.workers.dev/write?region=${region}`
  );
  const data = res.json();
  dbDuration.add(data.startend);
}
