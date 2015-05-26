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

function EsriSVGGraphicsElement(id, container) {
  this.inheritsFrom(new EsriGraphicsElement());

  var wd = (container.style.width) ? EsriUtils.getStyleValue(container.style.width) + "px" : "100%";
  var ht = (container.style.height) ? EsriUtils.getStyleValue(container.style.height) + "px" : "100%";
  var svgNS = "http://www.w3.org/2000/svg";
  var xlinkNS = "http://www.w3.org/1999/xlink";

  var gc = (this.gc = container.appendChild(document.createElementNS(svgNS, "svg")));
  gc.id = id + "_gc";
  EsriUtils.setElementStyle(gc, "position:absolute; left:0px; top:0px; width:" + wd + "; height:" + ht + "; overflow:visible;");
  var root = gc.appendChild(document.createElementNS(svgNS, "g"));
  root.id = gc.id + "_root";
  
  var self = this;

  function setStrokeStyle(shape, symbol) {
    shape.setAttributeNS(null, "stroke", (symbol? symbol.lineColor :self.lineColor));
    shape.setAttributeNS(null, "stroke-width", (symbol? symbol.lineWidth :self.lineWidth));
    shape.setAttributeNS(null, "stroke-opacity", (symbol? symbol.lineOpacity :self.lineOpacity));
  }

  function setFillStyle(shape,symbol) {
    shape.setAttributeNS(null, "fill", (symbol? symbol.fillColor :self.fillColor));
    shape.setAttributeNS(null, "fill-opacity",(symbol? symbol.fillOpacity : self.fillOpacity));
  }

  this.destroy = function() {
    this.clear();
    if (gc.parentNode) gc.parentNode.removeChild(gc);
  }

  this.clip = function(rect) { }
  this.clearClip = function() { }

  this.drawImage = function(src, left, top, width, height) {
    var image = document.createElementNS(svgNS, "image");
    image.setAttributeNS(xlinkNS, "href", src);
    image.setAttributeNS(null, "x", left);
    image.setAttributeNS(null, "y", top);
    image.setAttributeNS(null, "width", width);
    image.setAttributeNS(null, "height", height);
    return root.appendChild(image);
  }

  this.remove = function(element) {
    if (element.parentNode === root) {
      root.removeChild(element);
      return true;
    }
    return false;
  }

  this.clear = function() {
    if (gc) while (root.hasChildNodes() > 0) root.removeChild(root.lastChild);
  }

  this.drawPoint = function(point, symbol) {
    var size = Math.ceil(this.lineWidth / 2);
    var oldLineWidth = this.lineWidth;
    var oldFillColor = (symbol ? symbol.fillColor :self.fillColor);
    var oldFillOpacity = (symbol ? symbol.fillOpacity :self.fillOpacity);
    this.lineWidth = 1;
    this.fillColor = (symbol ? symbol.lineColor :self.lineColor);
    this.fillOpacity = (symbol ? symbol.lineOpacity :self.lineOpacity);
    var circle = this.drawCircle(new EsriPoint(point.x - size, point.y - size), oldLineWidth, symbol);
    this.lineWidth = oldLineWidth;
    this.fillColor = oldFillColor;
    this.fillOpacity = oldFillOpacity;
    return circle;
  };

  this.drawLine = function(point1, point2, symbol) {
    var line = document.createElementNS(svgNS, "line");
    line.setAttributeNS(null, "x1", point1.x);
    line.setAttributeNS(null, "y1", point1.y);
    line.setAttributeNS(null, "x2", point2.x);
    line.setAttributeNS(null, "y2", point2.y);
    setStrokeStyle(line, symbol);
    return root.appendChild(line);
  }

  this.drawRectangle = function(rect, symbol) {
    var sRect = document.createElementNS(svgNS, "rect");
    sRect.setAttributeNS(null, "x", rect.left);
    sRect.setAttributeNS(null, "y", rect.top);
    sRect.setAttributeNS(null, "width", rect.width);
    sRect.setAttributeNS(null, "height", rect.height);
    setStrokeStyle(sRect, symbol);
    setFillStyle(sRect, symbol);
    return root.appendChild(sRect);
  }

  this.drawCircle = function(center, radius, symbol) {
    var circle = document.createElementNS(svgNS, "circle");
    circle.setAttributeNS(null, "cx", center.x);
    circle.setAttributeNS(null, "cy", center.y);
    circle.setAttributeNS(null, "r", radius);
    setStrokeStyle(circle, symbol);
    setFillStyle(circle, symbol);
    return root.appendChild(circle);
  }

  this.drawOval = function(bounds, symbol) {
    var oval = document.createElementNS(svgNS, "ellipse");
    oval.setAttributeNS(null, "cx", bounds.center.x);
    oval.setAttributeNS(null, "cy", bounds.center.y);
    oval.setAttributeNS(null, "rx", bounds.width / 2);
    oval.setAttributeNS(null, "ry", bounds.height / 2);
    setStrokeStyle(oval, symbol);
    setFillStyle(oval, symbol);
    return root.appendChild(oval);
  }

  this.drawPolyline = function(points, symbol) {
    var str = "";
    for (var i=0, il=points.length; i<il; i++)
      str += " " + points[i].x + "," + points[i].y;

    var polyline = document.createElementNS(svgNS, "polyline");
    polyline.setAttributeNS(null, "points", str);
    polyline.setAttributeNS(null, "fill", "none");
    setStrokeStyle(polyline, symbol);
    return root.appendChild(polyline);
  }

  this.drawPolygon = function(points, symbol) {
    var str = "";
    for (var i=0, il=points.length; i<il; i++)
      str += " " + points[i].x + "," + points[i].y;

    var polygon = document.createElementNS(svgNS, "polygon");
    polygon.setAttributeNS(null, "points", str);
    setStrokeStyle(polygon, symbol);
    setFillStyle(polygon, symbol);
    return root.appendChild(polygon);
  }

  this.drawText = function(txt, bounds, fontStyle,symbol) {
    var text = document.createElementNS(svgNS, "text");
    text.setAttributeNS(null, "x", bounds.left);
    text.setAttributeNS(null, "y", bounds.top);
    text.setAttributeNS(null, "dy", 10);
    text.setAttributeNS(null, "textLength", bounds.width);
    setStrokeStyle(text, symbol);
    setFillStyle(text, symbol);
    if (fontStyle) {
      var ss = fontStyle.split(";");
      var id, value;
      for (var i=0;i<ss.length;i++) {
        var s = ss[i].split(":");
        id = s[0].trim();
        value = s[1];
        if (id == "" || ! value) continue;
        else text.setAttributeNS(null, id, value);
      }
    }

    text.appendChild(document.createTextNode(txt));
    return root.appendChild(text);
  }

  this.updateSymbol = function(el, symbol) {
    if(!el || !symbol) return;    
    if(symbol.lineColor) el.setAttribute("stroke", symbol.lineColor);
    if(symbol.lineWidth) el.setAttribute("stroke-width", symbol.lineWidth);
    if(symbol.lineOpacity) el.setAttribute("stroke-opacity", symbol.lineOpacity);
    if(symbol.fillColor) el.setAttribute("fill", symbol.fillColor);
    if(symbol.fillOpacity) el.setAttribute("fill-opacity", symbol.fillOpacity);
    if(symbol.src) {
      el.setAttribute("href", symbol.src);
      el.setAttribute("width", symbol.width);
      el.setAttribute("height", symbol.height);
      el.setAttribute("x", symbol.top);
      el.setAttribute("y", symbol.left);
    }
  }
}