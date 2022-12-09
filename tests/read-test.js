import http from "k6/http";
import { Trend } from "k6/metrics";

const dbDuration = new Trend("db_duration");

export default function () {
  const res = http.get(
    "https://arai-test-cloudflare-wokers.classmethodeurope.workers.dev/read"
  );
  const data = res.json();
  dbDuration.add(data.startend);
}
