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

var EsriUploadUtil = new function() {
  var uploadJSP = "upload.jsp";
  var uploadSuccessJsp = "uploadSuccess.jsp";
  var downloadJSP = "download.jsp";
  var pe, win, listener, downloadId;

  this.showUploadWindow = function(title, uploadListener, uploadPage, uploadSuccessPage) {
    if (win) destroyWindow()
    listener = uploadListener;
    if (! uploadPage) uploadPage = EsriControls.contextPath + uploadJSP;
    if (! uploadSuccessPage) uploadSuccessPage = EsriControls.contextPath + uploadSuccessJsp;

    var time = new Date().getTime();
    pe = new EsriPageElement("upload-pe-" + time);
    pe.divObject = document.body.appendChild(document.createElement("iframe"));
    pe.divObject.width = 375;
    pe.divId = pe.divObject.id = "upload-iframe-" + time;
    pe.divObject.src = uploadPage + "?requestPage=" + uploadJSP + "&successPage=" + uploadSuccessPage;
    EsriUtils.setElementStyle(pe.divObject, "border:0px NONE;");

    win = new EsriWindow("upload-win-" + time, title, pe);
    win.resizable = false;
    win.init();
    win.fit();
    win.center();
    win.addUpdateListener("upload-win-listener", winListener);
  }

  this.processUpload = function(filename, id) {
    win.removeUpdateListener("upload-win-listener");
    destroyWindow()
    if (id != "") listener(filename, id);
    else listener();
    listener = null;
  }

  this.showDownloadWindow = function(title, id, downloadPage) {
    downloadId = id;
    if (win) destroyWindow();
    if (! downloadPage) downloadPage = EsriControls.contextPath + downloadJSP;

    var time = new Date().getTime();
    pe = new EsriPageElement("download-pe-" + time);
    pe.divObject = document.body.appendChild(document.createElement("iframe"));
    pe.divId = pe.divObject.id = "download-iframe-" + time;
    pe.divObject.src = downloadPage + "?downloadId=" + id;
    EsriUtils.setElementStyle(pe.divObject, "border:0px NONE;");

    win = new EsriWindow("download-win-" + time, title, pe);
    win.resizable = false;
    win.init();
    win.fit();
    win.center();
  }

  this.closeDownloadWindow = function() { destroyWindow(); }
  function winListener(win) { if (win.closed) listener = null; }

  function destroyWindow() {
    win.hide();
    pe = pe.divObject = pe.divId = win = win.divObject = win.divId = null;
  }
}