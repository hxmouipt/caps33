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

if (! Object.prototype.inheritsFrom) { Object.prototype.inheritsFrom = function(oSuper) { for (sProperty in oSuper) this[sProperty] = oSuper[sProperty]; } }

if (! Array.prototype.indexOf) {
  Array.prototype.indexOf = function(item) {
    for (var i=0;i<this.length;i++) if (this[i] == item) return i;
    return -1;
  }
}

if (! String.prototype.trim) { String.prototype.trim = function() { return this.replace(/^\s+/g, '').replace(/\s+$/g, ''); } }

if (! String.prototype.endsWith) {
  String.prototype.endsWith = function(str) {
    if (str.length > this.length) return false;
    if (this.lastIndexOf(str) + str.length == this.length) return true;
    return false;
  }
}

function EsriPoint(x, y) {
  this.x = this.y = null;
  this.reshape(x, y);
}

EsriPoint.prototype.reshape = function(x, y) {
  this.x = x;
  this.y = y;
}

EsriPoint.prototype.offset = function(oX, oY) { return new EsriPoint(this.x + oX, this.y + oY); }
EsriPoint.prototype.equals = function(pt) { return this.x == pt.x && this.y == pt.y; }
EsriPoint.prototype.toString = function() { return "EsriPoint [x = " + this.x + ", y = " + this.y + "]"; }

function EsriRectangle(left, top, width, height) {
  this.left = this.top = this.width = this.height = 0;
  this.center = null;
  this.reshape(left, top, width, height);
}

EsriRectangle.prototype.offset = function(oX, oY) { return new EsriRectangle(this.left + oX, this.top + oY, this.width, this.height); }

EsriRectangle.prototype.reshape = function(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
  this.center = new EsriPoint(this.left + (this.width / 2), this.top + (this.height / 2));
}

EsriRectangle.prototype.scale = function(factor, scaleCenter) {
  var newWd = this.width * factor;
  var newHt = this.height * factor;
  var rect = new EsriRectangle(this.center.x - (newWd / 2), this.center.y - (newHt / 2), newWd, newHt);

  if (scaleCenter) {
    var x = this.center.x - scaleCenter.x;
    var y = this.center.y - scaleCenter.y;
    var shiftX = x * factor;
    var shiftY = y * factor;
    var moveX = shiftX - x;
    var moveY = shiftY - y;
    rect = rect.offset(moveX, moveY);
  }
  return rect;
}

EsriRectangle.prototype.parseStyle = function(style) {
  var a = style.split(";");
  var l = t = w = h = 0;
  for (var i=0;i<a.length;i++) {
    if (a[i] == "") continue;
    var p = a[i].trim().split(":");
    if (p[0] == "" || p[1] == "") continue;
    switch (p[0]) {
      case "left": l = EsriUtils.getStyleValue(p[1]); break;
      case "top" : t = EsriUtils.getStyleValue(p[1]); break;
      case "width" : w = EsriUtils.getStyleValue(p[1]); break;
      case "height" : h = EsriUtils.getStyleValue(p[1]); break;
    }
  }
  this.reshape(l, t, w, h);
  return this;
}

EsriRectangle.prototype.equals = function(rect) { return this.left == rect.left && this.top == rect.top && this.width == rect.width && this.height == rect.height; }
EsriRectangle.prototype.toStyle = function() { return "left:" + this.left + "px; top:" + this.top + "px; width:" + this.width + "px; height:" + this.height + "px;"; }
EsriRectangle.prototype.toString = function() { return "EsriRectangle [left = " + this.left + ", top = " + this.top + ", width = " + this.width + ", height = " + this.height + "]"; }

function EsriColor(r, g, b) {
  this.red = r;
  this.green = g;
  this.blue = b;
}

EsriColor.prototype.fromHex = function(hex) {
  this.red = EsriUtils.fromHex(((hex.charAt(0)=="#") ? hex.substring(1, 7) : hex).substring(0, 2));
  this.green = EsriUtils.fromHex(((hex.charAt(0)=="#") ? hex.substring(1, 7) : hex).substring(2, 4));
  this.blue = EsriUtils.fromHex(((hex.charAt(0)=="#") ? hex.substring(1, 7) : hex).substring(4, 6));
  return this;
}

EsriColor.prototype.fromString = function(s) {
  var cs = s.split(",");
  this.red = parseInt(cs[0]);
  this.green = parseInt(cs[1]);
  this.blue = parseInt(cs[2]);
  return this;
}

EsriColor.prototype.toHex = function() { return "#" + EsriUtils.toHex(this.red).substring(4) + EsriUtils.toHex(this.green).substring(4) + EsriUtils.toHex(this.blue).substring(4); }
EsriColor.prototype.toString = function() { return "EsriColor [red = " + this.red + ", green = " + this.green + ", blue = " + this.blue + "]"; }

function EsriGraphicsElement(id) {
  this.id = id;
  this.gc = null;

  this.lineColor = "#000";
  this.lineOpacity = 1;
  this.lineWidth = 1;
  this.fillColor = "#000";
  this.fillOpacity = 0;

  this.show = function() { EsriUtils.showElement(this.gc); }
  this.hide = function() { EsriUtils.hideElement(this.gc); }
  this.destroy = function() {}
  this.clip = function(rect) {}
  this.clearClip = function() {}
  this.remove = function(element) {}
  this.clear = function() {}
  this.drawPoint = function(point, symbol) {}
  this.drawLine = function(point1, point2, symbol) {}
  this.drawRectangle = function(rect, symbol) {}
  this.drawOval = function(bounds, symbol) {}
  this.drawCircle = function(center, radius, symbol) {}
  this.drawPolyline = function(points, symbol) {}
  this.drawPolygon = function(points, symbol) {}
  this.drawImage = function(src, left, top, width, height) {}
  this.drawText = function(txt, bounds, style, symbol) {}
  this.updateSymbol = function(el, symbol) {}
}

function EsriGraphicsSymbol(lc, lo, lw, fc, fo) {
  this.lineColor = lc||"#000";
  this.lineOpacity = lo||1;
  this.lineWidth = lw||1;
  this.fillColor = fc||"#000";
  this.fillOpacity = fo||0;
}

