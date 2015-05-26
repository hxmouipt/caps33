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

function EsriScaleBar(id, container, width, height, renderer) {
  this.inheritsFrom(new EsriPageElement(id, 0, 0, width, height));
  this.divId = "ScaleBarDiv_" + id;
  this.controlDivId = "ScaleBarControlDiv_" + id;
  this.renderer = (renderer) ? renderer : new EsriAlternatingScaleBarRenderer();
  var self = this;

  this.init = function(container) {
    this.divObject = container.appendChild(document.createElement("div"));
    this.divObject.id = this.divId;

    this.controlDiv = this.divObject.appendChild(document.createElement("div"));
    this.controlDiv.id = this.controlDivId;
    EsriUtils.setElementStyle(this.controlDiv, "position:relative; width:" + this.bounds.width + "px; height:" + this.bounds.height + "px;");

    this.renderer.scaleBar = this;
    this.renderer.init(this.controlDiv, this.bounds.width, this.bounds.height);
  }

  if (container) this.init(container);
}

function EsriScaleBarRenderer() {
  this.scaleBar = null;
  this.init = function(container) {}
  this.render = function(screenDistance, mapDistance, units) {}
}

function EsriScaleBarRendererBase() {
  this.inheritsFrom(new EsriScaleBarRenderer());

  this.graphics;
  this.fontSize = 10;
  this.fontWidth = this.fontSize / 2;
  this.fontStyle = "font-size:" + this.fontSize + "px; font-stretch:narrower;";
  this.top, this.bottom;
  this.lblTop = 5;
  this.lblWd = 30;
  this.width, this.height, this.zero;
  this.textSymbol;

  this.init = function(container, wd, ht) {
    this.width = wd;
    this.height = ht;
    this.zero = this.width * 3/8;
    this.top = Math.round(ht / 2);
    this.bottom = Math.round(this.top + (ht / 4));
    this.lblTop = this.top - this.fontSize - 5;
    this.lblWd = 30;

    this.graphics = EsriUtils.createGraphicsElement("ScaleBarGraphics", container);
    this.graphics.lineColor = "#000";
    this.graphics.lineWidth = 1;
    this.graphics.lineOpacity = 1;
    this.graphics.fillColor = "#000";
    this.graphics.fillOpacity = 0;
    this.textSymbol = new EsriGraphicsSymbol("#000",1.0,0.40,"#000",0.5);
    
  }
}

