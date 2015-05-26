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

function EsriTask(id, mapId) {
  this.inheritsFrom(new EsriControl(id, "Task", 0, 0, 0, 0));
  this.mapId = mapId;
  var self = this;
  var div = document.createElement("div");
  EsriUtils.hideElement(div);

  this.updateAsync = function(xml, eventSources) {
    var idTag = xml.getElementsByTagName("id").item(0);
    var id = idTag.firstChild.nodeValue;
    if (id == self.id) {
      self.mapId = xml.getElementsByTagName("map-id").item(0).firstChild.nodeValue;
      var contentTags = xml.getElementsByTagName("task-cdata-content");
      var content;
      if (EsriUtils.isIE) content = contentTags.item(0).firstChild.nodeValue;
      else {
        content = new XMLSerializer().serializeToString(contentTags.item(0));
        content = content.substring("<task-cdata-content><![CDATA[".length, content.indexOf("]]></task-cdata-content>"));
      }

      div.innerHTML = content;

      var newTaskCell = null;
      var taskCells = [];
      var taskCellIds = [];
      var tags = ["div"];

      for (var t=0;t<tags.length;t++) {
        var elems = div.getElementsByTagName(tags[t]);
        for (var i=0;i<elems.length;i++) {
          var elem = elems.item(i);
          if (elem.id.indexOf("EsriTaskCell_") == 0) {
            taskCellIds.push(elem.id);
            taskCells[elem.id] = elem;
          }
        }

        for (var n=0;n<taskCellIds.length;n++) {
          var oldTaskCell = document.getElementById(taskCellIds[n]);
          EsriUtils.hideElement(oldTaskCell);
          var newTaskCell = taskCells[taskCellIds[n]];
          EsriUtils.hideElement(newTaskCell);
          var rect = EsriUtils.getElementBounds(newTaskCell);
          EsriUtils.cloneElementStyle(oldTaskCell, newTaskCell);
          oldTaskCell.parentNode.replaceChild(newTaskCell, oldTaskCell);
          EsriUtils.removeElement(oldTaskCell);
          if ("taskWindowManager" in window) {
            for (var w=0;w<taskWindowManager.windowIds.length;w++) {
              var win = taskWindowManager.windows[taskWindowManager.windowIds[w]];
              if (win.pageElement.divId == taskCellIds[n]) {
                var winZ = -1;
                var closed = win.closed;
                if (closed) {
                  winZ = win.divObject.style.zIndex;
                  EsriUtils.setElementStyle(win.divObject, "z-index:-1;");
                }
                win.pageElement.divObject = newTaskCell;
                if (! win.fittable) {
                  if (rect.width && rect.height) {
                    var dx = win.bounds.width - win.pageElement.bounds.width;
                    var dy = win.bounds.height - win.pageElement.bounds.height;
                    win.bounds.width = rect.width + dx;
                    win.bounds.height = rect.height + dy;
                  }
                }
                taskWindowManager.loadProperties("win_" + self.id, true);
                win.update();
                win.fit();
                if (closed) {
                  if (! winZ) EsriUtils.removeElementStyle(win.divObject, "z-index;");
                  else EsriUtils.setElementStyle(win.divObject, "z-index:" + winZ + ";");
                }
                break;
              }
            }
          }
          EsriUtils.showElement(newTaskCell);
        }
      }
      div.innerHTML = "";

      var formId = EsriControls.maps[mapId].formId;
      if (eventSources.indexOf(self.id) != -1) {
        var formElements = document.forms[formId].elements;
        for (var i=0;i<formElements.length;i++) {
          var elementId = formElements[i].id;
          if ((elementId.indexOf(self.id + "_action_") != -1 || elementId.indexOf(self.id + "_tool_") != -1) && elementId.indexOf("button") == -1) {
            EsriUtils.removeFormElement(formId, elementId);
            EsriUtils.removeFormElement(formId, elementId + "_value");
          }
        }
      }

      var activeToolTags = xml.getElementsByTagName("active-tool");
      if (activeToolTags.length > 0) {
        var activeTool = activeToolTags.item(0).firstChild.nodeValue;
        EsriUtils.removeFormElement(formId, activeTool);
        EsriUtils.removeFormElement(formId, activeTool + "_value");
        EsriUtils.removeFormElement(formId, self.mapId);
        EsriUtils.removeFormElement(formId, self.mapId + "_mode");
        EsriUtils.removeFormElement(formId, self.mapId + "_minx");
        EsriUtils.removeFormElement(formId, self.mapId + "_miny");
        EsriUtils.removeFormElement(formId, self.mapId + "_maxx");
        EsriUtils.removeFormElement(formId, self.mapId + "_maxy");
        EsriUtils.removeFormElement(formId, self.mapId + "_coords");
        EsriUtils.removeFormElement(formId, self.mapId + "_value");
        EsriControls.maps[self.mapId].reactivateCurrentToolItem();
      }

      for (var i=0;i<self.updateListenerNames.length;i++) self.updateListeners[self.updateListenerNames[i]](self);
    }
  }

  EsriControls.tasks[id] = this;
  EsriControls.taskIds.push(id);
  EsriControls.addPostBackTagHandler("task", EsriControls.tasks[self.id].updateAsync);
}

EsriTask.initTaskGlobals = function(form) {
  if (! window.taskWindowManager) {
    var input = document.createElement("input");
    input.type = "HIDDEN";
    input.id = input.name = "taskWinProp";
    form.appendChild(input);

    window.taskWindowManager = new EsriWindowManager("taskWindowManager", document.getElementById("taskWinProp"));
  }
}

EsriTask.initTask = function(taskId, container, windowTitle, closed) {
  var taskCellId = "EsriTaskCell_" + taskId;
  var taskCell = document.getElementById(taskCellId);

  if (! taskCell) {
    taskCell = container.appendChild(document.createElement("div"));
    taskCell.id = taskCellId;
  }

  if (windowTitle) {
    var pe = new EsriPageElement("pe_" + taskCellId);
    pe.divObject = taskCell;
    pe.divId = taskCellId;

    var win = new EsriWindow("win_" + taskCellId, windowTitle, pe);
    win.closed = closed;
    win.init(container);
    win.fittable = true;
    win.fit();
    taskWindowManager.addWindow(win, true);
    win.center();
  }
}

EsriTask.loadTask = function(taskId, mapId, configs) {
  if (EsriControls.tasks[taskId]) return true;

  var formId = EsriControls.maps[mapId].formId;
  var form = document.getElementById(formId);
  EsriTask.initTaskGlobals(form);

  var id, container, title, config;
  for (var i=0, il=configs.length; i<il; i++) {
    config = configs[i];
    id = taskId;
    container = config.container ? config.container : formId;
    title = config.title;

    if (i > 0) { id += (i+1); }
    EsriTask.initTask(id, document.getElementById(container), title, i > 0);
  }

  new EsriTask(taskId, mapId);

  var params = "renderTask=renderTask&formId=" + formId + "&taskId=" + taskId + "&" + EsriUtils.buildRequestParams("mapForm");
  EsriUtils.sendAjaxRequest(EsriUtils.getServerUrl("mapForm"), params, false, EsriControls.processPostBack);
};