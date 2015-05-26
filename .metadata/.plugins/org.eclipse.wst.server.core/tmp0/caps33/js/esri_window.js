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

function EsriWindow(id, titleText, pageElement, container, isPopup) {
  this.inheritsFrom(new EsriPageElement(id));
  this.divId = "WindowDiv_" + id;
  this.pageElement = pageElement;
  var origContainer = container;
  var origParentNode = pageElement.divObject.parentNode;
  var popup = (isPopup && EsriUtils.getStyleByClassName("table.esriPopup")) ? true : false;
  var winStyle =  popup ? "esriPopup" : "esriWindow";

  this.collapsable = this.closable = this.showTitleBar = this.movable = this.resizable = this.fittable = true;
  this.collapsed = this.closed = false;
  this.showStatusBar = false;
  this.title = this.content = this.status;

  this.minWidth = 200;
  this.minHeight = 50;
  this.maxWidth = 600;
  this.maxHeight = 600;

  this.updateListeners = [];
  this.updateListenerNames = [];
  this.windowMgr = null;

  this.WINDOW_EVENT_OPENED = 0;
  this.WINDOW_EVENT_CLOSED = 1;
  this.WINDOW_EVENT_MOVED = 2;
  this.WINDOW_EVENT_RESIZED = 3;
  this.WINDOW_EVENT_EXPANDED = 4;
  this.WINDOW_EVENT_COLLAPSED = 5;

  var pixelImg = EsriControls.contextPath + "images/pixel.png";
  var titleTxt = titleText;
  var titleBar, contentRow, statusDiv;
  var colImg, cloImg;
  var self = this;
  var scrSz = 20;
  var moveAction, moving, resizeAction, resizing;
  var expWdSet, expWd, expHtSet, expHt, moveOutline;

  this.init = function(container) {
    var b;
    if (this.bounds.left && this.bounds.top && this.bounds.width && this.bounds.height) b = this.bounds;
    else b = EsriUtils.getElementPageBounds(this.pageElement.divObject);
    EsriUtils.removeElementStyle(this.pageElement.divObject, "position; left; top;");

    this.divObject = document.createElement("table");
    this.divObject.id = this.divId;
    this.divObject.cellSpacing = 0;
    this.divObject.cellPadding = 0;
    this.divObject.border = 0;
    this.divObject.className = winStyle;
    EsriUtils.setElementStyle(this.divObject, "position:absolute; left:" + b.left + "px; top:" + b.top + "px;");

    var tbody = this.divObject.appendChild(document.createElement("tbody"));
    var topRow = tbody.appendChild(document.createElement("tr"));
    var cellTL = topRow.appendChild(document.createElement("td"));
    cellTL.className = winStyle + "CellTL";
    var cellT = topRow.appendChild(document.createElement("td"));
    cellT.className = winStyle + "CellT";
    var cellTR = topRow.appendChild(document.createElement("td"));
    cellTR.className = winStyle + "CellTR";

    var midRow = tbody.appendChild(document.createElement("tr"));
    var cellL = midRow.appendChild(document.createElement("td"));
    cellL.className = winStyle + "CellL";
    var cellC = midRow.appendChild(document.createElement("td"));
    cellC.className = winStyle + "CellC";
    cellC.vAlign = "top";
    var cellR = midRow.appendChild(document.createElement("td"));
    cellR.className = winStyle + "CellR";

    var botRow = tbody.appendChild(document.createElement("tr"));
    var cellBL = botRow.appendChild(document.createElement("td"));
    cellBL.className = winStyle + "CellBL";
    var cellB = botRow.appendChild(document.createElement("td"));
    cellB.className = winStyle + "CellB";
    var cellBR = botRow.appendChild(document.createElement("td"));
    cellBR.className = winStyle + "CellBR";

    var contentTable = cellC.appendChild(document.createElement("table"));
    contentTable.width = "100%";
    contentTable.height = "100%";
    contentTable.cellSpacing = 0;
    contentTable.cellPadding = 0;
    contentTable.border = 0;
    contentTable.className = winStyle + "Layout";

    var contentBody = contentTable.appendChild(document.createElement("tbody"));

    if (this.showTitleBar) {
      var titleRow = contentBody.appendChild(document.createElement("tr"));
      titleRow.vAlign = "top";

      titleBar = titleRow.appendChild(document.createElement("td")).appendChild(document.createElement("table"));
      titleBar.className = winStyle + "TitleBar";
      titleBar.width = "100%";
      titleBar.cellSpacing = 1;
      titleBar.cellPadding = 1;
      var titleRowTable = titleBar.appendChild(document.createElement("tbody")).appendChild(document.createElement("tr"));
      var titleCell = titleRowTable.appendChild(document.createElement("td"));
      titleCell.width = "100%";
      this.title = titleCell.appendChild(document.createElement("span"));
      this.title.className = winStyle + "TitleText";
      this.title.appendChild(document.createTextNode(titleTxt));

      titleBar.onclick = function(event) {
        EsriUtils.stopEvent(event);
        (self.windowMgr) ? self.windowMgr.toFront(self.id) : self.toFront();
        return false;
      }

      if (this.fittable) {
        titleBar.ondblclick = function(event) {
          EsriUtils.stopEvent(event);
          self.fit();
          return false;
        }
      }

      if (this.collapsable) {
        colImg = titleRowTable.appendChild(document.createElement("td")).appendChild(document.createElement("img"));
        colImg.src = pixelImg;

        if (this.collapsed) colImg.className = winStyle + "Expand";
        else colImg.className = winStyle + "Collapse";

        colImg.onclick = function(event) {
          EsriUtils.stopEvent(event);
          if (self.collapsed) self.expand();
          else self.collapse();
        };
      }

      if (this.closable) {
        cloImg = titleRowTable.appendChild(document.createElement("td")).appendChild(document.createElement("img"));
        cloImg.src = pixelImg;
        cloImg.className = winStyle + "Close";
        cloImg.onclick = function(event) { self.hide(); EsriUtils.stopEvent(event); };
      }

      if (this.movable) {
        moveAction = new EsriDragElementAction(true);
        moveAction.activate(titleRow, processMoveEnd, processMove);
      }
    }

    contentRow = contentBody.appendChild(document.createElement("tr"));
    contentRow.vAlign = "top";
    var contentCell = contentRow.appendChild(document.createElement("td"));
    contentCell.height = "100%";
    EsriUtils.setElementStyle(contentCell, "position:relative;");
    var chks;
    if (EsriUtils.isIE6) chks = EsriUtils.getCheckBoxStates(this.pageElement.divObject);
    this.content = contentCell.appendChild(this.pageElement.divObject);
    if (EsriUtils.isIE6) EsriUtils.setCheckBoxStates(this.pageElement.divObject, chks);
    this.content.className = winStyle + "Content";

    if (this.showStatusBar) {
      var statusRow = contentBody.appendChild(document.createElement("tr"));
      statusRow.vAlign = "bottom";
      statusDiv = statusRow.appendChild(document.createElement("td")).appendChild(document.createElement("div"));
      statusDiv.className = winStyle + "StatusBar";
      this.status = statusDiv.appendChild(document.createElement("span"));
      this.status.className = winStyle + "StatusBarText";
    }

    if (! container) origContainer = document.body;
    else origContainer = container;

    origContainer.appendChild(this.divObject);
    updateBounds();

    if (this.resizable) {
      resizeAction = new EsriResizeElementAction(true, this.minWidth, this.minHeight, this.maxWidth, this.maxHeight);
      resizeAction.activate(this.divObject, processResizeEnd, processResize);
    }

    if (this.collapsed) this.collapse(true);
    if (this.closed) this.hide(true);
    normalize();
  }

  function processMove(x, y, end) {
    if (! moveOutline) {
      moveOutline = document.body.appendChild(document.createElement("table"));
      moveOutline.className = winStyle + "MoveOutline";
      if (self.showTitleBar) {
        var td = moveOutline.appendChild(document.createElement("tbody")).appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
        td.valign = "middle";
        td.align = "center";
        td.width = "100%";
        td.height = "100%";
        td.appendChild(self.title.cloneNode(true));
      }
      EsriUtils.setElementStyle(moveOutline, "position:absolute; width:" + self.bounds.width + "px; height:" + self.bounds.height + "px;");
      EsriUtils.setElementOpacity(moveOutline, 0.25);
      EsriUtils.setElementOpacity(self.divObject, 0.5);
    }

    var wl = self.bounds.left + x;
    var wt = self.bounds.top + y;
    var l = (wl < 0) ? 0 : wl;
    var t = (wt < 0) ? 0 : wt;
    EsriUtils.setElementStyle(moveOutline, "left:" + l + "px; top:" + t + "px;");
    if (end) {
      EsriUtils.setElementStyle(self.divObject, "left:" + l + "px; top:" + t + "px;");
      EsriUtils.setElementOpacity(self.divObject, 1);
    }
  }

  function processMoveEnd(x, y) {
    if (isNaN(x) || isNaN(y)) return;
    processMove(x, y, true);
    EsriUtils.removeElement(moveOutline);
    moveOutline = null;
    EsriUtils.setElementOpacity(self.divObject, 1);
    updateBounds();
    if (self.resizable && ! self.collapsed) resizeAction.activate(self.divObject, processResizeEnd, processResize);

    moving = false;
  }

  function processResize(rect) {
    if (! resizing) {
      updateBounds();
      resizing = true;
    }
    var dx = self.bounds.width - self.pageElement.bounds.width;
    var dy = self.bounds.height - self.pageElement.bounds.height;
    EsriUtils.setElementStyle(self.divObject, "width:" + rect.width + "px; height:" + rect.height + "px;");
    EsriUtils.setElementStyle(self.content, "width:" + (rect.width - dx) + "px; height:" + (rect.height - dy + 1) + "px;");
  }

  function processResizeEnd(rect) {
    processResize(rect);
    updateBounds();
    resizing = false;
  }

  function updateBounds() {
    if (! self.closed) {
      self.bounds = EsriUtils.getElementPageBounds(self.divObject);
      if (! self.collapsed) self.pageElement.bounds = EsriUtils.getElementPageBounds(self.content);
    }
    for (var i=0;i<self.updateListenerNames.length;i++) self.updateListeners[self.updateListenerNames[i]](self);
  }

  function saveState() { if (self.windowMgr) self.windowMgr.saveProperties(); }

  this.setTitle = function(str) { if (this.title) this.title.innerHTML = str; }
  this.setStatus = function(msg) { if (this.status) this.status.innerHTML = msg; }

  this.dispose = function(restore) {
    var chks;
    if (EsriUtils.isIE6) chks = EsriUtils.getCheckBoxStates(this.pageElement.divObject);
    if (restore) origParentNode.appendChild(this.pageElement.divObject);
    origContainer.removeChild(this.divObject);
    if (EsriUtils.isIE6) EsriUtils.setCheckBoxStates(this.pageElement.divObject, chks);
  }

  this.collapse = function(override, skipSave) {
    if ((self.collapsed || self.closed) && ! override) return;
    var b = EsriUtils.getElementPageBounds(titleBar);
    var bd = EsriUtils.getElementPageBounds(this.content);
    var bs = new EsriRectangle(0, 0, 0, 0);
    EsriUtils.hideElement(this.content);
    if (this.showStatusBar) {
      bs = EsriUtils.getElementPageBounds(statusDiv);
      EsriUtils.hideElement(statusDiv);
    }

    expWd = b.width;
    if (! popup) EsriUtils.setElementStyle(titleBar, "width:" + expWd + "px;");

    expHtSet = this.content.style.height == null;
    expHt = bd.height + bs.height;
    var h = this.bounds.height - expHt;
    EsriUtils.setElementStyle(this.divObject, "height:" + ((h < 0 && EsriUtils.isIE) ? 0 : h) + "px;");

    if (colImg) colImg.className = winStyle + "Expand";
    this.collapsed = true;
    updateBounds();
    if (this.resizable) resizeAction.deactivate();
    if (! skipSave) saveState();
  }

  this.expand = function(override, skipSave) {
    if ((! self.collapsed || self.closed) && ! override) return;
    EsriUtils.showElement(this.content);
    if (this.showStatusBar) EsriUtils.showElement(statusDiv);

    EsriUtils.removeElementStyle(titleBar, "width;");
    if (expHtSet) EsriUtils.setElementStyle(this.divObject, "height:" + (this.bounds.height + expHt) + "px;");
    else EsriUtils.removeElementStyle(this.divObject, "height;");

    if (colImg) colImg.className = winStyle + "Collapse";
    this.collapsed = false;
    if (this.resizable) resizeAction.activate(this.divObject, processResizeEnd, processResize);
    updateBounds();
    if (! skipSave) saveState();
  }

  this.hide = function(override, skipSave) {
    if (this.closed && ! override) return;
    EsriUtils.hideElement(this.divObject);
    this.closed = true;
    updateBounds();
    if (! skipSave) saveState();
  }

  this.show = function(override, skipSave) {
    if (! this.closed && ! override) return;
    EsriUtils.showElement(this.divObject);
    this.closed = false;
    updateBounds();
    if (! skipSave) saveState();
  }

  function setZ(z) { EsriUtils.setElementStyle(self.divObject, "z-index:" + z + ";"); }
  this.toFront = function(zi) { setZ((zi) ? zi : 111); }
  this.toBack = function(zi) { setZ((zi) ? zi : 110); }

  this.setWindowManager = function(wm) {
    this.windowMgr = wm;
    self = this;
  }

  this.moveTo = function(x, y) {
    if (! self.movable) return;
    var pb = EsriUtils.getPageBounds();
    EsriUtils.setElementStyle(this.divObject, "left:" + ((x < 0 || x > pb.width) ? 0 : x) + "px; top:" + ((y < 0 || y > pb.height) ? 0 : y) + "px;");
    updateBounds();
    saveState();
  }

  this.resize = function(w, h) {
    if (! this.resizable || this.closed) return;
    var b = EsriUtils.getElementPageBounds(this.divObject);
    var peBd = EsriUtils.getElementPageBounds(this.content);
    EsriUtils.setElementStyle(this.divObject, "width:" + w + "px; height:" + h + "px;");
    var dx = b.width - w;
    var dy = b.height - h;
    if (dx != 0 && (peBd.width - dx) > 0) EsriUtils.setElementStyle(this.content, "width:" + (peBd.width - dx) + "px;");
    if (dy != 0 && (peBd.height - dy) > 0) EsriUtils.setElementStyle(this.content, "height:" + (peBd.height - dy) + "px;");
    if (this.resizable) resizeAction.reactivate();
    updateBounds();
    saveState();
  }

  function normalize() {
    var b = EsriUtils.getElementPageBounds(self.divObject);

    if ((self.minWidth && self.maxWidth) && (b.width < self.minWidth || b.width > self.maxWidth)) {
      var w = (b.width < self.minWidth) ? self.minWidth : self.maxWidth;
      EsriUtils.setElementStyle(self.content, "width:" + w + "px;");
    }

    if ((self.minHeight && self.maxHeight) && (b.height < self.minHeight || b.height > self.maxHeight)) {
      var h = (b.height < self.minHeight) ? self.minHeight : self.maxHeight;
      EsriUtils.setElementStyle(self.content, "height:" + h + "px;");
    }

    b = EsriUtils.getElementPageBounds(self.divObject);
    var pb = EsriUtils.getPageBounds();
    if (b.left > pb.width || b.top > pb.height) self.moveTo(b.left, b.top);
    b = EsriUtils.getElementPageBounds(self.divObject);

    if ((b.left + b.width) > pb.width || (b.top + b.height) > pb.height) {
      var w = ((b.left + b.width) > pb.width) ? pb.width - b.left : b.width;
      var h = ((b.top + b.height) > pb.height) ? pb.height - b.top : b.height;
      self.resize(w, h);
    }
    else if (b.width > pb.width || b.height > pb.height) self.resize((b.width > pb.width) ? pb.width : b.width, (b.height > pb.height) ? pb.height : b.height);
    else updateBounds();
    if (self.resizable) resizeAction.reactivate();
  }

  this.fit = function() {
    if (! this.fittable) return;
    var cl = this.closed;
    var co = this.collapsed;
    if (cl) this.show(true, true);
    if (co) this.expand(true, true);
    EsriUtils.removeElementStyle(this.divObject, "width; height;");
    EsriUtils.removeElementStyle(this.content, "width; height;");
    if (EsriUtils.isIE) {
      var b = EsriUtils.getElementPageBounds(this.content);
      EsriUtils.setElementStyle(this.content, "width:" + (b.width + scrSz) + "px;");
    }
    normalize();
    if (co) this.collapse(true, true);
    if (cl) this.hide(true, true);
    saveState();
  }

  this.update = function() {
    if (! this.bounds.left && ! this.bounds.top && ! this.bounds.width && ! this.bounds.height) return;
    var peBd = this.pageElement.bounds.offset(0, 0);

    this.content = this.pageElement.divObject;
    EsriUtils.removeElementStyle(this.content, "position; left; top;");
    this.content.className = winStyle + "Content";

    EsriUtils.showElement(this.content);
    EsriUtils.showElement(this.divObject);
    EsriUtils.setElementStyle(this.divObject, "left:" + this.bounds.left + "px; top:" + this.bounds.top + "px;");
    var b = EsriUtils.getElementPageBounds(this.divObject);
    EsriUtils.setElementStyle(this.divObject, "width:" + this.bounds.width + "px; height:" + this.bounds.height + "px;");
    var dx = b.width - this.bounds.width;
    var dy = b.height - this.bounds.height;
    if (dx != 0 && (peBd.width - dx) > 0) EsriUtils.setElementStyle(this.content, "width:" + (peBd.width - dx) + "px;");
    if (dy != 0 && (peBd.height - dy) > 0) EsriUtils.setElementStyle(this.content, "height:" + (peBd.height - dy) + "px;");
    normalize();

    this.collapsed ? this.collapse(true, true) : this.expand(true, true);
    this.closed ? this.hide(true, true) : this.show(true, true);
    for (var i=0;i<this.updateListenerNames.length;i++) this.updateListeners[this.updateListenerNames[i]](this);
  }

  if (container) this.init(container);
}

EsriWindow.prototype.center = function() {
  var page = EsriUtils.getPageBounds();
  var wW = page.width;
  var wH = page.height;
  this.moveTo(Math.round(wW / 2) - Math.round(this.bounds.width / 2), Math.round(wH / 2) - Math.round(this.bounds.height / 2));
}

EsriWindow.prototype.addUpdateListener = function(name, listener) {
  if (this.updateListenerNames.indexOf(name) == -1) this.updateListenerNames.push(name);
  this.updateListeners[name] = listener;
}

EsriWindow.prototype.removeUpdateListener = function(name) {
  var index = this.updateListenerNames.indexOf(name);
  if (index != -1) {
    this.updateListenerNames.splice(index, 1);
    this.updateListeners[name] = null;
  }
}

EsriWindow.prototype.toggleVisibility = function() { this.closed ? this.show() : this.hide(); }
EsriWindow.prototype.toggleCollapse = function() { this.collapsed ? this.expand() : this.collapse(); }