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

function EsriOverview(id, container, mapId, wd, ht) {
  this.width = (wd) ? wd : (container.style.width) ? EsriUtils.getStyleValue(container.style.width) : 150;
  this.height = (ht) ? ht : (container.style.height) ? EsriUtils.getStyleValue(container.style.height) : 150;
  this.inheritsFrom(new EsriControl(id, "Overview", 0, 0, this.width, this.height));

  this.divId = "OverviewDiv_" + id;
  this.mapId = mapId;
  this.imageObject = null;
  this.imageId = "OverviewImage_" + id;
  this.imageUrl = EsriControls.contextPath + "images/pixel.gif";

  this.box = new EsriRectangle(0,0,0,0);
  this.boxFillColor = "#000";
  this.boxFillOpacity = 0.25;
  this.boxLineWidth = 2;
  this.boxLineColor = "#f00";
  this.boxLineOpacity = 1;
  this.boxZIndex = 9;
  this.clientPostBack = this.isContinuousPan = false;

  this.showNoData = false;
  this.noDataLabel = "No Data";

  this.enableLoading = false;
  var loading, loadingImg;

  var boxDivId = "OverviewBoxDiv_" + id;
  var boxImageId = "OverviewBoxImage_" + id;
  var boxBgImg = EsriControls.contextPath + "images/pixel.gif";
  var minWidth = minHeight = boxBgImage = boxDivObject = null;
  var dragBoxTool = new EsriOverviewPan("dragBoxTool", "dragBoxTool");
  var resizeTool = new EsriOverviewResize("overviewResizeTool", "overviewResizeTool");
  var self = this;

	this.init = function(container) {
    this.divObject = container.appendChild(document.createElement("div"));
    this.divObject.id = this.divId;
    EsriUtils.setElementStyle(this.divObject,	"position:relative; width:" + this.bounds.width + "px; height:" + this.bounds.height + "px; overflow:hidden; cursor:pointer;");

    if (this.showNoData) {
      var table = this.divObject.appendChild(document.createElement("table"));
      table.className = "esriOverviewNoData";
      var td = table.appendChild(document.createElement("tbody")).appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
      td.noWrap = true;
      td.align = "middle";
      td.vAlign = "center";
      td.appendChild(document.createTextNode(this.noDataLabel));
    }
    else {
      this.imageObject = this.divObject.appendChild(document.createElement("img"));
      this.imageObject.id = this.imageId;
      this.imageObject.src = this.imageUrl;
      EsriUtils.setElementStyle(this.imageObject, "position:absolute; left:" + this.bounds.left + "px; top:" + this.bounds.top + "px; width:" + this.bounds.width + "px; height:" + this.bounds.height + "px; ");

      boxDivObject = this.divObject.appendChild(document.createElement("div"));
      boxDivObject.id = boxDivId;
      EsriUtils.setElementStyle(boxDivObject, "position:absolute; left:" + this.box.left + "; top:" + this.box.top + "; width:" + this.box.width + "px; height:" +  this.box.height + "px; z-index: " + this.boxZIndex + "; cursor:move; border:" + this.boxLineWidth + "px solid " + this.boxLineColor + ";");

      boxBgImage = boxDivObject.appendChild(document.createElement("img"));
      boxBgImage.id = boxImageId;
      boxBgImage.src = boxBgImg;
      EsriUtils.setElementStyle(boxBgImage, "border:NONE; background-color:transparent; width:100%; height:100%;");

      dragBoxTool.control = this;
      dragBoxTool.element = boxBgImage;
      dragBoxTool.activate();

      resizeTool.control = this;
      resizeTool.element = boxDivObject;
      resizeTool.activate();

      loading = this.divObject.appendChild(document.createElement("div"));
      EsriUtils.setElementStyle(loading, "border:NONE; z-index:" + (this.boxZIndex + 1) + "; position:absolute; left:0px; top:0px; width:100%; height:100%; background-color:#000; display:none;");
      EsriUtils.setElementOpacity(loading, 0.0);
      loading.onmouseover = loading.onmousemove = loading.onmouseout = loading.onmousedown = loading.onmouseup = function(evt) { EsriUtils.stopEvent(evt); return false; }

      loadingImg = this.divObject.appendChild(document.createElement("img"));
      EsriUtils.hideElement(loadingImg);
      loadingImg.src = EsriControls.contextPath + "images/loading.gif";
      loadingImg.className = "esriLoadingImage";

      this.imageObject.onclick = handleClick;
      minWidth = minHeight = this.boxLineWidth * 3;
      resizeTool.action.setMinSize(minWidth, minHeight);
      EsriControls.addPostBackTagHandler("overview", EsriControls.overviews[self.id].updateAsync);
    }
  }

  this.update = function(left, top, wd, ht) {
    self.box.reshape(left, top, wd, ht);
		ht -= (self.boxLineWidth * 2);
		wd -= (self.boxLineWidth * 2);
		if(ht < minHeight) ht = minHeight;
		if(wd < minWidth) wd = minHeight;
    if (ht == minHeight || wd == minHeight) dragBoxTool.deactivate();
    else dragBoxTool.activate();
    EsriUtils.setElementStyle(boxDivObject, "position:absolute; left:" + left + "px; top:" + top + "px; width: " + wd + "px; height:" + ht + "px; z-index:" + self.boxZIndex + "; cursor:move; border:" + self.boxLineWidth + "px solid " + self.boxLineColor + ";");
    resizeTool.deactivate();
    resizeTool.activate();
	}

  this.updateAsync = function(xml, eventSources) {
    var id = xml.getElementsByTagName("id").item(0).firstChild.nodeValue;
    if (id == self.id) {
      self.mapId = xml.getElementsByTagName("map-id").item(0).firstChild.nodeValue;
      var imgUrl = xml.getElementsByTagName("image-url").item(0).firstChild.nodeValue;
      self.setOverviewImage(xml.getElementsByTagName("image-url").item(0).firstChild.nodeValue);
      var lt = parseInt(xml.getElementsByTagName("x1").item(0).firstChild.nodeValue);
      var tp = parseInt(xml.getElementsByTagName("y1").item(0).firstChild.nodeValue);
      self.update(lt, tp, (parseInt(xml.getElementsByTagName("x2").item(0).firstChild.nodeValue) - lt), (parseInt(xml.getElementsByTagName("y2").item(0).firstChild.nodeValue) - tp));

      var formId = EsriControls.maps[self.mapId].formId;
      EsriUtils.removeFormElement(formId, self.id);
      EsriUtils.removeFormElement(formId, self.id + "_mode");
      EsriUtils.removeFormElement(formId, self.id + "_centerx");
      EsriUtils.removeFormElement(formId, self.id + "_centery");

      self.hideLoading();
      for (var i=0;i<self.updateListenerNames.length;i++) self.updateListeners[self.updateListenerNames[i]](self);
    }
  }

  this.showLoading = function() {
    if (this.enableLoading) {
      EsriUtils.showElement(loading);
      EsriUtils.showElement(loadingImg);
    }
  }

  this.hideLoading = function() {
    EsriUtils.hideElement(loadingImg);
    EsriUtils.hideElement(loading);
  }

  function handleClick(event) {
    self.showLoading();
    var pt = EsriUtils.getXY(event);
    var bounds = EsriUtils.getElementPageBounds(EsriUtils.getEventSource(event));
    var map = EsriControls.maps[self.mapId];
    map.showLoading();
    EsriUtils.addFormElement(map.formId, self.id, self.id);
    EsriUtils.addFormElement(map.formId, self.id + "_mode", "recenter");
    EsriUtils.addFormElement(map.formId, self.id + "_minx", pt.x - bounds.left);
    EsriUtils.addFormElement(map.formId, self.id + "_miny", pt.y - bounds.top);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }

  EsriControls.overviewIds.push(this.id);
  EsriControls.overviews[this.id] = this;
  if (container) this.init(container);
}

