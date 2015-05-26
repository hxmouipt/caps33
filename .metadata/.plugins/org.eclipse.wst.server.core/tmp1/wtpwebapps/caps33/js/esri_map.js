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

function EsriMap(id, container, formId, wd, ht) {
  this.width = (wd) ? wd : (container && container.style.width) ? EsriUtils.getStyleValue(container.style.width) : 400;
  this.height = (ht) ? ht : (container && container.style.height) ? EsriUtils.getStyleValue(container.style.height) : 400;
  this.inheritsFrom(new EsriControl(id, "Map", 0, 0, this.width, this.height));
  this.formId = formId;
  var self = this;

  this.divId = "MapDiv_" + id;
  this.controlDivId = "MapControlDiv_" + id;
  this.controlDiv = null;

  this.graphics = null;
  this.graphicsId = "MapGraphics_" + id;
  this.graphicsZIndex = 19;
  this.webGraphics = null;
  this.webGraphicsId = "MapWebGraphics_" + id;
  this.webGraphicsZIndex = 20;
  this.isFuseGraphics = false;


  this.loadingId = "MapLoading_" + id;
  this.loadingImage = null;
  this.loadingUrl = EsriControls.contextPath + "images/loading.gif";
  this.loadingZIndex = 99;

  this.imageGridId = "MapGridDiv_" + id;
  this.imageGrid = this.viewBounds = null;
  this.currentToolbar = this.currentTool = null;
  this.panTool = new EsriMapContinuousPan("emcp_" + id, "emcp_" + id);
  this.keyNavigation = new EsriMapKeyNavigation("emkn_" + id, "emkn_" + id);
  this.mouseWheelTool = new EsriMapMouseWheel("emmw_" + id, "emmw_" + id);
  this.mapSources = [];
  this.mapSourceNames = [];

  this.scaleBarId = "ScaleBar_" + id
  this.scaleBarDiv = null;
  this.scaleBar = null;
  this.scaleBarTypeNames = ["Alternating", "SteppedScaleLine", "SingleDivision", "DoubleAlternating"];
  this.scaleBarTypes = [];
  this.scaleBarTypes["Alternating"] = "EsriAlternatingScaleBarRenderer";
  this.scaleBarTypes["SteppedScaleLine"] = "EsriSteppedScaleLineRenderer";
  this.scaleBarTypes["SingleDivision"] = "EsriSingleDivisionScaleBar";
  this.scaleBarTypes["DoubleAlternating"] = "EsriDoubleAlternatingScaleBarRenderer";

  this.numLevels = 0;
  this.level = 0;
  
  this.enableMapTips = true;
  this.mapTip = null;
  this.callOut = null;

  this.init = function(container) {
    if (! this.width || ! this.height) {
      var size = EsriUtils.getElementPageBounds(container);
      if (size.width && size.height) {
        this.width = size.width;
        this.height = size.height;
      }
    }
    this.bounds = new EsriRectangle(0, 0, this.width, this.height);
    this.viewBounds = new EsriRectangle(0, 0, this.width, this.height);

    this.divObject = container.appendChild(document.createElement("div"));
    this.divObject.id = this.divId;
    EsriUtils.setElementStyle(this.divObject, "width:" + this.width + "px; height:" + this.height + "px; overflow:hidden;");

    this.controlDiv = this.divObject.appendChild(document.createElement("div"));
    this.controlDiv.id = this.controlDivId;
    this.controlDiv.align = "left";
    EsriUtils.setElementStyle(this.controlDiv, "position:relative; width:" + this.width + "px; height:" + this.height + "px; overflow:hidden;");

    this.imageGrid = this.controlDiv.appendChild(document.createElement("div"));
    this.imageGrid.id = this.imageGridId;
    EsriUtils.setElementStyle(this.imageGrid, "position:absolute; left:0px; top:0px; width:" + this.width + "px; height:" + this.height + "px;");

    this.graphics = EsriUtils.createGraphicsElement(this.graphicsId, this.imageGrid);
    EsriUtils.setElementStyle(this.graphics.gc, "z-index:" + this.graphicsZIndex + ";");

    this.divObject.onmouseover = function() { self.panTool.activate(); };
    this.divObject.onmouseout = function() { self.panTool.deactivate(); };

    this.loadingImage = this.controlDiv.appendChild(document.createElement("img"));
    this.loadingImage.id = this.loadingId;
    this.loadingImage.src = this.loadingUrl;
    this.loadingImage.className = "esriLoadingImage";
    EsriUtils.setElementStyle(this.loadingImage, "display:none; z-index:" + this.loadingZIndex + ";");

    for (var i=0;i<this.mapSourceNames.length;i++) {
      this.mapSources[this.mapSourceNames[i]].update(this);
      this.mapSources[this.mapSourceNames[i]].updateImages(this.viewBounds);
    }

    this.updateWebGraphics();

    this.panTool.control = this.keyNavigation.control = this.mouseWheelTool.control = this;
    this.panTool.element = this.imageGrid;
    this.keyNavigation.element = this.mouseWheelTool.element = this.divObject;

    this.panTool.activate();
    this.keyNavigation.activate();
    this.mouseWheelTool.activate();

    EsriControls.addPostBackTagHandler("map", EsriControls.maps[self.id].updateAsync);
    
    var args ={};
    args.container = this.controlDiv;
    this.callOut = new EsriCallOut(this.controlDivId,args);
    this.mapTip = new EsriMapTip(this.id);

  }

  this.updateAsync = function(xml, eventSources) {
    var idTag = xml.getElementsByTagName("id").item(0);
    if (idTag.firstChild.nodeValue == self.id) {
      self.width = parseInt(xml.getElementsByTagName("width").item(0).firstChild.nodeValue);
      self.height = parseInt(xml.getElementsByTagName("height").item(0).firstChild.nodeValue);
      self.bounds.reshape(0, 0, self.width, self.height);
      self.viewBounds.reshape(0, 0, self.width, self.height);

      self.enableMapTips = xml.getElementsByTagName("enable-info-window").item(0).firstChild.nodeValue == "true";
      self.isFuseGraphics = xml.getElementsByTagName("control-fuse-graphics").item(0).firstChild.nodeValue == "true";

      if (self.webGraphics) EsriUtils.hideElement(self.webGraphics);
      EsriUtils.setElementStyle(self.divObject, "width:" + self.width + "px; height:" + self.height + "px; overflow:hidden;");
      EsriUtils.setElementStyle(self.controlDiv, "position:relative; width:" + self.width + "px; height:" + self.height + "px; overflow:hidden;");
      EsriUtils.setElementStyle(self.imageGrid, "position:absolute; left:0px; top:0px; width:" + self.width + "px; height:" + self.height + "px;");
      EsriUtils.setElementStyle(self.loadingImage, "display:none; z-index:" + self.loadingZIndex + ";");

      self.removeAllMapSources();
      self.clearImages();

      var tlcTags = xml.getElementsByTagName("tile-levels-count");
      if (tlcTags.length > 0) {
        self.numLevels = parseInt(tlcTags.item(0).firstChild.nodeValue);
        self.level = parseInt(xml.getElementsByTagName("tile-level").item(0).firstChild.nodeValue);
      }

      var dataSourcesTags = xml.getElementsByTagName("data-sources");
      if (dataSourcesTags.length > 0) {
        var dataSourcesTag = dataSourcesTags.item(0);

        var dataSourceTags = dataSourcesTag.getElementsByTagName("data-source");
        if (dataSourceTags.length > 0) {
          for (var i=(dataSourceTags.length-1);i>=0;i--) {
            var dataSourceTag = dataSourceTags.item(i);
            var transparency = dataSourceTag.getAttribute("transparency");
            transparency = (transparency) ? parseFloat(transparency) : 1;

            var tileTags = dataSourceTag.getElementsByTagName("tile");
            var dynamicTags = dataSourceTag.getElementsByTagName("dynamic");

            if (tileTags.length > 0) {
              tileTag = tileTags.item(0);

              var mapSource = new EsriMapSourceTile(tileTag.getElementsByTagName("base-url").item(0).firstChild.nodeValue);
              mapSource.filesys = tileTag.getElementsByTagName("file-sys").item(0).firstChild.nodeValue == "true";
              mapSource.showNoData = false;
              mapSource.imageOpacity = transparency;
              var formatTags = tileTag.getElementsByTagName("image-format");
              if (formatTags.length > 0)
                mapSource.fileFormat = formatTags.item(0).firstChild.nodeValue;

              mapSource.imageWidth = parseInt(tileTag.getElementsByTagName("tile-width").item(0).firstChild.nodeValue);
              mapSource.imageHeight = parseInt(tileTag.getElementsByTagName("tile-height").item(0).firstChild.nodeValue);
              mapSource.numLevels = parseInt(tileTag.getElementsByTagName("levels-count").item(0).firstChild.nodeValue);
              mapSource.level = parseInt(tileTag.getElementsByTagName("level").item(0).firstChild.nodeValue);
              mapSource.startColumn = parseInt(tileTag.getElementsByTagName("start-column").item(0).firstChild.nodeValue);
              mapSource.endColumn = parseInt(tileTag.getElementsByTagName("end-column").item(0).firstChild.nodeValue);
              mapSource.column = parseInt(tileTag.getElementsByTagName("column").item(0).firstChild.nodeValue);
              mapSource.startRow = parseInt(tileTag.getElementsByTagName("start-row").item(0).firstChild.nodeValue);
              mapSource.endRow = parseInt(tileTag.getElementsByTagName("end-row").item(0).firstChild.nodeValue);
              mapSource.row = parseInt(tileTag.getElementsByTagName("row").item(0).firstChild.nodeValue);
              mapSource.offsetX = parseInt(tileTag.getElementsByTagName("offsetx").item(0).firstChild.nodeValue);
              mapSource.offsetY = parseInt(tileTag.getElementsByTagName("offsety").item(0).firstChild.nodeValue);
              self.addMapSource("mapSource" + (i + 1), mapSource, false);
            }
            else if (dynamicTags.length > 0) {
              dynamicTag = dynamicTags.item(0);
              var imageUrl = dynamicTag.getElementsByTagName("image-url").item(0).firstChild.nodeValue;
              var mapSource = new EsriMapSourceDynamic(self.width, self.height);
              mapSource.imageOpacity = transparency;
              mapSource = self.addMapSource("mapSource" + (i + 1), mapSource, false);
              mapSource.addImage(0, 0, mapSource.generateTileId(0, 0), imageUrl);
            }
          }
        }
      }

      self.graphics.destroy();
      self.graphics = EsriUtils.createGraphicsElement(self.graphicsId, self.imageGrid);
      EsriUtils.setElementStyle(self.graphics.gc, "z-index:" + self.graphicsZIndex + ";");

      for (var i=0;i<self.mapSourceNames.length;i++) {
        self.mapSources[self.mapSourceNames[i]].update(self);
        self.mapSources[self.mapSourceNames[i]].updateImages(self.viewBounds);
      }

      var scalebarTags = xml.getElementsByTagName("scalebar");
      if (scalebarTags.length > 0 && self.scaleBar) {
        var scalebarTag = scalebarTags.item(0);
        var imageUrlTags = scalebarTag.getElementsByTagName("image-url");
        if (imageUrlTags.length > 0) self.scaleBar.src = imageUrlTags.item(0).firstChild.nodeValue;
        else {
          var sd = parseInt(scalebarTag.getElementsByTagName("screen-distance").item(0).firstChild.nodeValue);
          var md = parseFloat(scalebarTag.getElementsByTagName("map-distance").item(0).firstChild.nodeValue);
          var u = scalebarTag.getElementsByTagName("units").item(0).firstChild.nodeValue;
          self.scaleBar.renderer.render(sd, md, u);
        }
      }

      self.reactivateCurrentToolItem();

      EsriUtils.removeFormElement(self.formId, self.id);
      EsriUtils.removeFormElement(self.formId, self.id + "_mode");
      EsriUtils.removeFormElement(self.formId, self.id + "_minx");
      EsriUtils.removeFormElement(self.formId, self.id + "_miny");
      EsriUtils.removeFormElement(self.formId, self.id + "_maxx");
      EsriUtils.removeFormElement(self.formId, self.id + "_maxy");
      EsriUtils.removeFormElement(self.formId, self.id + "_coords");
      EsriUtils.removeFormElement(self.formId, self.id + "_value");

      for (var i=0;i<self.updateListenerNames.length;i++) self.updateListeners[self.updateListenerNames[i]](self);    
    }
  }

  this.updateWebGraphics = function() {
    if (! this.isFuseGraphics) {
      var redisplay = this.webGraphics == null;
      if (this.webGraphics) EsriUtils.setElementStyle(this.webGraphics, "width:0px; height:0px;");
      var params = "getWebGraphics=getWebGraphics&formId=" + this.formId + "&mapId=" + this.id + "&redisplay=" + redisplay + "&" + EsriUtils.buildRequestParams(this.formId);
      EsriUtils.sendAjaxRequest(EsriUtils.getServerUrl(this.formId), params, false, process_updateWebGraphicsResponse);
    }
  }

  function process_updateWebGraphicsResponse(xh) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var vb = self.viewBounds;
      var xml = EsriUtils.getXmlDocument(xh);
      var changed = xml.getElementsByTagName("changed").item(0).firstChild.nodeValue == "true";

      self.webGraphics = document.getElementById(self.webGraphicsId);
      if (changed) {
        if (self.webGraphics) {
          EsriUtils.removeElement(self.webGraphics);
          self.webGraphics = null;
        }

        var imageTags = xml.getElementsByTagName("image-url");
        if (imageTags.length > 0) {
          var img = self.webGraphics = self.imageGrid.appendChild(EsriUtils.createImage(imageTags.item(0).firstChild.nodeValue, vb.width + "px", vb.height + "px"));
          img.id = self.webGraphicsId;
          EsriUtils.setElementStyle(img, "position:absolute; left:" + vb.left + "px; top:" + vb.top + "px; z-index:" + self.webGraphicsZIndex + ";");
          EsriUtils.setElementOpacity(img, xml.getElementsByTagName("transparency").item(0).firstChild.nodeValue);        
        }
      }
      else if (self.webGraphics) EsriUtils.setElementStyle(self.webGraphics, "position:absolute; left:" + vb.left + "px; top:" + vb.top + "px; width:" + vb.width + "px; height:" + vb.height + "px; z-index:" + self.webGraphicsZIndex + "; display:block;");
    }
  }

  this.centerAt = function(x, y) {
    var params = "doContinuousPan=doContinuousPan&centerAt=centerAt&source=" + ((this.numLevels == 0) ? "dynamic" : "tile") + "&formId=" + this.formId + "&mapId=" + this.id + "&centerx=" + x + "&centery=" + y + "&" + EsriUtils.buildRequestParams(this.formId);
    EsriUtils.sendAjaxRequest(EsriUtils.getServerUrl(this.formId), params, false, process_centerAtResponse);
  }

  function process_centerAtResponse(xh) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);
      var responseTag = xml.getElementsByTagName("response").item(0);

      var mapTags = responseTag.getElementsByTagName("map");
      for (var i=0;i<mapTags.length;i++) {
        var mapTag = mapTags.item(i);
        var mapId = mapTag.getElementsByTagName("id").item(0).firstChild.nodeValue;
        if (mapId == self.id) {
          var scalebarTags = mapTag.getElementsByTagName("scalebar");
          if (scalebarTags.length > 0 && self.scaleBar) {
            var scalebarTag = scalebarTags.item(0);
            var imageUrlTags = scalebarTag.getElementsByTagName("image-url");
            if (imageUrlTags.length > 0) self.scaleBar.src = imageUrlTags.item(0).firstChild.nodeValue;
            else self.scaleBar.renderer.render(parseInt(scalebarTag.getElementsByTagName("screen-distance").item(0).firstChild.nodeValue), parseFloat(scalebarTag.getElementsByTagName("map-distance").item(0).firstChild.nodeValue), scalebarTag.getElementsByTagName("units").item(0).firstChild.nodeValue);
          }

          for (var j=0;j<self.updateListenerNames.length;j++) self.updateListeners[self.updateListenerNames[j]](self);
          mapTag.parentNode.removeChild(mapTag);
          break;
        }
      }

      EsriControls.processPostBackXML(xml);
    }
  }

  this.resize = function(wd, ht) {
    this.showLoading();
    var params = "doContinuousPan=doContinuousPan&resizeMap=resizeMap&source=" + ((this.numLevels == 0) ? "dynamic" : "tile") + "&formId=" + this.formId + "&mapId=" + this.id + "&width=" + wd + "&height=" + ht + "&" + EsriUtils.buildRequestParams(this.formId);
    EsriUtils.sendAjaxRequest(EsriUtils.getServerUrl(this.formId), params, false, EsriControls.processPostBack);
  }

  this.dynamicMapSourceDelegate = new EsriDynamicMapSourceDelegate(this);

  EsriControls.mapIds.push(this.id);
  EsriControls.maps[this.id] = this;
  if (container) this.init(container);
}

