'use strict';

const env = require('env-var');
const varanus = require('varanus');
const varanusElasticsearch = require('varanus-elasticsearch');
const log = require('tke-logger').getLogger(__filename);

const appName = env.get('FH_TITLE').asString();

const varanusInstance = varanus({
  log: log,
  flush: getFlushFunction(),
  flushInterval: env.get('PERFMON_FLUSH', '15000').asIntPositive(),
  maxRecords: env.get('PERFORMON_MAX_RECORDS', '2000').asIntPositive,
  level: env.get('PERFMON_LOG_LEVEL', 'info').asString,
  enabled: env.get('PERFMON_ENABLED').asBool()
});

exports.newMonitor = function (name) {
  console.log('New monitor', Object.keys(varanusInstance));
  return varanusInstance.newMonitor(name);
};

function getFlushFunction() {
  const esHost = env.get('PERFMON_ES_HOST').asString();

  if (esHost) {
    return getElasticsearchFlush();
  } else {
    log.warn('No ELASTICSEARCH_HOST variable set, not writing data to ' +
      'elasticsearch');
    return getDefaultFlush();
  }
}

function getElasticsearchFlush() {
  return varanusElasticsearch({
    appName: appName,
    host: env.get('PERFMON_ES_HOST').asString(),
    env: env.get('FH_ENV').asString(),
    indexName: env.get('PERFMON_ES_INDEX', 'appmonitoring').asString(),
    indexType: env.get('PERFMON_INDEX_TYPE', 'monthly').asString(),
    recordType: env.get('PERFMON_RECORD_TYPE', 'appMonitoring').asString()
  });
}

function getDefaultFlush() {
  return function (records) {
    if (log.debug()) {
      records.forEach(function (record) {
        log.debug('Performance: %s#%s %s',
          record.service,
          record.fnName,
          record.time
        );
      });
    }
  };
}