EsriOverview.prototype.setOverviewImage = function(url) {
  this.imageUrl = url;
  this.imageObject.src = url;
}

function EsriOverviewPan(id, toolName) {
	this.inheritsFrom(new EsriToolItem(id, toolName, new EsriDragElementAction(true, true)));
  var self = this;
  var ov, map;
  var ovBox, ovToMapRatioWd, ovToMapRatioHt;

  this.activate = function() { this.action.activate(this.element, this.postAction, this.continuousAction); this.isActive = true; }

  this.update = function() {
    self = this;
    ov = self.control;
    map = EsriControls.maps[ov.mapId];
    ovBox = new EsriRectangle(ov.box.left, ov.box.top, ov.box.width, ov.box.height);
    ovToMapRatioWd = map.width / ov.box.width;
    ovToMapRatioHt = map.height / ov.box.height;
  }

  this.continuousAction = function(x, y) {
    if (! ov || ! ovBox || ! ovToMapRatioWd) self.update();
    if (ov.isContinuousPan) map.panTool.action.doDrag(Math.round(-x * ovToMapRatioWd), Math.round(-y * ovToMapRatioHt));
    else if (map.currentTool && map.updateOverview && map.currentTool.action.doDrag) map.currentTool.action.doDrag(Math.round(-x * ovToMapRatioWd), Math.round(-y * ovToMapRatioHt));
    else ov.update(ovBox.left + x, ovBox.top + y, ovBox.width, ovBox.height);
  }

  this.postAction = function(x, y) {
    if (x == 0 && y == 0) return;
    if (! ov || ! ovBox || ! ovToMapRatioWd) self.update();
    ov.showLoading();

    if (ov.isContinuousPan) {
      map.panTool.action.endDrag(Math.round(-x * ovToMapRatioWd), Math.round(-y * ovToMapRatioHt));
      ovToMapRatioWd = ovToMapRatioHt = null;
    }
    else if (map.currentTool && map.updateOverview && map.currentTool.action.endDrag) {
      map.currentTool.action.endDrag(Math.round(-x * ovToMapRatioWd), Math.round(-y * ovToMapRatioHt));
      ovToMapRatioWd = ovToMapRatioHt = null;
    }
    else {
      map.showLoading();
      EsriUtils.addFormElement(map.formId, ov.id, ov.id);
      EsriUtils.addFormElement(map.formId, ov.id + "_mode", "recenter");
      EsriUtils.addFormElement(map.formId, ov.id + "_minx", Math.round(ovBox.center.x + x));
      EsriUtils.addFormElement(map.formId, ov.id + "_miny", Math.round(ovBox.center.y + y));
      if (ov.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
      EsriUtils.submitForm(map.formId, ov.clientPostBack, EsriControls.processPostBack);
      ovBox = null;
    }
  }
}

function EsriOverviewResize(id, toolName) {
  this.inheritsFrom(new EsriToolItem(id, toolName, new EsriResizeElementAction(true)));
  var self = this;
  var ov, map;

  this.activate = function() {
    ov = self.control;
    map = EsriControls.maps[ov.mapId];
    this.action.activate(this.element, this.postAction);
    this.isActive = true;
  }

  this.postAction = function(bounds) {
    ov.showLoading();
    map.showLoading();
    EsriUtils.addFormElement(map.formId, ov.id, ov.id);
    EsriUtils.addFormElement(map.formId, ov.id + "_mode", "zoom");
    EsriUtils.addFormElement(map.formId, ov.id + "_minx", Math.round(bounds.left));
    EsriUtils.addFormElement(map.formId, ov.id + "_miny", Math.round(bounds.top));
    EsriUtils.addFormElement(map.formId, ov.id + "_maxx", Math.round(bounds.left + bounds.width));
    EsriUtils.addFormElement(map.formId, ov.id + "_maxy", Math.round(bounds.top + bounds.height));
    if (ov.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, ov.clientPostBack, EsriControls.processPostBack);
  }
}