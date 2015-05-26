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
var identifyLoadingIcon = document.createElement("div");
var identifyMarkerIcon = document.createElement("div");
identifyLoadingIcon.id = "identifyLoading";
identifyMarkerIcon.id = "identifyMarker";


function initIdentify() {
  EsriControls.addPostBackTagHandler("task", handleTaskUpdate);
}

function handleTaskUpdate(task, mapIds) {
  for(var i=0;i<mapIds.length;i++) {
   if(mapIds[i]=="map1") {
     if(task.hasChildNodes() && EsriUtils.getXmlText(task.getElementsByTagName("id").item(0)) == "mapToolsTask") {
       var toolId = EsriUtils.getXmlText(task.getElementsByTagName("active-tool").item(0));
       if(toolId && toolId == "mapToolsTask_tool_identify")
         requestIdentifyResults();
      }
    }
  }
}

function requestIdentifyResults() {
  //EsriControls.maps["map1"].mapTip.hide();
  var url = EsriUtils.getServerUrl(formId);
  var params = "formId=" + formId + "&mapId=map1&ajaxCommand=ajaxCommand&ajaxCommandBeanId=identifyResultCommand&" + EsriUtils.buildRequestParams(formId);
  EsriUtils.sendAjaxRequest(url, params, false, handleIdentifyResultRequest);
}

function handleIdentifyResultRequest(xhr) {
  if(xhr != null && xhr.readyState == 4 && xhr.status == 200) {
    var xml = EsriUtils.getXmlDocument(xhr);
    var pointEl = xml.getElementsByTagName("point").item(0);
    var map = EsriControls.maps["map1"];

    if(document.getElementById(identifyLoadingIcon.id)) {
      map.divObject.removeChild(document.getElementById(identifyLoadingIcon.id));
    }

    if(pointEl) { // because a point element is present, we display a maptip

      var g = map.graphics;
      var mc = map.callOut;
      var mt = map.mapTip;
      var mapTipContent = new Array();
      var resultEls = xml.getElementsByTagName("result");

      for (var i = 0; i < resultEls.length; i++) {
        var result = getResultFromXml(resultEls[i]);
        if(result.content == "")
          result.content = "<![CDATA[default]]>";

        var template = mt.transform(result.attributes, result.content);
        var mapTipData = {
          id: result.id,
          content: template.content,
          header: result.name + " (" + result.layer + ")",
          footer: getFooterContent(result.id, result.resource, result.layer)
        };
        mapTipContent.push(mapTipData);
      }

      map.divObject.appendChild(identifyMarkerIcon);
      EsriUtils.setElementStyle(identifyMarkerIcon, "top:" + (parseInt(pointEl.getAttribute("y")) - 27) + "px;" + "left:" + (parseInt(pointEl.getAttribute("x")) - 12) + "px; display: block;");

      if (mapTipContent.length > 0) {
        mc.setContent(mapTipContent);
      } else {
        mc.setContent({header: Res.getString("no_results"), content: Res.getString("no_results_desc"),footer:Res.getString("no_results")});
      }

      mc.moveTo(parseInt(pointEl.getAttribute("x")), parseInt(pointEl.getAttribute("y")));
      mc.collapse();
      mc.show();
      mc.onHide = function() {
        requestClearIdentifyResult();
        if(document.getElementById(identifyMarkerIcon.id)) {
          map.divObject.removeChild(document.getElementById(identifyMarkerIcon.id));
        }
        this.onHide = null;
        map.mapTip.setEventsEnabled(true);
      };
    }
  }
}