var EsriUtils = new function() {
  var appName = window.navigator.appName.toLowerCase();
  var gc;
  var alphaRegExp = new RegExp("progid:DXImageTransform.Microsoft.Alpha\\(opacity=\\d{1,}\\)");
  var alphaImageLoaderRegExp = new RegExp("^.*\\b\\b.*$");

  this.isNav = appName.indexOf("netscape") != -1;
  this.isIE = appName.indexOf("microsoft") != -1;

  this.userAgent = navigator.userAgent;
  this.isIE6 = this.userAgent.indexOf("MSIE 6") != -1;
  this.isIE7 = this.userAgent.indexOf("MSIE 7") != -1;
  this.isFF15 = this.userAgent.indexOf("Firefox/1.5") != -1 || this.userAgent.indexOf("Firefox/2.") != -1;
  this.navType = "IE";
  this.doPostBack = true;

  if (! this.isIE) {
    if (this.userAgent.indexOf("Firefox") != -1) this.navType = "Firefox";
    else if (this.userAgent.indexOf("Opera") != -1) this.navType = "Opera";
    else if (this.userAgent.indexOf("Safari") != -1) this.navType = "Safari";
    else if (this.userAgent.indexOf("Netscape") != -1) this.navType = "Netscape";
    else this.navType = "Mozilla";
  }

  if (this.isIE) {
    this.graphicsType = "VML";
    document.writeln("<xml:namespace ns=\"urn:schemas-microsoft-com:vml\" prefix=\"v\"/>\n");
    document.writeln("<style type=\"text/css\"> v\\:* { behavior: url(#default#VML);} </style>\n");
  }
  else this.graphicsType = "SVG";

  this.leftButton = 1;
  this.rightButton = 2;
  if (this.isNav) this.rightButton = 3;
  this.mouseWheelUnit = 3;
  if (this.isIE) this.mouseWheelUnit = 120;

  this.KEY_LEFT = 37;
  this.KEY_UP = 38;
  this.KEY_RIGHT = 39;
  this.KEY_DOWN = 40;
  this.KEY_ENTER = 13;
  this.KEY_ESCAPE = 27;

  this.hideElement = function(element) { element.style.display = "none"; }
  this.showElement = function(element) { element.style.display = "block"; }
  this.toggleElement = function(element) { (element.style.display.toLowerCase() == "block") ? element.style.display = "none" : element.style.display = "block"; }
  this.moveElement = function(element, left, top) { EsriUtils.setElementStyle(element, "left:" + left + "px; top:" + top + "px;"); }

  this.getXY = function(e) {
    if (this.isIE) return new EsriPoint(window.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - 2, window.event.clientY + document.body.scrollTop + document.documentElement.scrollTop - 2);
    else return new EsriPoint(e.pageX, e.pageY);
  }

  this.getEventSource = function(e) {
    if (this.isIE) return window.event.srcElement;
    else return e.target;
  }

  this.stopEvent = function(e) {
    if (this.isIE) {
      window.event.returnValue = false;
      window.event.cancelBubble = true;
    }
    else {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  this.getKeyCode = function(e) {
    if (this.isIE) return window.event.keyCode;
    else return e.keyCode;
  }

  this.getElementBounds = function(e) {
    var es = e.style;
    return new EsriRectangle(this.getStyleValue(es.left), this.getStyleValue(es.top), this.getStyleValue(es.width), this.getStyleValue(es.height));
  }

  this.getElementPageBounds = function(e) {
    var eL = eT = 0;
    var elB, etB;
    var eW = e.offsetWidth;
    var eH = e.offsetHeight;
    while(e) {
      elB = 0;
      etB = 0;
      eL += e.offsetLeft;
      eT += e.offsetTop;

      if (e.style && e.style.borderWidth != "") {
        elB = parseInt(e.style.borderWidth);
        etB = parseInt(e.style.borderWidth);
      }
      else if (e.style && e.style.borderLeftWidth != "") {
        elB = parseInt(e.style.borderLeftWidth);
        etB = parseInt(e.style.borderTopWidth);
      }
      if (isNaN(elB)) elB = 0;
      if (isNaN(etB)) etB = 0;

      eL += elB;
      eT += etB;
      e = e.offsetParent;
    }
    return new EsriRectangle(eL, eT, eW, eH);
  }

  this.getPageBounds = function() {
    if (window.innerHeight) return new EsriRectangle(0, 0, window.innerWidth, window.innerHeight);
    else if (document.documentElement.clientHeight) return new EsriRectangle(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
    else if (document.body.clientHeight) return new EsriRectangle(0, 0, document.body.clientWidth, document.body.clientHeight);
    else return new EsriRectangle(0, 0, 0, 0);
  }

  this.isLeftButton = function(e) { return this.getMouseButton(e) == this.leftButton; }

  this.getMouseButton = function(e) {
    if (this.isIE) return window.event.button;
    else return e.which;
  }

  function camelizeStyle(name) {
    var a = name.split("-");
    var s = a[0];
    for (var c=1;c<a.length;c++) s += a[c].substring(0, 1).toUpperCase() + a[c].substring(1);
    return s;
  }

  this.setElementStyle = function(e, css) {
    var es = e.style;
    var ss = css.split(";");
    for (var i=0;i<ss.length;i++) {
      var s = ss[i].split(":");
      s[0] = s[0].trim();
      if (s[0] == "" || ! s[1]) continue;
      eval("es." + camelizeStyle(s[0]) + " = \"" + s[1].trim() + "\"");
    }
  }

  this.getElementBorders = function(e) {
    var es = e.style;
    return {
      top: parseInt(es.borderTopWidth),
      right: parseInt(es.borderRightWidth),
      bottom: parseInt(es.borderBottomWidth),
      left: parseInt(es.borderLeftWidth)
    }
  }

  this.getStyleByClassName = function(name) {
    var styleSheets = document.styleSheets;
    name = name.toLowerCase();
    for (var s=(styleSheets.length-1);s>=0;s--) {
      var rules;
      if (this.isIE) rules = styleSheets.item(s).rules;
      else rules = styleSheets.item(s).cssRules;
      for (var i=(rules.length-1);i>=0;i--) {
        if (rules.item(i).selectorText && rules.item(i).selectorText.toLowerCase() == name) return rules.item(i).style;
      }
    }
    return null;
  }

  this.removeElementStyle = function(e, css) {
    var es = e.style;
    var ss = css.split(";");
    for (var i=0;i<ss.length;i++) {
      var s = ss[i].split(":");
      s[0] = s[0].trim();
      if (s[0] == "") continue;
      if (this.isIE) es.removeAttribute(camelizeStyle(s[0]));
      else es.removeProperty(s[0]);
    }
  }

  this.setElementOpacity = function(e, o) {
    if (this.isIE) {
      var filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + (o * 100) + ")";
      if (e.runtimeStyle.filter) e.runtimeStyle.filter = e.runtimeStyle.filter.replace(alphaRegExp, filter);
      else e.runtimeStyle.filter = filter;
    }
    else this.setElementStyle(e, "-moz-opacity:" + o + "; opacity:" + o + ";");
  }

  this.cloneElementStyle = function(src, target) {
    var ss = src.style;
    var ts = target.style;
    for (var s in ss) try { eval("ts." + s + " = ss." + s + ";"); } catch (e) {};
  }

  this.getElementsByClassName = function(element, className) {
    var cs = element.getElementsByTagName("*");
    var es = [];
    for (var i=0;i<cs.length;i++) {
      var c = cs.item(i);
      if (c.className.match(new RegExp("(^|\\s)" + className + "(\\s|$)"))) es.push(c);
    }
    return es;
  }

  this.removeElement = function(elem) {
    if (this.isIE) {
      if (! gc) {
        gc = document.body.appendChild(document.createElement("div"));
        this.hideElement(gc);
      }
      gc.appendChild(elem);
      gc.innerHTML = "";
    }
    else if (elem && elem.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  }

  this.createImage = function(src, width, height) {
    var img;
    if (this.isIE6) {
      img = document.createElement("div");
      EsriUtils.setElementStyle(img, "width:" + width + "; height:" + height + ";");
      var s = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "')";
      if (img.runtimeStyle.filter) img.runtimeStyle.filter = img.runtimeStyle.filter.replace(alphaImageLoaderRegExp, s);
      else img.runtimeStyle.filter = s;
    }
    else {
      img = document.createElement("img")
      img.src = src;
      EsriUtils.setElementStyle(img, "width:" + width + "; height:" + height + ";");
    }
    return img;
  }

  this.setImageSrc = function(img, src) {
    img.onload = null;
    if (this.isIE6 && !src.toLowerCase().endsWith(".gif") && !src.toLowerCase().endsWith(".jpg")) {
      var s = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "')";
      img.src = EsriControls.contextPath + "images/pixel.gif";
      if (img.runtimeStyle.filter) img.runtimeStyle.filter = img.runtimeStyle.filter.replace(alphaImageLoaderRegExp, s);
      else img.runtimeStyle.filter = s;
    }
    else img.src = src;
  }

  this.createGraphicsElement = function(id, cont) { return eval("new Esri" + this.graphicsType + "GraphicsElement(id, cont);"); }

  this.getStyleValue = function(s) {
    if (typeof s == "number") return s;
    var index = s.indexOf("px");
    if (index == -1) {
      index = s.indexOf("%");
      if (index == -1) return s;
      else return parseInt(s.substring(0, index));
    }
    return parseInt(s.substring(0, index));
  }

  this.addFormElement = function(fId, name, value) {
    var eId = fId + "_input_" + name;
    var inp = document.getElementById(eId);
    if (! inp) inp = document.createElement("input");
    inp.type = "HIDDEN";
    inp.id = eId;
    inp.name = name;
    inp.value = value;
    document.forms[fId].appendChild(inp);
  }

  this.removeFormElement = function(fId, name) {
    var inp = document.getElementById(fId + "_input_" + name);
    if (! inp) inp = document.getElementById(name);
    if (inp) inp.parentNode.removeChild(inp);
  }

  this.getJSessionId = function() {
    var start;
    if ((start = document.cookie.indexOf("JSESSIONID=")) != -1) {
      start = document.cookie.indexOf("=", start) + 1;
      var end = document.cookie.indexOf(";", start);
      return document.cookie.substring(start, (end == -1) ? document.cookie.length : end);
    }
    return "";
  }

  this.getServerUrl = function(fId) {
    if (document.forms[fId].action.indexOf(";jsessionid=") != -1) return encodeURI(document.forms[fId].action);
    else if (this.getJSessionId()) return encodeURI(document.forms[fId].action + ";jsessionid=" + this.getJSessionId());
    else return encodeURI(document.forms[fId].action);
  }

  this.createXmlHttpObject = function() {
    if (this.isIE) {
      try { return new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (exception) { return new ActiveXObject("Microsoft.XMLHTTP"); }
    }
    return new XMLHttpRequest();
  }

  this.buildRequestParams = function(fId) {
    var form = document.forms[fId];
    var params = "";
    for (i=0;i<form.elements.length;i++) {
      var e = form.elements[i];
      var eType = e.type;
      if (eType && e.name.trim().length > 0) {
        var eLow = eType.toLowerCase();
        if (eLow == "checkbox") { if (e.checked) params += "&" + e.name + "=" + encodeURIComponent(e.value); }
        else if (eLow == "select-multiple") {
          for (var c=0;c<e.childNodes.length;c++) {
            var child = e.childNodes.item(c);
            if (child.selected) params += "&" + e.name + "=" + encodeURIComponent(child.value);
          }
        }
        else if (eLow == "radio") { if (e.checked) params += "&" + e.name + "=" + encodeURIComponent(e.value); }
        else if (eLow != "button" && eLow != "submit") params += "&" + e.name + "=" + encodeURIComponent(e.value);
      }
    }
    return (params.indexOf("&") == 0) ? params.substring(1) : params;
  }

  this.submitForm = function(fId, async, callbackFunc) {
    if (! async || ! this.doPostBack) {
      this.removeFormElement(fId, "doPostBack");
      document.forms[fId].submit();
    }
    else {
      var params = "formId=" + encodeURIComponent(fId) + "&" + this.buildRequestParams(fId);
      this.sendAjaxRequest(this.getServerUrl(fId), params, false, callbackFunc);
    }
  }

  this.sendAjaxRequest = function(url, params, doGET, callback, contentType) {
    try {
      params = "isXMLHttp=" + encodeURIComponent("true") + "&" + params;

      var xh = this.createXmlHttpObject();
      xh.onreadystatechange = function() {
        if (xh != null && xh.readyState == 4) {
          try {
            if (xh.status == 200) {
              var xml = EsriUtils.getXmlDocument(xh);
              var error = EsriUtils.getErrorFromDocument(xml);
              if (error !== null) {
                if (error)
                  alert(error);
                return false;
              }
            }
            else {
              window.location.href = EsriControls.contextPath + "error.html";
            }
          }
          catch (exception) {
            alert("An error occurred while processing your request.");
            window.location.href = EsriControls.contextPath + "error.html";
            return false;
          }
        }
        callback(xh);
        if (xh != null && xh.readyState == 4) {
          xh = null;
        }
      };

      if (doGET) {
        xh.open("GET", url + "?" + params, true);
        xh.send(null);
      }
      else {
        xh.open("POST", url, true);
        xh.setRequestHeader("content-type", (contentType) ? contentType : "application/x-www-form-urlencoded");
        xh.send(params);
      }
      return xh;
    }
    catch (exception) { return null; }
  }

  this.getXmlDocument = function(xh) {
    var xml = xh.responseXML;
    if (xml && xml.firstChild) return xml;
    else return this.stringToXml(xh.responseText);
  }

  this.stringToXml = function(s) {
    try {
      var xml;
      if (EsriUtils.isIE) {
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = "false";
        xml.loadXML(s);
      }
      else {
        var parser = new DOMParser();
        xml = parser.parseFromString(s, "text/xml");
      }
      return xml;
    }
    catch (e) { return null; }
  }

  this.getErrorFromDocument = function(xml) {
    var errorTags = xml.getElementsByTagName("error");
    if (errorTags.length > 0) {
      var message = errorTags.item(0).getElementsByTagName("message").item(0).firstChild.nodeValue;
      var redirect = "redirect=";
      var i = message.indexOf(redirect);
      if (i != -1) {
        message = message.substring(i + redirect.length);
        window.location.href = EsriControls.contextPath + (message.indexOf("/") == 0 ? message.substring(1) : message);
        return "";
      }
      return message;
    }
    return null;
  }

  function decToHex(d) { return "0123456789abcdef".substring(d, d+1); }
  function hexToDec(h) { return "0123456789abcdef".indexOf(h); }

  this.toHex = function(n) { return (decToHex((0xf00000 & n) >> 20) + decToHex((0x0f0000 & n) >> 16) + decToHex((0x00f000 & n) >> 12) + decToHex((0x000f00 & n) >> 8) + decToHex((0x0000f0 & n) >> 4) + decToHex((0x00000f & n) >> 0)); }

  this.fromHex = function(h) {
    while (h.length < 6) h = "0" + h;
    return ((hexToDec(h.substring(0,1)) << 20) + (hexToDec(h.substring(1,2)) << 16) + (hexToDec(h.substring(2,3)) << 12) + (hexToDec(h.substring(3,4)) << 8) + (hexToDec(h.substring(4,5)) << 4) + (hexToDec(h.substring(5,6))));
  }

  this.getCheckBoxStates = function(root) {
    var chks = new Array();
    var inputs = root.getElementsByTagName("input");
    if (inputs) {
      for (var i=0, il=inputs.length; i<il; i++) {
        var input = inputs[i];
        if (input.type == "checkbox") chks[input.id] = input.checked;
      }
    }
    return chks;
  }

  this.setCheckBoxStates = function(root, chks) {
    var inputs = root.getElementsByTagName("input");
    if (inputs) {
      for (var i=0, il=inputs.length; i<il; i++) {
        var input = inputs[i];
        if (input.type == "checkbox" && chks[input.id] != undefined) input.checked = chks[input.id];
      }
    }
  }
  
  this.getXmlText = function(node) {
    if(! node) return null;
    return node.innerText || node.textContent || (node.firstChild ? node.firstChild.nodeValue : null);
  }
}

function EsriPageElement(id, l, t, w, h) {
  this.id = id;
  this.bounds = new EsriRectangle((l) ? l : 0, (t) ? t : 0, (w) ? w : 0, (h) ? h : 0);

  this.divId = "";
  this.divObject = null;

  this.resize = function(wd, ht) {
    this.bounds.reshape(this.bounds.left, this.bounds.top, wd, ht);
    EsriUtils.setElementStyle(this.divObject, "width:" + wd + "px; height:" + ht + "px;");
  }
}

EsriPageElement.prototype.show = function() { EsriUtils.showElement(this.divObject); }
EsriPageElement.prototype.hide = function() { EsriUtils.hideElement(this.divObject); }

function EsriControl(id, ct, l, t, w, h) {
  this.inheritsFrom(new EsriPageElement(id, l, t, w, h));
  this.type = ct;
  this.updateListeners = new Array();
  this.updateListenerNames = new Array();
}

EsriControl.prototype.addUpdateListener = function(name, listener) {
  if (this.updateListenerNames.indexOf(name) == -1) this.updateListenerNames.push(name);
  this.updateListeners[name] = listener;
}

EsriControl.prototype.removeUpdateListener = function(name) {
  var index = this.updateListenerNames.indexOf(name);
  if (index != -1) {
    this.updateListenerNames.splice(index, 1);
    this.updateListeners[name] = null;
  }
}

if (! window.EsriControls) {
  window.EsriControls = new function() {
    this.maps = new Array();
    this.mapIds = new Array();
    this.toolbars = new Array();
    this.toolbarIds = new Array();
    this.tocs = new Array();
    this.tocIds = new Array();
    this.overviews = new Array();
    this.overviewIds = new Array();
    this.tasks = new Array();
    this.taskIds = new Array();

    var postBackTagHandlers = new Array();
    var postBackTagNames = new Array();

    this.contextPath = "";

    var self = this;

    this.addPostBackTagHandler = function(tagName, handler) {
      if (postBackTagNames.indexOf(tagName) == -1) {
        postBackTagNames.push(tagName);
        postBackTagHandlers[tagName] = new Array();
      }

      if (postBackTagHandlers[tagName].indexOf(handler) != -1) return;
      postBackTagHandlers[tagName].push(handler);
    }

    this.removePostBackTagHandler = function(tagName, handler) {
      var i = postBackTagHandlers[tagName].indexOf(handler);
      if (i != -1) return postBackTagHandlers[tagName].splice(i, 1);
      return null;
    }

    this.processPostBack = function(xh) {
      if (xh != null && xh.readyState == 4 && xh.status == 200)
        EsriControls.processPostBackXML(EsriUtils.getXmlDocument(xh));
    }

    this.processPostBackXML = function(xml) {
      var formTags = xml.getElementsByTagName("form");
      var eventSources = new Array();
      if (formTags.length > 0) {
        var formTag = formTags.item(0);
        var formId = formTag.getElementsByTagName("id").item(0).firstChild.nodeValue;
        EsriUtils.removeFormElement(formId, "doPostBack");

        var eventSourceTags = formTag.getElementsByTagName("eventsource");
        for (var i=0;i<eventSourceTags.length;i++) {
          var eventSource = eventSourceTags.item(i).firstChild.nodeValue;
          eventSources.push(eventSource);
          EsriUtils.removeFormElement(formId, eventSource);
          EsriUtils.removeFormElement(formId, eventSource + "_value");
          EsriUtils.removeFormElement(formId, eventSource + "_mode");
        }
      }

      for (var h=0;h<postBackTagNames.length;h++) {
        var tagName = postBackTagNames[h];
        var tags = xml.getElementsByTagName(tagName);
        for (var i=0;i<tags.length;i++)
          for (var l=0;l<postBackTagHandlers[tagName].length;l++)
            postBackTagHandlers[tagName][l](tags.item(i), eventSources);
      }

      for (var m=0;m<self.mapIds.length;m++) {
        var map = self.maps[self.mapIds[m]];
        map.hideLoading();
        map.updateWebGraphics();
      }
    }
  }
}

function EsriAction() {
  this.name = "EsriAction";
  this.graphicsZIndex = 49;
  this.symbol = new EsriGraphicsSymbol("#f00", 1, 2, "#fff", 0);
  this.cursor = "crosshair";
  this.isActive = false;

  this.activate = null;
  this.deactivate = null;
  this.reactivate = function() {}
}

function EsriToolItem(id, tn, act, isM) {
  this.id = id;
  this.name = tn;
  this.action = act;
  this.isMarker = isM;
  this.showLoading = true;
  this.isCommand = this.isDisabled = this.clientPostBack = this.isActive = false;
  this.toolTip = this.element = this.control = null;
  this.defaultStyle = this.hoverStyle = this.selectedStyle = this.disabledStyle = null;
  this.defaultImage = this.hoverImage = this.selectedImage = this.disabledImage = null;

  this.activate = function() { if (this.action) this.action.activate(this.element, this.postAction); this.isActive = true; }
  this.deactivate = function() { if (this.action) this.action.deactivate(); this.isActive = false; }
  this.postAction = null;
}

function EsriDrawLineAction() {
  this.inheritsFrom(new EsriAction());
  this.name = "EsriDrawLineAction";
  var element, callback, contCallback, bounds, startPt, gr, graphic;
  var createGraphic = true;
  var self = this;

  this.activate = function(elem, cbF, ccbF, ge) {
    element = elem;
    callback = cbF;
    contCallback = ccbF;

    if (ge) {
      gr = ge;
      createGraphic = false;
    }
    else {
      gr = EsriUtils.createGraphicsElement(element.id + "_gr", element);
      EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
    }
    element.style.cursor = self.cursor;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      element.onmousedown = element.onmousemove = element.onmouseup = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      gr.gc.onmousedown = gr.gc.onmousemove = gr.gc.onmouseup = null;
      if (graphic) gr.remove(graphic);
      if (createGraphic) gr.destroy();
    }
    element = startPt = gr = graphic = null;
  }

  this.reactivate = function() {
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmousemove = gr.gc.onmousemove = null;
    element.onmouseup = gr.gc.onmouseup = null;
    var e = element;
    var c = callback;
    var cc = contCallback;
    var ge = createGraphics ? null : gr;
    this.deactivate();
    this.activate(e, c, cc, ge);
  }

  function processMouseDown(e) {
    self.isActive = true;
    bounds = EsriUtils.getElementPageBounds(element);
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmousemove = gr.gc.onmousemove = processMouseMove;
    element.onmouseup = gr.gc.onmouseup = processMouseUp;
    startPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (graphic) gr.remove(graphic);
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    if (graphic) gr.remove(graphic);
    var endPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    graphic = gr.drawLine(startPt, endPt, self.symbol);
    EsriUtils.stopEvent(e);
    if (contCallback) contCallback(startPt, endPt);
    return false;
  }

  function processMouseUp(e) {
    if (graphic) gr.remove(graphic);
    element.onmousemove = gr.gc.onmousemove = element.onmouseup = gr.gc.onmouseup = null;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
    EsriUtils.stopEvent(e);
    callback(startPt, EsriUtils.getXY(e).offset(-bounds.left, -bounds.top));

    self.isActive = false;
    return false;
  }
}

function EsriDragElementAction(docIn, enableMouseOut) {
  this.inheritsFrom(new EsriAction());
  this.name = "EsriDragElementAction";
  var docInput = docIn;
  var enMouseOut = enableMouseOut;
  this.cursor = "move";
  var element, startPt, callback, contCallback, bounds, movePt;
  var self = this;

  this.activate = function(elem, cbFunc, ccbFunc) {
    element = elem;
    callback = cbFunc;
    contCallback = ccbFunc;
    element.style.cursor = self.cursor;
    element.onmousedown = processMouseDown;
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      element.onmousedown = element.onmousemove = element.onmouseup = element.onmouseout = null;
      element.style.cursor = "default";
    }
    if (docInput) document.onmousedown = document.onmousemove = document.onmouseup = null;
    element = startPt = bounds = callback = null;
  }

  function processMouseDown(e) {
    if (! EsriUtils.isLeftButton(e)) return;
    self.isActive = true;
    bounds = EsriUtils.getElementBounds(element);

    startPt = EsriUtils.getXY(e);
    element.onmousemove = processMouseMove;
    element.onmouseup = processMouseUp;
    if (enMouseOut) element.onmouseout = processMouseOut;
    if (docInput) {
      document.onmousemove = processMouseMove;
      document.onmouseup = processMouseUp;
    }
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    var pt = movePt = EsriUtils.getXY(e);
    self.doDrag(pt.x - startPt.x, pt.y - startPt.y);
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseUp(e) {
    var pt = EsriUtils.getXY(e);
    element.onmousemove = element.onmouseup = element.onmouseout = null;
    if (docInput) document.onmousemove = document.onmouseup = null;
    self.endDrag(pt.x - startPt.x, pt.y - startPt.y);
    
    EsriUtils.stopEvent(e);
    self.isActive = false;
    return false;
  }

  function processMouseOut(e) {
    element.onmousemove = element.onmouseup = element.onmouseout = null;
    if (docInput) document.onmousemove = document.onmouseup = null;
    self.endDrag(movePt.x - startPt.x, movePt.y - startPt.y);

    EsriUtils.stopEvent(e);
    self.isActive = false;
    return false;
  }

  this.doDrag = function(x, y) {
    if (! self.isActive) {
      bounds = EsriUtils.getElementBounds(element);
      self.isActive = true;
    }

    EsriUtils.moveElement(element, bounds.left + x, bounds.top + y);
    if (contCallback) contCallback(x, y);
  }

  this.endDrag = function(x, y) {
    self.isActive = false;
    if (x != 0 || y != 0) EsriUtils.moveElement(element, bounds.left + x, bounds.top + y);
    callback(x, y);
  }
}

function EsriDrawRectShapeAction(shapeType) {
  this.inheritsFrom(new EsriAction());
  this.name = (shapeType == "Rectangle") ? "EsriDrawRectangleAction" : (shapeType == "Oval") ? "EsriDrawOvalAction" : "EsriDrawRectShapeAction";
  var element, bounds, startPt, callback, contCallback, gr, graphic;
  var shape = (shapeType) ? shapeType : "Rectangle";
  var createGraphic = true;
  var self = this;

  this.activate = function(elem, cF, ccF, ge) {
    element = elem;
    callback = cF;
    contCallback = ccF;

    if (ge) {
      gr = ge;
      createGraphic = false;
    }
    else {
      gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
      EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
    }
    
    element.style.cursor = self.cursor;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      element.onmousedown = element.onmousemove = element.onmouseup = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      gr.gc.onmousedown = gr.gc.onmousemove = gr.gc.onmouseup = null;
      if (graphic) gr.remove(graphic);
      if (createGraphic) gr.destroy();
    }
    element = startPt = gr = graphic = null;
  }

  this.reactivate = function() {
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmousemove = gr.gc.onmousemove = null;
    element.onmouseup = gr.gc.onmouseup = null;
    var e = element;
    var c = callback;
    var cc = contCallback;
    var ge = createGraphic ? null : gr;
    this.deactivate();
    this.activate(e, c, cc);
  }

  function normalizeRectangle(point1, point2) {
    if (point1 && point2 && point1.x && point1.y && point2.x && point2.y) {
      var left = (point1.x < point2.x) ? point1.x : point2.x;
      var top = (point1.y < point2.y) ? point1.y : point2.y;
      var width = Math.abs(point1.x - point2.x);
      var height = Math.abs(point1.y - point2.y);
      return new EsriRectangle(left, top, width, height);
    }
    else return null;
  }

  function processMouseDown(e) {
    self.isActive = true;
    bounds = EsriUtils.getElementPageBounds(element);
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmousemove = gr.gc.onmousemove = processMouseMove;
    element.onmouseup = gr.gc.onmouseup = processMouseUp;
    startPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (graphic) gr.remove(graphic);
    eval("graphic = gr.draw" + shape + "(new EsriRectangle(startPt.x, startPt.y, 1, 1), self.symbol);");
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    var rect = normalizeRectangle(startPt, pt);
    if (rect) {
      gr.remove(graphic);
      eval("graphic = gr.draw" + shape + "(rect, self.symbol);");
      if (contCallback) contCallback(rect);
    }
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseUp(e) {
    self.isActive = false;
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    var rect = normalizeRectangle(startPt, pt);
    if (rect) {
      if (graphic) gr.remove(graphic);
      element.onmousemove = gr.gc.onmousemove = element.onmouseup = gr.gc.onmouseup = null;
      element.onmousedown = gr.gc.onmousedown = processMouseDown;
      callback(rect);
    }
    EsriUtils.stopEvent(e);
    return false;
  }
}

function EsriDrawRectangleAction() { return new EsriDrawRectShapeAction("Rectangle"); }
function EsriDrawOvalAction() { return new EsriDrawRectShapeAction("Oval"); }

function EsriDrawPointAction() {
  this.inheritsFrom(new EsriAction());
  this.name = "EsriDrawPointAction";
  var element, callback, bounds;
  this.cursor = "pointer";
  var self = this;

  this.activate = function(elem, callbackFunc) {
    element = elem;
    callback = callbackFunc;
    element.style.cursor = self.cursor;
    element.onmousedown = processMouseDown;
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      element.style.cursor = "default";
      element.onmousedown = null;
    }
    element = bounds = callback = null;
  }

  this.reactivate = function() {
    element.onmousedown = null;
    var e = element;
    var c = callback;
    this.deactivate();
    this.activate(e, c);
  }

  function processMouseDown(e) {
    self.isActive = true;
    bounds = EsriUtils.getElementPageBounds(element);
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    EsriUtils.stopEvent(e);
    callback(pt);
    self.isActive = false;
    return false;
  }
}

function EsriDrawPolyShapeAction(isPolygon) {
  this.inheritsFrom(new EsriAction());
  this.name = (isPolygon) ? "EsriDrawPolygonAction" : "EsriDrawPolylineAction";
  var isPgon = isPolygon;
  var element, callback, contCallback, bounds, pts, index, gr, tGr, lineGraphic, closePolyGraphic, polyGraphics;
  var createGraphics = true;
  var self = this;

  this.activate = function(elem, cF, ccF, ge) {
    element = elem;
    callback = cF;
    contCallback = ccF;
    polyGraphics = [];

    if (ge) {
      gr = (tGr = ge);
      createGraphics = false;
    }
    else {
      gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
      EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
      
      tGr = EsriUtils.createGraphicsElement(element.id + "tGr", element);
      EsriUtils.setElementStyle(tGr.gc, "z-index:" + this.graphicsZIndex + ";");
      tGr.lineColor = this.lineColor;
      tGr.lineWidth = this.lineWidth;
      tGr.lineOpacity = this.lineOpacity;
    }
    
    element.style.cursor = self.cursor;
    element.onmousedown = tGr.gc.onmousedown = processMouseDown;
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      element.style.cursor = "default";
      element.onclick = element.ondblclick = element.onmousemove = element.onmouseup = element.onmousedown = null;
    }

    clearGraphics();
    if (createGraphics) {
      if (gr != null) { 
        gr.gc.onclick = gr.gc.ondblclick = gr.gc.onmousemove = gr.gc.onmouseup = gr.gc.onmousedown = null;
        gr.destroy();
      }
      if (tGr != null) {
        tGr.gc.onclick = tGr.gc.ondblclick = tGr.gc.onmousemove = tGr.gc.onmouseup = tGr.gc.onmousedown = null;
        if (lineGraphic) tGr.remove(lineGraphic);
        if (isPgon && closePolyGraphic) tGr.remove(closePolyGraphic);
        tGr.destroy();
      }
    }
    else {
      if (gr != null) {
        gr.gc.onclick = gr.gc.ondblclick = gr.gc.onmousemove = gr.gc.onmouseup = gr.gc.onmousedown = null;
      }
    }
    element = bounds = pts = index = gr = tGr = lineGraphic = closePolyGraphic = polyGraphics = null;
  }

  this.reactivate = function() {
    element.onmousedown = tGr.gc.onmousedown = null;
    element.onclick = tGr.gc.onclick = null;
    element.ondblclick = tGr.gc.ondblclick = null;
    element.onmousemove = tGr.gc.onmousemove = null;
    element.onmouseup = tGr.gc.onmouseup = null;
    var e = element;
    var c = callback;
    var cc = contCallback;
    var ge = createGraphics ? null : gr;
    this.deactivate();
    this.activate(e, c, cc, ge);
  }

  function clearGraphics() {
    if (lineGraphic) tGr.remove(lineGraphic);
    if (isPgon && closePolyGraphic) tGr.remove(closePolyGraphic);
    for (var i=polyGraphics.length - 1; i>=0; i--) gr.remove(polyGraphics[i]);
  }

  function processMouseDown(e) {
    self.isActive = true;
    bounds = EsriUtils.getElementPageBounds(element);
    pts = new Array();
    index = 0;
    pts.push(EsriUtils.getXY(e).offset(-bounds.left, -bounds.top));
    EsriUtils.stopEvent(e);

    element.onmousedown = tGr.gc.onmousedown = null;
    element.onclick = tGr.gc.onclick = processClick;
    element.onmousemove = tGr.gc.onmousemove = processMouseMove;
    element.ondblclick = tGr.gc.ondblclick = processDblClick;
    return false;
  }

  function processMouseMove(e) {
    if (lineGraphic) tGr.remove(lineGraphic);
    if (isPgon && closePolyGraphic) tGr.remove(closePolyGraphic);
    if (bounds) {
      var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
      lineGraphic = tGr.drawLine(pts[index], pt, self.symbol);
      if (isPgon) closePolyGraphic = tGr.drawLine(pt, pts[0], self.symbol);
    }
    EsriUtils.stopEvent(e);
    return false;
  }

  function processClick(e) {
    pts.push(EsriUtils.getXY(e).offset(-bounds.left, -bounds.top));
    index++;
    if (index > 0) polyGraphics.push(gr.drawLine(pts[index - 1], pts[index], self.symbol));
    EsriUtils.stopEvent(e);
    if (contCallback) contCallback(pts);
    return false;
  }

  function processDblClick(e) {
    clearGraphics();
    tGr.gc.onclick = tGr.gc.onmousemove = tGr.gc.ondblclick = element.onclick = element.onmousemove = element.ondblclick = null;
    element.onmousedown = tGr.gc.onmousedown = processMouseDown;

    if (pts) {
      var newPts = new Array();
      for (var i=1;i<pts.length;i++) { if (pts[i].x != pts[i-1].x || pts[i].y != pts[i-1].y) newPts.push(pts[i-1]); }
      newPts.push(EsriUtils.getXY(e).offset(-bounds.left, -bounds.top));
      callback(newPts);
    }

    self.isActive = false;
    EsriUtils.stopEvent(e);
    return false;
  }
}

function EsriDrawPolylineAction() { return new EsriDrawPolyShapeAction(false); }
function EsriDrawPolygonAction() { return new EsriDrawPolyShapeAction(true); }

function EsriDrawCircleAction() {
  this.inheritsFrom(new EsriAction());
  this.name = "EsriDrawCircleAction";
  var element, callback, contCallback, bounds, center, gr, currPt, pointGraphic, circleGraphic;
  var currLength = 0;
  var createGraphic = true;
  var self = this;

  this.activate = function(elem, cF, ccF, ge) {
    element = elem;
    callback = cF;
    contCallback = ccF;

    if (ge) {
      createGraphic = false;
      gr = ge;
    }
    else {
      gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
      EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
    }
    element.style.cursor = self.cursor;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      element.onmousedown = element.onmousemove = element.onmouseup = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      gr.gc.onmousedown = gr.gc.onmousemove = gr.gc.onmouseup = null;
      if (pointGraphic) gr.remove(pointGraphic);
      if (circleGraphic) gr.remove(circleGraphic);
      if (createGraphic) gr.destroy();
    }
    element = gr = pointGraphic = circleGraphic = null;
  }

  this.reactivate = function() {
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmousemove = gr.gc.onmousemove = null;
    element.onmouseup = gr.gc.onmouseup = null;
    var e = element;
    var c = callback;
    var cc = contCallback;
    var ge = createGraphic ? null : gr;
    this.deactivate();
    this.activate(e, c, cc, ge);
  }

  function getLength(pt1, pt2) { return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2)); }

  function processMouseDown(e) {
    self.isActive = true;
    bounds = EsriUtils.getElementPageBounds(element);
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmousemove = gr.gc.onmousemove = processMouseMove;
    element.onmouseup = gr.gc.onmouseup = processMouseUp;
    center = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (pointGraphic) gr.remove(pointGraphic);
    if (circleGraphic) gr.remove(circleGraphic);
    pointGraphic = gr.drawPoint(center, self.symbol);
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    var radius = Math.round(getLength(center, EsriUtils.getXY(e).offset(-bounds.left, -bounds.top)));
    if (pointGraphic) gr.remove(pointGraphic);
    if (circleGraphic) gr.remove(circleGraphic);
    pointGraphic = gr.drawPoint(center,self.symbol);
    circleGraphic = gr.drawCircle(center, radius, self.symbol);
    EsriUtils.stopEvent(e);
    if (contCallback) contCallback(center, radius);
    return false;
  }

  function processMouseUp(e) {
    if (pointGraphic) gr.remove(pointGraphic);
    if (circleGraphic) gr.remove(circleGraphic);
    element.onmousemove = gr.gc.onmousemove = element.onmouseup = gr.gc.onmouseup = null;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
    EsriUtils.stopEvent(e);
    callback(center, getLength(center, EsriUtils.getXY(e).offset(-bounds.left, -bounds.top)));

    self.isActive = false;
    return false;
  }
}

