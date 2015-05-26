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

function EsriNavigator(id, container, continuousPan, panCallbackFunc, zoomCallbackFunc, left, top) {
  this.inheritsFrom(new EsriPageElement(id, 0, 0, 0, 0));

  this.divId = "EsriNavigatorDiv_" + this.id;
  this.image_navigator = EsriControls.contextPath + "images/navigator.gif";
  this.image_size = 80;
  this.image_map_zoomin_shape = "circle";
  this.image_map_zoomin_coords = "39,28,5";
  this.image_map_zoomout_shape = "circle";
  this.image_map_zoomout_coords = "39,50,5";
  this.image_map_move_shape = "circle";
  this.image_map_move_coords = "39,39,5";
  this.directions = [];
  this.directions["NW"] = new EsriPoint(-1, -1);
  this.directions["N"] = new EsriPoint(0, -1);
  this.directions["NE"] = new EsriPoint(1, -1);
  this.directions["E"] = new EsriPoint(1, 0);
  this.directions["SE"] = new EsriPoint(1, 1);
  this.directions["S"] = new EsriPoint(0, 1);
  this.directions["SW"] = new EsriPoint(-1, 1);
  this.directions["W"] = new EsriPoint(-1, 0);

  var navLeft = (left) ? left : 0;
  var navTop = (top) ? top : 0;
  var callback_pan = panCallbackFunc;
  var callback_zoom = zoomCallbackFunc;
  var eventStart, image, image_map_zoomin, image_map_zoomout, image_map_pan, image_map_move, currentDirection, currentDistance, timer;
  var image_id = "EsriNavigatorImage_" + this.id;
  var image_map_id = "EsriNavigatorImageMap_" + this.id;
  var continuous = continuousPan;
  var self = this;

  this.init = function(container) {
    this.bounds = new EsriRectangle(navLeft, navTop, this.image_size, this.image_size);

    this.divObject = document.createElement("div");
    this.divObject.id = this.divId;
    EsriUtils.setElementStyle(this.divObject, "position:absolute; left:" + navLeft + "px; top:" + navTop + "px; width:" + this.image_size + "px; height:" + this.image_size + "px;");

    var controlDiv = this.divObject.appendChild(document.createElement("div"));
    EsriUtils.setElementStyle(controlDiv, "position:relative;");

    image = controlDiv.appendChild(document.createElement("img"));
    image.id = image_id;
    image.src = this.image_navigator;
    EsriUtils.setElementStyle(image, "position:absolute; left:0px; top:0px; width:" + this.image_size + "px; height:" + this.image_size + "px; border:0px NONE #fff;");

    var image_map = document.createElement("map");
    image_map.id = image_map_id;
    image_map.name = image_map_id;
    EsriUtils.setElementStyle(image_map, "width:" + this.image_size + "px; height:" + this.image_size + "px; border:0px NONE #fff;");

    if (this.image_map_zoomin_shape && this.image_map_zoomin_coords) {
      image_map_zoomin = document.createElement("area");
      image_map_zoomin.id = "ZI";
      image_map_zoomin.shape = this.image_map_zoomin_shape;
      image_map_zoomin.coords = this.image_map_zoomin_coords;
      image_map_zoomin.onmousedown = handler_ZoomIn;
      image_map.appendChild(image_map_zoomin);
    }

    if (this.image_map_zoomout_shape && this.image_map_zoomout_coords) {
      image_map_zoomout = document.createElement("area");
      image_map_zoomout.id = "ZO";
      image_map_zoomout.shape = this.image_map_zoomout_shape;
      image_map_zoomout.coords = this.image_map_zoomout_coords;
      image_map_zoomout.onmousedown = handler_ZoomOut;
      image_map.appendChild(image_map_zoomout);
    }

    if (this.image_map_move_shape && this.image_map_move_coords) {
      image_map_move = document.createElement("area");
      image_map_move.id = "MOVE";
      image_map_move.shape = this.image_map_move_shape;
      image_map_move.coords = this.image_map_move_coords;
      image_map_move.onmousedown = handler_Move_MouseDown;
      image_map.appendChild(image_map_move);
    }

    image_map_pan = document.createElement("area");
    image_map_pan.id = "PAN";
    image_map_pan.shape = "rect";
    image_map_pan.coords = "0,0," + this.image_size + "," + this.image_size;
    image_map_pan.onmousedown = handler_Pan_MouseDown;
    image_map.appendChild(image_map_pan);
    EsriUtils.setElementStyle(image_map, "border:0px NONE #fff;");

    image.useMap = "#" + image_map_id;
    controlDiv.appendChild(image_map);
    container.appendChild(this.divObject);
    self = this;
  }

  function handler_Pan_MouseDown(event) {
    self.bounds = EsriUtils.getElementPageBounds(self.divObject);
    image_map_pan.onmousemove = handler_Pan_MouseMove;
    image_map_pan.onmouseup = image_map_pan.onmouseout = handler_Pan_MouseUp;
    handler_Pan(event);
    return false;
  }

  function handler_Pan_MouseMove(event) {
    handler_Pan(event);
    return false;
  }

  function handler_Pan_MouseUp(event) {
    clearTimeout(timer);
    currentDirection = null;
    image_map_pan.onmousemove = image_map_pan.onmouseup = null;
    callback_pan(new EsriPoint(0, 0), -1);
    return false;
  }

  function handler_Pan(event) {
    var point = EsriUtils.getXY(event);
    var shiftX = point.x - self.bounds.center.x;
    var shiftY = point.y - self.bounds.center.y;
    var dist = Math.sqrt(Math.pow(shiftX, 2) + Math.pow(shiftY, 2));

    var dir;
    var shift = (shiftX / shiftY);
    if (shift == 0) {
      if (shiftY > 0) dir = "S";
      else dir = "N";
    }
    else if (shiftX < 0) {
      if (shift >= 0 && shift <= 0.5) dir = "N";
      else if (shift > 0.5 && shift <= 1.5) dir = "NW";
      else if (shift > 1.5 || shift <= -1.5) dir = "W";
      else if (shift > -1.5 && shift <= -0.5) dir = "SW";
      else dir = "S";
    }
    else {
      if (shift >= 0 && shift <= 0.5) dir = "S";
      else if (shift > 0.5 && shift <= 1.5) dir = "SE";
      else if (shift > 1.5 || shift <= -1.5) dir = "E";
      else if (shift > -1.5 && shift <= -0.5) dir = "NE";
      else dir = "N";
    }

    if (dir != currentDirection || dist != currentDistance) {
      clearTimeout(timer);
      call_panCallback(self.directions[dir], dist);
      currentDirection = dir;
      currentDistance = dist;
    }
  }

  function call_panCallback(direction, distance) {
    callback_pan(direction, distance);
    if (continuous) timer = setTimeout( function() { call_panCallback(direction, distance); }, 0);
  }

  function handler_Zoom(inOut) {
    callback_zoom(inOut);
    return false;
  }

  function handler_ZoomIn() { return handler_Zoom(1); }
  function handler_ZoomOut() { return handler_Zoom(-1); }

  function handler_Move_MouseDown(event) {
    if (eventStart) {
      handler_Mouse_MouseUp(event);
      return;
    }
    eventStart = EsriUtils.getXY(event);
    document.onmousemove = handler_Move_MouseMove;
    document.onmouseup = handler_Move_MouseUp;
    return false;
  }

  function handler_Move_MouseMove(event) {
    var point = EsriUtils.getXY(event);
    if (point.x < 0 || point.y < 0) return;
    EsriUtils.moveElement(self.divObject, self.bounds.left + (point.x - eventStart.x), self.bounds.top + (point.y - eventStart.y));
    return false;
  }

  function handler_Move_MouseUp(event) {
    var point = EsriUtils.getXY(event);
    EsriUtils.moveElement(self.divObject, self.bounds.left + (point.x - eventStart.x), self.bounds.top + (point.y - eventStart.y));
    self.bounds = self.bounds.offset(point.x - eventStart.x, point.y - eventStart.y)
    document.onmousemove = document.onmouseup = eventStart = null;
    return false;
  }

  if (container) this.init(container);
}
