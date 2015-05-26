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

function EsriSlider(id, container, callbackFunc, left, top) {
  this.inheritsFrom(new EsriPageElement(id, 0, 0, 0, 0));

  this.divId = "SliderDiv_" + this.id;
  var value;
  var rangeMin, rangeMax;
  var callback = callbackFunc;
  var sliderLeft = (left) ? left : 0;
  var sliderTop = (top) ? top : 0;
  var imgWd, imgHt, startXY, activeXY, activeImage;
  var valueChanging = false;
  var self = this;

  this.numSegments = 10;
  this.initValue = 0;
  this.isHorizontal = true;
  this.showTicks = true;
  this.roundValues = true;
  this.callContinuously = false;
  this.imagesDirectory = EsriControls.contextPath + "images/slider/";
  
  this.h_top_width = 12;
  this.h_top_height = 16;
  this.h_bottom_width = 12;
  this.h_bottom_height = 16;

  this.v_top_width = 16;
  this.v_top_height = 12;
  this.v_bottom_width = 16;
  this.v_bottom_height = 12;

  this.v_image_width = 16;
  this.v_image_height = 12;
  this.h_image_width = 12;
  this.h_image_height = 16;
  var active_image_id = this.divId + "_active_image";

  this.init = function(container) {
    this.numSegments = Math.round(this.numSegments);
    value = (this.initValue < 0) ? 0 : (this.initValue > this.numSegments) ? this.numSegments : this.initValue;

    if (this.isHorizontal) {
      imgWd = this.h_image_width;
      imgHt = this.h_image_height;
      rangeMin = this.h_top_width;
      rangeMax = rangeMin + ((this.numSegments + 1) * imgWd);
      this.bounds = new EsriRectangle(sliderLeft, sliderTop, ((this.numSegments + 3) * imgWd), imgHt);
    }
    else {
      imgWd = this.v_image_width;
      imgHt = this.v_image_height;
      rangeMin = this.v_top_height;
      rangeMax = rangeMin + ((this.numSegments + 1) * imgHt);
      this.bounds = new EsriRectangle(sliderLeft, sliderTop, imgWd, ((this.numSegments + 3) * imgHt));
    }

    this.divObject = document.createElement("div");
    this.divObject.id = this.divId;
    EsriUtils.setElementStyle(this.divObject, "width:" + (this.bounds.left + this.bounds.width) + "px; height:" + (this.bounds.top + this.bounds.height) + "px; border:0px NONE;");

    var action = new EsriMouseWheelAction();
    action.activate(this.divObject, function(val) { updateValue(value + val, true); });

    var controlDiv = document.createElement("div");
    EsriUtils.setElementStyle(controlDiv, "position:relative; left:" + sliderLeft + "px; top:" + sliderTop + "px;");

    var topImage = controlDiv.appendChild(EsriUtils.createImage(this.imagesDirectory + ((this.isHorizontal) ? "h" : "v") + "_slider_top.png", this.v_top_width + "px", this.v_top_height + "px"));
    topImage.id = this.divId + "_top_image";
    topImage.onclick = function() {
      if (self.isHorizontal) updateValue(value - 1, true);
      else updateValue(value + 1, true);
      return false;
    };
    EsriUtils.setElementStyle(topImage, "position:absolute; left:0px; top:0px;");

    var inactiveImageSrc = this.imagesDirectory + ((this.isHorizontal) ? "h" : "v") + "_slider_" + ((this.showTicks) ? "tick" : "inactive") + ".png";
    for (var i=0;i<=this.numSegments;i++) {
      var img = controlDiv.appendChild(EsriUtils.createImage(inactiveImageSrc, imgWd + "px", imgHt + "px"));
      img.id = (this.isHorizontal) ? i : this.numSegments - i;
      img.onclick = function() {
        updateValue(this.id, true);
        return false;
      };
      EsriUtils.setElementStyle(img, "position:absolute; left:" + ((this.isHorizontal) ? ((i + 1) * imgWd) : 0) + "px; top:" + ((this.isHorizontal) ? 0 : ((i * imgHt) + this.v_top_height)) + "px;");
    }

    var botImage = controlDiv.appendChild(EsriUtils.createImage(this.imagesDirectory + ((this.isHorizontal) ? "h" : "v") + "_slider_bottom.png", this.v_bottom_width + "px", this.v_bottom_height + "px"));
    botImage.id = this.id + "_bottom_image";
    botImage.onclick = function() {
      if (self.isHorizontal) updateValue(value + 1, true);
      else updateValue(value - 1, true);
      return false;
    }
    EsriUtils.setElementStyle(botImage, "position:absolute; left:" + ((this.isHorizontal) ? rangeMax : 0) + "px; top:" + ((this.isHorizontal) ? 0 : rangeMax) + "px;");

    if (this.numSegments == 0) {
      if (this.isHorizontal) EsriUtils.setElementStyle(botImage, "left:" + this.h_top_width + "px;");
      else EsriUtils.setElementStyle(botImage, "top:" + this.v_top_height + "px;");
    }

    activeImage = controlDiv.appendChild(EsriUtils.createImage(this.imagesDirectory + ((this.isHorizontal) ? "h" : "v") + "_slider_active.png", imgWd + "px", imgHt + "px"));
    activeImage.id = active_image_id;
    activeImage.onmousedown = handler_ValueChange_MouseDown;
    if (this.numSegments == 0) {
      EsriUtils.hideElement(activeImage);
    }

    this.divObject.appendChild(controlDiv);
    container.appendChild(this.divObject);
    self = this;
    updateValue(value, false);
  }

  function handler_ValueChange_MouseDown(e) {
    valueChanging = true;
    document.body.style.cursor = "pointer";
    var point = EsriUtils.getXY(e);
    startXY = (self.isHorizontal) ? point.x : point.y;
    activeImage.onmousemove = document.onmousemove = handler_ValueChange_MouseMove;
    activeImage.onmouseup = document.onmouseup = handler_ValueChange_MouseUp;
    return false;
  }

  function handler_ValueChange_MouseUp(e) {
    if (valueChanging) {
      valueChanging = false;
      document.body.style.cursor = "default";
      handler_ValueChange(e, true);
      activeImage.onmousemove = document.onmousemove = null;
      activeImage.onmouseup = document.onmouseup = null;
      return false;
    }
  }

  function handler_ValueChange_MouseMove(e) {
    if (valueChanging) {
      handler_ValueChange(e, false);
      return false;
    }
  }

  function handler_ValueChange(e, update) {
    var point = EsriUtils.getXY(e);
    var xy;
    if (self.isHorizontal) xy = activeXY + (point.x - startXY);
    else xy = activeXY + (point.y - startXY);

    if (xy < rangeMin) xy = rangeMin;
    else {
      if (self.isHorizontal && xy > (rangeMax - imgWd)) xy = rangeMax - imgWd;
      else if (xy > (rangeMax - imgHt)) xy = rangeMax - imgHt;
    }

    var currentValue;
    if (self.isHorizontal) {
      if (self.roundValues) currentValue = Math.ceil(((xy - (imgWd/2)) - rangeMin) / imgWd);
      else currentValue = (xy - rangeMin) / imgWd;
    }
    else {
      if (self.roundValues) currentValue = self.numSegments - Math.ceil(((xy - (imgHt/2)) - rangeMin) / imgHt);
      else currentValue = self.numSegments - ((xy - rangeMin) / imgHt);
    }

    if (update) updateValue(currentValue, true);
    else {
      if (self.isHorizontal) EsriUtils.moveElement(activeImage, xy, 0);
      else EsriUtils.moveElement(activeImage, 0, xy);

      if (self.callContinuously) {
        if (self.roundValues && (currentValue % 1 != 0)) return;
        callback(currentValue);
      }
    }
  }

  function updateValue(newValue, update) {
    newValue = parseFloat(newValue);
    if (self.numSegments > 0) {
      if (newValue < 0) newValue = 0;
      else if (newValue > self.numSegments) newValue = self.numSegments;
    }

    if (self.isHorizontal) {
      EsriUtils.setElementStyle(activeImage, "position:absolute; left:" + (rangeMin + (newValue * imgWd)) + "px; top:0px; width:" + imgWd + "px; height:" + imgHt + ";");
      activeXY = rangeMin + (newValue * imgWd);
    }
    else {
      EsriUtils.setElementStyle(activeImage, "position:absolute; left:0px; top:" + (rangeMin + ((self.numSegments - newValue) * imgHt)) + "px; width:" + imgWd + "px; height:" + imgHt + ";");
      activeXY = rangeMin + ((self.numSegments - newValue) * imgHt);
    }

    if (newValue != value && update) callback(newValue);
    value = newValue;
  }

  this.setValue = function(value, doUpdate) { updateValue(value, doUpdate); }
  if (container) this.init(container);
}