function EsriMouseWheelAction() {
  this.inheritsFrom(new EsriAction());
  this.name = "EsriMouseWheelAction";
  var element, callback;
  var wheelTimer, timerValue;

  this.activate = function(elem, callbackFunc) {
    element = elem;
    callback = callbackFunc;
    if (EsriUtils.isIE) element.onmousewheel = processMouseWheel;
    else element.addEventListener("DOMMouseScroll", processMouseWheel, false);
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      if (EsriUtils.isIE) element.onmousewheel = null;
      else element.removeEventListener("DOMMouseScroll", processMouseWheel, false);
    }
  }

  function processMouseWheel(e) {
    self.isActive = true;
    var wheelValue = (EsriUtils.isIE) ? window.event.wheelDelta : -e.detail;
    EsriUtils.stopEvent(e);
    var value = wheelValue / EsriUtils.mouseWheelUnit;
    if (timerValue) {
      if (Math.abs(value) > Math.abs(timerValue)) timerValue = value;
      else return;
    }
    else timerValue = value;

    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function() { callback(value); timerValue = 0; self.isActive = false; }, 500);
    self.isActive = false;
    return false;
  }
}

function EsriResizeElementAction(docInput, minWd, minHt, maxWd, maxHt) {
  this.inheritsFrom(new EsriAction());
  this.name = "EsriResizeElementAction";
  this.cursor = "default";
  this.excludeDirs = [];
  var element, bd, pBd, startPt, callback, contCallback, direction;
  var tol = 5;
  var minw = minWd ? minWd : 0;
  var minh = minHt ? minHt : 0;
  var maxw = maxWd;
  var maxh = maxHt;
  var docInp = docInput;
  var self = this;

  this.activate = function(elem, cbFunc, ccbFunc) {
    element = elem;
    callback = cbFunc;
    contCallback = ccbFunc;
    pBd = EsriUtils.getElementPageBounds(element);
    var borders = EsriUtils.getElementBorders(element);
    pBd.left += borders.left;
    pBd.top += borders.top;
    pBd.width -= (borders.left + borders.right);
    pBd.height -= (borders.top + borders.bottom);

    bd = EsriUtils.getElementBounds(element);
    if (! bd.width || bd.height) {
      bd.width = pBd.width;
      bd.height = pBd.height;
    }
    element.style.cursor = self.cursor;
    direction = "";
    element.onmousemove = processMouseMove;
    self = this;
  }

  this.deactivate = function() {
    this.isActive = false;
    if (element != null) {
      element.style.cursor = "default";
      element.onmousemove = element.onmousedown = element.onmouseup = element = null;
    }
    if (docInp) document.onmousemove = document.onmouseup = null;
  }

  this.reactivate = function() {
    element.onmousedown = element.onmousemove = element.onmouseup = null;
    document.onmousemove = document.onmouseup = null;
    direction = "";
    var e = element;
    var c = callback;
    var cc = contCallback;
    this.deactivate();
    this.activate(e, c, cc);
  }

  this.setMinSize = function(wd, ht) {
    minw = wd;
    minh = ht;
  }

  this.setMaxSize = function(wd, ht) {
    maxw = wd;
    maxh = ht;
  }

  function processMouseMove(e) {
    var xy = EsriUtils.getXY(e);
    if (direction != "" && self.isActive) {
      var b = bd.offset(0, 0);
      var dX = xy.x - startPt.x;
      var dY = xy.y - startPt.y;

      if (direction.indexOf("n") == 0) {
        b.top += dY;
        if (dY < 0) b.height += Math.abs(dY);
        else b.height -= dY;
      }
      else if (direction.indexOf("s") == 0) b.height += dY;

      if (direction.indexOf("w") != -1) {
        b.left += dX;
        if (dX < 0) b.width += Math.abs(dX);
        else b.width -= dX;
      }
      else if (direction.indexOf("e") != -1) b.width += dX;

      if (b.width < minw) return false;
      else if (b.height < minh) return false;
      if (b.width < minw) {
        if ((direction == "n" || direction == "nw" || direction == "w" || direction == "sw") && dX > 0) return false;
        else if ((direction == "ne" || direction == "e" || direction == "se" || direction == "s") && dX < 0) return false;
      }
      else if (b.height < minh) {
        if ((direction == "n" || direction == "ne" || direction == "nw" || direction == "w") && dY > 0) return false;
        else if ((direction == "e" || direction == "se" || direction == "s" || direction == "sw") && dY < 0) return false;
      }
      else if (maxw && b.width > maxw && dX > 0) return false;
      else if (maxh && b.height > maxh && dY > 0) return false;

      EsriUtils.setElementStyle(element, b.toStyle());
      if (contCallback) contCallback(b);
    }
    else {
      var l = pBd.left;
      var t = pBd.top
      var r = l + pBd.width;
      var b = t + pBd.height;

      var dir = new Array();
      for (var i=0;i<2;i++) {
        if (xy.y >= (t - tol) && xy.y <= (t + tol) && dir[0] != "n") dir[i] = "n";
        else if (xy.x >= (r - tol) && xy.x <= (r + tol) && dir[0] != "e") dir[i] = "e";
        else if (xy.y >= (b - tol) && xy.y <= (b + tol) && dir[0] != "s") dir[i] = "s";
        else if (xy.x >= (l - tol) && xy.x <= (l + tol) && dir[0] != "w") dir[i] = "w";
        else dir[i] = null;
      }

      direction = "";
      if (dir[0] != null) direction += dir[0];
      if (dir[1] != null) direction += dir[1];

      if (direction == "es") direction = "se";
      else if (direction == "en") direction = "ne";
      else if (direction == "ws") direction = "sw";
      else if (direction == "wn") direction = "nw";

      if (self.excludeDirs.indexOf(direction) != -1) {
        direction = "";
        return false;
      }

      if (direction) {
        element.style.cursor = direction + "-resize";
        element.onmousedown = processMouseDown;
      }
      else {
        element.style.cursor = self.cursor;
        element.onmousedown = null;
      }
    }
    return false;
  }

  function processMouseDown(e) {
    self.isActive = true;
    startPt = EsriUtils.getXY(e);
    element.onmouseup = processMouseUp;
    if (docInp) {
      document.onmousemove = processMouseMove;
      document.onmouseup = processMouseUp;
    }
    return false;
  }

  function processMouseUp(e) {
    processMouseMove(e);
    pBd = EsriUtils.getElementPageBounds(element);
    var tbd = EsriUtils.getElementBounds(element);
    if (! tbd.equals(bd)) {
      bd = tbd;
      direction = "";
      element.onmousedown = element.onmouseup = null;
      if (docInp) document.onmousemove = document.onmouseup = null;
      callback(bd);
    }
    self.isActive = false;
    return false;
  }
}