EsriMap.prototype.setCurrentToolItem = function(toolItem, toolbarId) {
  if (! toolItem) return;
  if(this.callOut) this.callOut.hide();
  if (this.currentTool && this.currentTool.id == toolItem.id) {
    this.reactivateCurrentToolItem();
    return;
  }

  if (toolItem.isCommand) {
    if (this.currentTool && this.currentToolbar) EsriControls.toolbars[this.currentToolbar].setToolItemInactive(this.currentTool.id);
    if (toolbarId) EsriControls.toolbars[toolbarId].setToolItemActive(toolItem.id);
    toolItem.control = this;
    toolItem.element = this.imageGrid;
    toolItem.activate();
    toolItem.deactivate();
    if (toolbarId) EsriControls.toolbars[toolbarId].setToolItemInactive(toolItem.id);
    if (this.currentTool && this.currentToolbar) EsriControls.toolbars[this.currentToolbar].setToolItemActive(this.currentTool.id);
    return;
  }

  if (this.currentTool) {
    if (this.currentToolbar) EsriControls.toolbars[this.currentToolbar].setToolItemInactive(this.currentTool.id);
    this.currentTool.deactivate();
  }

  this.currentToolbar = toolbarId;
  this.currentTool = toolItem;
  this.currentTool.control = this;
  this.currentTool.element = this.imageGrid;
  if (this.currentToolbar) EsriControls.toolbars[this.currentToolbar].setToolItemActive(this.currentTool.id);
  this.currentTool.activate();
}

