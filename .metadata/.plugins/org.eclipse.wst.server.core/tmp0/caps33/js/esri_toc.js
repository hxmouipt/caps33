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

function EsriTocNode(key, label, level) {
  this.key = key;
  this.label = label;
  this.level = level;

  this.isShowExpanded = false;
  this.isExpanded = false;
  this.isShowChecked = false;
  this.isChecked = false;
  this.isUrl = false;
  this.imageUrl = null;
  this.isDisabled = false;
  this.isSelected = false;
  this.contextMenuItems = new Array();
}

function EsriContextMenuItem(label, value, description) {
  this.label = label;
  this.value = value;
  this.description = description;
}

function EsriToc(id, cont, mapId, ren) {
  this.inheritsFrom(new EsriControl(id, "Toc"));
  this.mapId = mapId;
  this.renderer = ren;
  this.clientPostBack = false;
  this.autoPostBack = true;
  this.nodes = null;
  this.divId = "TocDiv_" + this.id;
  this.tokenStart = "${";
  this.tokenEnd = "}";
  this.tokenHandlers = new Array();
  this.tokens = new Array();
  var self = this;

  this.init = function(cont) {
    if (! this.renderer) this.renderer = new EsriTableTocRenderer();
    this.nodes = new Array();

    this.divObject = document.createElement("div");
    this.divObject.id = this.divId;
    EsriUtils.setElementStyle(this.divObject, "width:100%; height:100%; overflow:auto;");
    this.renderer.toc = this;
    this.renderer.init(this.divObject);
    cont.appendChild(this.divObject);
    self = this;

    EsriControls.addPostBackTagHandler("toc", EsriControls.tocs[self.id].updateAsync);
  }

  this.addTokenHandler = function(name, handlerFunction) {
    if (this.tokens.indexOf(name) == -1)
      this.tokens.push(name);
    this.tokenHandlers[name] = handlerFunction;
  }

  this.updateAsync = function(xml, eventSources) {
    var idTag = xml.getElementsByTagName("id").item(0);
    if (idTag.firstChild.nodeValue == self.id) {
      self.renderer.reset();
      self.nodes = new Array();

      self.mapId = xml.getElementsByTagName("map-id").item(0).firstChild.nodeValue;
      var nodeTags = xml.getElementsByTagName("dataframe").item(0).getElementsByTagName("node");
      self.renderer.startRendering();
      for (var i=0, l=nodeTags.length;i<l;i++) {
        var node = nodeTags.item(i);
        var content = node.getElementsByTagName("content").item(0);
        var key = node.getAttribute("key");
        var label = content.hasChildNodes() ? content.firstChild.nodeValue : "";
        var level = parseInt(node.getAttribute("level"));
        var n = new EsriTocNode(key, label, level);

        n.isShowExpanded = node.getAttribute("expanded") != "";
        n.isExpanded = node.getAttribute("expanded") == "true";
        n.isShowChecked = true;
        n.isShowChecked = content.getAttribute("ischecked") != "";
        n.isChecked = content.getAttribute("ischecked") == "true";
        n.isUrl = content.getAttribute("isurl") == "true";
        n.imageUrl = content.getAttribute("image-url");
        n.isDisabled = content.getAttribute("isdisabled") == "true";
        n.isSelected = content.getAttribute("isselected") == "true";

        var contextMenuTag = node.getElementsByTagName("context-menu");
        if (contextMenuTag.length == 1) {
          var contextItems = contextMenuTag.item(0).getElementsByTagName("item");
          for (var c=0;c<contextItems.length;c++) n.contextMenuItems.push(new EsriContextMenuItem(contextItems.item(c).getAttribute("label"), contextItems.item(c).getAttribute("value"), contextItems.item(c).getAttribute("description")));
        }

        self.nodes.push(n);
        self.renderer.renderNode(n);
      }
      self.renderer.endRendering();

      var form = document.forms[EsriControls.maps[self.mapId].formId];
      EsriUtils.removeFormElement(form.id, self.id);
      EsriUtils.removeFormElement(form.id, self.id + "_nodeKey");
      EsriUtils.removeFormElement(form.id, self.id + "_nodeOperation");
      EsriUtils.removeFormElement(form.id, self.id + "_contextMenuItemValue");
      for (i=0;i<form.elements.length;i++) {
        var name = form.elements[i].name;
        if (name && name.indexOf(self.id) == 0) EsriUtils.removeFormElement(form.id, name);
      }

      for (var i=0;i<self.updateListenerNames.length;i++) self.updateListeners[self.updateListenerNames[i]](self);
    }
  }

  this.nodeOperation = function(k, o) {
    var map = EsriControls.maps[this.mapId];
    EsriUtils.addFormElement(map.formId, self.id, self.id);
    EsriUtils.addFormElement(map.formId, self.id + "_nodeKey", k);
    EsriUtils.addFormElement(map.formId, self.id + "_nodeOperation", o);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    if (self.autoPostBack) {
      map.showLoading();
      EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
    }
  }

  this.checkedNodeOperation = function(k, cv) {
    var map = EsriControls.maps[self.mapId];
    EsriUtils.addFormElement(map.formId, self.id, self.id);
    EsriUtils.addFormElement(map.formId, self.id + "_nodeKey", k);
    EsriUtils.addFormElement(map.formId, self.id + "_" + k, cv);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    if (self.autoPostBack) {
      map.showLoading();
      EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
    }
  }

  this.contextMenuOperation = function(v, k) {
    var map = EsriControls.maps[self.mapId];
    EsriUtils.addFormElement(map.formId, self.id, self.id);
    EsriUtils.addFormElement(map.formId, self.id + "_contextMenuItemValue", v);
    this.nodeOperation(k, "contextMenu");
  }

  EsriControls.tocIds.push(id);
  EsriControls.tocs[id] = this;
  if (cont) this.init(cont);
}

