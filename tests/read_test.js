import http from "k6/http";
import { Trend } from "k6/metrics";

const apiDuration = new Trend("api_duration");
const dbDuration = new Trend("db_duration");

export default function () {
  const res = http.get(
    "https://arai-test-cloudflare-wokers.classmethodeurope.workers.dev/read"
  );
  const data = res.json();
  apiDuration.add(data.duration * 1000);
  dbDuration.add(data.startend);
}
