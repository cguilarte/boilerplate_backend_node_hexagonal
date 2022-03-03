import { ELASTIC_HOST, ELASTIC_PORT, ELASTIC_PINGTIMEOUT } from '../config/env';
import elasticSearch from 'elasticsearch';

const elasticClient = new elasticSearch.Client({
  host: `${ELASTIC_HOST}:${ELASTIC_PORT}`,
  pingTimeout: ELASTIC_PINGTIMEOUT,
});

module.exports = elasticClient;