EsriToc.prototype.addTocNode = function(k, lb, lv, isSE, isE, isSC, isC, isU, iU, isDi, isS, mi) {
  var n = new EsriTocNode(k, lb, lv);
  n.isShowExpanded = isSE;
  n.isExpanded = isE;
  n.isShowChecked = isSC;
  n.isChecked = isC;
  n.isUrl = isU;
  n.imageUrl = iU;
  n.isDisabled = isDi;
  n.isSelected = isS;
  n.contextMenuItems = mi;
  this.nodes.push(n);
  this.renderer.renderNode(n);
}

function EsriTocRenderer() {
  this.toc = null;
  this.init = function(container) {}
  this.reset = function() {}
  this.startRendering = function() {}
  this.renderNode = function(node) {}
  this.endRendering = function() {}
}

function EsriTableTocRenderer() {
  this.inheritsFrom(new EsriTocRenderer());
  var table, tbody;
  var self = this;
  var checkBoxStates;
  var tocContextMenuItems = new Array();

  this.collapsedImage = "images/plus.gif";
  this.expandedImage = "images/minus.gif";
  this.indentWidth = 10;

  this.init = function(container) {
    table = document.createElement("table");
    table.cellSpacing = 0;
    table.cellPadding = 0;
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
    container.appendChild(table);
    addTokenHandlers();
    self = this;
  }

  function addTokenHandlers() {
    self.toc.addTokenHandler("loading-image", function(key, token) {
      var img = document.createElement("img");
      img.src = EsriControls.contextPath + "images/loading.gif";
      EsriUtils.setElementStyle(img, "width:16px; height:16px; vertical-align:middle; border:NONE; padding-right:4px; margin-right:4px;");
      return img;
    });

    self.toc.addTokenHandler("url", function(key, token) {
      var vStart = "(";
      var vEnd = ")";
      var a = document.createElement("a");
      var vs = token.split(vStart);
      a.href = vs[1].substring(0, vs[1].indexOf(vEnd));
      a.target = "_blank";
      a.appendChild(document.createTextNode(vs[2].substring(0, vs[2].indexOf(vEnd))));
      return a;
    });

    self.toc.addTokenHandler("imgsrc", function(key, token) {
      var img = document.createElement("img");
      img.src = token.substring("imgsrc=".length);
      EsriUtils.setElementStyle(img, "vertical-align:middle; border:NONE; padding-right:4px; margin-right:4px;");
      return img;
    });

    self.toc.addTokenHandler("save-gp-result", function(key, token, label) {
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(label));
      td.onclick = function() { saveGpResultRequestHandler(key); };
      return td;
    });

    self.toc.addTokenHandler("show-copyright", function(key, token, label) {
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(label));
      td.onclick = function() { showCopyrightRequestHandler(key); };
      return td;
    });
  }

  function handleLabel(lbl, key, isCtxMnu, indentWd) {
    var st = lbl.indexOf(self.toc.tokenStart);
    var en = lbl.indexOf(self.toc.tokenEnd, st);

    if (st != -1 && en != -1) {
      if (isCtxMnu) {
        var token = lbl.substring((st + self.toc.tokenStart.length), en);
        var label = lbl.substring(0, st) + lbl.substring(en + 1);

        for (var t=0;t<self.toc.tokens.length;t++) {
          if (token.indexOf(self.toc.tokens[t]) == 0)
            return self.toc.tokenHandlers[self.toc.tokens[t]](key, token, label);
        }
      }
      else {
        var a = lbl.split(self.toc.tokenStart);
        var ps = [];
        var span = document.createElement("span");
        for (var i=0;i<a.length;i++) {
          var p = a[i];
          if (p.indexOf(self.toc.tokenEnd) != -1) {
            var e = p.indexOf(self.toc.tokenEnd);
            var t = p.substring(0, e);
            var l = p.substring(e + self.toc.tokenEnd.length);

            var handled = false;
            if (t == "newline") {
              span.innerHTML += "<br />";
              span.appendChild(createSpacer(indentWd));
              handled = true;
            }

            for (var r=0;r<self.toc.tokens.length;r++) {
              if (t.indexOf(self.toc.tokens[r]) == 0) {
                span.appendChild(self.toc.tokenHandlers[self.toc.tokens[r]](key, t));
                handled = true;
                break;
              }
            }

            if (! handled) span.appendChild(document.createTextNode(p));
            if (l != "") span.appendChild(document.createTextNode(l));
          }
          else span.appendChild(document.createTextNode(p));
        }
        return span;
      }
    }

    return null;
  }

  this.reset = function() {
    while (tbody.hasChildNodes()) EsriUtils.removeElement(tbody.firstChild);
    self.tocContextMenuItems = new Array();
  }

  function createSpacer(wd) {
    var spacer = document.createElement("img");
    spacer.src = EsriControls.contextPath + "images/pixel.gif";
    EsriUtils.setElementStyle(spacer, "width:" + wd + "px; height:0px");
    return spacer;
  }

  function SliderHandler(k, v) {
    var key = k;
    var value = v;
    this.sliderTransparencyCallback = function(sliderValue) {
      var sValue = parseFloat((1 - (sliderValue/10)));
      var map = EsriControls.maps[self.toc.mapId];
      if (! (map.mapSourceNames.length == 1 && map.mapSources[map.mapSourceNames[0]].type == "dynamic")) {
        var ms = map.mapSources[map.mapSourceNames[(map.mapSourceNames.length - 1) - parseInt(key)]];
        var il = ms.imageList;
        ms.imageOpacity = sValue;
        for (var i=0;i<il.length;i++) {
          var img = document.getElementById(il[i]);
          if (img) EsriUtils.setElementOpacity(img, sValue);
        }
      }
      self.toc.contextMenuOperation(value + "|" + sValue, key);
    };
  }

  function saveGpResultRequestHandler(key) {
    var map = EsriControls.maps[self.toc.mapId];
    var fId = map.formId;
    var url = EsriUtils.getServerUrl(fId);
    var params = "gpAsyncTaskResults=gpAsyncTaskResults&saveResult=saveResult&formId=" + map.formId + "&tocId=" + self.toc.id + "&key=" + key + "&" + EsriUtils.buildRequestParams(fId);
    EsriUtils.sendAjaxRequest(url, params, false, saveGpResultResponseHandler);
  }

  function saveGpResultResponseHandler(xh) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);
      var downloadId = xml.getElementsByTagName("download-id").item(0).firstChild.nodeValue;
      var id = downloadId;
      EsriUploadUtil.showDownloadWindow("Save Result", id);
    }
  }

  function showCopyrightRequestHandler(key) {
    var map = EsriControls.maps[self.toc.mapId];
    var fId = map.formId;
    var url = EsriUtils.getServerUrl(fId);
    var params = "agsAjax=agsAjax&showCopyright=showCopyright&formId=" + map.formId + "&tocId=" + self.toc.id + "&key=" + key + "&" + EsriUtils.buildRequestParams(fId);
    EsriUtils.sendAjaxRequest(url, params, false, showCopyrightResponseHandler);
  }

  function showCopyrightResponseHandler(xh) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);

      var copyrightTags = xml.getElementsByTagName("copyright");
      if (copyrightTags.length > 0) {
        var copyrightTag = copyrightTags.item(0);
        var nodeText = copyrightTag.getElementsByTagName("node-text").item(0).firstChild.nodeValue;
        var st = nodeText.indexOf(self.toc.tokenStart);
        var en = nodeText.indexOf(self.toc.tokenEnd, (st + self.toc.tokenStart.length));
        if (st != -1 && en != -1) nodeText = nodeText.substring(0, st) + nodeText.substring(en + 1);
        var copyrightTextTag = copyrightTag.getElementsByTagName("copyright-text").item(0);
        var copyrightText = "";
        if (copyrightTextTag.hasChildNodes()) copyrightText = copyrightTextTag.firstChild.nodeValue;

        var time = new Date().getTime();
        var pe = new EsriPageElement("pe" + time);
        pe.divObject = document.createElement("div");
        pe.divObject.id = pe.divId = "" + time;

        pe.divObject.innerHTML = "<b>Layer : </b>" + nodeText + "<br /><br /><b>Copyright : </b>" + copyrightText;
        EsriUtils.setElementStyle(pe.divObject, "width:380px; height:110px; overflow:auto; margin:5px; padding:5px;");

        var win = new EsriWindow("win" + time, "Copyright", pe);
        win.init();
        win.resize(400, 150);
        win.resizable = false;
        win.center();
      }
    }
  }

  function showContextMenu(e, key) {
    var contextMenuId = "EsriContextMenu_" + self.toc.id;
    if (document.getElementById(contextMenuId)) document.getElementById(contextMenuId).parentNode.removeChild(document.getElementById(contextMenuId));

    var menuItems = tocContextMenuItems[key];
    if (menuItems.length == 0) return;

    var table = document.createElement("table");
    table.id = contextMenuId;
    table.className = "esriContextMenu";
    var tb = document.createElement("tbody");
    table.appendChild(tb);

    for (var i=0;i<menuItems.length;i++) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.id = i;
      td.className = "esriContextMenuItem";
      var label = menuItems[i].label;

      if (label == "Transparency") {
        var initValue = (1 - menuItems[i].value.substring(menuItems[i].value.indexOf("|") + 1)) * 10;
        td.appendChild(document.createTextNode(menuItems[i].label));

        var slider = new EsriSlider("TocMenuSlider_" + self.toc.id + "_" + i, null, new SliderHandler(key, menuItems[i].value.substring(0, menuItems[i].value.indexOf("|"))).sliderTransparencyCallback);
        slider.numSegments = 10;
        slider.initValue = initValue;
        slider.roundValues = false;
        slider.showTicks = true;
        slider.callContinuously = false;
        slider.init(td);
      }
      else {
        var elem = handleLabel(label, key, true);
        if (elem) {
          td = elem;
          td.id = i;
          td.className = "esriContextMenuItem";
        }
        else {
          td.appendChild(document.createTextNode(menuItems[i].label));
          td.onclick = function(e) {
            var index = EsriUtils.getEventSource(e).id;
            self.toc.contextMenuOperation(tocContextMenuItems[key][index].value, key);
            return false;
          }
        }
        td.onmouseover = function(e) { EsriUtils.getEventSource(e).className = "esriContextMenuItemActive"; }
        td.onmouseout = function(e) { EsriUtils.getEventSource(e).className = "esriContextMenuItem"; }
      }

      tr.appendChild(td);
      tb.appendChild(tr);
    }

    var pt = EsriUtils.getXY(e);
    EsriUtils.setElementStyle(table, "position:absolute; left:" + pt.x + "px; top:" + pt.y + "px; z-index:9999;");
    document.body.appendChild(table);
    document.onclick = document.oncontextmenu = function(e) {
      table.parentNode.removeChild(table);
      document.onclick = document.oncontextmenu = null;
    }
  }

  this.startRendering = function() {
    if (EsriUtils.isIE6) checkBoxStates = EsriUtils.getCheckBoxStates(tbody);
    tbody = table.removeChild(tbody);
    if (EsriUtils.isIE6) EsriUtils.setCheckBoxStates(tbody, checkBoxStates);
  }

  this.endRendering = function() {
    if (EsriUtils.isIE6) checkBoxStates = EsriUtils.getCheckBoxStates(tbody);
    tbody = table.appendChild(tbody);
    if (EsriUtils.isIE6) EsriUtils.setCheckBoxStates(tbody, checkBoxStates);
  }

  this.renderNode = function(node) {
    var tr = tbody.appendChild(document.createElement("tr"));
    var td = tr.appendChild(document.createElement("td"));
    td.noWrap = true;
    td.className = ((node.isSelected) ? ((node.isDisabled) ? "esriTocLabelSelectedDisabled" : "esriTocLabelSelected") : ((node.isDisabled) ? "esriTocLabelDisabled" : "esriTocLabel"));
    td.appendChild(createSpacer((node.level * this.indentWidth) + 5));

    var expanded;
    if (node.isShowExpanded) {
      var expanded;
      if (EsriUtils.isIE) expanded = td.appendChild(document.createElement("<input type=\"image\" />"));
      else {
        expanded = td.appendChild(document.createElement("input"));
        expanded.type = "image";
      }
      expanded.id = self.toc.id + "_" + node.key + "_exp";
      expanded.verticalAlign = "middle";
      expanded.src = (node.isExpanded) ? this.expandedImage : this.collapsedImage;
      expanded.onclick = function() { self.toc.nodeOperation(node.key, "expandCollapse"); return false; };
    }
    else expanded = td.appendChild(createSpacer(9));
    EsriUtils.setElementStyle(expanded, "padding:0px 4px 0px 0px; margin:0px 4px 0px 0px;");

    if (node.isShowChecked) {
      var checked;
      if (EsriUtils.isIE) checked = td.appendChild(document.createElement("<input type=\"checkbox\" checked=\"checked\" />"));
      else {
        checked = td.appendChild(document.createElement("input"));
        checked.type = "CHECKBOX";
      }
      checked.id = "EsriTocNodeCheckbox_" + self.toc.id + "_" + node.key;
      checked.checked =  node.isChecked;
      checked.verticalAlign = "middle";
      if (node.isDisabled) checked.disabled = true;
      checked.onclick = function() { self.toc.checkedNodeOperation(node.key, document.getElementById("EsriTocNodeCheckbox_" + self.toc.id + "_" + node.key).checked); };
      EsriUtils.setElementStyle(checked, "padding:0px 4px 0px 0px; margin:0px 4px 0px 0px;");
    }

    if (node.imageUrl) {
      var symbol = td.appendChild(document.createElement("img"));
      symbol.src = node.imageUrl;
      symbol.onclick = function() { self.toc.nodeOperation(node.key, "click"); return false; };
      EsriUtils.setElementStyle(symbol, "padding:0px 4px 0px 0px; margin:0px 4px 0px 0px;");
    }

    var span = document.createElement("span");
    if (node.isUrl) span.onclick = function() { self.toc.nodeOperation(node.key, 1); return false; };
    var elem = handleLabel(node.label, node.key, false, (node.level * this.indentWidth) + 5 + 9 + 4 + ((EsriUtils.isIE) ? 0 : 4));
    if (elem) span.appendChild(elem);
    else span.appendChild(document.createTextNode(node.label));

    if (node.contextMenuItems) {
      tocContextMenuItems[node.key] = node.contextMenuItems;
      span.oncontextmenu = function(e) {
        showContextMenu(e, node.key);
        EsriUtils.stopEvent(e);
        return false;
      }
    }
    else span.oncontextmenu = function(e) { EsriUtils.stopEvent(e); return false; };

    if (node.isUrl) {
      var a = td.appendChild(document.createElement("a"));
      a.href = "javascript:void(0);";
      a.appendChild(span);
    }
    else td.appendChild(span);
  }
}