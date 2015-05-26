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

function EsriColorChooser(id, container, cb, initColor) {
  this.inheritsFrom(new EsriPageElement(id, 0, 0, 0, 0));

  this.currentColor = (initColor) ? initColor : new EsriColor(0, 0, 0);
  this.callContinuously = false;
  this.showSelectButton = true;
  this.showCurrentColor = true;
  this.showStatus = true;
  this.divId = "EsriColorChooserDiv_" + id;
  this.selectLabel = "OK";
  var callback = cb;

  var rr = [255,255,255,255,204,204,204,255,204,255,255,255,153,153,153,255,153,255,255,255,  0,  0,  0,255,102,204,204,204,  0,  0,  0,204, 51,153,153,153,  0,  0,  0,153,  0,102,102,102,  0,  0,  0, 66];
  var gg = [255,204,204,255,255,255,204,204,204,153,153,255,255,255,153,153,153,  0,153,255,255,255,  0,102,102,  0,102,204,204,204,  0,  0, 51,  0,102,153,153,153,  0,  0,  0,  0, 51,102,102,102,  0,  0];
  var bb = [255,204,153,204,204,255,255,255,204,153,102,153,153,255,255,255,153,  0,  0,  0,  0,255,255,255,102,  0,  0,  0,  0,204,204,204, 51,  0,  0,  0,  0,153,153,153,  0,  0,  0,  0,  0,102,102,102];
  var currentColorTd, status;
  var rgbSliders = new Array();
  var self = this;

  this.init = function(container) {
    this.divObject = container.appendChild(document.createElement("div"));
    this.divObject.id = this.divId;
    this.divObject.className = "esriColorChooser";

    var colorTable = this.divObject.appendChild(document.createElement("table"));
    var colorTableTbody = colorTable.appendChild(document.createElement("tbody"));
    var index = 0;
    for (var r=0;r<6;r++) {
      var ctTr = colorTableTbody.appendChild(document.createElement("tr"));
      for (var c=0;c<8;c++) {
        var ctTd = ctTr.appendChild(document.createElement("td"));
        ctTd.id = rr[index] + "," + gg[index] + "," + bb[index];
        ctTd.onclick = setColor;
        EsriUtils.setElementStyle(ctTd, "width:20px; height:20px; border:1px SOLID #000; background-color:rgb(" + rr[index] + "," + gg[index] + "," + bb[index] + ");");
        index++;
      }
    }

    var sliderTable = this.divObject.appendChild(document.createElement("table"));
    var sliderTbody = sliderTable.appendChild(document.createElement("tbody"));
    var colorNameArr = ["Red", "Green", "Blue"];
    var colorRgbArr = ["rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)"];
    for (var i=0;i<3;i++) {
      var sTr = sliderTbody.appendChild(document.createElement("tr"));
      var cTd = sTr.appendChild(document.createElement("td"));
      EsriUtils.setElementStyle(cTd, "width:30px; height:20px; background-color:" + colorRgbArr[i] + "; border:1px INSET #000;");

      var sTd = sTr.appendChild(document.createElement("td"));
      var updateFunc;
      if (i==0) updateFunc = updateRedColor;
      else if (i==1) updateFunc = updateGreenColor;
      else updateFunc = updateBlueColor;
      rgbSliders[i] = new EsriSlider(this.id + "_" + i, null, updateFunc);
      rgbSliders[i].numSegments = 10;
      rgbSliders[i].initValue = 0;
      rgbSliders[i].showTicks = false;
      rgbSliders[i].roundValues = false;
      rgbSliders[i].callContinuously = true;
      rgbSliders[i].init(sTd);
    }

    if (this.showCurrentColor) {
      var currColorTable = this.divObject.appendChild(document.createElement("table"));
      var currColorTbody = currColorTable.appendChild(document.createElement("tbody"));
      var currColorTr = currColorTbody.appendChild(document.createElement("tr"));
      currentColorTd = currColorTr.appendChild(document.createElement("td"));

      var selectTd = currColorTr.appendChild(document.createElement("td"));
      if (this.showSelectButton) {
        var select;
        if (EsriUtils.isIE) select = selectTd.appendChild(document.createElement("<input type='button' />"));
        else {
          select = selectTd.appendChild(document.createElement("input"));
          select.type = "button";
        }
        select.className = "esriToolDefault";
        select.onmouseover = function(e) { EsriUtils.getEventSource(e).className = "esriToolHover"; return false; }
        select.onmousedown = function(e) { EsriUtils.getEventSource(e).className = "esriToolSelected"; return false; }
        select.onmouseout = function(e) { EsriUtils.getEventSource(e).className = "esriToolDefault"; return false; }
        select.onclick = process_ColorSelect;
        select.value = this.selectLabel;
      }
      else {
        var span = selectTd.appendChild(document.createElement("span"));
        span.innerHTML += "&nbsp;";
      }
    }

    if (this.showStatus) {
      var statusTable = this.divObject.appendChild(document.createElement("table"));
      statusTable.width = "100%";
      var statusTbody = statusTable.appendChild(document.createElement("tbody"));
      var statusTr = statusTbody.appendChild(document.createElement("tr"));
      var statusTd = statusTr.appendChild(document.createElement("td"));
      status = statusTd.appendChild(document.createElement("span"));
      status.className = "esriColorChooserStatusText";
      status.appendChild(document.createTextNode("Status"));
    }
    self.setCurrentColor(this.currentColor.red, this.currentColor.green, this.currentColor.blue, true);
  }

  function updateRedColor(value) { self.setCurrentColor(Math.round(25.5 * value)); }
  function updateGreenColor(value) { self.setCurrentColor(null, Math.round(25.5 * value)); }
  function updateBlueColor(value) { self.setCurrentColor(null, null, Math.round(25.5 * value)); }

  function setColor(e) {
    var color = EsriUtils.getEventSource(e).id;
    var rgb = color.split(",");
    self.setCurrentColor(rgb[0], rgb[1], rgb[2], true);
  }

  this.setCurrentColor = function(r, g, b, updateSliders) {
    if (r != null) {
      self.currentColor.red = r;
      if (updateSliders) rgbSliders[0].setValue(r/25.5);
    }
    if (g != null) {
      self.currentColor.green = g;
      if (updateSliders) rgbSliders[1].setValue(g/25.5);
    }
    if (b != null) {
      self.currentColor.blue = b;
      if (updateSliders) rgbSliders[2].setValue(b/25.5);
    }

    if (self.showCurrentColor) EsriUtils.setElementStyle(currentColorTd, "width:150px; height:10px; background-color:rgb(" + self.currentColor.red + "," + self.currentColor.green + "," + self.currentColor.blue + ");");
    if (self.showStatus) status.firstChild.nodeValue = "(" + self.currentColor.red + "," + self.currentColor.green + "," + self.currentColor.blue + "), " + self.currentColor.toHex();
    if (self.callContinuously) callback(self.currentColor);
  }

  function process_ColorSelect() { callback(self.currentColor); }
  if (container) this.init(container);
}