/*
COPYRIGHT 1995-2005 ESRI

TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
Unpublished material - all rights reserved under the 
Copyright Laws of the United States.

For additional information, contact:
Environmental Systems Research Institute, Inc.
Attn: Contracts Dept
380 New York Street
Redlands, California, USA 92373

email: contracts@esri.com
*/

function EsriTask_GPAsyncTaskResultsTimer(id, tocId, pingSeconds) {
  this.id = id;
  this.tocId = tocId;
  var toc = EsriControls.tocs[tocId];
  var formId = EsriControls.maps[toc.mapId].formId;
  var timer = null;
  var ping = (pingSeconds) ? pingSeconds : 5;
  var self = this;

  this.tagHandler = function(xml, eventSources) {
    var tocId = xml.getElementsByTagName("toc-id").item(0).firstChild.nodeValue;
    if (self.tocId == tocId) {
      var resultTags = xml.getElementsByTagName("result");
      var jobsCompleted = true;
      for (var i=0;i<resultTags.length;i++) {
        var resultTag = resultTags.item(i);
        if (resultTag.getAttribute("complete") == "false") jobsCompleted = false;
      }

      if (jobsCompleted) stopTimer();
      else if (! jobsCompleted && timer == null) startTimer();
    }
  }

  function sendGpAsyncRequest() {
    var url = EsriUtils.getServerUrl(formId);
    var params = "gpAsyncTaskResults=gpAsyncTaskResults&status=status&formId=" + formId + "&tocId=" + self.tocId + "&" + EsriUtils.buildRequestParams(formId);
    EsriUtils.sendAjaxRequest(url, params, false, EsriControls.processPostBack);
  }

  function startTimer() {
    setTimeout(function() { sendGpAsyncRequest() }, 0);
    timer = setTimeout(function() { startTimer() }, ping * 1000);
  }

  function stopTimer() {
    clearTimeout(timer);
    timer = null;
  }

  EsriControls.addPostBackTagHandler("gp-task-results-async", this.tagHandler);
  setTimeout(function() { sendGpAsyncRequest() }, ping * 1000);
}