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
function EsriWebMapResultsTocRenderer() {
  this.inheritsFrom(new EsriTocRenderer());
  var tbody, container;
  var checkBoxStates;
  var isExpandCollapse = false;
  var tocContextMenuItems = new Array();
  this.collapsedImage = EsriControls.contextPath + "images/plus.gif";
  this.expandedImage = EsriControls.contextPath + "images/minus.gif";
  this.indentWidth = 10;
  
  var padFactor = 1.25;
  var padUnits = "em";
  var map = null;
  var self = this;
  var lastResultId = null;
  var checkBoxElements = [];
  
  this.init = function(container) {
    this.container = container;
    tbody = document.createElement("div");
    tbody.className = "nodes";
    container.appendChild(tbody);
    addTokenHandlers();
    map = EsriControls.maps[this.toc.mapId];
    
    map.mapTip.onFeatureFocus = function(feature) {
      highlightResultNode(feature.id, true);
    }
    map.mapTip.onFeatureBlur = function(feature) {
      unHighlightResultNode(feature.id, true);
    }    
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

  function createSpacer(wd, ht) {
    if(!ht) ht = 0;
    var spacer = document.createElement("img");
    spacer.src = EsriControls.contextPath + "images/pixel.gif";
    EsriUtils.setElementStyle(spacer, "width:" + wd + "px; height:" + ht + "px");
    return spacer;
  }

  function saveGpResultRequestHandler(key) {
    var map = EsriControls.maps[self.toc.mapId];
    var fId = map.formId;
    var url = EsriUtils.getServerUrl(fId);
    var params = "ajaxCommand=ajaxCommand&ajaxCommandBeanId=saveGPTaskResultCommand&formId=" + map.formId + "&tocId=" + self.toc.id + "&key=" + key + "&" + EsriUtils.buildRequestParams(fId);
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

  function showContextMenu(e, key) {
    var contextMenuId = "EsriContextMenu_" + self.toc.id;
    if (document.getElementById(contextMenuId)) document.getElementById(contextMenuId).parentNode.removeChild(document.getElementById(contextMenuId));

    var menuItems = tocContextMenuItems[key];
    if (menuItems.length == 0) return;

    var table = document.createElement("table");
    table.id = contextMenuId;
    table.className = "moreMenu";
    var tb = document.createElement("tbody");
    table.appendChild(tb);

    for (var i=0;i<menuItems.length;i++) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.id = i;
      var label = menuItems[i].label;

      var elem = handleLabel(label, key, true);
      if (elem) {
        td = elem;
        td.id = i;
      }
      else {
        td.appendChild(document.createTextNode(menuItems[i].label));
        td.onclick = function(e) {
          var index = EsriUtils.getEventSource(e).id;
          self.toc.contextMenuOperation(tocContextMenuItems[key][index].value, key);
          return false;
        }
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
   if (EsriUtils.isIE7 || EsriUtils.isIE6 ) checkBoxStates = EsriUtils.getCheckBoxStates(tbody);
   tbody = self.container.removeChild(tbody);
   if (EsriUtils.isIE7 || EsriUtils.isIE6) EsriUtils.setCheckBoxStates(tbody, checkBoxStates);
  }

  this.endRendering = function() {
    if (EsriUtils.isIE6 || EsriUtils.isIE7) checkBoxStates = EsriUtils.getCheckBoxStates(tbody);
    tbody = self.container.appendChild(tbody);
    if (EsriUtils.isIE6 || EsriUtils.isIE7) EsriUtils.setCheckBoxStates(tbody, checkBoxStates);
    if(!isExpandCollapse && map.mapTip)
      map.mapTip.updateMapTips();
    if(isExpandCollapse) 
      isExpandCollapse = false;
  }

  this.renderNode = function(node) {
    if(EsriUtils.isIE6) {
      var wrapEl = document.createElement("div");
      EsriUtils.setElementStyle(wrapEl, "height: 0px; width: 100%;");
      tbody.appendChild(wrapEl);
    }
    var divEl = document.createElement("div");
    
    if(node.label.indexOf("contentType=") == 0) {
      node.contentType = node.label.substring("contentType=".length, node.label.indexOf(";"));
      node.label = node.label.substring(node.label.indexOf(";") + 1, node.label.length);
    }
    
    if(node.label.indexOf("resultIds=") == 0) {
      node.resultIds = node.label.substring("resultIds=".length, node.label.indexOf(";"));
      node.label = node.label.substring(node.label.indexOf(";") + 1, node.label.length);
    }
    
    if(node.label.indexOf("resultId=") == 0) {
      divEl.id = node.resultId = node.label.substring("resultId=".length, node.label.indexOf(";"));
      node.label = node.label.substring(node.label.indexOf(";") + 1, node.label.length);
    }
    
    if (node.contentType) {
      var ct = node.contentType;
      if(ct == "LAYER") { 
        divEl.className = "layer";
        if(node.label.indexOf(";resultTemplate")!=-1) {
          resultTemplate = decodeURIComponent(node.label.substring(node.label.indexOf(";resultTemplate=")+";resultTemplate=".length,node.label.lastIndexOf(";")));
          resultTemplate = resultTemplate.trim();
          node.label = node.label.substring(0,node.label.indexOf(";resultTemplate="));
        }
        
      }
      else if(ct == "RESULT") { // needs highlighting

        divEl.className = "result";
        divEl.onmouseover = function(e){ highlightResultNode(divEl.id) };
        divEl.onmouseout = function(e){ unHighlightResultNode(divEl.id) };
        lastResultId = divEl.id;
      }
      else if(ct == "DETAIL") {
        divEl.className = "detail";
      }
      else {
        divEl.className = "root";
      }
    }

    if(node.isShowExpanded) {
      var toggle = document.createElement("div");
      toggle.id = self.toc.id + "_" + node.key + "_exp";
      toggle.className = node.isExpanded ? "expanded" : "collapsed";
      toggle.onclick = function() {
        isExpandCollapse=true;
        self.toc.nodeOperation(node.key, "expandCollapse");
        return false; 
      };

      divEl.appendChild(toggle);
    }
    else {
      var pad = document.createElement("div");
      pad.className = "togglepad"
      divEl.appendChild(pad);
    }    

    if(node.contentType && node.level == 3) {
      divEl.id = lastResultId + "_details";
      divEl.setAttribute("resultId", lastResultId);
      var details = document.createElement("div");
      details.setAttribute("resultId", lastResultId);      
      var pairs = node.label.split(";");
      var argList = [];
      for(var i = 0; i < pairs.length; i++) {
        var kv = pairs[i].split("|");
        argList[kv[0]]=kv[1];
      }
      if(resultTemplate!=null) {
        var detailsbody = document.createElement("div");
        detailsbody.setAttribute("resultId", lastResultId);
        details.appendChild(detailsbody);
        var template = {templateString:resultTemplate,startToken:"\\${",endToken:"}"};
        if(resultTemplate=="default") template=template.templateString;
        var resultDetail = map.mapTip.transform(argList,template);
        resultDetail.content = resultDetail.content.replace("/ /","");
        detailsbody.innerHTML = resultDetail.content;
      }
      
      divEl.onmouseover = function(e) {
        var src = EsriUtils.getEventSource(e);
        highlightResultNode(src.getAttribute("resultId"));
      }
     
      divEl.onmouseout = function(e) {
        var src = EsriUtils.getEventSource(e);
        unHighlightResultNode(src.getAttribute("resultId"));
      }
      divEl.appendChild(details);
    }
    else {
      if(node.isShowChecked) {
        var cb;
        cb = document.createElement("input");
        cb.id = "EsriTocNodeCheckbox_" + self.toc.id + "_" + node.key;
        cb.type = "checkbox";
        if(EsriUtils.isIE) cb.defaultChecked = cb.checked = setState(cb);
        else cb.checked = setState(cb);
        cb.className = "check";
        cb.disabled = node.isDisabled ? true: false;
        
        if(node.resultIds)
          cb.setAttribute("resultIds", node.resultIds);
        else
          cb.setAttribute("resultIds", divEl.id);
        cb.onclick = function(e) {
          //No need to send the server the request at all state maintained at the client for check Node operation
          var src = EsriUtils.getEventSource(e);
          //update the state in the array
          updateState(src);
          if(map.mapTip) {
            if(src.getAttribute("resultIds")){
              map.mapTip.toggleFeaturesByLevel(src.getAttribute("resultIds").split("|"), src.checked,getLevel(src.id));
            }
          }
        };
        divEl.appendChild(cb);
      }
      
      if(node.imgUrl) {
        var img = document.createElement("img");
        img.src = node.imageUrl;
        img.className = "image";
        img.onclick = function() { 
          self.toc.nodeOperation(node.key, "click");
          return false;
        };
        
        divEl.appendChild(img);
      }
      
      var label = document.createElement("div");
      var txtSpanEl = handleLabel(node.label, node.key, false, 0); //(node.level * this.indentWidth) + 5 + 9 + 4 + ((EsriUtils.isIE) ? 0 : 4));
      label.className = "label";
      if(txtSpanEl)
        label.appendChild(txtSpanEl);
      else
        label.appendChild(document.createTextNode(node.label.trim() == "" ? "_" : node.label));
      divEl.appendChild(label);
      if(node.isUrl) {
        label.onclick = function() {
          self.toc.nodeOperation(node.key, 1); 
          return false; 
        };
      }

      if (node.contextMenuItems) {
        tocContextMenuItems[node.key] = node.contextMenuItems;
        divEl.oncontextmenu = function(e) {
          showContextMenu(e, node.key);
          EsriUtils.stopEvent(e);
          return false;
        }
      }
      else {
        divEl.oncontextmenu = function(e) {
          EsriUtils.stopEvent(e); return false;
        };
      }
    }
    
    EsriUtils.setElementStyle(divEl, "padding-left: " + (node.level * padFactor) + padUnits + ";");
    tbody.appendChild(divEl);
    
  }
  
  function getLevel(id) {
    var levelstring = id.substring(id.indexOf("EsriTocNodeCheckbox_results_")+"EsriTocNodeCheckbox_results_".length);
    var level = levelstring.split("_").length;
    return level-1;
  }
  
  function setState(cb) {
    var index = getCheckBoxIndex(cb.id);
    if(index==-1) {
      checkBoxElements[checkBoxElements.length]=cb;
      return true;
    }
    return checkBoxElements[index].checked; 
  }
   
  function getCheckBoxIndex(id) {
    for(var i = 0; i < checkBoxElements.length; i++) {
      if(checkBoxElements[i].id==id)
        return i;
    }
    return -1;
  }
  
  function updateState(src) {
    var index=-1;
    for(var i = 0; i < checkBoxElements.length; i++) {
      if(checkBoxElements[i].id==src.id)
      index=i;
    }
    if(index!=-1) checkBoxElements[index].checked=src.checked;
  }
  
  function highlightResultNode(resultId, skipMapTip) {
    if(!skipMapTip && map.mapTip)
      map.mapTip.highlightFeaturesById(resultId);
    var resNode = document.getElementById(resultId);
    if(resNode)
      resNode.className = "resultHighlight";
    var det = document.getElementById(resultId + "_details");
    if(det)
      det.className = "detailHighlight";    
  }

  function unHighlightResultNode(resultId, skipMapTip) {
    if(!skipMapTip && map.mapTip)
      map.mapTip.unHighlightFeaturesById(resultId);
    var resNode = document.getElementById(resultId);
    if(resNode)
      resNode.className = "result";      
    var det = document.getElementById(resultId + "_details");
    if(det)
      det.className = "detail";
  }
}