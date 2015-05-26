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

function EsriVMLGraphicsElement(id, container) {
  this.inheritsFrom(new EsriGraphicsElement(id));

  var gc = (this.gc = container.appendChild(document.createElement("div")));
  gc.id = this.id + "_gc";
  EsriUtils.setElementStyle(gc, "position:absolute; left:0px; top:0px; width:" + ((container.style.width) ? EsriUtils.getStyleValue(container.style.width) + "px" : "100%") + "; height:" + ((container.style.height) ? EsriUtils.getStyleValue(container.style.height) + "px" : "100%") + "; border:0px NONE white; background-color:transparent; overflow:visible;");

  document.body.style.cssText += "zoom:1.0";
  var screenScaleFactor = screen.deviceXDPI / screen.logicalXDPI;
  var elementCount = 0;
  var self = this;

  this.remove = function(element) {
    if (element.parentNode === gc) {
      gc.removeChild(element);
      return true;
    }
    return false;
  }

  this.clear = function() {
    gc.innerHTML = "";
    elementCount = 0;
  }

  this.destroy = function() {
    this.clear();
    if (gc.parentNode) gc.parentNode.removeChild(gc);
  }

  function setStrokeStyle(shape, symbol) {
    shape.strokeColor = (symbol? symbol.lineColor :self.lineColor);
    var stroke = shape.appendChild(document.createElement("v:stroke"));
    stroke.weight = (symbol? symbol.lineWidth :self.lineWidth);
    stroke.opacity = ((symbol? symbol.lineOpacity :self.lineOpacity) * 100) + "%";
  }

  function setFillStyle(shape, symbol) {
    shape.fillColor = (symbol? symbol.fillColor :self.fillColor);
    var fill = shape.appendChild(document.createElement("v:fill"));
    fill.opacity = ((symbol? symbol.fillOpacity : self.fillOpacity) * 100) + "%";
  }

  this.clip = function(rect) { EsriUtils.setElementStyle(gc, "clip: rect(" + rect.top + "px, " + (rect.left + rect.width) + "px, " + (rect.top + rect.height) + "px, " + rect.left + "px);"); }
  this.clearClip = function() { EsriUtils.setElementStyle(gc, "clip:auto;"); }
  this.drawCircle = function(center, radius, symbol) { return this.drawOval(new EsriRectangle(center.x - radius, center.y - radius, radius * 2, radius * 2), symbol); }
  
  this.drawLine = function(point1, point2, symbol) {
    var line = document.createElement("v:line");
    line.from = (point1.x * screenScaleFactor) + "," + (point1.y * screenScaleFactor);
    line.to = (point2.x * screenScaleFactor) + "," + (point2.y * screenScaleFactor);
    setStrokeStyle(line, symbol);
    return gc.appendChild(line, symbol);
  }

  this.drawOval = function(bounds, symbol) {
    var oval = document.createElement("v:oval");
    EsriUtils.setElementStyle(oval, "position:absolute; width:" + (bounds.width * screenScaleFactor) + "px; height:" + (bounds.height * screenScaleFactor) + "px; top:" + (bounds.top * screenScaleFactor) + "px; left:" + (bounds.left * screenScaleFactor) + "px;");
    setFillStyle(oval, symbol);
    setStrokeStyle(oval, symbol);
    return gc.appendChild(oval);
  }

  this.drawRectangle = function(rect, symbol) {
    var r2 = document.createElement("v:rect");
    EsriUtils.setElementStyle(r2, "position:absolute; width:" + (rect.width * screenScaleFactor) + "px; height:" + (rect.height * screenScaleFactor) + "px; top:" + (rect.top * screenScaleFactor) + "px; left:" + (rect.left * screenScaleFactor) + "px;");
    setFillStyle(r2, symbol);
    setStrokeStyle(r2, symbol);
    return gc.appendChild(r2);
  }

  this.drawImage = function(src, left, top, width, height) {
    var image = document.createElement("v:image");
    image.src = src;
    EsriUtils.setElementStyle(image, "position:absolute; left:" + left + "px; top:" + top + "px; width:" + width + "px; height:" + height + "px;");
    return gc.appendChild(image);
  }

  this.drawPoint = function(point, symbol) {
    var size = Math.ceil(this.lineWidth / 2);
    return this.drawOval(new EsriRectangle(point.x - size, point.y - size, this.lineWidth, this.lineWidth),symbol);
  }

  function buildPointsString(points) {
    var s = "";
    for (var i=0, il=points.length; i<il; i++)
      s += (points[i].x * screenScaleFactor) + "," + (points[i].y * screenScaleFactor) + " ";
    return s.trim();
  }

  this.drawPolyline = function(points, symbol) {
    var polyline = document.createElement("v:polyline");
    polyline.points = buildPointsString(points);
    setStrokeStyle(polyline, symbol);
    var fill = polyline.appendChild(document.createElement("v:fill"));
    fill.on = false;
    return gc.appendChild(polyline);
  }

  this.drawPolygon = function(points, symbol) {
    points.push(new EsriPoint(points[0].x, points[0].y));
    var polygon = document.createElement("v:polyline");
    polygon.points = buildPointsString(points);
    setFillStyle(polygon, symbol);
    setStrokeStyle(polygon, symbol);
    return gc.appendChild(polygon);
  }

  this.drawText = function(txt, bounds, fontStyle, symbol) {
    var rect = document.createElement("v:rect");
    EsriUtils.setElementStyle(rect, "position:absolute; color:" + (symbol ? symbol.lineColor :self.lineColor) + "; border:NONE; left:" + (bounds.left * screenScaleFactor) + "px; top:" + (bounds.top * screenScaleFactor) + "px; width:" + (bounds.width * screenScaleFactor) + "px; height:" + (bounds.height * screenScaleFactor) + "px; overflow:hidden; " + fontStyle + ";");
    var fill = rect.appendChild(document.createElement("v:fill"));
    fill.on = false;
    var stroke = rect.appendChild(document.createElement("v:stroke"));
    stroke.weight = "0px";
    stroke.opacity = "0%";
    var textbox = rect.appendChild(document.createElement("v:textbox"));
    textbox.inset = "0px, 0px, 0px, 0px";
    textbox.appendChild(document.createTextNode(txt));
    return gc.appendChild(rect);
  }

  this.updateSymbol = function(el, symbol) {
    if(!el || !symbol) return;    
    if(symbol.lineColor) el.strokeColor = symbol.lineColor;
    if(symbol.lineOpacity || symbol.lineWidth) {
      var s = el.getElementsByTagName("stroke").item(0);
      if(symbol.lineWidth) s.weight = symbol.lineWidth;
      if(symbol.lineOpacity) s.opacity = symbol.lineOpacity;
    }
    
    if(symbol.fillColor) el.fillColor = symbol.fillColor;
    if(symbol.fillOpacity) {
      var f = el.getElementsByTagName("fill").item(0);
      f.opacity = symbol.fillOpacity;
    }
    if(symbol.src) {
      el.src = symbol.src;
      el.style.width = symbol.width;
      el.style.height = symbol.height;
      el.style.top = symbol.top;
      el.style.left = symbol.left;
    }
  } 
}