EsriMap.prototype.deactivateCurrentToolItem = function() { if (this.currentTool) this.currentTool.deactivate(); }
EsriMap.prototype.activateCurrentToolItem = function() { if (this.currentTool) this.currentTool.activate(); }

EsriMap.prototype.reactivateCurrentToolItem = function() {
  if (this.currentTool) {
    if (this.currentTool.action.isActive) {
      return;
    }

    this.deactivateCurrentToolItem();
    this.activateCurrentToolItem();
  }
}

EsriMap.prototype.clearCurrentToolItem = function() {
  if (this.currentTool) {
    if (this.currentToolbar) EsriControls.toolbars[this.currentToolbar].setToolItemInactive(this.currentTool.id);
    this.currentTool.deactivate();
    this.currentTool = this.currentToolbar = null;
  }
}

EsriMap.prototype.createCurrentToolItem = function(id, eId, clientAction, sl, pb, lc, lw, def, hov, sel, dis) {
  var toolItem = eval("new " + clientAction + "(id, id);");
  toolItem.showLoading = sl;
  toolItem.clientPostBack = pb;
  if (lc) toolItem.action.symbol.lineColor = lc;
  if (lw) toolItem.action.symbol.lineWidth = lw;
  var elementId = eId;
  var e = document.getElementById(elementId);
  var fMouseOver = e.onmouseover;
  var fMouseOut = e.onmouseout;
  var type = e.type.toLowerCase();
  var de = def;
  var ho = hov;
  var se = sel;
  var di = dis;

  toolItem.origActivate = toolItem.activate;
  toolItem.origDeactivate = toolItem.deactivate;

  toolItem.activate = function() {
    var e = document.getElementById(elementId);
    if (e) {
      if (type == "image") EsriUtils.setImageSrc(e, se);
      else e.className = se;
      e.onmouseover = e.onmouseout = null;
      toolItem.origActivate();
    }
  }

  toolItem.deactivate = function() {
    var e = document.getElementById(elementId);
    if (e) {
      if (type == "image") EsriUtils.setImageSrc(e, de);
      else e.className = de;
      e.onmouseover = fMouseOver;
      e.onmouseout = fMouseOut;
    }
    toolItem.origDeactivate();
  }

  this.setCurrentToolItem(toolItem);
  return toolItem;
}

