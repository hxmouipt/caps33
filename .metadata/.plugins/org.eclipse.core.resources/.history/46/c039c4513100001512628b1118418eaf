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

function EsriToolbar(id, container, mapId, type) {
  this.inheritsFrom(new EsriControl(id, "Toolbar", 0, 0, 0, 0));
  this.mapId = mapId;
  this.type = type;
  var self = this;

  this.ORIENTATION_HORIZONTAL = 0;
  this.ORIENTATION_VERTICAL = 1;
  this.TOOL_ITEM_CONTAINER_ID_PREFIX = "ToolItemDiv_";

  this.divId = "ToolbarDiv_" + id;
  this.tableId = "ToolbarTable_" + id;
  this.table = this.tableBody = null;
  this.toolItems = new Array();
  this.toolItemNames = new Array();

  this.orientation = this.ORIENTATION_HORIZONTAL;

  this.init = function(container) {
    this.divObject = document.createElement("div");
    this.divObject.id = this.divId;
    this.divObject.className = "esriToolbar";

    this.table = document.createElement("table");
    this.tableBody = document.createElement("tbody");
    this.table.id = this.tableId;
    this.table.appendChild(this.tableBody);
    this.divObject.appendChild(this.table);
    container.appendChild(this.divObject);
    this.divObject.onclick = this.processMouseClick;
    this.divObject.onmouseover = this.processMouseOver;
    this.divObject.onmouseout = this.processMouseOut;

    EsriControls.toolbarIds.push(this.id);
    EsriControls.toolbars[this.id] = this;
    EsriControls.addPostBackTagHandler("toolbar", EsriControls.toolbars[self.id].updateAsync);
  }

  this.updateAsync = function(xml, eventSources) {
    var idTag = xml.getElementsByTagName("id").item(0);
    if (idTag.firstChild.nodeValue == self.id) {
      self.mapId = xml.getElementsByTagName("map-id").item(0).firstChild.nodeValue;
      var tb = EsriControls.toolbars[self.id];
      var activeToolTag = xml.getElementsByTagName("activetool").item(0);
      if (activeToolTag.firstChild) EsriControls.maps[self.mapId].setCurrentToolItem(self.toolItems[activeToolTag.firstChild.nodeValue], self.id);

      var toolTags = xml.getElementsByTagName("tool");
      var toolEl, key, tool, imageTags, imageTag;
      for(var i = 0; i < toolTags.length; i++) {
        toolEl = toolTags.item(i);
        key = toolEl.getElementsByTagName("key").item(0).firstChild.nodeValue;
        tool = self.toolItems[key];

        tool.isDisabled = (toolEl.getElementsByTagName("disabled").item(0).hasChildNodes()) ? toolEl.getElementsByTagName("disabled").item(0).firstChild.nodeValue == "true" : false;
        tool.name = (toolEl.getElementsByTagName("tooltext").item(0).hasChildNodes()) ? toolEl.getElementsByTagName("tooltext").item(0).firstChild.nodeValue : "";
        tool.toolTip = (toolEl.getElementsByTagName("tooltip").item(0).hasChildNodes()) ? toolEl.getElementsByTagName("tooltip").item(0).firstChild.nodeValue : "";
        tool.clientPostBack = (toolEl.getElementsByTagName("clientpostback").item(0).hasChildNodes()) ? toolEl.getElementsByTagName("clientpostback").item(0).firstChild.nodeValue == "true" : false;

        imageTags = toolEl.getElementsByTagName("images");
        if (imageTags.length > 0) {
          imageTag = imageTags.item(0);
          tool.defaultImage = (imageTag.getElementsByTagName("default").item(0).hasChildNodes()) ? imageTag.getElementsByTagName("default").item(0).firstChild.nodeValue : "";
          tool.hoverImage = (imageTag.getElementsByTagName("hover").item(0).hasChildNodes()) ? imageTag.getElementsByTagName("hover").item(0).firstChild.nodeValue : "";
          tool.selectedImage = (imageTag.getElementsByTagName("selected").item(0).hasChildNodes()) ? imageTag.getElementsByTagName("selected").item(0).firstChild.nodeValue : "";
          tool.disabledImage = (imageTag.getElementsByTagName("disabled").item(0).hasChildNodes()) ? imageTag.getElementsByTagName("disabled").item(0).firstChild.nodeValue : "";
        }

        if (tool.isDisabled) tb.setToolItemDisabled(key);
        else tb.setToolItemInactive(key);
      }

      for (var i=0;i<self.updateListenerNames.length;i++) self.updateListeners[self.updateListenerNames[i]](self);
    }
  }
}

