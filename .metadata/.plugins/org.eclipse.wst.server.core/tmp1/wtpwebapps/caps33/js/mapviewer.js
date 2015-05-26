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

var ieBuffer = 0;
var ieContentStyle = "left:0px;";
if(window.navigator.appName.toLowerCase().indexOf("microsoft")>=0) {
  ieBuffer = 3;
  ieContentStyle = "left: -" + ieBuffer + "px;";
}

var taskBox = null;
var formId = "mapForm";
var taskDetailsHeader;

var toolbarId = "toolbar";
var layoutSliderId = "layoutslider";
var headerId = "header";
var contentId = "content";
var pageId = "page";
var panelId = "panel";
var statusId = "statusDiv";

var mapMargin = 10;
var mapBorder = 1;
var resizeCounter = 1;
var scaleBar, northArrowImg;
var toc1, ov1, resultsToc;


function initLayout() {
  toc1 = EsriControls.tocs["toc1"];
  ov1 = EsriControls.overviews["ov1"];
  resultsToc = EsriControls.tocs["results"];

  loadTaskCenter();
  initSliders();
  resizeMap();

  EsriControls.addPostBackTagHandler("mapviewer-elements", mapViewerElementsHandler);
  resultsToc.addUpdateListener("resultsDivShowHide", resultsDivShowHide);
  
  if (ov1)
    ov1.isContinuousPan = true;

  if (toc1) {
    toc1.bounds.width = 300;
    toc1.bounds.height = 400;
  }

  closeTaskWindows();
  initNavAndSlider();
  initNorthArrow();
  window.onresize = handleResize;
  
  if(document.getElementById(editDivId)) {
    initEditor();
  }
  
  initIdentify();
  if (EsriUtils.isIE) menus_ie6fix();
}

function loadTaskCenter() {
  var cont = document.getElementById("taskCenterPanel");
  taskBox = new TaskBox(cont, formId + ":taskWindows");
  taskBox.windowForm = document.getElementById(formId);

  var ovToggle = document.getElementById("button_mapToolsTask_action_toggleOverview");
  if (ov1) {
    var overviewMapElt = document.getElementById("overview");
    EsriUtils.hideElement(overviewMapElt);

    if (ovToggle) {
      EsriUtils.showElement(ovToggle);
    }
    taskBox.overviewId = ov1.id;
  }
  else
    if (ovToggle)
      EsriUtils.hideElement(ovToggle);

  taskBox.addPanel(document.getElementById("resultsPanelContent"), Res.getString("Results"), false);
  if(toc1)
    taskBox.addPanel(document.getElementById("tocPanelContent"), Res.getString("Map Contents"), false, formId, toc1.bounds);
  taskBox.hidePanel("resultsPanelContent");
}

function togglePanel() {
  EsriUtils.toggleElement(document.getElementById(panelId));
  resizeMap();
}

function handleResize(e) {
  resizeCounter++;
  resizeLayout();
  setTimeout('throttleResize(' + resizeCounter + ')', 250);
}

function resizeMap() {
  var dimensions = resizeLayout();
  var map = EsriControls.maps['map1'];
  if (dimensions[0] != map.bounds.width || dimensions[1] != map.bounds.height)
    map.resize(dimensions[0], dimensions[1]);
}

function resizePanelContentLayout(sliderObj) {
  resizeMap();
}

function resizeLayout() {
  var hdr = document.getElementById(headerId);
  var layout = document.getElementById(pageId);
  var panel = document.getElementById(panelId);
  var content = document.getElementById(contentId);
  var slider = document.getElementById(layoutSliderId);

  var layoutBounds = EsriUtils.getElementPageBounds(layout);
  var panelBounds = EsriUtils.getElementPageBounds(panel);
  var sliderBounds = EsriUtils.getElementPageBounds(slider);
  var hdrBounds = EsriUtils.getElementPageBounds(hdr);
  var bounds = EsriUtils.getPageBounds();

  if(panel.style.display == "none")  //ie doesn't get 0 width when panel is collapsed
    panelBounds.width = 0;

  var bottomHeight = bounds.height - hdrBounds.height;
  //var contentWidth = bounds.width - (sliderBounds.width + sliderBounds.left) - ieBuffer;
  var contentWidth = bounds.width - (sliderBounds.width + panelBounds.width) - ieBuffer;
  var newContentH = ((bottomHeight > 0) ? bottomHeight : 0);
  var newContentW = ((contentWidth > 0) ? contentWidth : 0);
  var contentClass = EsriUtils.getStyleByClassName("#content");
  var newContentStyle = "position:relative; width:" + newContentW + "px; height: " + newContentH + "px; top:0px; " + ieContentStyle;
  var newLayoutStyle = "height: " + bounds.height + "px;";
  var newPanelStyle = "height: " + (bounds.height - hdrBounds.height) + "px;width:" + (bounds.width - newContentW - sliderBounds.width - ieBuffer) + "px;";
  var newSliderStyle = "height: " + (bounds.height - hdrBounds.height) + "px;";
  EsriUtils.setElementStyle(layout, newLayoutStyle);
  EsriUtils.setElementStyle(panel, newPanelStyle);
  EsriUtils.setElementStyle(slider, newSliderStyle);
  EsriUtils.setElementStyle(content, newContentStyle);
  return [newContentW, newContentH];
}