function EsriKeyInputAction() {
  this.inheritsFrom(new EsriAction());
  this.name = "EsriKeyInputAction";
  var element, callback, contCallback;
  var self = this;

  this.activate = function(elem, cbF, ccbF) {
    element = elem;
    callback = cbF;
    contCallback = ccbF;
    element.onmouseover = processMouseOver;
    element.onmouseout = processMouseOut;
  }

  this.deactivate = function() { element = callback = contCallback = element.onmouseover = element.onmouseout = document.onkeydown = document.onkeypress = document.onkeyup = null; }

  function processMouseOver() {
    if (EsriUtils.isIE) {
      document.onkeydown = processKeyDownPress;
      document.onkeypress = processKeyFalse;
    }
    else {
      document.onkeydown = processKeyFalse;
      document.onkeypress = processKeyDownPress;
    }
    document.onkeyup = processKeyUp;
    return false;
  }

  function processMouseOut(e) {
    EsriUtils.stopEvent(e);
    document.onkeydown = document.onkeypress = document.onkeyup = null;
  }

  function processKeyFalse(e) {
    EsriUtils.stopEvent(e);
    return false;
  }

  function processKeyDownPress(e) {
    self.isActive = true;
    var kc = EsriUtils.getKeyCode(e);
    EsriUtils.stopEvent(e);
    return contCallback(kc);
  }

  function processKeyUp(e) {
    var kc = EsriUtils.getKeyCode(e);
    EsriUtils.stopEvent(e);
    self.isActive = false;
    return callback(kc);
  }
}