EsriToolbar.prototype.addSeparator = function(text) {
  var cell = this.getNextToolbarCell();
  var separator = document.createTextNode(text);
  cell.appendChild(separator);
}

EsriToolbar.prototype.addImageSeparator = function(path, styleClass, style) {
  var cell = this.getNextToolbarCell();
  var sep = document.createElement("img");
  if (styleClass) sep.className = styleClass;
  if (style) EsriUtils.setElementStyle(sep, style);
  sep.src = path;
  cell.appendChild(sep);
}

EsriToolbar.prototype.getNextToolbarCell = function() {
  var cell = document.createElement("td");
  cell.noWrap = "nowrap";
  if (this.orientation == this.ORIENTATION_HORIZONTAL) {
    var row = null;
    if(this.tableBody.hasChildNodes()) row = this.tableBody.firstChild;
    else {
      row = document.createElement("tr");
      this.tableBody.appendChild(row);
    }
    row.appendChild(cell);
  }
  else if (this.orientation == this.ORIENTATION_VERTICAL) {
    var row = document.createElement("tr");
    this.tableBody.appendChild(row);
    row.appendChild(cell);
  }
  return cell;
}

EsriToolbar.prototype.getToolItemContainerId = function(toolId) { return this.TOOL_ITEM_CONTAINER_ID_PREFIX + this.id + "|" + toolId; }
EsriToolbar.prototype.getToolId = function(elementId) { return elementId.substring(elementId.indexOf("|") + 1, elementId.length); }

function EsriTextToolbar(id, container, mapId) {
  this.inheritsFrom(new EsriToolbar(id, container, mapId, "TEXT"));
  var self = this;

  this.addToolItem = function(toolItem) {
    this.toolItems[this.getToolId(this.getToolItemContainerId(toolItem.id))] = toolItem;
    if (this.toolItemNames.indexOf(toolItem.id) == -1) {
      var parentCell = this.getNextToolbarCell();
      var toolDiv = document.createElement("div");
      var toolText = document.createTextNode(toolItem.name);
      toolDiv.id = this.getToolItemContainerId(toolItem.id);
      if(toolItem.isDisabled) toolDiv.className = "esriTextToolbarDisabled";
      else toolDiv.className = "esriTextToolbarDefault";
      toolDiv.appendChild(toolText);
      parentCell.appendChild(toolDiv);
      this.toolItemNames.push(toolItem.id);
    }
  }

  this.setToolItemInactive = function(toolId) { document.getElementById(this.getToolItemContainerId(toolId)).className = "esriTextToolbarDefault"; }
  this.setToolItemActive = function(toolId) { document.getElementById(this.getToolItemContainerId(toolId)).className = "esriTextToolbarSelected"; }
  this.setToolItemDisabled = function(toolId) { document.getElementById(this.getToolItemContainerId(toolId)).className = "esriTextToolbarDisabled"; }

  this.processMouseClick = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(tool && !tool.isDisabled) {
      toolId = self.getToolId(el.id);
      if (self.mapId) EsriControls.maps[self.mapId].setCurrentToolItem(self.toolItems[toolId], self.id);
      else tool.activate();
    }
  }

  this.processMouseOver = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(tool && !(EsriControls.maps[self.mapId].currentTool == tool) && !tool.isDisabled) el.className = "esriTextToolbarHover";
  }

  this.processMouseOut = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(tool && !(EsriControls.maps[self.mapId].currentTool == tool) && !tool.isDisabled) el.className = "esriTextToolbarDefault";
  }

  if (container) this.init(container);
}

