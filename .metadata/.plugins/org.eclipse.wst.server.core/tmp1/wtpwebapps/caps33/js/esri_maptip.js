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
function EsriMapTip(mapId) {
  var lastClicked = null;
  var mapTipFeatures = null;
  var map = null;
  var blankImage;
  var invisible;
  var mapTipElements = [];
  var mapTipsVisibility =[];
  var self = this;
  var mapTipTimer = null;
  var calloutNode = {};
  var eventsEnabled = true; 
  var prevHighlight = true;
  
  this.init = function(mapId) {
    map = EsriControls.maps[mapId];
    map.addUpdateListener("updateMapTips", this.updateMapTips);
    mapTipFeatures = new Array();
    
    map.callOut.onDismiss = function() {
      if(calloutNode.feature) {
        if(self.onFeatureBlur)
          self.onFeatureBlur(calloutNode.feature);
        unHighlightFeatures(calloutNode.feature);
        clearTimeout(mapTipTimer);
        calloutNode.sourceElement.onmouseover = handleFeatureMouseOver;
        mapTipTimer = null;
      }
      map.callOut.hide();
    }
    
    blankImage = new Image();
    blankImage.src = EsriControls.contextPath + "images/pixel.png";
    blankImage.width = blankImage.height = 32;
 
    invisible = {};
    invisible.color = "red";
    invisible.transparency = 0.0;
    invisible.width = 10;
  }

  this.updateMapTips = function() {
    if(!map.enableMapTips) return;
    var g = map.graphics;
    for(var i=0, il=mapTipElements.length; i<il; i++) g.remove(mapTipElements[i]);
    mapTipElements = [];
    var fId = map.formId;
    var url = EsriUtils.getServerUrl(fId);
    var params = "getMapTipInfo=getMapTipInfo&formId=" + fId + "&mapId=" + map.id + "&" + EsriUtils.buildRequestParams(fId);
    EsriUtils.sendAjaxRequest(url, params, false, mapTipHandler);
  }
  
  this.setEventsEnabled = function(bool) {
    eventsEnabled = bool;
  }
  
  this.isEventsEnabled = function() {
    return eventsEnabled;
  }

  function handleFeatureClick(e) {
    if(eventsEnabled===false) return;
    EsriUtils.stopEvent(e);
    var el = EsriUtils.getEventSource(e);
    el.onmousemove = null;
    if(mapTipFeatures[el.name].isCallout) {
      if(!map.callOut.isVisible())
        lastClicked = null;
      if(lastClicked == el)
        lastClicked = null;
      else {
        var offsets = getCalloutOffsets();
        calloutNode.pt = EsriUtils.getXY(e).offset(offsets.top, offsets.left);
        lastClicked = el;
      }
      map.callOut.expand();
      calloutNode.sourceElement = el;
      el.onmouseout = null;
      el.onmouseover=null;
      if(self.onFeatureBlur)
        self.onFeatureBlur(calloutNode.feature);
    }
  }

  function toLiteral(a) { var o = {}; for(var i = 0; i < a.length; i++){ o[a[i]]=''; } return o; }
  
  function getElementIndex(id) {
    for(var i=0,i1=mapTipElements.length;i<i1;i++)
      if(mapTipElements[i].name==id) return i;
    return -1;
  }
  
  function showMapTip(g,id) {
    if(mapTipElements[getElementIndex(id)]){
      for(var i=0,i1=mapTipElements.length;i<i1;i++)
        if(mapTipElements[i].name==id) EsriUtils.showElement(mapTipElements[i]);
    }
    else {
      var f=mapTipFeatures[id];
      var farray = [];
      farray.push(f);
      if(f.type=="Polygon")
        drawPolygons(g,farray);
      else if(f.type=="Polyline")
        drawPolylines(g,farray);
      else if(f.type=="Point")
        drawPoints(g,farray);
     }
  }
  
  function hideMapTip(g,id) {
    for(var i=0,i1=mapTipElements.length;i<i1;i++)
      if(mapTipElements[i].name==id) EsriUtils.hideElement(mapTipElements[i]);
  }
  
  this.toggleFeaturesByLevel = function (ids,show,level) {
    var oIds = toLiteral(ids);
    var g = map.graphics;
    var visObj;
    if(show) {
      if(level==2) { //child
        visObj = mapTipsVisibility[ids];
        visObj.lastLevel = level; //update
        visObj.childChecked = show;
        if(visObj.layerChecked !=false) {
          visObj.visibility = show;
          mapTipsVisibility[ids] = visObj;
          showMapTip(g,ids);
        }
        mapTipsVisibility[ids] = visObj;
      }
      else { // layer||root
        for(i = 0,i1=ids.length;i<i1;i++) {
          visObj = mapTipsVisibility[ids[i]];
          visObj.lastLevel = level;
          if(level==0) visObj.rootChecked = show;
          else
            visObj.layerChecked = show;
          
          if(visObj.childChecked!=false && visObj.layerChecked!=false && visObj.rootChecked!=false) {
            visObj.visibility = show;
            showMapTip(g,ids[i]);
            mapTipsVisibility[ids] = visObj;
          }
          mapTipsVisibility[ids[i]]=visObj;
        }
      }
    }//true
    else {
      if(level == 2) { //child
        hideMapTip(g,ids);
        if(mapTipsVisibility[ids]== undefined) visObj = {};
        else visObj = mapTipsVisibility[ids];
        visObj.lastLevel = level;//this will give the parent|child
        visObj.childChecked = show;// this will give the visibility
        visObj.visibility = show;
        mapTipsVisibility[ids]=visObj;
      }
      else { // layer||root
        for(i = 0,i1=ids.length;i<i1;i++) {
          hideMapTip(g,ids[i]);
          if(mapTipsVisibility[ids[i]]== undefined) visObj = {};
          else visObj = mapTipsVisibility[ids[i]];
          visObj.lastLevel = level;//this will give the parent|child
          if(level==0) visObj.rootChecked = show;
          else
            visObj.layerChecked = show;
          visObj.visibility = show;
          mapTipsVisibility[ids[i]]=visObj;
        }
      }
    }// false
  }

  this.highlightFeaturesById = function(id) {
    if(mapTipsVisibility[id] && mapTipsVisibility[id].visibility === true) 
      if(mapTipFeatures[id]) highlightFeatures(mapTipFeatures[id]);
  }

  this.unHighlightFeaturesById = function(id) {
    if(mapTipsVisibility[id] && mapTipsVisibility[id].visibility === true)
      if(mapTipFeatures[id]) unHighlightFeatures(mapTipFeatures[id]);
  }
  
  this.toggleFeatures = function(ids, show) {
    var oIds = toLiteral(ids);
    var display = "none";
    var g = map.graphics;
    if(show) display = "block";
    for(var i=0, il=mapTipElements.length; i<il; i++)
      if(mapTipElements[i].name in oIds)
        mapTipElements[i].style.display = display;
  }

  function highlightFeatures(feature) {
    var g = map.graphics;
    var gsymbol;
    for(var i=0, il=mapTipElements.length; i<il; i++) {
      if(feature.symbol) {
        if(mapTipElements[i].name == feature.id) { 
          gsymbol = updateFeatureSymbol(mapTipElements[i],feature,true);
          g.updateSymbol(mapTipElements[i], gsymbol);
        }
      }
    }
  }

  function unHighlightFeatures(feature) {
    var g = map.graphics;
    var gsymbol;
    for(var i=0, il=mapTipElements.length; i<il; i++) {
      if(feature.symbol) {
        if(mapTipElements[i].name == feature.id) {
          gsymbol = updateFeatureSymbol(mapTipElements[i],feature,false);
          g.updateSymbol(mapTipElements[i], gsymbol);
        }
      }
    }
  }

  function updateFeatureSymbol(element,feature,isHighlight) {
    var gsymbol = new EsriGraphicsSymbol();
    if(isHighlight) {
      gsymbol.fillColor=feature.symbol.highlightFillColor;
      gsymbol.fillOpacity=feature.symbol.highlightFillOpacity;
      gsymbol.lineWidth=feature.symbol.highlightLineWidth;
      gsymbol.lineColor=feature.symbol.highlightLineColor;
      gsymbol.lineOpacity=feature.symbol.highlightLineOpacity;
    }
    else {
      gsymbol.fillColor=feature.symbol.fillColor;
      gsymbol.fillOpacity=feature.symbol.fillOpacity;
      gsymbol.lineWidth=feature.symbol.lineWidth;
      gsymbol.lineColor=feature.symbol.lineColor;
      gsymbol.lineOpacity=feature.symbol.lineOpacity;
    }
    if(feature.symbol.highlightMarker || feature.symbol.marker) {
      if(prevHighlight != isHighlight) 
        updateMarkerOffsets(element,feature,gsymbol,isHighlight);
      prevHighlight = isHighlight;
    }
    return gsymbol;
  }

  function updateMarkerOffsets(element,feature,gsymbol,isHighlight) {
    var oldImg,img,oldOffsets,offsets;
    oldImg = new Image();
    img = new Image();
    if(isHighlight) {
      oldImg.src = feature.symbol.marker;
      img.src = feature.symbol.highlightMarker;
    }
    else {
      oldImg.src = feature.symbol.highlightMarker;
      img.src = feature.symbol.marker;
    }
    oldImg = getMarkerSize(oldImg);
    oldOffsets = getMarkerOffsets(oldImg);
    img = getMarkerSize(img);
    offsets = getMarkerOffsets(img);
    offsets.top=  oldOffsets.top-offsets.top;
    offsets.left= oldOffsets.left-offsets.left;
    gsymbol.src = img.src;
    gsymbol.height = img.height;
    gsymbol.width = img.width;
    if(EsriUtils.isIE) {
      gsymbol.top = parseInt(EsriUtils.getStyleValue(element.style.top)) + offsets.left;
      gsymbol.left = parseInt(EsriUtils.getStyleValue(element.style.left)) + offsets.top;
    }
    else {
      gsymbol.top = parseInt(element.getAttribute("x"))+ offsets.top;
      gsymbol.left = parseInt(element.getAttribute("y"))+ offsets.left;
      }
  }

  function handleFeatureMouseOver(e) {
    if(eventsEnabled===false) return;
    EsriUtils.stopEvent(e);
    var el = EsriUtils.getEventSource(e);
      el.onmouseout = handleFeatureMouseOut;
    if(mapTipFeatures[el.name].isCallout) { 
      el.onmousemove = handleMouseMoveOverMaptip;
      if(calloutNode.sourceElement) {
        calloutNode.sourceElement.onmouseover = handleFeatureMouseOver;
      }
      calloutNode.sourceElement = el;
      if(!map.callOut.isVisible()) {
       calloutNode.feature = {};
      }
      if(mapTipFeatures[el.name] == calloutNode.feature) {
        if(!map.callOut._collapsed) {
          el.onmouseout = null;
          calloutNode.feature = mapTipFeatures[el.name];
          mapTipTimer = window.setTimeout(map.mapTip.showCallOut,500);
        }
        if(!map.callOut.isVisible())
          map.callOut.collapse();
      }
      else {
        if(calloutNode.feature) {
          if(!map.callOut.isCollapsed())
            unHighlightFeatures(calloutNode.feature);
          if(self.onFeatureBlur)
            self.onFeatureBlur(calloutNode.feature);
        }
        map.callOut.hide();
        map.callOut.collapse();
        calloutNode.feature = mapTipFeatures[el.name];
        mapTipTimer = window.setTimeout(map.mapTip.showCallOut, 500);
      }
    }
    highlightFeatures(mapTipFeatures[el.name]);
    if(self.onFeatureFocus)
      self.onFeatureFocus(mapTipFeatures[el.name]);
  }
  
  function getCalloutOffsets() {
    var offsets = {top:0,left:0};
    if (map.callOut.anchorPosition == 'upperleft') {
      offsets.top = -1;
      offsets.left = -1;
    }
    else if (map.callOut.anchorPosition == 'upperright') {
      offsets.top = -1;
      offsets.left = 1;
    }
    else if (map.callOut.anchorPosition == 'lowerleft') {
      offsets.top = 1;
      offsets.left = -1;
    }
    else if (map.callOut.anchorPosition == 'lowerright'){
      offsets.top = 1;
      offsets.left = 1;
    }
    return offsets;
  }

  function handleMouseMoveOverMaptip(e) {
    if(eventsEnabled===false) return;
    var el = EsriUtils.getEventSource(e);
    var offsets = getCalloutOffsets();
    calloutNode.pt = EsriUtils.getXY(e).offset(offsets.left, offsets.top);
    clearTimeout(mapTipTimer);
    mapTipTimer = null;
    mapTipTimer = window.setTimeout(map.mapTip.showCallOut,100);
  }

  function handleFeatureMouseOut(e) {
    if(eventsEnabled===false) return;
    EsriUtils.stopEvent(e);
    var el = EsriUtils.getEventSource(e);
    el.onmousemove = null;
    el.onmouseout = null;
    el.onmouseover = handleFeatureMouseOver;
    if(mapTipFeatures[el.name].isCallout) {
      clearTimeout(mapTipTimer);
      mapTipTimer = null;
      window.setTimeout(map.mapTip.hideCallout,100);
    }
    if(self.onFeatureBlur)
      self.onFeatureBlur(mapTipFeatures[el.name]);
    unHighlightFeatures(mapTipFeatures[el.name]);
  }

  this.showCallOut = function() {
    var mapBounds = EsriUtils.getElementPageBounds(map.callOut._container);
    var el = calloutNode.sourceElement;
    var feature = calloutNode.feature;
    if(calloutNode.pt) {
    map.callOut.moveTo(calloutNode.pt.x - mapBounds.left, calloutNode.pt.y - mapBounds.top);
    map.callOut.setContent({header: feature.header, content: feature.content,footer: feature.footer  });
    map.callOut.show();
    }
  }

  this.hideCallout = function() {
    map.callOut.hide();
  }

  function mapTipHandler(xh) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);
      var layerList = xml.getElementsByTagName("layer");
      if(layerList.length > 0) {
        var g = map.graphics;
        if(!g) return;
        var pgons = new Array();
        var plines = new Array();
        var points = new Array();
        for (var i=0, il=layerList.length; i<il; i++) {
          var layer = layerList.item(i);
          var callout,text,header, body,footer;
          var isDefaultCallout = false;
          if(layer.getElementsByTagName("infowindow-cdata-content").length > 0) {
            callout=layer.getElementsByTagName("infowindow-cdata-content").item(0);
            text = callout.childNodes[0].nodeValue;
            if(text.trim()=="default") isDefaultCallout = true;
          }//callout present
          var symEl = null;
          //storing the symbol information of the layer
          if(layer.getElementsByTagName("symbol").length > 0) {
            symEl = layer.getElementsByTagName("symbol").item(0);
          }
          var featureList  = layer.getElementsByTagName("feature");
          if(featureList.length > 0) {
            for(var j=0, jl=featureList.length; j<jl; j++) {
              var featureNode = featureList[j];
              var feature={}; // object for storing the feature information for maptip rendering
              feature.isCallout = false;
              if(layer.getElementsByTagName("infowindow-cdata-content").length > 0) {
                var calloutContent, attributes;
                if(featureNode.getElementsByTagName("attributes").length > 0) {
                  attributes = featureNode.getElementsByTagName("attributes").item(0);
                  if(attributes.getElementsByTagName("attribute").length > 0) {
                    feature.isCallout = true;
                    var attributesArray = getAttributesAsArray(attributes);
                    if(isDefaultCallout) calloutContent = map.mapTip.transform(attributesArray,text);
                    else {
                      var template= {};
                      template.templateString = text;
                      calloutContent = map.mapTip.transform(attributesArray,template);
                    }
                    feature.header = calloutContent.header;
                    feature.content = calloutContent.content;
                    feature.footer = calloutContent.footer;
                  }
                }
              }//when callout is present apply transform
              //symbol
              if(symEl!=null) feature.symbol = {};
              feature.id = featureNode.getAttribute("id");
              // geometry of each feature
              var geometry =featureNode.getElementsByTagName("geometry").item(0);
              feature.type = geometry.getAttribute("type");
              if(feature.type == "Polyline") {
                if(feature.symbol) {
                  if(symEl.getElementsByTagName("line-color").length > 0)
                  feature.symbol.lineColor = getColorString(EsriUtils.getXmlText(symEl.getElementsByTagName("line-color").item(0)));
                  if(symEl.getElementsByTagName("line-opacity").length > 0)
                  feature.symbol.lineOpacity = parseFloat(EsriUtils.getXmlText(symEl.getElementsByTagName("line-opacity").item(0)));
                  if(symEl.getElementsByTagName("line-width").length > 0)
                  feature.symbol.lineWidth = parseInt(EsriUtils.getXmlText(symEl.getElementsByTagName("line-width").item(0)));
                  if(symEl.getElementsByTagName("highlight-line-color").length > 0)
                  feature.symbol.highlightLineColor = getColorString(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-line-color").item(0)));
                  if(symEl.getElementsByTagName("highlight-line-opacity").length > 0)
                  feature.symbol.highlightLineOpacity = parseFloat(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-line-opacity").item(0)));
                  if(symEl.getElementsByTagName("highlight-width").length > 0)
                  feature.symbol.highlightLineWidth = parseInt(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-width").item(0)));
                }
                feature.geometry = getPolylinePointsFromXml(geometry);
                plines.push(feature);
              }
              else if(feature.type == "Polygon"){
                if(feature.symbol) {
                  if(symEl.getElementsByTagName("line-color").length > 0)
                  feature.symbol.lineColor = getColorString(EsriUtils.getXmlText(symEl.getElementsByTagName("line-color").item(0)));
                  if(symEl.getElementsByTagName("line-opacity").length > 0)
                  feature.symbol.lineOpacity = parseFloat(EsriUtils.getXmlText(symEl.getElementsByTagName("line-opacity").item(0)));
                  if(symEl.getElementsByTagName("line-width").length > 0)
                  feature.symbol.lineWidth = parseInt(EsriUtils.getXmlText(symEl.getElementsByTagName("line-width").item(0)));
                  feature.symbol.fillColor = getColorString(EsriUtils.getXmlText(symEl.getElementsByTagName("fill-color").item(0)));
                  feature.symbol.fillOpacity = parseFloat(EsriUtils.getXmlText(symEl.getElementsByTagName("fill-opacity").item(0)));
                  if(symEl.getElementsByTagName("highlight-line-color").length > 0)
                  feature.symbol.highlightLineColor = getColorString(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-line-color").item(0)));
                  if(symEl.getElementsByTagName("highlight-line-opacity").length > 0)
                  feature.symbol.highlightLineOpacity = parseFloat(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-line-opacity").item(0)));
                  if(symEl.getElementsByTagName("highlight-width").length > 0)
                  feature.symbol.highlightLineWidth = parseInt(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-width").item(0)));
                  if(symEl.getElementsByTagName("highlight-fill-color").length > 0)
                  feature.symbol.highlightFillColor = getColorString(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-fill-color").item(0)));
                  if(symEl.getElementsByTagName("highlight-fill-opacity").length > 0)
                  feature.symbol.highlightFillOpacity = parseFloat(EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-fill-opacity").item(0)));
                }
                feature.geometry = getPolygonPointsFromXml(geometry);
                pgons.push(feature);
              }
              else if(feature.type == "Point") {
                if(feature.symbol) {
                  feature.symbol.marker = EsriUtils.getXmlText(symEl.getElementsByTagName("marker").item(0));
                  if(symEl.getElementsByTagName("highlight-marker").length > 0)
                  feature.symbol.highlightMarker = EsriUtils.getXmlText(symEl.getElementsByTagName("highlight-marker").item(0));
                }
                feature.geometry = getPointFromXml(geometry);
                points.push(feature);
              }
              mapTipFeatures[feature.id] = feature; // adding to features array
            }//for loop for features in every layer
          }//if features > 0
        }//for loop for layerList
        drawPolygons(g, pgons);
        drawPolylines(g, plines);
        drawPoints(g, points);
      }//if layerlist > 0
    }
  }
 
  function drawPoints(g, features) {
    for (var i = 0; i < features.length; i++) {
      var f = features[i];
      var img;
      var imgSrc;
      if(f.symbol) {
        img = new Image();
        img.src = f.symbol.marker;
      }
      else {
        img = blankImage;
        img.height=img.width=16;
        offsets.top = img.height/2
        offsets.left = img.width/2;
      }
      if(!mapTipsVisibility[f.id]) {
        mapTipsVisibility[f.id]={visibility:true};
      }
      if(mapTipsVisibility[f.id].visibility) {
        img = getMarkerSize(img);            
        offsets = getMarkerOffsets(img);
        var el = g.drawImage(img.src,(f.geometry.x - offsets.top),(f.geometry.y - offsets.left), img.width, img.height);
        el.name = f.id;
        setEventHandlers(el, f);
        mapTipsVisibility[f.id].visibility = true;
        mapTipElements.push(el);
      }
      else {
        mapTipsVisibility[f.id].visibility = false;
      }
    }
  }
  
  function getMarkerSize(img) {
    var src = img.src;
    var anchor;
    var size = (src.substring(src.lastIndexOf("-")+1,src.indexOf(".png"))).split("x");
    img.height = parseInt(size[0]);
    img.width = parseInt(size[1]);
    return img;    
  }
  
  function getMarkerOffsets(img) {
    var src = img.src;
    var anchor;
    var offsets = {top:img.height/2,left:img.width/2};
    if(src.indexOf("-tl-") > -1) {
      offsets.top  = 0;
      offsets.left = 0;
    }
    else if(src.indexOf("-tr-") > -1) {
      offsets.top = img.height;
      offsets.left = 0;
    }
    else if(src.indexOf("-bl-") > -1) {
      offsets.top = 0;
      offsets.left = img.width;
    }
    else if(src.indexOf("-br-") > -1) {
      offsets.top = img.height;
      offsets.left = img.width;
    }
    else if(src.indexOf("-b-") > -1) {
      offsets.left = img.width;
    }
    else if(src.indexOf("-t-") > -1) {
      offsets.left = 0;
    }
    else if(src.indexOf("-l-") > -1) {
      offsets.top = 0;
    }
    else if(src.indexOf("-r-") > -1) {
      offsets.top = img.height;
    }
    return offsets;
  }

  function drawPolylines(g, features) {
    for (var i = 0; i < features.length; i++) {
      var f = features[i];
      var gsymbol = new EsriGraphicsSymbol();
      if(f.symbol) {
        gsymbol.lineColor = f.symbol.lineColor;
        gsymbol.lineOpacity = f.symbol.lineOpacity;
        gsymbol.lineWidth = f.symbol.lineWidth;
      }
      else {
        gsymbol.lineColor = invisible.color;
        gsymbol.lineOpacity = invisible.transparency;
        gsymbol.lineWidth = invisible.width;
      }
      if(!mapTipsVisibility[f.id]) mapTipsVisibility[f.id]={visibility:true};
      if(mapTipsVisibility[f.id].visibility) {      
          for (var j = 0; j < f.geometry.length; j++) {
          var el = g.drawPolyline(f.geometry[j],gsymbol);
          el.name = f.id;
          setEventHandlers(el, f);
          mapTipElements.push(el);
          mapTipsVisibility[f.id].visibility = true;
        }
      }
      else
      mapTipsVisibility[f.id].visibility = false;
    }
  }

  function drawPolygons(g, features) {
    for (var i = 0; i < features.length; i++) {
      var f = features[i];
      var gsymbol = new EsriGraphicsSymbol();
      if(f.symbol) {
        gsymbol.lineColor = f.symbol.lineColor;
        gsymbol.lineOpacity = f.symbol.lineOpacity
        gsymbol.lineWidth = f.symbol.lineWidth
        gsymbol.fillColor = f.symbol.fillColor;
        gsymbol.fillOpacity = f.symbol.fillOpacity
      }
      else {
        gsymbol.lineColor = g.fillColor = invisible.color;
        gsymbol.lineOpacity = g.fillOpacity = invisible.transparency;
        gsymbol.lineWidth = invisible.width;
      }
      if(!mapTipsVisibility[f.id]) mapTipsVisibility[f.id]={visibility:true};
      if(mapTipsVisibility[f.id].visibility) {      
        for (var j = 0; j < f.geometry.length; j++) {
          var el = g.drawPolygon(f.geometry[j],gsymbol);
          el.name = f.id;
          setEventHandlers(el, f);
          mapTipElements.push(el);
        }
        mapTipsVisibility[f.id].visibility = true;
      }
      else
       mapTipsVisibility[f.id].visibility = false;
      
    }
  }

  function getColorString(c) {
    if(c && c.length > 0 && c != "")
      return c.indexOf(",") > -1 ? "rgb(" + c + ")" : c;
    return null;
  }

  function setEventHandlers(el, feature) {
    el.onmouseover = handleFeatureMouseOver;
    if(feature.content) {
      el.onclick = handleFeatureClick;
    }
  }

  function getPointFromXml(node) {
    var pointEl = node.getElementsByTagName("point").item(0);
    return new EsriPoint(parseInt(pointEl.getAttribute("x")) + map.viewBounds.left, parseInt(pointEl.getAttribute("y")) + map.viewBounds.top);
  }

  function getPolylinePointsFromXml(node) {
    var paths = new Array();
    var pathsEl = node.getElementsByTagName("path");
    var ol = map.viewBounds.left;
    var ot = map.viewBounds.top;
    var path, pointELs, pointEL;
    for(var i = 0; i < pathsEl.length; i++) {
      pointEls = pathsEl[i].getElementsByTagName("point");
      path =  new Array(pointEls.length);
      for(var j = 0; j < pointEls.length; j++) {
        pointEl = pointEls[j];
        path[j] = new EsriPoint(parseInt(pointEl.getAttribute("x")) + ol, parseInt(pointEl.getAttribute("y")) + ot);
      }
      paths[i] = path;
    }
    return paths;
  }

  function getPolygonPointsFromXml(node) {
    var rings = new Array();
    var ringsEl = node.getElementsByTagName("ring");
    var ol = map.viewBounds.left;
    var ot = map.viewBounds.top;
    var pointEl;
    for(var p = 0; p < ringsEl.length; p++) {
      var pointEls = ringsEl[p].getElementsByTagName("point");
      var ring = new Array(pointEls.length);
      for(var q = 0; q < pointEls.length; q++) {
        pointEl = pointEls[q];
        ring[q] = new EsriPoint(parseFloat(pointEl.getAttribute("x")) + ol, parseFloat(pointEl.getAttribute("y")) + ot);
      }
      rings.push(ring);
    }
    return rings;
  }
  function getAttributesAsArray(el) {  //pass <attributes><attribute/></attributes>
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
  
  //transform(attributeList,"default"|{templateString,[startToken][endToken]}) 
  this.transform = function(attributeList,template) {
    var calloutContent = {header:"",content:"",footer:""};
    if(template.templateString == undefined) 
      calloutContent = defaultTransform(attributeList);
    else {
      var text = "<?xml version='1.0' encoding='UTF-8'?>" + "<root>" + template.templateString + "</root>";
      var xml = EsriUtils.stringToXml(text);
      if(template.startToken == undefined) template.startToken = "\\${";
      if(template.endToken == undefined) template.endToken = "}";
      if(xml.getElementsByTagName("header").length > 0) {
        template.templateString=text.substring(text.indexOf("<header>"),text.indexOf("</header>") + "</header>".length);
        calloutContent.header = customTransform(attributeList,template);
      }
      if(xml.getElementsByTagName("body").length > 0) {
        template.templateString=text.substring(text.indexOf("<body>"),text.indexOf("</body>") + "</body>".length);
        calloutContent.content = customTransform(attributeList,template);
      }
      if(xml.getElementsByTagName("footer").length > 0) {
        template.templateString=text.substring(text.indexOf("<footer>"),text.indexOf("</footer>") + "</footer>".length);
        calloutContent.footer = customTransform(attributeList,template);
      }
    }
    return calloutContent;
  }
  
  function defaultTransform(attributeList) {
    var attribute, name, value, regex;
    var fbody = [];
    var ffooter = "";
    var calloutContent = {header:"",content:"",footer:""};
    var table = document.createElement("table");
    table.className = "default-template";
    var tbody = document.createElement("tbody");
    for(var key in attributeList) {
      if(key == "inheritsFrom" || key =="indexOf") continue;
      name = key;
      value = attributeList[key];
      if(calloutContent.header == "") calloutContent.header = value; 
      var tdKey = document.createElement("td");
      var tdValue = document.createElement("td");
      var tr = document.createElement("tr");
      tdKey.className = "key-cell";
      tdValue.className = "value-cell";
      
      tdKey.appendChild(document.createTextNode(name));
      tdValue.appendChild(document.createTextNode(value));
      tr.appendChild(tdKey);
      tr.appendChild(tdValue);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    var contentDiv = document.createElement("div");
    contentDiv.appendChild(table);
    calloutContent.content = contentDiv.innerHTML;
    calloutContent.footer  = ffooter;
    return calloutContent;
  }

  function customTransform(attributeList,template) {
    var attribute, name, value, regex;
    var text = template.templateString;
    for(var key in attributeList) {
      if(key == "inheritsFrom" || key =="indexOf") continue;
      name = key;
      value = attributeList[key];
      regex = new RegExp(template.startToken + name + template.endToken, "g");
      if(text!=null)
        text = text.replace(regex, value);
    }
    return text;
  }

  // callback functions
  this.onFeatureFocus = null; //function(feature) { }
  this.onFeatureBlur = null; //function(feature) { }
  if(mapId)
    this.init(mapId);

}