EsriMap.prototype.clearImages = function() {
  var childCount = this.imageGrid.childNodes.length;
  for (var i=childCount-1;i>=0;i--) {
    var child = this.imageGrid.childNodes.item(i);
    if (child.tagName.toLowerCase() != "div" && child.id != this.webGraphicsId) this.imageGrid.removeChild(child);
  }
}

EsriMap.prototype.addMapSource = function(name, mapSource, updateWebGraphics) {
  if (this.mapSourceNames.indexOf(name) == -1) this.mapSourceNames.push(name);
  this.mapSources[name] = mapSource;
  mapSource.id = name;
  this.mapSources[name].update(this);
  mapSource.imageZIndex = this.mapSourceNames.length;
  if (updateWebGraphics) this.updateWebGraphics();
  return mapSource;
}

EsriMap.prototype.removeMapSource = function(name, updateWebGraphics) {
  var index = this.mapSourceNames.indexOf(name);
  if (index == -1) return;

  this.mapSourceNames.splice(index, 1);
  var mapSource = this.mapSources[name];
  this.mapSources[name] = null;

  if (updateWebGraphics) this.updateWebGraphics();
  return mapSource;
}

EsriMap.prototype.removeAllMapSources = function() { for (var i=(this.mapSourceNames.length-1);i>=0;i--) this.removeMapSource(this.mapSourceNames[i], false); }
EsriMap.prototype.showLoading = function() { EsriUtils.showElement(this.loadingImage); }
EsriMap.prototype.hideLoading = function() { EsriUtils.hideElement(this.loadingImage); }

EsriMap.prototype.addScaleBar = function(url, position, width, height, sDist, mDist, units, type) {
  this.scaleBarDiv = this.controlDiv.appendChild(document.createElement("div"));

  var posStyle;
  if (position == "none") this.scaleBarDiv.className = "esriScaleBar";
  else {
    var pa = position.split("-");
    posStyle = "position:absolute; " + pa[0] + ":10px; " + pa[1] + ":10px; z-index:99;";
  }

  if (url) {
    this.scaleBar = this.scaleBarDiv.appendChild(document.createElement("img"));
    this.scaleBar.id = this.scaleBarId;
    this.scaleBar.src = url;
    if (posStyle) EsriUtils.setElementStyle(this.scaleBar, posStyle);
  }
  else {
    var renderer = eval("window." + this.scaleBarTypes[(type) ? type : this.scaleBarTypeNames[0]]);
    this.scaleBar = new EsriScaleBar(this.scaleBarId, this.scaleBarDiv, width, height, new renderer());
    if (posStyle) EsriUtils.setElementStyle(this.scaleBar.divObject, posStyle);
    this.scaleBar.renderer.render(sDist, mDist, units);
  }
}

EsriMap.prototype.changeLevel = function(newLevel) {
  var source = (this.numLevels == 0) ? "dynamic" : "tile";
  if (source == "tile" && (newLevel < 0 || newLevel >= this.numLevels)) return;
  this.showLoading();
  var params = "doContinuousPan=doContinuousPan&changeLevel=changeLevel&source=" + source + "&formId=" + this.formId + "&mapId=" + this.id + "&level=" + newLevel + "&factor=" + (1.0 + newLevel) + "&" + EsriUtils.buildRequestParams(this.formId);
  EsriUtils.sendAjaxRequest(EsriUtils.getServerUrl(this.formId), params, false, EsriControls.processPostBack);
}

