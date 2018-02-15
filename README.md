# TKE Varanus

TKE-specific configuration for [Varanus](https://www.npmjs.com/package/varanus) which sends data to Elasticsearch (ES).

## Environment Variables
- `PERFMON_ENABLED` - Must be set to `true` for any logging of metrics to happen.
- `PERFMON_ES_HOST` - The Elasticsearch host URL. If this is not provided, then metrics will just be logged to the console.
- `PERFMON_FLUSH` - Milliseconds between flushing of records. Defaults to `15000`.
- `PERFORMON_MAX_RECORDS` - Maximum number of records to accumulate before flushing to ES. Defaults to `2000`.
- `PERFMON_LOG_LEVEL` - Log level for the ES client. Defaults to `info`.
- `PERFMON_ES_INDEX` - The name of the ES index to use. Must be all lowercase. Defaults to `appmonitoring`.
- `PERFMON_INDEX_TYPE` - The type of ES index. Must be one of `monthly`, `daily`, or `single`. Defaults to `monthly`, which means that each month gets its own ES index. (The most effective way of removing old records from ES is by deleting entire indexes.)
- `PERFMON_RECORD_TYPE` - The type of ES record we're sending. Defaults to `appMonitoring`.
- `FH_ENV` - The env the app is running in. Should be provided in any RHMAP instance.
- `FH_TITLE` - The title of the app. Should be provided in any RHMAP instance.

---

## Usage

### Monitoring Function Calls
In each file that has functions you'd like to monitor, do something like this:

```js
const monitor = require('tke-varanus').newMonitor(__filename);
...
exports.foo = monitor.info(function foo(arg1) {
  ... // Something that takes a while...
  ... // It can also return a promise
  ... // See the Varanus docs for the full API
});
```

---