function EsriImageToolbar(id, container, mapId) {
  this.inheritsFrom(new EsriToolbar(id, container, mapId, "IMAGE"));
  var self = this;

  this.addToolItem = function(toolItem) {
    this.toolItems[toolItem.id] = toolItem;
    if (this.toolItemNames.indexOf(toolItem.id) == -1) {
      var parentCell = this.getNextToolbarCell();
      var toolImage = document.createElement("img");
      toolImage.src = toolItem.defaultImage;
      toolImage.id = this.getToolItemContainerId(toolItem.id);
      parentCell.appendChild(toolImage);
      this.toolItemNames.push(toolItem.id);
      if (toolItem.toolTip) {
        toolImage.alt = toolItem.toolTip;
        toolImage.title = toolItem.toolTip;
      }
      if(toolItem.isDisabled) {
        toolImage.className = "esriImageToolbarDisabled";
        this.setToolItemDisabled(toolItem.id);
      }
      else toolImage.className = "esriImageToolbarDefault";
    }
  }

  this.setToolItemInactive = function(toolId) {
    var el = document.getElementById(this.getToolItemContainerId(toolId));
    var tool = this.toolItems[toolId];
    tool.isDisabled = false;
    el.src = tool.defaultImage;
    el.className = "esriImageToolbarDefault";
  }

  this.setToolItemActive = function(toolId) {
    var el = document.getElementById(this.getToolItemContainerId(toolId));
    var tool = this.toolItems[toolId];
    tool.isDisabled = false;
    if(tool.selectedImage) {
      el.src = tool.selectedImage;
      el.className = "esriImageToolbarDefault";
    }
    else {
      el.src = tool.defaultImage;
      el.className = "esriImageToolbarSelected";
    }
  }

  this.setToolItemDisabled = function(toolId) {
    var el = document.getElementById(this.getToolItemContainerId(toolId));
    var tool = this.toolItems[toolId];
    tool.isDisabled = true;
    if(tool.disabledImage) {
      el.src = tool.disabledImage;
      el.className = "esriImageToolbarDefault";
    }
    else el.className = "esriImageToolbarDisabled";
  }

  this.processMouseClick = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(tool && !tool.isDisabled) {
      toolId = self.getToolId(el.id);
      if (self.mapId) EsriControls.maps[self.mapId].setCurrentToolItem(self.toolItems[toolId], self.id);
      else tool.activate();
    }
  }

  this.processMouseOver = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(tool && !(EsriControls.maps[self.mapId].currentTool == tool) && !tool.isDisabled) {
      if(tool.hoverImage) el.src = tool.hoverImage;
      else el.className = "esriImageToolbarHover";;
    }
  }

  this.processMouseOut = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(tool && !(EsriControls.maps[self.mapId].currentTool == tool) && !tool.isDisabled) {
      el.src = tool.defaultImage;
      el.className = "esriImageToolbarDefault";
    }
  }

  if (container) this.init(container);
}