function EsriMapSource(type) {
  this.id = "EsriMapSource";
  this.type = type;
  this.map = this.formUrl = null;
  this.doTileCleanUp = true;
  this.imageList = new Array();
  this.imageZIndex = 0;
  this.imageOpacity = 1;
  this.offsetX = this.offsetY = this.imageWidth = this.imageHeight = this.row = this.column = 0;
  var self = this;

  this.update = function(m) {
    this.map = m;
    this.formUrl = EsriUtils.getServerUrl(this.map.formId);
    this.imageList = new Array();
    self = this;
  }

  this.addImage = function(oX, oY, imageId) {}
  this.generateTileId = function(row, col) { return "MapTile_" + this.map.id + "_" + this.id + "_" + row + "_" + col; }

  this.updateImages = function(inRect) {
    var rect = inRect.offset(this.offsetX, this.offsetY);
    var sC = Math.floor(rect.left / this.imageWidth);
    var sR = Math.floor(rect.top / this.imageHeight);
    var eC = Math.ceil((rect.left + rect.width) / this.imageWidth);
    var eR = Math.ceil((rect.top + rect.height) / this.imageHeight);
    for (var c=sC;c<eC;c++) {
      for (var r=sR;r<eR;r++) {
        var id = this.generateTileId(r, c);
        if (this.imageList.indexOf(id) == -1) {
          this.imageList.push(id);
          this.addImage(this.row + r, this.column + c, id);
        }
      }
    }

    if (this.doTileCleanUp) {
      var scaledRect = rect.scale(2);
      var startCol = Math.floor(scaledRect.left / this.imageWidth);
      var startRow = Math.floor(scaledRect.top / this.imageHeight);
      var endCol = Math.ceil((scaledRect.left + scaledRect.width) / this.imageWidth);
      var endRow = Math.ceil((scaledRect.top + scaledRect.height) / this.imageHeight);
      var tempList = new Array();
      for (var c=startCol;c<endCol;c++) { for (var r=startRow;r<endRow;r++) tempList.push(this.generateTileId(r, c)); }

      for (var l=this.imageList.length-1;l>=0;l--) {
        if (tempList.indexOf(this.imageList[l]) == -1) {
          var obj = document.getElementById(this.imageList.splice(l, 1)[0]);
          if (obj) EsriUtils.removeElement(obj);
        }
      }
    }
  }
}

function EsriMapSourceDynamic(imgWd, imgHt) {
  this.inheritsFrom(new EsriMapSource("dynamic"));
  this.imageWidth = imgWd;
  this.imageHeight = imgHt;
  this.doTileCleanUp = false;
  var self = this;

  this.addImage = function(oY, oX, id, url) {
    if (url) {
      var img = this.map.imageGrid.appendChild(document.createElement("img"));
      img.id = id;
      img.className = "esriMapImage";
      this.imageList.push(id);
      EsriUtils.setElementStyle(img, "position:absolute; left:" + (this.map.width * oX) + "px; top:" + (this.map.height * oY) + "px; width:" + this.map.width + "px; height:" + this.map.height + "px; margin:0px; padding:0px; border:0px none; z-index:" + this.imageZIndex + ";");
      EsriUtils.setElementOpacity(img, this.imageOpacity);
      if (EsriUtils.isIE6) {
        EsriUtils.hideElement(img);
        img.onload = function(evt) {
          EsriUtils.setImageSrc(img, img.src);
          EsriUtils.showElement(img);
          img.onload = null;
        }
      }
      img.src = url;
    }
    else if (! (oY == 0 && oX == 0)) {
      this.map.dynamicMapSourceDelegate.addImages(oY, oX);
    }
  }

  function process_getImageResponse(xh, oX, oY, id) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);

      var img = self.map.imageGrid.appendChild(document.createElement("img"));
      EsriUtils.setImageSrc(img, xml.getElementsByTagName("image-url").item(0).firstChild.nodeValue);
      img.id = id;
      img.className = "esriMapImage";
      EsriUtils.setElementStyle(img, "left:" + (self.map.width * oX) + "px; top:" + (self.map.height * oY) + "px; width:" + self.map.width + "px; height:" + self.map.height + "px; z-index:" + self.imageZIndex + ";");
      EsriUtils.setElementOpacity(img, self.imageOpacity);
    }
  }
}

function EsriDynamicMapSourceDelegate(map) {
  var mapId = map.id;
  var STATUS_UNAVAILABLE = 0;
  var STATUS_PROCESSING = -1;
  var STATUS_AVAILABLE = 1;
  var status = [];

  function generateStatusId(y, x) { return y + "," + x; }

  this.addImages = function(oY, oX) {
    var statusId = generateStatusId(oY, oX);
    if (! status[statusId]) {
      status[statusId] = STATUS_PROCESSING;
      var map = EsriControls.maps[mapId];
      var bc = map.bounds.center;
      var bcx = bc.x;
      var bcy = bc.y;
      var vc = map.viewBounds.center;
      var params = "doContinuousPan=doContinuousPan&getImage=getImage&formId=" + map.formId +
        "&mapId=" + mapId +
        "&centerx=" + (bcx + (bcx - vc.x + (map.width * oX))) +
        "&centery=" + (bcy + (bcy - vc.y + (map.height * oY))) +
        "&" + EsriUtils.buildRequestParams(map.formId);
      EsriUtils.sendAjaxRequest(EsriUtils.getServerUrl(map.formId), params, false, function(xh) { process_getImageResponse(xh, oX, oY, statusId); });
    }
  }

  this.clear = function() { status = []; }

  function process_getImageResponse(xh, oX, oY, statusId) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);
      var map = EsriControls.maps[mapId];
      var imageUrlTags = xml.getElementsByTagName("image-url");

      var msNames = map.mapSourceNames;
      var urlLoop = 0;
      for (var i=msNames.length-1; i>=0; i--) {
        var mapSource = map.mapSources[msNames[i]];
        if (mapSource.type == "dynamic")
          mapSource.addImage(oY, oX, mapSource.generateTileId(oY, oX), imageUrlTags.item(urlLoop++).firstChild.nodeValue);
      }

      status[statusId] = STATUS_AVAILABLE;
    }
  }

  map.addUpdateListener("esriMapSourceDelegate", this.clear);
}

