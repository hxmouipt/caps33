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
function EsriCallOut(calloutId,args) {
  this.id = "CallOut_" + calloutId;
  this.inheritsFrom(new EsriPageElement(this.id));
  this.divId = "CallOut_" + calloutId;
  this.anchorPosition = null;
  this.args=args;
  if(args.container)
    this._container = args.container;
  this._content = null;
  this._arrow = null;
  this._window = null;
  this._header = null;
  this._toggle = null;
  this._footer = null;
  this._collapsed = true;

  var currentContent = null;
  var self = this;

  this.init = function(calloutId) {
    this.divObject = document.createElement("div");
    this.divObject.id = this.divId;
  
    // build dom elements...
    var infoWin = this.divObject;
    var infoWinInner = document.createElement("div");
    var arrows = document.createElement("div");
    var arrow = document.createElement("div");
    var win = document.createElement("div");
    var winInner = document.createElement("div");
    var title = document.createElement("div");
    var dismiss = document.createElement("img");
    var toggle = document.createElement("img");
    var content = document.createElement("div");
    var footer = document.createElement("div");
  
    if(this.args.styleClass)
      infoWin.className = this.args.styleClass;
    else   
      infoWin.className = "infowindow";
    infoWin.style.display = "none";
    arrows.className = "arrows";
    arrow.className = "arrow";
    win.className = "window";
    winInner.style.position = "relative";
    title.className = "title";
    title.id = this.divId + "_header";
    dismiss.src = "images/pixel.gif";
    dismiss.className = "hide";
    toggle.src = "images/pixel.gif";
    toggle.className = "toggleOn";
    content.className = "content";
    content.id = this.divId + "_content";
    footer.className = "footer";
    footer.id = this.divId + "_footer";
    winInner.appendChild(title);
    winInner.appendChild(toggle);
    winInner.appendChild(dismiss);
    winInner.appendChild(content);
    winInner.appendChild(footer);
  
    win.appendChild(winInner);
    arrows.appendChild(arrow);
    infoWinInner.appendChild(win);
    infoWinInner.appendChild(arrows);
  
    //events
    dismiss.onclick = handleDismissClick;
    toggle.onclick = handleToggleClick;
  
    infoWin.appendChild(infoWinInner);
  
    this._content = content;
    this._arrow = arrow;
    this._window = win;
    this._header = title;
    this._toggle = toggle;
    this._footer = footer;
    //append dom element to container...
    this._container.appendChild(this.divObject);
    this.collapse();
    //block events
    infoWin.onmousewheel = function(e) { EsriUtils.stopEvent(e); }
  }
  
  function handleDismissClick(e) {
    if(self.onDismiss)
      self.onDismiss();
    self.hide();
    EsriUtils.stopEvent(e);
  }

  function handleToggleClick(e) {
    self.toggle();
    EsriUtils.stopEvent(e);
  }

  function handleOnChange(e) {
    var src = EsriUtils.getEventSource(e);
    for(var i = 0; i<src.options.length; i++) {
      var o = src.options[i];
      var el = document.getElementById(self.id + "_subcontent_" + o.value)
      var el2 = document.getElementById(self.id + "_footercontent_" + o.value)
      if(o.selected) {
        EsriUtils.showElement(el);
        EsriUtils.showElement(el2);
      }
      else {
        EsriUtils.hideElement(el);
        EsriUtils.hideElement(el2);
      }
    }
    if(self._collapsed)
      self.expand();
  }

  this.show = function() {
    EsriUtils.showElement(this.divObject);
    this._onContentDisplayedChanged();
    if(this.onShow)
      this.onShow();
  }

  this.hide = function() {
    EsriUtils.hideElement(this.divObject);
    this._onContentDisplayedChanged();
    if(this.onHide)
      this.onHide();
  }

  this.toggle = function() {
    if(this._collapsed)
      this.expand();
    else
      this.collapse();
  }

  this.expand = function() {
    this._content.style.display = "block";
    this._footer.style.display = "block";
    this._toggle.className = "toggleOff"
    this._collapsed = false;
    this._onContentDisplayedChanged();
    if(this.onExpand)
      this.onExpand();
  }

  this.collapse = function() {
    this._content.style.display = "none";
    this._footer.style.display = "none";
    this._toggle.className = "toggleOn";
    this._collapsed = true;
    this._onContentDisplayedChanged();
    if(this.onCollapse)
      this.onCollapse();
  }

  this.isVisible = function() {
    return this.divObject.style.display == "block";
  }

  this.isCollapsed = function() {
    return this._collapsed;
  }

  this._setContent = function(container, value) {
    if(!value)
      container.innerHTML = "";
    else if(typeof value == 'object')
      container.appendChild(value);
    else
      container.innerHTML = value;
  }

  this.setContent = function(args) {
    if(this._content.hasChildNodes())
      this._content.innerHTML = "";
    if(this._header.hasChildNodes())
      this._header.innerHTML = "";
    if(this._footer.hasChildNodes())
      this._footer.innerHTML = "";

    if(args.length) {
      var select = document.createElement("select");
      select.className = "select";
      select.size = 1;
      select.onchange = handleOnChange;

      for(var i=0; i<args.length; i++) {
        var result = args[i];
        var opt = document.createElement("option");
        var contentDiv = document.createElement("div");
        var footerDiv = document.createElement("div");

        opt.value = result.id || result.header;
        opt.appendChild(document.createTextNode(result.header));
        select.appendChild(opt);

        contentDiv.className = "subcontent";
        contentDiv.id = this.id + "_subcontent_" + opt.value;
        this._setContent(contentDiv, result.content);
        this._content.appendChild(contentDiv);

        footerDiv.className = "footercontent";
        footerDiv.id = this.id + "_footercontent_" + opt.value;
        this._setContent(footerDiv, result.footer);
        this._footer.appendChild(footerDiv);

        if(i==0) {
          EsriUtils.showElement(contentDiv);
          EsriUtils.showElement(footerDiv);
        }
      }
      this._header.appendChild(select);
      this._onContentDisplayedChanged();
    }
    else {
      if(typeof args.header == 'object')
        this._header.appendChild(document.createTextNode(args.header));
      else
        this._header.innerHTML = args.header;

      if(typeof args.content == 'object')
        this._content.appendChild(args.content);
      else
        this._content.innerHTML = args.content;

      if(typeof args.footer == 'object')
        this._footer.appendChild(document.createTextNode(args.footer));
      else
        this._footer.innerHTML = args.footer;

      
    }
    currentContent = args;
  }

  this.getContent = function() {
    return currentContent;
  }

  this.updateAnchor = function() {
    var cn = null;
    var c = EsriUtils.getElementPageBounds(this._container);
    var cx = c.width / 2;
    var cy = c.height / 2;
    var t = parseInt(this.divObject.style.top);
    var l = parseInt(this.divObject.style.left);

    if(cx < l)
      cn = cy < t ? "upperleft" : "lowerleft";
    else
      cn = cy < t ? "upperright" : "lowerright";

    this._arrow.className = "arrow " + cn;
    this._window.className = "window " + cn;
    this.anchorPosition = cn;
  }

  this.moveTo = function(l, t) {
    EsriUtils.moveElement(this.divObject, l, t);
    this.updateAnchor();
  }
  
  // private callback
  this._onContentDisplayedChanged = function() {
    if(this._footer.innerHTML != "" && !this._collapsed)
      EsriUtils.showElement(this._footer);
    else
      EsriUtils.hideElement(this._footer);
  }
  

  this.onCollapse = null;
  this.onExpand = null;
  this.onHide = null;
  this.onShow = null;
  this.onDismiss = null; 
  
  if(calloutId)
    this.init(calloutId,args);
}