function throttleResize(val) {
  if(val != resizeCounter)
    return true;
  resizeMap();
  return true;
}

function setStatus(s) {
  document.getElementById(statusId).innerHTML = s + "<br/>" + document.getElementById(statusId).innerHTML;
}

function resultsDivShowHide(toc) {
  if (toc.nodes.length == 0)
    taskBox.hidePanel("resultsPanelContent");
  else
    taskBox.showPanel("resultsPanelContent");
}

function toggleWindow(id, mapId, config) {
  if (mapId && config) {
    if (EsriTask.loadTask(id, mapId, config) && taskWindowManager && taskWindowManager.windows["win_EsriTaskCell_" + id]) {
      taskWindowManager.windows["win_EsriTaskCell_" + id].toggleVisibility();
    }
  }
  else if (taskWindowManager && taskWindowManager.windows[id]) {
    taskWindowManager.windows[id].toggleVisibility();
  }
}

function closeTaskWindows() {
  var props = taskWindowManager.getProperties();
  for (var i=0;i<taskWindowManager.windowIds.length;i++) {
    var id = taskWindowManager.windowIds[i];
    if (props.indexOf(id) == -1) {
      var win = taskWindowManager.windows[id];
      win.center();
      win.hide();
    }
  }
}

function initNavAndSlider() {
  var map = EsriControls.maps["map1"];
  var mapNavigator = new EsriMapNavigator("mapNavigator", null, map.id);
  mapNavigator.image_navigator = "images/slider/directional_arrows_N.png";
  mapNavigator.image_size = 52;
  mapNavigator.image_map_zoomin_shape = 
  mapNavigator.image_map_zoomin_coords =
  mapNavigator.image_map_zoomout_shape = 
  mapNavigator.image_map_zoomout_coords = 
  mapNavigator.image_map_move_shape = 
  mapNavigator.image_map_move_coords = null;
  mapNavigator.init(document.getElementById("nav-container"));

  var mapSlider = new EsriMapSlider("mapSlider", null, map.id, map.numLevels, map.level);
  mapSlider.imagesDirectory = "images/slider/";
  mapSlider.v_bottom_width = 16;
  mapSlider.v_bottom_height = 17;
  mapSlider.v_top_width = 16;
  mapSlider.v_top_height = 17;    
  mapSlider.v_image_width = 16;
  mapSlider.v_image_height = 8;
  mapSlider.init(document.getElementById("slider-container"));
}

function initNorthArrow() {
  var northarrowDiv = document.getElementById("northarrow");
  if (northarrowDiv) {
    northArrowImg = northarrowDiv.appendChild(EsriUtils.createImage(document.getElementById(formId + ":northarrowHid").value, "100px", "100px"));
    northArrowImg.id = "northArrowImg";
  }
}

function mapViewerElementsHandler(xml, eventSources) {
  var northarrowTags = xml.getElementsByTagName("north-arrow-url");
  if (northArrowImg && northarrowTags.length > 0 && northarrowTags.item(0).hasChildNodes()) {
    var src = northarrowTags.item(0).firstChild.nodeValue;
    if (EsriUtils.isIE) {
      var img = EsriUtils.createImage(src, "100px", "100px");
      img.id = northArrowImg.id;
      northArrowImg.parentNode.replaceChild(img, northArrowImg);
      northArrowImg = img;
    }
    else
      northArrowImg.src = src;
  }
}

function requestCopyrightInfo() {
  var url = EsriUtils.getServerUrl(formId);
  var params = "formId=" + formId + "&mapId=map1&ajaxCommand=ajaxCommand&ajaxCommandBeanId=copyrightCommand&" + EsriUtils.buildRequestParams(formId);
  EsriUtils.sendAjaxRequest(url, params, false, handleCopyrightInfoRequest);
}