function getResultFromXml(resultEl) {
  var result = {
    content: "",
    attributes: new Array(),
    id: EsriUtils.getXmlText(resultEl.getElementsByTagName("id").item(0)),
    layer: EsriUtils.getXmlText(resultEl.getElementsByTagName("layer").item(0)),
    name: EsriUtils.getXmlText(resultEl.getElementsByTagName("name").item(0)),
    resource: EsriUtils.getXmlText(resultEl.getElementsByTagName("resource").item(0))
  };

  var attributesEls = resultEl.getElementsByTagName("attributes");
  if(attributesEls && attributesEls.length == 1) {
    result.attributes = getAttributesAsArray(attributesEls.item(0));
  }

  var contentEls = resultEl.getElementsByTagName("content");
  if(contentEls && contentEls.length == 1) {
    result.content = EsriUtils.getXmlText(contentEls.item(0));
  }

  return result;
}

function getFooterContent(id, resource, layer) {
  var cont = document.createElement("div");
  var layerLabel = document.createElement("div");
  layerLabel.innerHTML = resource + " > " + layer;
  var linkLabel = document.createElement("div");
  linkLabel.className = "link";
  linkLabel.innerHTML = Res.getString("add_to_results");
  linkLabel.onclick = function() {
    requestAddToResults(id);
  };
  cont.appendChild(layerLabel);
  cont.appendChild(linkLabel);
  layerLabel = linkLabel = null;
  return cont;
}

function getAttributesAsArray(el) {
  var attributes = new Array();
  if(el) {
    var attributeEls = el.getElementsByTagName("attribute");
    if(attributeEls.length > 0) {
      for(var i = 0; i < attributeEls.length; i++) {
        var attributeEl = attributeEls.item(i);
        attributes[attributeEl.getAttribute("name")] = attributeEl.getAttribute("value");
      }
    }
  }
  return attributes;
}

function requestClearIdentifyResult() {
  var url = EsriUtils.getServerUrl(formId);
  var params = "formId=" + formId + "&mapId=map1&ajaxCommand=ajaxCommand&ajaxCommandBeanId=clearIdentifyResultCommand&" + EsriUtils.buildRequestParams(formId);
  EsriUtils.sendAjaxRequest(url, params, false, function() { });
}

function requestAddToResults(objectId) {
  var url = EsriUtils.getServerUrl(formId);
  var params = "formId=" + formId + "&mapId=map1&ajaxCommand=ajaxCommand&ajaxCommandBeanId=addIdentifyToResultsCommand&identifyResultId=" + objectId + "&" + EsriUtils.buildRequestParams(formId);
  EsriUtils.sendAjaxRequest(url, params, false, handleAddToResultsRequest);
}

function handleClearIdentifyResultRequest(xhr) {
  EsriControls.processPostBack(xhr);
}

function handleAddToResultsRequest(xhr) {
  if(xhr != null && xhr.readyState == 4 && xhr.status == 200) {
    var xml = EsriUtils.getXmlDocument(xhr);
    var success = EsriUtils.getXmlText(xml.getElementsByTagName("result-added").item(0));
    EsriControls.processPostBackXML(xml);
  }
}

function refreshResults() {
  if(resultsToc) {
    resultsToc.nodeOperation(null, null);
  }
}

/*
 * Override default EsriMapPoint
 */
function MapViewerIdentifyMapPoint(id, toolName, isMarkerTool) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDrawPointAction(), isMarkerTool));
  var self = this;
  this.update = function() { self = this; }
  this.postAction = function(point) {
    self.update();
    var map = self.control;

    if (self.isMarker) map.graphics.drawPoint(point);
    else {
      map.mapTip.setEventsEnabled(false);
      map.divObject.appendChild(identifyLoadingIcon);
      point = point.offset(-map.viewBounds.left, -map.viewBounds.top);
      EsriUtils.setElementStyle(identifyLoadingIcon,
        "top:" + (point.y - 8) + "px;" +
        "left:" + (point.x - 8) + "px; display: block;");

      EsriUtils.addFormElement(map.formId, map.id, map.id);
      EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
      EsriUtils.addFormElement(map.formId, map.id + "_minx", point.x);
      EsriUtils.addFormElement(map.formId, map.id + "_miny", point.y);
      if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
      EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
    }
  }
}
