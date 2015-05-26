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

function TaskBox(container, windowMgrField) {
  var self = this;
  this.container = container;
  this.expandImg = "images/window/expand.gif";
  this.collapseImg = "images/window/collapse.gif";
  this.popImg = "images/window/pop.gif";
  this.dockImg = "images/window/dock.gif";

  this.contentIds = new Array();
  this.contentBounds = new Array();
  this.titles =  new Array();
  this.windows = new EsriWindowManager(container.id + "_taskboxWindows", windowMgrField);
  this.windowForm = null;
  this.overviewId = null;

  container.style.overflow = "auto";

  this.closePanels = function() {
    for(var i = 0; i < this.contentIds.length; i++) {
      var id = this.contentIds[i];
      EsriUtils.hideElement(document.getElementById(id));
    }
  }

  this.togglePanel = function(contentId) {
    var content = document.getElementById(contentId);
    EsriUtils.toggleElement(content);
    updateOverviewBox();
    var toggle = document.getElementById(this.getPanelHeaderToggleId(contentId));
    if(content.style.display == "none")
      toggle.src = this.expandImg;
    else
      toggle.src = this.collapseImg;
  }

  this.showPanel = function(contentId) {
    EsriUtils.showElement(document.getElementById(contentId));
    updateOverviewBox();
    var toggle = document.getElementById(this.getPanelHeaderToggleId(contentId));
    if(toggle)
      toggle.src = this.collapseImg;
  }

  this.hidePanel = function(contentId) {
    EsriUtils.hideElement(document.getElementById(contentId));
    updateOverviewBox();
    var toggle = document.getElementById(this.getPanelHeaderToggleId(contentId));
    if(toggle)
      toggle.src = this.expandImg;
  }

  this.getPanelBaseDivId = function(contentId) {
    return contentId + "_baseDiv";
  }

  this.getPanelWindowId = function(contentId) {
    return contentId + "_window";
  }

  this.getPanelPageElementId = function(contentId) {
    return contentId + "_pageElement";
  }

  this.getPanelHeaderLabelId = function(contentId) {
    return contentId + "_headerLbl";
  }

  this.getPanelHeaderToggleId = function(contentId) {
    return contentId + "_headerTgl";
  }

  this.getPanelHeaderDockId = function(contentId) {
    return contentId + "_headerDock";
  }

  this.getPanelHeaderDivId = function(contentId) {
    return contentId + "_headerDiv";
  }

  this.getContentDivId = function(divId) {
    return divId.substr(0, divId.indexOf("_"));
  }

  this.addPanel = function(content, title, dockable, formId, bounds) {
    content.style.overflow = "auto";
    var text = document.createTextNode(title);

    var toggle = document.createElement("img");
    toggle.src = this.expandImg;
    toggle.id = this.getPanelHeaderToggleId(content.id);
    toggle.onclick = handlePanelHeaderClick;

    var pop = document.createElement("img");
    pop.src = this.popImg;
    pop.id = this.getPanelHeaderDockId(content.id);
    pop.onclick = handlePanelHeaderClick;

    var titleCell = document.createElement("td");
    titleCell.style.paddingLeft = "1em";
    titleCell.style.width = "100%";
    titleCell.id = this.getPanelHeaderLabelId(content.id);
    titleCell.className = "panelHeaderLabel";
    titleCell.appendChild(text);
    titleCell.onclick = handlePanelHeaderClick;

    var tglCell = document.createElement("td");
    tglCell.style.width = toggle.width;
    tglCell.appendChild(toggle);

    var popCell = document.createElement("td");
    popCell.style.width = pop.width;
    popCell.appendChild(pop);

    var headerRow = document.createElement("tr");
    headerRow.vAlign = "middle";
    headerRow.appendChild(titleCell);
    headerRow.appendChild(tglCell);
    headerRow.appendChild(popCell);

    var titleTblBdy = document.createElement("tbody");
    titleTblBdy.appendChild(headerRow);

    var titleTbl = document.createElement("table");
    titleTbl.cellPadding = 0;
    titleTbl.cellSpacing = 0;
    titleTbl.width = "100%";
    titleTbl.appendChild(titleTblBdy);

    var titleBar = document.createElement("div");
    titleBar.id = this.getPanelHeaderDivId(content.id);
    titleBar.className = "panelHeaderDiv";
    EsriUtils.setElementStyle(titleBar, "width:100%;");
    titleBar.appendChild(titleTbl);

    // save state - begin ie6fix
    var checkboxStates = saveCheckBoxStates(content);
    // end ie6fix

    var panel = document.createElement("div");
    panel.id = this.getPanelBaseDivId(content.id);
    panel.appendChild(titleBar);
    panel.appendChild(content);

    this.container.appendChild(panel);
    this.contentIds.push(content.id);
    this.contentBounds[content.id] = bounds;
    this.titles[content.id] = title;

    // restore the checkbox states - ie6fix
    restoreCheckBoxStates(content, checkboxStates);
    // end ie6fix

    EsriUtils.hideElement(pop);
    if(dockable)
      EsriUtils.showElement(pop);
  }

  this.resetContents = function(content) {
    var checkboxStates = saveCheckBoxStates(content);
    var baseDiv = document.getElementById(this.getPanelBaseDivId(content.id));
    if(baseDiv.childNodes[1])
      baseDiv.removeChild(baseDiv.childNodes[1]);
    baseDiv.appendChild(content);
    restoreCheckBoxStates(content, checkboxStates);
    updateOverviewBox();
  }

  this.popPanel = function(contentId) {
    EsriUtils.hideElement(document.getElementById(this.getPanelBaseDivId(contentId)));
    updateOverviewBox();
  }

  this.dockPanel = function(contentId) {
    var content = document.getElementById(this.getPanelBaseDivId(contentId));
    content.className = "panel";
    EsriUtils.showElement(content);
    updateOverviewBox();
  }

  function handlePanelHeaderClick(e) {
    var eSrc = EsriUtils.getEventSource(e);
    var content = document.getElementById(self.getContentDivId(eSrc.id));
    var bounds = self.contentBounds[content.id];

    if(eSrc.id.indexOf("headerDock") > 0) {
      self.popPanel(content.id);
      self.showPanel(content.id);

      // save checkbox state - ie6fix
      var cbstates = saveCheckBoxStates(content);
      // end ie6fix

      var winId = self.getPanelWindowId(content.id) + new Date().getTime();
      var peId = self.getPanelPageElementId(content.id);
      var pe = new EsriPageElement();
      pe.divId = peId;
      pe.divObject = content;

      var clickPoint = EsriUtils.getXY(e);
      var win = new EsriWindow(winId, self.titles[content.id], pe);
      if (bounds) {
        win.bounds = new EsriRectangle(clickPoint.x - 5, clickPoint.y - 5, bounds.width, bounds.height);
        win.resizable = false;
      }
      else
        win.bounds = new EsriRectangle(clickPoint.x - 5, clickPoint.y - 5, 300, 200);
      win.closeImgUrl = self.dockImg;
      win.collapsable = false;
      win.init(self.windowForm);
      updateOverviewBox();
      win.addUpdateListener("onClose", winUpdateHandler);
      if (content.id.indexOf("overview") != -1)
        win.addUpdateListener("overviewMove", overviewWinUpdateHandler);

      // restore checkbox state - ie6fix
      restoreCheckBoxStates(pe.divObject, cbstates);
      // end ie6fix
    }
    else {
      self.togglePanel(content.id);
    }
    return false;
  }

  function updateOverviewBox() {
    if (self.overviewId) {
      var ov = EsriControls.overviews[self.overviewId];
      if (! ov.showNoData) {
        var b = ov.box;
        ov.update(b.left, b.top, b.width, b.height);
      }
    }
  }

  function winUpdateHandler(win) {
    if(win.closed) {
      win.removeUpdateListener("onClose");
      self.resetContents(win.pageElement.divObject);
      self.dockPanel(self.getContentDivId(win.id));
      win = null;
      delete win;
    }
    return false;
  }

  function overviewWinUpdateHandler(win) {
    if (win.closed) win.removeUpdateListener("overviewMove");
    updateOverviewBox();
  }

  // saves checkbox form field states, returns an array - ie6fix
  function saveCheckBoxStates(content) {
    var checkboxStates = new Array();
    var inputs = content.getElementsByTagName("input");
    if (inputs) {
	    for (var i = 0; i < inputs.length; i++) {
	      var input = inputs[i];
	      if (input.type == "checkbox") {
        	checkboxStates[input.id] = input.checked;
	      }
	    }
    }
    return checkboxStates;
  }

  // restores checkbox form field states - ie6fix
  function restoreCheckBoxStates(content, checkboxStates) {
    var inputs = content.getElementsByTagName("input");
    if (inputs) {
	    for (var i = 0; i < inputs.length; i++) {
	      var input = inputs[i];
	      if (input.type == "checkbox") {
	        input.checked = checkboxStates[input.id];
	      }
	    }
    }
  }
}