function EsriMapSourceTile(tileUrl, tileWd, tileHt, numLevels, level, startCol, endCol, col, startRow, endRow, row, offX, offY) {
  this.inheritsFrom(new EsriMapSource("tile"));
  this.tileUrl = tileUrl;
  this.filesys = false;
  this.imageWidth = tileWd;
  this.imageHeight = tileHt;
  this.numLevels = numLevels;
  this.level = level;
  this.startColumn = startCol;
  this.endColumn = endCol;
  this.column = col;
  this.startRow = startRow;
  this.endRow = endRow;
  this.row = row;
  this.offsetX = offX;
  this.offsetY = offY;

  this.showNoData = true;
  this.noDataLabel = "No Data";
  this.fileFormat = "png";
  var self = this;

  function prependZeros(s, len) {
    var delta = len - s.length;
    for (var i=1;i<=delta;i++) s = "0" + s;
    return s;
  }

  function generateUrl(url, level, row, col) {
    if (self.filesys) {
      var l = "L" + prependZeros(new String(level), 2);
      var r = "R" + prependZeros(EsriUtils.toHex(row), 8);
      var c = "C" + prependZeros(EsriUtils.toHex(col), 8);
      return ((url.endsWith("/")) ? url : url + "/") + l + "/" + r + "/" + c + "." + self.fileFormat;
    }
    else return url + "&level=" + level + "&row=" + row + "&column=" + col;
  }

  this.addImage = function(row, col, id) {
    var left = (this.imageWidth * (col - this.column)) - this.offsetX;
    var top = (this.imageHeight * (row - this.row)) - this.offsetY;
    if (this.startRow <= row && row <= this.endRow && this.startColumn <= col && col <= this.endColumn) {
      var img = this.map.imageGrid.appendChild(document.createElement("img"));
      img.id = id;
      img.className = "esriMapImage";
      EsriUtils.setElementStyle(img, "left:" + left + "px; top:" + top + "px; width:" + this.imageWidth + "px; height:" + this.imageHeight + "px; z-index:" + this.imageZIndex + ";");
      EsriUtils.setElementOpacity(img, this.imageOpacity);
      if (EsriUtils.isIE6) {
        EsriUtils.hideElement(img);
        img.onload = function(evt) {
          EsriUtils.setImageSrc(img, img.src);
          EsriUtils.showElement(img);
          img.onload = null;
        }
      }
      img.src = generateUrl(this.tileUrl, this.level, row, col);
    }
    else if (this.showNoData) {
      var table = this.map.imageGrid.appendChild(document.createElement("table"));
      table.id = id;
      table.className = "esriMapNoData";
      EsriUtils.setElementStyle(table, "left:" + left + "px; top:" + top + "px; width:" + this.imageWidth + "px; height:" + this.imageHeight + "px; z-index:" + this.imageZIndex + ";");
      var cell = table.appendChild(document.createElement("tbody")).appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
      cell.vAlign = "middle";
      cell.align = "center";
      cell.appendChild(document.createTextNode(this.noDataLabel));
    }
  }
}

function EsriMapToolItem(id, tn, act, isM) {
  this.inheritsFrom(new EsriToolItem(id, tn, act, isM));

  this.activate = function() {
    if (this.action) this.action.activate(this.element, this.postAction);
    this.isActive = true;
  }

  this.deactivate = function() {
    if (this.action) this.action.deactivate();
    this.isActive = false;
  }

  this.postAction = function() {}
}

function EsriMapRectangle(id, toolName, isMarkerTool) {
	this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDrawRectangleAction(), isMarkerTool));
  var self = this;

  this.activate = function() {
    if (this.action) this.action.activate(this.element, this.postAction, null, this.control.graphics);
    this.isActive = true;
  }
  this.update = function() { self = this; }
	this.postAction = function(rect) {
    if (rect.width == 0 && rect.height == 0) return;

    self.update();
    var map = self.control;

    if (self.isMarker) map.graphics.drawRectangle(rect,self.action.symbol);
    else {
      if (self.showLoading) map.showLoading();
      rect = rect.offset(-map.viewBounds.left, -map.viewBounds.top);

      EsriUtils.addFormElement(map.formId, map.id, map.id);
      EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
      EsriUtils.addFormElement(map.formId, map.id + "_minx", rect.left);
      EsriUtils.addFormElement(map.formId, map.id + "_miny", rect.top);
      EsriUtils.addFormElement(map.formId, map.id + "_maxx", rect.left + rect.width);
      EsriUtils.addFormElement(map.formId, map.id + "_maxy", rect.top + rect.height);
      if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
      EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
    }
	}
}

function EsriMapPan(id, toolName) {
	this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDragElementAction(true)));
  var self = this;
  this.updateOverview = false;

  this.update = function() { self = this; }
	this.postAction = function(x, y) {
    if (x == 0 && y == 0) return;

    self.update();
    var map = self.control;
    if (self.showLoading) map.showLoading();

    EsriUtils.addFormElement(map.formId, map.id, map.id);
    EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
    EsriUtils.addFormElement(map.formId, map.id + "_minx", Math.round(map.bounds.center.x - x));
    EsriUtils.addFormElement(map.formId, map.id + "_miny", Math.round(map.bounds.center.y - y));
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }
}