function EsriImageAndTextToolbar(id, container, mapId) {
  this.inheritsFrom(new EsriToolbar(id, container, mapId, "IMAGE_AND_TEXT"));
  var self = this;

  this.textPos = "RIGHT";
  this.imgAlign = "CENTER";
  this.textAlign = "CENTER";
  this.divAlign = "CENTER";

  var tableStyle = "border:NONE; margin:0px; padding:0px;";

  this.addToolItem = function(toolItem) {
    this.toolItems[this.getToolId(this.getToolItemContainerId(toolItem.id))] = toolItem;
    if (this.toolItemNames.indexOf(name) == -1) {
      var parentCell = this.getNextToolbarCell();
      var div = document.createElement("div");
      var image = document.createElement("img");
      var label = document.createTextNode(toolItem.name);
      var imgCell = document.createElement("td");
      var txtCell = document.createElement("td");

      div.id = this.getToolItemContainerId(toolItem.id);
      div.align = this.divAlign;
      txtCell.id = this.getToolItemContainerId(toolItem.id) + "_txtc";
      txtCell.align = this.textAlign;
      txtCell.width = "100%";
      imgCell.id = this.getToolItemContainerId(toolItem.id) + "_imgc";
      imgCell.align = this.imgAlign;
      image.src = toolItem.defaultImage;
      image.id = this.getToolItemContainerId(toolItem.id) + "_img";
      imgCell.appendChild(image);
      txtCell.appendChild(label);
      var table = div.appendChild(addToTable(imgCell, txtCell));
      table.id = this.getToolItemContainerId(toolItem.id) + "_tbl";
      parentCell.appendChild(div);
      this.toolItemNames.push(toolItem.id);
      if(toolItem.isDisabled) {
        div.className = txtCell.className = "esriImageAndTextToolbarDisabled";
        this.setToolItemDisabled(toolItem.id);
      }
      else div.className = txtCell.className = "esriImageAndTextToolbarDefault";

      if(toolItem.toolTip) {
        image.alt = toolItem.toolTip;
        image.title = toolItem.toolTip;
      }
    }
  }

  function addToTable(imgCell, txtCell) {
    var table = document.createElement("table");
    table.width = "100%";
    table.border = 0;
    table.margin = 0;
    table.cellSpacing = 0;
    table.cellPadding = 1;
    EsriUtils.setElementStyle(table, tableStyle);
    var body = document.createElement("tbody");
    table.appendChild(body);
    if (self.textPos.toUpperCase() == "RIGHT" || self.textPos.toUpperCase() == "LEFT") {
      var row = body.appendChild(document.createElement("tr"));
      row.appendChild(imgCell);
      if (self.textPos.toUpperCase() == "RIGHT") row.appendChild(txtCell);
      else row.insertBefore(txtCell, imgCell);
    }
    else {
      var imgRow = document.createElement("tr");
      var txtRow = document.createElement("tr");
      imgRow.appendChild(imgCell);
      txtRow.appendChild(txtCell);
      body.appendChild(imgRow);
      if (self.textPos.toUpperCase() == "TOP") body.insertBefore(txtRow, imgRow);
      else body.appendChild(txtRow);
    }
    return table;
  }

  this.setToolItemInactive = function(toolId) {
    var el = document.getElementById(this.getToolItemContainerId(toolId));
    var tool = this.toolItems[toolId];
    tool.isDisabled = false;
    el.src = tool.defaultImage;
    el.className = getTextCellElement(el).className = "esriImageAndTextToolbarDefault";
  }

  this.setToolItemActive = function(toolId) {
    var el = document.getElementById(this.getToolItemContainerId(toolId));
    var tool = this.toolItems[toolId];
    tool.isDisabled = false;
    el.className = getTextCellElement(el).className = "esriImageAndTextToolbarSelected";
  }

  this.setToolItemDisabled = function(toolId) {
    var el = document.getElementById(this.getToolItemContainerId(toolId));
    var tool = this.toolItems[toolId];
    tool.isDisabled = true;
    el.className = getTextCellElement(el).className = "esriImageAndTextToolbarDisabled";
  }

  this.processMouseClick = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(!tool && isToolImage(el.id)) {
      el = getToolDivElementFromImage(el.id);
      tool = self.toolItems[self.getToolId(el.id)];
    }

    if(tool && !tool.isDisabled) {
      toolId = self.getToolId(el.id);
      if (self.mapId) EsriControls.maps[self.mapId].setCurrentToolItem(self.toolItems[toolId], self.id);
      else tool.activate();
    }
  }

  this.processMouseOver = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(!tool && isToolImage(el.id)) {
      el = getToolDivElementFromImage(el.id);
      tool = self.toolItems[self.getToolId(el.id)];
    }

    if(tool && !(EsriControls.maps[self.mapId].currentTool == tool) && !tool.isDisabled) el.className = getTextCellElement(el).className = "esriImageAndTextToolbarHover";
  }

  this.processMouseOut = function(event) {
    var el = EsriUtils.getEventSource(event);
    var tool = self.toolItems[self.getToolId(el.id)];
    if(!tool && isToolImage(el.id)) {
      el = getToolDivElementFromImage(el.id);
      tool = self.toolItems[self.getToolId(el.id)];
    }

    if(tool && !(EsriControls.maps[self.mapId].currentTool == tool) && !tool.isDisabled) el.className = getTextCellElement(el).className = "esriImageAndTextToolbarDefault";
  }

  function isToolImage(imageId) { return imageId.lastIndexOf("_img") == (imageId.length - 4) || imageId.lastIndexOf("_tbl") == (imageId.length - 4) || imageId.lastIndexOf("_imgc") == (imageId.length - 5) || imageId.lastIndexOf("_txtc") == (imageId.length - 5); }
  function getTextCellElement(divEl) { return document.getElementById(divEl.id + "_txtc"); }

  function getToolDivElementFromImage(imageId) {
    var parentId = imageId.substring(0, imageId.lastIndexOf("_"));
    return document.getElementById(parentId);
  }

  if (container) this.init(container);
}
