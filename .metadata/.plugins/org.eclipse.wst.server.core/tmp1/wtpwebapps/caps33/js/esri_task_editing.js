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

function EsriEditingDrawAction() {
  this.inheritsFrom(new EsriAction());
  this.isEditing = true;

  this.lineOpacity = 0.5;
  this.fillColor = "#ff0";
  this.fillOpacity = 0.25;

  this.snapping = false;
  this.snapDistance = 5;
  this.snapColor = "#f90";
  this.snapWidth = 8;

  this.snappedPoint = null;
  this.snapGraphics = null;
  this.clickTolerance = 3;
}

function EsriEditingDrawPointAction() {
  this.inheritsFrom(new EsriEditingDrawAction());
  this.name = "EsriEditingDrawPointAction";

  var element, callback, contCallback, bounds, timer, currPt, gr;
  var callbackTimeout = 250;
  var self = this;

  this.activate = function(elem, cb, ccb) {
    element = elem;
    callback = cb;
    contCallback = ccb;

    element.style.cursor = this.cursor;
    element.onmousemove = processMouseMove;
    element.onclick = processClick;

    if (this.snapping) {
      gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
      EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
      gr.lineColor = this.lineColor;
      gr.lineWidth = this.lineWidth;
      gr.lineOpacity = this.lineOpacity;
      gr.fillColor = this.fillColor;
      gr.fillOpacity = this.fillOpacity;
      gr.gc.style.cursor = this.cursor;

      this.snapGraphics = EsriUtils.createGraphicsElement(element.id + "sGr", element);
      EsriUtils.setElementStyle(this.snapGraphics.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      this.snapGraphics.lineColor = this.snapColor;
      this.snapGraphics.lineWidth = this.snapWidth;
      this.snapGraphics.fillColor = "#fff";
      this.snapGraphics.fillOpacity = 1;
      this.snapGraphics.gc.style.cursor = this.cursor;

      gr.gc.onmousemove = this.snapGraphics.gc.onmousemove = processMouseMove;
      gr.gc.onclick = this.snapGraphics.gc.onclick = processClick;
    }
  }

  this.deactivate = function() {
    if (element != null) {
      element.onmousedown = element.onclick = element.onmousemove = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      gr.destroy();
      this.snapGraphics.destroy();
      gr.gc.onmousedown = gr.gc.onclick = this.snapGraphics.gc.onmousedown = this.snapGraphics.gc.onclick = null;
    }
    element = callback = gr = this.snapGraphics = this.snappedPoint = null;
  }

  this.reactivate = function() {
    var e = element;
    var c = callback;
    var cc = contCallback;
    this.deactivate();
    this.activate(e, c, cc);
  }

  function getPoint(e) {
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if ((Math.abs(currPt.x - pt.x) <= self.clickTolerance && Math.abs(currPt.y - pt.y) <= self.clickTolerance) && self.snappedPoint) pt = self.snappedPoint;
    return pt;
  }

  function processMouseMove(e) {
    bounds = EsriUtils.getElementPageBounds(element);
    currPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (gr) {
      self.snapGraphics.clear();
      gr.clear();
      gr.drawCircle(currPt, self.snapDistance);
      restartTimer();
    }
    if (EsriUtils.isNav) EsriUtils.stopEvent(e);
    return false;
  }

  function processClick(e) {
    clearTimeout(timer);
    bounds = EsriUtils.getElementPageBounds(element);
    currPt = getPoint(e);
    EsriUtils.stopEvent(e);
    if (gr) {
      gr.clear();
      self.snapGraphics.clear();
    }
    bounds = null;
    callback(currPt);
  }

  function restartTimer() {
    if (timer) clearTimeout(timer);
    var pt = currPt;
    timer = setTimeout(function() { self.snapGraphics.clear(); self.snappedPoint = null; contCallback(pt); }, callbackTimeout);
  }
}

function EsriEditingDrawLineAction() {
  this.inheritsFrom(new EsriEditingDrawAction());
  this.name = "EsriEditingDrawLineAction";

  var element, callback, bounds, timer, startPt, gr, tGr, currPt, contCallback;
  var callbackTimeout = 250;
  var self = this;

  this.activate = function(elem, cbF, ccbF) {
    element = elem;
    callback = cbF;
    contCallback = ccbF;

    gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
    EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
    gr.lineColor = this.lineColor;
    gr.lineWidth = this.lineWidth;

    element.style.cursor = gr.gc.style.cursor = this.cursor;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
    element.onmousemove = gr.gc.onmousemove = processMouseMove;

    if (this.snapping) {
      tGr = EsriUtils.createGraphicsElement(element.id + "tGr", element);
      EsriUtils.setElementStyle(tGr.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      tGr.lineColor = this.lineColor;
      tGr.lineWidth = this.lineWidth;
      tGr.lineOpacity = this.lineOpacity;
      tGr.fillColor = this.fillColor;
      tGr.fillOpacity = this.fillOpacity;

      this.snapGraphics = EsriUtils.createGraphicsElement(element.id + "sGr", element);
      EsriUtils.setElementStyle(this.snapGraphics.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      this.snapGraphics.lineColor = this.snapColor;
      this.snapGraphics.lineWidth = this.snapWidth;
      this.snapGraphics.fillColor = "#fff";
      this.snapGraphics.fillOpacity = 1;
      this.snapGraphics.gc.style.cursor = this.cursor;

      tGr.gc.style.cursor = this.snapGraphics.gc.style.cursor = this.cursor;
      tGr.gc.onmousedown = this.snapGraphics.gc.onmousedown = processMouseDown;
      tGr.gc.onmousemove = this.snapGraphics.gc.onmousemove = processMouseMove;
    }
  }

  this.deactivate = function() {
    if (element != null) {
      element.onmouseup = element.onmousemove = element.onmousedown = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      gr.destroy();
      gr.gc.onmouseup = gr.gc.onmousemove = gr.gc.onmousedown = null;
    }
    if (tGr) {
      tGr.destroy();
      this.snapGraphics.destroy();
      tGr.gc.onmouseup = this.snapGraphics.gc.onmouseup = tGr.gc.onmousemove = this.snapGraphics.gc.onmousemove = tGr.gc.onmousedown = this.snapGraphics.gc.onmousedown = null;
    }
    element = startPt = gr = this.snapGraphics = this.snappedPoint = null;
  }

  this.reactivate = function() {
    var e = element;
    var c = callback;
    var ccb = contCallback;
    this.deactivate();
    this.activate(e, c, ccb);
  }

  function getPoint(e) {
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if ((Math.abs(currPt.x - pt.x) <= self.clickTolerance && Math.abs(currPt.y - pt.y) <= self.clickTolerance) && self.snappedPoint) pt = self.snappedPoint;
    return pt;
  }

  function processMouseDown(e) {
    bounds = EsriUtils.getElementPageBounds(element);
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmouseup = gr.gc.onmouseup = processMouseUp;
    if (tGr) {
      tGr.gc.onmousedown = self.snapGraphics.gc.onmousedown = null;
      tGr.gc.onmouseup = self.snapGraphics.gc.onmouseup = processMouseUp;
    }
    startPt = getPoint(e);
    gr.clear();
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    if (! bounds) bounds = EsriUtils.getElementPageBounds(element);
    currPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (startPt) {
      gr.clear();
      gr.drawLine(startPt, currPt);
    }
    if (tGr) {
      self.snapGraphics.clear();
      tGr.clear();
      tGr.drawCircle(currPt, self.snapDistance);
      restartTimer();
    }
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseUp(e) {
    clearTimeout(timer);
    var sPt = startPt;
    startPt = null;
    gr.clear();
    element.onmouseup = gr.gc.onmouseup = null;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
    if (tGr) {
      tGr.clear();
      self.snapGraphics.clear();
      tGr.gc.onmouseup = self.snapGraphics.gc.onmouseup = null;
      tGr.gc.onmousedown = self.snapGraphics.gc.onmousedown = processMouseDown;
    }
    callback(sPt, getPoint(e));
    EsriUtils.stopEvent(e);
    return false;
  }

  function restartTimer() {
    if (timer) clearTimeout(timer);
    var pt = currPt;
    timer = setTimeout(function() { self.snapGraphics.clear(); self.snappedPoint = null; contCallback(pt); }, callbackTimeout);
  }
}

function EsriEditingDrawPolyShapeAction(isPolygon) {
  this.inheritsFrom(new EsriEditingDrawAction());
  this.name = (isPolygon) ? "EsriEditingDrawPolygonAction" : "EsriEditingDrawPolylineAction";

  var isPgon = isPolygon;
  var element, callback, contCallback, bounds, pts, index, gr, tGr, timer, currPt;
  var callbackTimeout = 250;
  var self = this;

  this.activate = function(elem, cb, ccb) {
    element = elem;
    callback = cb;
    contCallback = ccb;
    pts = [];

    gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
    EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
    gr.lineColor = this.lineColor;
    gr.lineWidth = this.lineWidth;
    gr.lineOpacity = this.lineOpacity;

    tGr = EsriUtils.createGraphicsElement(element.id + "tGr", element);
    EsriUtils.setElementStyle(tGr.gc, "z-index:" + this.graphicsZIndex + ";");
    tGr.lineColor = this.lineColor;
    tGr.lineWidth = this.lineWidth;
    tGr.lineOpacity = this.lineOpacity;
    tGr.fillColor = this.fillColor;
    tGr.fillOpacity = this.fillOpacity;

    element.style.cursor = tGr.gc.style.cursor = this.cursor;
    element.onmousedown = tGr.gc.onmousedown = processMouseDown;
    element.onmousemove = tGr.gc.onmousemove = processMouseMove;

    if (this.snapping) {
      this.snapGraphics = EsriUtils.createGraphicsElement(element.id + "sGr", element);
      EsriUtils.setElementStyle(this.snapGraphics.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      this.snapGraphics.lineColor = this.snapColor;
      this.snapGraphics.lineWidth = this.snapWidth;
      this.snapGraphics.fillColor = "#fff";
      this.snapGraphics.fillOpacity = 1;
      this.snapGraphics.gc.style.cursor = this.cursor;

      this.snapGraphics.gc.cursor = this.cursor;
      this.snapGraphics.gc.onmousedown = processMouseDown;
      this.snapGraphics.gc.onmousemove = processMouseMove;
    }

    index = 0;
  }

  this.deactivate = function() {
    if (element != null) {
      element.onmouseup = element.onmousemove = element.onmousedown = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      gr.gc.onmousedown = gr.gc.onmousemove = null;
      gr.destroy();
    }
    if (this.snapGraphics) {
      this.snapGraphics.gc.onmousedown = this.snapGraphics.gc.onmousemove = null;
      this.snapGraphics.destroy();
    }
    if (tGr != null) tGr.destroy();
    element = bounds = pts = index = gr = tGr = this.snapGraphics = this.snappedPoint = null;
  }

  this.reactivate = function() {
    var e = element;
    var cb = callback;
    var ccb = contCallback;
    this.deactivate();
    this.activate(e, cb, ccb);
  }

  function getPoint(e) {
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if ((Math.abs(currPt.x - pt.x) <= self.clickTolerance && Math.abs(currPt.y - pt.y) <= self.clickTolerance) && self.snappedPoint) pt = self.snappedPoint;
    return pt;
  }

  function processMouseDown(e) {
    bounds = EsriUtils.getElementPageBounds(element);
    pts.push(getPoint(e));

    element.onmousedown = tGr.gc.onmousedown = null;
    element.onclick = tGr.gc.onclick = processClick;
    element.ondblclick = tGr.gc.ondblclick = processDblClick;
    if (self.snapGraphics) {
      self.snapGraphics.gc.onmousedown = null;
      self.snapGraphics.gc.onclick = processClick;
      self.snapGraphics.gc.ondblclick = processDblClick;
    }

    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    if (! bounds) bounds = EsriUtils.getElementPageBounds(element);
    tGr.clear();
    currPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (pts.length > 0) {
      tGr.drawLine(pts[index], currPt);
      if (isPgon) tGr.drawLine(currPt, pts[0]);
    }
    if (self.snapping) {
      self.snapGraphics.clear();
      tGr.drawCircle(currPt, self.snapDistance);
      restartTimer();
    }

    EsriUtils.stopEvent(e);
    return false;
  }

  function processClick(e) {
    pts.push(getPoint(e));
    index++;
    if (index > 0) gr.drawLine(pts[index - 1], pts[index]);
    EsriUtils.stopEvent(e);
    return false;
  }

  function processDblClick(e) {
    clearTimeout(timer);
    tGr.clear();
    gr.clear();
    tGr.gc.onclick = tGr.gc.ondblclick = element.onclick = element.ondblclick = null;
    element.onmousedown = tGr.gc.onmousedown = processMouseDown;
    if (self.snappingGraphics) {
      this.snapGraphics.gc.onclick = this.snapGraphics.gc.ondblclick = null;
      this.snapGraphics.gc.onmousedown = processMouseDown;
    }

    var newPts = [];
    for (var i=1;i<pts.length;i++) { if (pts[i].x != pts[i-1].x || pts[i].y != pts[i-1].y) newPts.push(pts[i-1]); }
    newPts.push(getPoint(e));

    pts = [];
    index = 0;
    currPt = bounds = timer = null;
    EsriUtils.stopEvent(e);
    callback(newPts);
  }

  function restartTimer() {
    if (timer) clearTimeout(timer);
    var pt = currPt;
    timer = setTimeout(function() { self.snapGraphics.clear(); self.snappedPoint = null; contCallback(pt); }, callbackTimeout);
  }
}

function EsriEditingToolItem(id, toolName, action) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, action, false));
  this.taskId = null;

  this.activate = function() {
    if (this.taskId) {
      this.action.snapping = document.getElementById(this.taskId + "_param_snapEnabled").checked;
      this.action.snapDistance = parseInt(document.getElementById(this.taskId + "_param_snapTolerance").value);
      this.action.snapColor = new EsriColor().fromString(document.getElementById(this.taskId + "_param_snapTipsColor").value).toHex();
      this.action.snapWidth = parseInt(document.getElementById(this.taskId + "_param_verticesSize").value);
    }
    this.action.activate(this.element, this.postAction, this.continuousAction);
    this.isActive = true;
  }
}

function EsriEditingPoint(id, toolName) {
  this.inheritsFrom(new EsriEditingToolItem(id, toolName, new EsriEditingDrawPointAction()));
  var self = this;

  this.update = function() { self = this; }

  this.continuousAction = function(point) {
    self.update();
    var map = self.control;
    EsriEditingUtils.snapPointRequestHandler(self.taskId, map.id, point.offset(-map.viewBounds.left, -map.viewBounds.top), self.action);
  }

  this.postAction = function(point) {
    self.update();
    var map = self.control;
    if (self.showLoading) map.showLoading();
    point = point.offset(-map.viewBounds.left, -map.viewBounds.top);

    EsriUtils.addFormElement(map.formId, map.id, map.id);
    EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
    EsriUtils.addFormElement(map.formId, map.id + "_minx", point.x);
    EsriUtils.addFormElement(map.formId, map.id + "_miny", point.y);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }
}

function EsriEditingLine(id, toolName) {
  this.inheritsFrom(new EsriEditingToolItem(id, toolName, new EsriEditingDrawLineAction()));
  var self = this;

  this.update = function() { self = this; }

  this.continuousAction = function(point) {
    self.update();
    var map = self.control;
    EsriEditingUtils.snapPointRequestHandler(self.taskId, map.id, point.offset(-map.viewBounds.left, -map.viewBounds.top), self.action);
  }

  this.postAction = function(from, to) {
    if (from.x == to.x && from.y == to.y) return;

    self.update();
    var map = self.control;
    if (self.showLoading) map.showLoading();
    from = from.offset(-map.viewBounds.left, -map.viewBounds.top);
    to = to.offset(-map.viewBounds.left, -map.viewBounds.top);

    EsriUtils.addFormElement(map.formId, map.id, map.id);
    EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
    EsriUtils.addFormElement(map.formId, map.id + "_coords", from.x + ":" + from.y + "|" + to.x + ":" + to.y);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }
}

function EsriEditingPoly(id, toolName, isPgon) {
  this.inheritsFrom(new EsriEditingToolItem(id, toolName, new EsriEditingDrawPolyShapeAction(isPgon)));
  var isPolygon = isPgon;
  var self = this;

  this.update = function() { self = this; }

  this.continuousAction = function(point) {
    self.update();
    var map = self.control;
    EsriEditingUtils.snapPointRequestHandler(self.taskId, map.id, point.offset(-map.viewBounds.left, -map.viewBounds.top), self.action);
  }

  this.postAction = function(points) {
    if (points.length <= 1) return;

    self.update();
    var map = self.control;
    if (self.showLoading) map.showLoading();

    var pts = "";
    var viewLeft = map.viewBounds.left;
    var viewTop = map.viewBounds.top;
    for (var i=0;i<points.length;i++) {
      points[i] = points[i].offset(-viewLeft, -viewTop);
      if (i == 0) pts += points[i].x + ":" + points[i].y;
      else pts += "|" + points[i].x + ":" + points[i].y;
    }
    EsriUtils.addFormElement(map.formId, map.id, map.id);
    EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
    EsriUtils.addFormElement(map.formId, map.id + "_coords", pts);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }
}

function EsriEditingPolyline(id, toolName) { return new EsriEditingPoly(id, toolName, false); }
function EsriEditingPolygon(id, toolName) { return new EsriEditingPoly(id, toolName, true); }

var EsriEditingUtils = new function() {
  var ccWin;
  var fontSize = 12;

  this.showColorChooser = function(title, fieldId, butId) {
    var cs = document.getElementById(fieldId).value.split(",");
    var initColor;
    if (cs.length == 3) initColor = new EsriColor(parseInt(cs[0]), parseInt(cs[1]), parseInt(cs[2]));

    var cc = new EsriColorChooser("cc", document.body, function(color) { ccWin.hide(); document.getElementById(fieldId).value = color.red + "," + color.green + "," + color.blue; EsriUtils.setElementStyle(document.getElementById(butId), "background-color:rgb(" + color.red + "," + color.green + "," + color.blue + ");"); }, initColor);
    var ccWin = new EsriWindow(new Date().getTime(), title, cc);
    ccWin.movable = true;
    ccWin.collapsable = false;
    ccWin.resizable = false;
    ccWin.init();
    ccWin.fit();
    ccWin.center();
    ccWin.toFront();
  }

  this.snapPointRequestHandler = function(taskId, mapId, point, action) {
    var map = EsriControls.maps[mapId];
    var url = EsriUtils.getServerUrl(map.formId);
    var params = "agsAjax=agsAjax&snapPoint=snapPoint&formId=" + map.formId + "&taskId=" + taskId + "&x=" + point.x + "&y=" + point.y + "&" + EsriUtils.buildRequestParams(map.formId);
    EsriUtils.sendAjaxRequest(url, params, false, function(xh) { EsriEditingUtils.snapPointResponseHandler(xh, mapId, action); });
  }

  this.snapPointResponseHandler = function(xh, mapId, action) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);

      var pointTags = xml.getElementsByTagName("point");
      var point;
      if (pointTags.length > 0) {
        var pointTag = pointTags.item(0);
        var x = parseInt(pointTag.getElementsByTagName("x").item(0).firstChild.nodeValue);
        var y = parseInt(pointTag.getElementsByTagName("y").item(0).firstChild.nodeValue);
        point = new EsriPoint(x, y);
      }

      var sg = action.snapGraphics;
      if (sg) {
        sg.clear();
        if (point) {
          sg.drawPoint(point);
          action.snappedPoint = point;
  
          var label = pointTag.getElementsByTagName("label").item(0).firstChild.nodeValue
          var lblWd = Math.round(label.length * fontSize * 0.667);
          var lblHt = fontSize + 4;
          var rect = new EsriRectangle(point.x - Math.round(lblWd / 2), point.y - (2 * lblHt), lblWd, lblHt);
          sg.drawText(label, rect, "font-size:" + fontSize + "px; font-stretch:narrower; background-color:#fff;");
        }
      }
    }
  }
}