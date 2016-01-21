'use strict';

exports = module.exports = function (settings, request) {

  class DatadogApi {
    constructor(url, appKey, apiKey) {
      this.defaultHeaders = {'Content-type': 'application/json'};
      this.request = request;
      this.manageTimeBoardUrl = url + `/{{dash_id}}?api_key=${apiKey}&application_key=${appKey}`;
      this.createTimeBoardUrl = url + `?api_key=${apiKey}&application_key=${appKey}`;
    }

    getTimeboard(boardId) {
      return this.request.get(this.manageTimeBoardUrl.replace('{{dash_id}}', boardId));
    };

    createTimeboard(json) {
      return this.request.post({
        url: this.createTimeBoardUrl,
        json: json,
        headers: this.defaultHeaders
      });
    };

    updateTimeboard(boardId, json) {
      return this.request.put({
        url: this.manageTimeBoardUrl.replace('{{dash_id}}', boardId),
        json: json,
        headers: this.defaultHeaders
      });
    };

    deleteTimeboard(boardId) {
      return this.request.del(this.manageTimeBoardUrl.replace('{{dash_id}}', boardId));
    };
  }

  return new DatadogApi(settings.dataDogApiUrl, settings.dataDogAppKey, settings.dataDogApiKey)
};

exports['@singleton'] = true;
exports['@require'] = ['settings', 'request'];
