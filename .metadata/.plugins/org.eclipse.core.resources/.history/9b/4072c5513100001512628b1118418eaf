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

function EsriWindowManager(id, formField) {
  this.backZIndex = 110;
  this.frontZIndex = 111;
  this.formField = formField;
  this.windowIds = new Array();
  this.windows = new Array();
}

EsriWindowManager.prototype.getProperties = function() { if(this.formField) return this.formField.value;}
EsriWindowManager.prototype.setProperties = function(props) { if(this.formField) this.formField.value = props; }

EsriWindowManager.prototype.saveProperties = function() {
  var props = "";
  for(i = 0; i < this.windowIds.length; i++) {
    var id = this.windowIds[i];
    var win = this.windows[id];
    props += id + ";left=" + win.bounds.left + ";top=" + win.bounds.top + ";width=" + win.bounds.width + ";height="+ win.bounds.height + ";collapsed=" + win.collapsed + ";closed=" + win.closed + "|";
  }
  this.setProperties(props);
}

EsriWindowManager.prototype.loadProperties = function(winId, resize) {
  var propsStr = this.getProperties();
  if (propsStr.indexOf(winId) == -1) return;
  var wins = propsStr.split("|");
  var win = this.windows[winId];
  for (var j=0;j<wins.length;j++) {
    var props = wins[j].split(";");
    if(winId == props[0]) {
      for (var i=1;i<props.length;i++) {
        var prop = props[i].split("=");
        switch (prop[0].toLowerCase()) {
          case "left": win.bounds.left = parseInt(prop[1]); break;
          case "top": win.bounds.top = parseInt(prop[1]); break;
          case "width":
            var value = parseInt(prop[1]);
            if (resize) { if (win.bounds.width < value) win.bounds.width = value; }
            else win.bounds.width = value;
            break;
          case "height":
            var value = parseInt(prop[1]);
            if (resize) { if (win.bounds.height < value) win.bounds.height = value; }
            else win.bounds.height = value;
            break;
          case "closed": win.closed = (prop[1].toLowerCase() == "true"); break;
          case "collapsed": win.collapsed = (prop[1].toLowerCase() == "true"); break;
        }
      }
      break;
    }
  }
}

EsriWindowManager.prototype.restoreProperties = function(resize) {
  for (var i=0;i<this.windowIds.length;i++) {
    this.loadProperties(this.windowIds[i], resize);
    this.windows[this.windowIds[i]].update();
  }
}

EsriWindowManager.prototype.addWindow = function(win, resize) {
  this.windowIds.push(win.id);
  this.windows[win.id] = win;
  win.setWindowManager(this);
  if(this.formField) this.loadProperties(win.id, resize);
  win.update();
}

EsriWindowManager.prototype.toFront = function(winId) {
  if(this.windows[winId]) {
    for(var i = 0; i < this.windowIds.length; i++) {
      var id = this.windowIds[i];
      if(id == winId) this.windows[id].toFront(this.frontZIndex);
      else this.windows[id].toBack(this.backZIndex);
    }
  }
}

EsriWindowManager.prototype.makeAllVisible = function(w, h) {
  for(var i = 0; i < this.windowIds.length; i++) {
    var id = this.windowIds[i];
    var win = this.windows[id];
    if(win.bounds.left <= 0) while(win.bounds.left <= 0) win.bounds.left++;
    if(win.bounds.top <= 0) while(win.bounds.top <= 0) win.bounds.top++;
    if(win.bounds.left + win.bounds.width > w) while(win.bounds.left + win.bounds.width >= w && win.bounds.left > 0) win.bounds.left--;
    if(win.bounds.top + win.bounds.height > h) while(win.bounds.top + win.bounds.height >= h && win.bounds.top > 0) win.bounds.top--;
    EsriUtils.moveElement(win.divObject.id, win.bounds.left, win.bounds.top);
  }
}