function EsriMapContinuousPan(id, toolName) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDragElementAction(true)));
  var self = this;
  var map, overview;
  var ovBox, mapToOvRatioWd, mapToOvRatioHt;
  this.updateOverview = true;

  this.update = function() {
    self = this;
    map = this.control;
    if(map.callOut) map.callOut.hide();
    if (! overview) {
      for (var i=0;i<EsriControls.overviewIds.length;i++) {
        if (EsriControls.overviews[EsriControls.overviewIds[i]].mapId == map.id) {
          overview = EsriControls.overviews[EsriControls.overviewIds[i]];
          break;
        }
      }
    }
    if (overview && ! overview.showNoData) {
      ovBox = new EsriRectangle(overview.box.left, overview.box.top, overview.box.width, overview.box.height);
      mapToOvRatioWd = ovBox.width / map.width;
      mapToOvRatioHt = ovBox.height / map.height;
    }
  }

  this.activate = function() {
    this.action.activate(this.element, this.postAction, this.continuousAction);
    this.isActive = true;
  }

  this.continuousAction = function(x, y) {
    if (! map || ! mapToOvRatioWd) self.update();
    var vb = map.viewBounds.offset(-x, -y);
    for (var i=0;i<map.mapSourceNames.length;i++) map.mapSources[map.mapSourceNames[i]].updateImages(vb);
    if (! EsriUtils.isIE) {
      var gc = map.graphics.gc;
      EsriUtils.setElementStyle(gc, "left:" + vb.left + "px; top:" + vb.top + "px;");
      gc.firstChild.setAttribute("transform", "translate(" + -vb.left + " " + -vb.top + ")");
    }
    if (overview && ! overview.showNoData) overview.update(ovBox.left + -(x * mapToOvRatioWd), ovBox.top + -(y * mapToOvRatioHt), ovBox.width, ovBox.height);
  }

  this.postAction = function(x, y) {
    if (x == 0 && y == 0) return;
    if (! map) self.update();
    var vb = (map.viewBounds = map.viewBounds.offset(-x, -y));

    if (! EsriUtils.isIE) {
      var gc = map.graphics.gc;
      EsriUtils.setElementStyle(gc, "left:" + vb.left + "px; top:" + vb.top + "px;");
      gc.firstChild.setAttribute("transform", "translate(" + -vb.left + " " + -vb.top + ")");
    }

    mapToOvRatioWd = mapToOvRatioHt = null;
    var bounds = map.bounds.offset(-x, -y);
    map.centerAt(bounds.center.x, bounds.center.y);
  }
}

function EsriMapPoint(id, toolName, isMarkerTool) {
	this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDrawPointAction(), isMarkerTool));
  var self = this;

  this.update = function() { self = this; }
	this.postAction = function(point) {
    self.update();
    var map = self.control;

    if (self.isMarker) map.graphics.drawPoint(point);
    else {
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
}

function EsriMapLine(id, toolName, isMarkerTool) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDrawLineAction(), isMarkerTool));
  var self = this;

  this.activate = function() {
    if (this.action) this.action.activate(this.element, this.postAction, null, this.control.graphics);
    this.isActive = true;
  }
  this.update = function() { self = this; }
  this.postAction = function(from, to) {
    if (from.x == to.x && from.y == to.y) return;

    self.update();
    var map = self.control;

    if (self.isMarker) map.graphics.drawLine(from, to,self.action.symbol);
    else {
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
}

function EsriMapPoly(id, toolName, isMarkerTool, isPolygon) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, ((isPolygon) ? new EsriDrawPolygonAction() : EsriDrawPolylineAction()), isMarkerTool));
  this.isPolygon = isPolygon;
  var self = this;

  this.activate = function() {
    if (this.action) this.action.activate(this.element, this.postAction, null, this.control.graphics);
    this.isActive = true;
  }
  this.update = function() { self = this; }
  this.postAction = function(points) {
    if (points.length <= 1) return;

    self.update();
    var map = self.control;

    if (self.isMarker) {
      if (self.isPolygon) map.graphics.drawPolygon(points,self.action.symbol);
      else map.graphics.drawPolyline(points,self.action.symbol);
    }
    else {
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
}

function EsriMapPolyline(id, toolName, isMarkerTool) { return new EsriMapPoly(id, toolName, isMarkerTool, false); }
function EsriMapPolygon(id, toolName, isMarkerTool) { return new EsriMapPoly(id, toolName, isMarkerTool, true); }

function EsriMapCircle(id, toolName, isMarkerTool) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDrawCircleAction(), isMarkerTool));
  var self = this;

  this.activate = function() {
    if (this.action) this.action.activate(this.element, this.postAction, null, this.control.graphics);
    this.isActive = true;
  }
  this.update = function() { self = this; }
  this.postAction = function(center, radius) {
    if (radius == 0) return;

    self.update();
    var map = self.control;

    if (self.isMarker) map.graphics.drawCircle(center, radius,self.action.symbol);
    else {
      if (self.showLoading) map.showLoading();
      center = center.offset(-map.viewBounds.left, -map.viewBounds.top);

      EsriUtils.addFormElement(map.formId, map.id, map.id);
      EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
      EsriUtils.addFormElement(map.formId, map.id + "_coords", center.x + ":" + center.y + ":" + radius);
      if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
      EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
    }
  }
}

function EsriMapOval(id, toolName, isMarkerTool) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDrawOvalAction(), isMarkerTool));
  var self = this;

  this.activate = function() {
    if (this.action) this.action.activate(this.element, this.postAction, null, this.control.graphics);
    this.isActive = true;
  }
  this.update = function() { self = this; }
  this.postAction = function(rect) {
    if (rect.width == 0 && rect.height == 0) return;

    self.update();
    var map = self.control;

    if (self.isMarker) map.graphics.drawOval(rect,self.action.symbol);
    else {
      if (self.showLoading) map.showLoading();
      rect = rect.offset(-map.viewBounds.left, -map.viewBounds.top);

      EsriUtils.addFormElement(map.formId, map.id, map.id);
      EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
      EsriUtils.addFormElement(map.formId, map.id + "_coords", rect.center.x + ":" + rect.center.y + ":" + rect.width + ":" + rect.height);
      if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
      EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
    }
  }
}

function EsriMapImage(id, toolName) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriDrawPointAction(), true));
  this.imageUrl = EsriControls.contextPath + "images/pixel.gif";
  this.imageWidth = this.imageHeight = 0;
  var self = this;

  this.update = function() { self = this; }
  this.postAction = function(point) {
    self.update();
    var map = self.control;
    map.graphics.drawImage(self.imageUrl, point.x - (self.imageWidth / 2), point.y - (self.imageHeight / 2), self.imageWidth, self.imageHeight);
  }
}

