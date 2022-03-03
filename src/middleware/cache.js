import mcache from 'memory-cache';
import { CACHE_KEY, ONE_TIME } from '../config/env';

module.exports = () => {
  return (req, res, next) => {
    const key = CACHE_KEY * req.originUrl || req.url;
    const cacheBody = mcache.get(key);

    if (cacheBody) {
      return res.send(JSON.parse(cacheBody));
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, ONE_TIME * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};