function EsriSteppedScaleLineRenderer() {
  this.inheritsFrom(new EsriScaleBarRendererBase());
  var self = this;

  this.render = function(sd, md, units) {
    var m = Math.round(self.zero);
    var q = Math.round(sd * 0.25);
    var h = Math.round(sd * 0.5);
    var t = Math.round(sd * 0.75);

    var pts = [new EsriPoint(m - sd, self.bottom), new EsriPoint(m - sd, self.top),
      new EsriPoint(m - t, self.top), new EsriPoint(m - t, self.bottom),
      new EsriPoint(m - h, self.bottom), new EsriPoint(m - h, self.top),
      new EsriPoint(m - q, self.top), new EsriPoint(m - q, self.bottom),
      new EsriPoint(m, self.bottom), new EsriPoint(m, self.top),
      new EsriPoint(m + sd, self.top), new EsriPoint(m + sd, self.bottom)];
    self.graphics.clear();
    self.graphics.drawPolyline(pts);

    var lbl = new String(md);
    var hLbl = new String(md / 2);
    var zLbl = "0";

    
    self.graphics.drawText(lbl, new EsriRectangle(m - sd - Math.round(self.fontWidth * lbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(hLbl, new EsriRectangle(m - h - Math.round(self.fontWidth * hLbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(zLbl, new EsriRectangle(m - Math.round(self.fontWidth * zLbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(lbl + " " + units, new EsriRectangle(m + sd - Math.round(self.fontWidth * lbl.length / 2), self.lblTop, self.lblWd * 4, self.fontSize), self.fontStyle, this.textSymbol);
  }
}

function EsriSingleDivisionScaleBar() {
  this.inheritsFrom(new EsriScaleBarRendererBase());
  var self = this;

  this.render = function(sd, md, units) {
    var m = Math.round(self.zero);
    self.graphics.clear();
    self.graphics.fillOpacity = 1;
    self.graphics.drawRectangle(new EsriRectangle(m, self.top, sd, (self.bottom - self.top)));

    var lbl = new String(md);
    var zLbl = "0";

    self.graphics.drawText(zLbl, new EsriRectangle(m - Math.round(self.fontWidth * zLbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(lbl + " " + units, new EsriRectangle(m + sd - Math.round(self.fontWidth * lbl.length / 2), self.lblTop, self.lblWd * 4, self.fontSize), self.fontStyle, this.textSymbol);
  }
}

function EsriAlternatingScaleBarRenderer() {
  this.inheritsFrom(new EsriScaleBarRendererBase());
  var self = this;

  this.render = function(sd, md, units) {
    var m = Math.round(self.zero);
    var q = Math.round(sd * 0.25);
    var h = Math.round(sd * 0.5);
    var t = Math.round(sd * 0.75);
    var ht = self.bottom - self.top;

    var rect1 = new EsriRectangle(m - sd, self.top, q, ht);
    var rect2 = new EsriRectangle(m, self.top, sd, ht);

    self.graphics.clear();
    self.graphics.fillOpacity = 0;
    self.graphics.drawRectangle(rect1.offset(q, 0));
    self.graphics.drawRectangle(rect1.offset(t, 0));

    self.graphics.fillOpacity = 1;
    self.graphics.drawRectangle(rect1);
    self.graphics.drawRectangle(rect1.offset(h, 0));
    self.graphics.drawRectangle(rect2);

    var lbl = new String(md);
    var hLbl = new String(md / 2);
    var zLbl = "0";
    
    self.graphics.drawText(lbl, new EsriRectangle(m - sd - Math.round(self.fontWidth * lbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(hLbl, new EsriRectangle(m - h - Math.round(self.fontWidth * hLbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(zLbl, new EsriRectangle(m - Math.round(self.fontWidth * zLbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(lbl + " " + units, new EsriRectangle(m + sd - Math.round(self.fontWidth * lbl.length / 2), self.lblTop, self.lblWd * 4, self.fontSize), self.fontStyle, this.textSymbol);
  }
}

function EsriDoubleAlternatingScaleBarRenderer() {
  this.inheritsFrom(new EsriScaleBarRendererBase());
  var self = this;

  this.render = function(sd, md, units) {
    var m = Math.round(self.zero);
    var q = Math.round(sd * 0.25);
    var h = Math.round(sd * 0.5);
    var t = Math.round(sd * 0.75);
    var ht = Math.round((self.bottom - self.top)/2);

    var rect1 = new EsriRectangle(m - sd, self.top, q, ht);
    var rect2 = new EsriRectangle(m, self.top, sd, ht);

    self.graphics.clear();
    self.graphics.fillOpacity = 0;
    self.graphics.drawRectangle(rect1.offset(0, ht));
    self.graphics.drawRectangle(rect1.offset(q, 0));
    self.graphics.drawRectangle(rect1.offset(h, ht));
    self.graphics.drawRectangle(rect1.offset(t, 0));
    self.graphics.drawRectangle(rect2.offset(0, ht));

    self.graphics.fillOpacity = 1;
    self.graphics.drawRectangle(rect1);
    self.graphics.drawRectangle(rect1.offset(q, ht));
    self.graphics.drawRectangle(rect1.offset(h, 0));
    self.graphics.drawRectangle(rect1.offset(t, ht));
    self.graphics.drawRectangle(rect2);

    var lbl = new String(md);
    var hLbl = new String(md / 2);
    var zLbl = "0";
    
    self.graphics.drawText(lbl, new EsriRectangle(m - sd - Math.round(self.fontWidth * lbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(hLbl, new EsriRectangle(m - h - Math.round(self.fontWidth * hLbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(zLbl, new EsriRectangle(m - Math.round(self.fontWidth * zLbl.length / 2), self.lblTop, self.lblWd, self.fontSize), self.fontStyle, this.textSymbol);
    self.graphics.drawText(lbl + " " + units, new EsriRectangle(m + sd - Math.round(self.fontWidth * lbl.length / 2), self.lblTop, self.lblWd * 4, self.fontSize), self.fontStyle, this.textSymbol);
  }
}