function EsriMapKeyNavigation(id, toolName, panSpeed) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriKeyInputAction()));
  var map;
  var KEY_PLUS = EsriUtils.isIE ? 187 : 61;
  var KEY_PLUS_NUM = 107;
  var KEY_MINUS = EsriUtils.isIE ? 189 : 109;
  var KEY_MINUS_NUM = 109;
  var KEY_UPPER_RIGHT = 33;
  var KEY_UPPER_LEFT = 36;
  var KEY_LOWER_RIGHT = 34;
  var KEY_LOWER_LEFT = 35;
  var keyCodes = [EsriUtils.KEY_ESCAPE, EsriUtils.KEY_RIGHT, EsriUtils.KEY_LEFT, EsriUtils.KEY_DOWN, EsriUtils.KEY_UP, KEY_PLUS, KEY_PLUS_NUM, KEY_MINUS, KEY_MINUS_NUM, KEY_UPPER_RIGHT, KEY_UPPER_LEFT, KEY_LOWER_RIGHT, KEY_LOWER_LEFT];
  var self = this;
  var xDiff = 0, yDiff = 0;
  var speed = (panSpeed) ? panSpeed : 5;
  var timeStep = 2500;
  var maxSpeed = 3;
  var sTime = null;

  this.update = function() {
    self = this;
    map = this.control;
  }

  this.activate = function() {
    this.action.activate(this.element, this.postAction, this.continuousAction);
    this.isActive = true;
  }

  this.continuousAction = function(keyCode) {
    if (keyCodes.indexOf(keyCode) == -1) return true;
    if (keyCode == EsriUtils.KEY_ESCAPE || keyCode == KEY_PLUS || keyCode == KEY_PLUS_NUM || keyCode == KEY_MINUS || keyCode == KEY_MINUS_NUM) return true;
    if (! map) self.update();

    if (! sTime) sTime = new Date().getTime();
    var delta = new Date().getTime() - sTime;
    var m = Math.min(Math.floor(delta / timeStep), maxSpeed);
    var s = speed + (speed * m);

    if (keyCode == EsriUtils.KEY_RIGHT) xDiff -= s;
    else if (keyCode == EsriUtils.KEY_LEFT) xDiff += s;
    else if (keyCode == EsriUtils.KEY_DOWN) yDiff -= s;
    else if (keyCode == EsriUtils.KEY_UP) yDiff += s;
    else if (keyCode == KEY_UPPER_RIGHT) { xDiff -= s; yDiff += s; }
    else if (keyCode == KEY_UPPER_LEFT) { xDiff += s; yDiff += s; }
    else if (keyCode == KEY_LOWER_RIGHT) { xDiff -= s; yDiff -= s; }
    else if (keyCode == KEY_LOWER_LEFT) { xDiff += s; yDiff -= s; }
    map.panTool.action.doDrag(xDiff, yDiff);
    return false;
  }

  this.postAction = function(keyCode) {
    if (keyCodes.indexOf(keyCode) == -1) return true;
    if (! map) self.update();
    if (keyCode == EsriUtils.KEY_ESCAPE && map.currentTool) map.currentTool.action.reactivate();
    else if (keyCode == KEY_PLUS || keyCode == KEY_PLUS_NUM) map.mouseWheelTool.postAction(1);
    else if (keyCode == KEY_MINUS || keyCode == KEY_MINUS_NUM) map.mouseWheelTool.postAction(-1);
    else if (keyCode == EsriUtils.KEY_RIGHT || keyCode == EsriUtils.KEY_LEFT || keyCode == EsriUtils.KEY_DOWN || keyCode == EsriUtils.KEY_UP || keyCode == KEY_UPPER_RIGHT || keyCode == KEY_UPPER_LEFT || keyCode == KEY_LOWER_RIGHT || keyCode == KEY_LOWER_LEFT) map.panTool.action.endDrag(xDiff, yDiff);
    xDiff = yDiff = 0;
    sTime = null;
    return false;
  }
}

function EsriMapMouseWheel(id, toolName) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, new EsriMouseWheelAction()));
  var self = this;
  var map;

  this.update = function() {
    self = this;
    map = this.control;
  }

  this.postAction = function(value) {
    if (! map) self.update();
    map.changeLevel(map.level + value);
  }
}

function EsriMapServerAction(id, toolName, func) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, null));
  this.isCommand = true;
  var func = func;
  var self = this;

  this.update = function() { self = this; }
  this.activate = function() {
    self.update();

    if (func) if (! func()) return;

    var map = self.control;
    if (self.showLoading) map.showLoading();

    EsriUtils.addFormElement(map.formId, this.id, this.id);
    EsriUtils.addFormElement(map.formId, this.id + "_value", this.id);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
    this.isActive = true;
  }
}

function EsriMapNavigator(id, container, mapId, left, top) {
  this.inheritsFrom(new EsriNavigator(id, container, true, panCallback, zoomCallback, left, top));
  this.speedStepDistance = 10;
  var self = this;
  var shiftX = shiftY = 0;
  var map = EsriControls.maps[mapId];
  var panToolAction = map.panTool.action;

  function panCallback(panPoint, dist) {
    if (dist == -1) {
      panToolAction.endDrag(shiftX, shiftY);
      shiftX = shiftY = 0;
    }
    else {
      shiftX -= panPoint.x * Math.ceil(dist / self.speedStepDistance);
      shiftY -= panPoint.y * Math.ceil(dist / self.speedStepDistance);
      panToolAction.doDrag(shiftX, shiftY);
    }
  }

  function zoomCallback(inORout) { map.changeLevel(map.level + inORout); }
}

function EsriMapSlider(id, container, mapId, numLevels, initLevel, left, top) {
  this.inheritsFrom(new EsriSlider(id, null, changeZoomLevel, left, top));
  this.numSegments = numLevels ? numLevels - 1 : numLevels;
  this.initValue = initLevel;
  this.isHorizontal = false;
  this.showTicks = true;
  this.roundValues = true;
  this.callContinuously = false;
  var self = this;

  function changeZoomLevel(value) { EsriControls.maps[mapId].changeLevel(value); }
  this.update = function(map) { self.setValue(map.level); }
  EsriControls.maps[mapId].addUpdateListener(id, this.update);
  if (container) this.init(container);
}