function handleCopyrightInfoRequest(xhr) {
  if(xhr != null && xhr.readyState == 4 && xhr.status == 200) {
    var resEls = EsriUtils.getXmlDocument(xhr).getElementsByTagName("resource");
    var contentContainer = document.createElement("div");
    contentContainer.className = "copyright-display";
    for(var i = 0; i < resEls.length; i++) {
      var resEl = resEls[i];
      var resMapName = EsriUtils.getXmlText(resEl.getElementsByTagName("map-name").item(0));
      var resAlias = EsriUtils.getXmlText(resEl.getElementsByTagName("alias").item(0));
      var layerEls = resEl.getElementsByTagName("layer");
      
      var resLabel = document.createElement("div");
      resLabel.className = "copyright-resource";
      resLabel.appendChild(document.createTextNode(resAlias));
      contentContainer.appendChild(resLabel);
      for(var j = 0; j < layerEls.length; j++) {
        var layerEl = layerEls[j];
        var layerName = EsriUtils.getXmlText(layerEl.getElementsByTagName("name").item(0));
        var layerId = EsriUtils.getXmlText(layerEl.getElementsByTagName("id").item(0));
        var layerCopyright = EsriUtils.getXmlText(layerEl.getElementsByTagName("copyright-text").item(0));
        var layerLabel = document.createElement("div");
        var copyrightLabel = document.createElement("div");
        layerLabel.className = "copyright-layer";
        layerLabel.appendChild(document.createTextNode(layerName));
        copyrightLabel.className = "copyright-text";
        copyrightLabel.appendChild(document.createTextNode(layerCopyright));
        contentContainer.appendChild(layerLabel);
        contentContainer.appendChild(copyrightLabel);
      }      
    }
    
    var map = EsriControls.maps["map1"];
    var cp = document.getElementById("copyright");
    var maptipTitle = document.createElement("div");
    var offsetLeft = cp.offsetLeft - (map.viewBounds.width - cp.offsetLeft);
    var offsetTop = cp.offsetTop - (map.viewBounds.height - cp.offsetTop);
      
    maptipTitle.innerHTML = document.getElementById("copyright-label").innerHTML;
    map.callOut.setContent({header: EsriUtils.getXmlText(maptipTitle).trim(), content: contentContainer, footer: ""});
    map.callOut.moveTo((offsetLeft + cp.offsetWidth/2), offsetTop);
    map.callOut.expand();
    map.callOut.show();
  }
}

function getDefaultMapTipTemplate(/* String */ details, /* String */ valDelim, /* String */ groupDelim) {
  var pairs = details.split(groupDelim);
  var temp = document.createElement("span");
  var table = document.createElement("table");  
  var tbody = document.createElement("tbody");
  for(i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split(valDelim);
    var key = pair[0];
    var val = pair[1];
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var td2 = document.createElement("td");
    td.appendChild(document.createTextNode(key));
    td2.appendChild(document.createTextNode(val));
    tr.appendChild(td);
    tr.appendChild(td2);
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  temp.appendChild(table);
  return temp.innerHTML; 
}

function esriToggleOverviewMap() {
  var overviewMapElt = document.getElementById("overview");
  EsriUtils.toggleElement(overviewMapElt);
  var ovToggle = document.getElementById("button_mapToolsTask_action_toggleOverview");
  if (overviewMapElt.style.display == "none") { // It's hidden, let's set the right graphic
    EsriUtils.setImageSrc(ovToggle, "images/show-overview-map.png")
    ovToggle.alt = "Show OverviewMap";
    ovToggle.title = "Show OverviewMap";
  } else {
    EsriUtils.setImageSrc(ovToggle, "images/hide-overview-map.png")
    ovToggle.alt = "Hide OverviewMap";
    ovToggle.title = "Hide OverviewMap"; 
  }
}

// Editing Specific JavaScript Start
/* mapcontrol */
var mapId ="map1";

/* edit window */
var editDivId = "esri_editDiv";
var selectEditLayerId = "selectEditLayerId";
var editorWindowsRefreshId = "editorWindowsRefreshId";

/* edit version window */
var editVersionDivId = "esri_editVersionDiv";
var selectEditVersionId = formId+":editVersionSubview:selectEditVersionId";

/* settings window */
var settingsDivId = "esri_editSettingsDiv";
var editSnappingRulesDiv = "editSnappingRulesDiv";
var snapTolId = "editconfig_snapTolerance";
var snapEnabledId = "editconfig_snapEnabled";
var snapColorId = "editconfig_snapTipsColor";

/* xy window */
var xyDivId = "esri_editXYDiv";
// Editing Specific JavaScript End

// Task Menu
function menus_ie6fix() {
  var css_rule;
  var ie6Selector;

  for (var i = 0; i < document.styleSheets.length; i++) {
    for (var j = 0; j < document.styleSheets[i].rules.length ; j++) {
      css_rule = document.styleSheets[i].rules[j];
      if (css_rule.selectorText.indexOf("LI:hover") != -1) {
         ie6Selector = css_rule.selectorText.replace(/LI:hover/gi, "LI.iehover");
         document.styleSheets[i].addRule(ie6Selector , css_rule.style.cssText);
      }
    }
  }

  var taskMenu = document.getElementById("task-menu");
  if (taskMenu) {
    var getElm = taskMenu.getElementsByTagName("UL").item(0).getElementsByTagName("LI");
    for (var i=0; i<getElm.length; i++) {
      getElm.item(i).onmouseover=function() {
        this.className += " iehover";
      }
      getElm.item(i).onmouseout=function() {
        this.className = this.className.replace(new RegExp(" iehover\\b"), "");
      }
    }
  }
}
// End Task Menu
