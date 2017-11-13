let await = require('asyncawait/await');
let asynchronous = require('asyncawait/async');

exports.findFromAndUpdateCache = asynchronous(function (key, callback) {
  let myCacheValue = await (RedisCache.getAsync(key));
  if (myCacheValue) {
    let newCacheValue = JSON.parse(myCacheValue);
    newCacheValue = callback(newCacheValue);
    RedisCache.set(key, JSON.stringify(newCacheValue));
  }
})

exports.getFromTheCache = function (key) {
  let myCacheValue;
  let executeCacheCheck = asynchronous(function(){
    myCacheValue = await (RedisCache.getAsync(key));
  })
  executeCacheCheck();
  if (myCacheValue) {
    return JSON.parse(myCacheValue);
  }
  return null;
}

exports.setInCache = asynchronous(function(key, value){
  RedisCache.set(key, JSON.stringify(value));
})

exports.findFromCacheUpdateString = asynchronous(function(key, callback) {
  let myCacheValue = await (RedisCache.getAsync(key))
  if (myCacheValue) {
    let newCacheValue = callback(myCacheValue);
    RedisCache.set(key, newCacheValue);
  }
})
