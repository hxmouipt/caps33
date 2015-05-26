/*
COPYRIGHT 1995-2007 ESRI

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
/* mapcontrol */
var mapId ="map1";
var formId = "mapForm";

/* edit window */
var editDivId = "esri_editDiv";
var selectEditLayerId = "selectEditLayerId";
var editorWindowsRefreshId = "editorWindowsRefreshId";

/* edit version window */
var editVersionDivId = "esri_editVersionDiv";
var selectEditVersionId = formId+":editVersionSubview:selectEditVersionId";

/* settings window */
var settingsDivId = "esri_editSettingsDiv";
var editSnappingRulesDiv = "editSnappingRulesDiv";
var snapTolId = "editconfig_snapTolerance";
var snapEnabledId = "editconfig_snapEnabled";
var snapColorId = "editconfig_snapTipsColor";

/* xy window */
var xyDivId = "esri_editXYDiv";

/* windows */
var editorWin;
var editorVersionWin;
var editorSettingsWin;
var editorXYWin;

var editorWindowClosed = false;
var snapWidth = 8;

var editorWindowTitle = "Editing";

var editorNullFeatureMessage = "No features selected";


/* init editor */
function initEditor() {
  //create windows if needed.
  createVersionWindow(formId,editVersionDivId);
  createEditWindow(formId,editDivId);
  createSettingsWindow(formId,settingsDivId);
  createXYWindow(formId,xyDivId);
 
  //register postback tag handler
  EsriControls.addPostBackTagHandler("EditBean", editBeanHandler);

  // start editing
  initEditorRequest();
}

/* init editor */
function showEditorWindow() {
  initEditorRequest("showWindow");
}

/* init editor request */
function initEditorRequest(action) {
  var map = EsriControls.maps[mapId];

  //Get server URL
  var url = EsriUtils.getServerUrl(map.formId);
  //Set request parameters
  var params = "EditBean=EditBean&ajaxServerAction=init";
  if(action){
    params = params + "&action="+action;
  }  
  //Send AJAX request and set response processing function
  EsriUtils.sendAjaxRequest(url, params, false, function(xmlHttp) { updateEditorResponse(xmlHttp, null , action); });
}

/* create a new Settings Window*/
function createSettingsWindow(formId,settingsDivId) {
  if(settingsDivId && formId){
    var settingsDiv = document.getElementById(settingsDivId);
    //settings window
    if(settingsDiv){
      var pe = new EsriPageElement("pe");
      pe.divObject = settingsDiv;
      pe.divId = settingsDivId;
      var form = document.getElementById(formId);
      editorSettingsWin = new EsriWindow("editorSettingsWin", "Settings", pe, form);
      editorSettingsWin.fit();
      editorSettingsWin.hide();
    }
  }
}

/* create a new XY Enter Window*/
function createXYWindow(formId,xyDivId) {
  if(xyDivId && formId){
    var xyDiv = document.getElementById(xyDivId);
    //enter XY window
    if(xyDiv){
      var pe = new EsriPageElement("pe");
      pe.divObject = xyDiv;
      pe.divId = xyDiv;
      
      var form = document.getElementById(formId);
      
      editorXYWin = new EsriWindow("editorXYWin", "Enter XY Value(s)", pe, form);
      editorXYWin.fit();
      editorXYWin.hide();
    }
  }
}

/* create a new Editor Window*/
function createVersionWindow(formId,editVersionDivId) {
  if(editVersionDivId && formId){
    var editVersionDiv = document.getElementById(editVersionDivId);
    //editing version window
    if(editVersionDiv){
      var pe = new EsriPageElement("pe");
      pe.divObject = editVersionDiv;
      pe.divId = editVersionDivId;
      
      var form = document.getElementById(formId);
      editorVersionWin = new EsriWindow("editorVersionWin", editorWindowTitle, pe, form);
      editorVersionWin.fit();
      editorVersionWin.hide();
    }
  }  
}

/* create a new Editor Window*/
function createEditWindow(formId,editDivId) {
  if(editDivId && formId){
    var editDiv = document.getElementById(editDivId);
    //editing window
    if(editDiv){
      var pe = new EsriPageElement("pe");
      pe.divObject = editDiv;
      pe.divId = editDivId;
      
      var form = document.getElementById(formId);
      editorWin = new EsriWindow("editorWin", editorWindowTitle, pe, form);
      editorWin.fit();
      editorWin.hide();
      editorWindowClosed = editorWin.closed;
      editorWin.addUpdateListener("EditorWinListener", closeEditorWindowHandler);
    }
  }  
}

/* show editor window*/
function editorShowWindowHandler(xml, eventsource, action) {
  if(!xml){
     return;
  }
  if(action == "showWindow" || xml.getAttribute("windowOpened") == "true"){
    if(xml.getAttribute("window") == "version"){
      if(editorVersionWin){
        editorVersionWin.setTitle(xml.getAttribute("title"));
        editorVersionWin.show();
      }
      if(editorWin){
        editorWin.hide();
      }
      
    }else if(xml.getAttribute("window") == "edit"){
      if(editorWin){
        editorWin.setTitle(xml.getAttribute("title"));
        editorWin.show();
      }
      if(editorVersionWin){
        editorVersionWin.hide();
      }
      
    }
  }
  if(eventsource){
    EsriControls.maps[mapId].createCurrentToolItem(eventsource, eventsource, "EsriMapServerAction", true, true, null, null, "esriToolDefault", "esriToolHover", "esriToolSelected", "esriToolDisabled");
  }
}
/* closing editor window */
function closeEditorWindowHandler(win) {
   if(!editorWindowClosed){
     if(editorWin.closed){
       closeEditorWindowRequest("request");
       editorWindowClosed = true;
       return false;
     }
   }else if (! editorWin.closed){
     editorWindowClosed = false;
   }
}

/* close editor request */
function closeEditorWindowRequest(action) {
  var map = EsriControls.maps[mapId];

  //Get server URL
  var url = EsriUtils.getServerUrl(map.formId);
  //Set request parameters
  var params = "EditBean=EditBean&ajaxServerAction=closeEditor&action="+action;
  //Send AJAX request and set response processing function
  EsriUtils.sendAjaxRequest(url, params, false, function(xmlHttp) { updateEditorResponse(xmlHttp, null , action); });
}

/* close editor window*/
function editorExitWindowHandler(xml, action) {
  if(!xml){
     return false;
  }
  if(editorSettingsWin){
    editorSettingsWin.hide();
  }
  if(editorXYWin){
    editorXYWin.hide();
  }
  
  var refreshButton =document.getElementById(editorWindowsRefreshId);

  EsriControls.maps[mapId].clearCurrentToolItem();

  if(xml.getAttribute("confirm") == "false"){
    if(refreshButton){
      refreshButton.onclick();
    }
    return;
  }
  if (confirm(xml.getAttribute("message"))) {
    if(editorSettingsWin){
      editorSettingsWin.hide();
    }
    if(editorXYWin){
      editorXYWin.hide();
    }
    closeEditorWindowRequest("confirm");
    
    if(action == "confirm"){
      if(refreshButton){
        refreshButton.onclick();
      }
      return;
    }
  }else{
    editorWin.show();
  }
}
/* show the enter xy window */
function showEnterXYWindow(){
  var cTool = EsriControls.maps[mapId].currentTool;
  if(!cTool){ 
   return false;
  }
  var editingCurrentTaskName = cTool.name;
  if(editingCurrentTaskName){
    var editaction = EsriControls.maps[mapId].currentTool.action;
    if(!editaction){
      return false;
    }
    var editactionName = EsriControls.maps[mapId].currentTool.action.name;
    if(!editactionName){
      return false;
    }
    
    newXYWindowRequest(editactionName,editingCurrentTaskName);
    editorXYWin.show();
    return false;
  }
}

/* init xy window request */
function newXYWindowRequest(clientaction, serveraction) {
  var map = EsriControls.maps[mapId];

  //Get server URL
  var url = EsriUtils.getServerUrl(map.formId);
  //Set request parameters
  var params = "EditBean=EditBean&ajaxServerAction=enterXY&action=start&clientAction=" + clientaction+"&serverAction="+serveraction;
  //Send AJAX request and set response processing function
  EsriUtils.sendAjaxRequest(url, params, false, updateEditorResponse);
}

/* enter xy values */
function enterXYRequest(eventsource,xID, yID) {
  var map = EsriControls.maps[mapId];

  //Get server URL
  var url = EsriUtils.getServerUrl(map.formId);
  //Set request parameters
  var params = "EditBean=EditBean&ajaxServerAction=enterXY&action=" + eventsource + "&x=" + document.getElementById(xID).value+"&y=" + document.getElementById(yID).value;
  //Send AJAX request and set response processing function
  EsriUtils.sendAjaxRequest(url, params, false, function(xmlHttp) { updateEditorResponse(xmlHttp, eventsource); });
}

/* Process postback xml response and update content */
function editorEnterXYWindowHandler(xml, eventsource) {
  if(!xml){
     return false;
  }
  if(xml.getAttribute("continue") == "false" && xml.getAttribute("final") == "false"){
    editorXYWin.hide();
  }
  
  var continueXY = document.getElementById("continueEnterXY");
  var finalXY = document.getElementById("enterFinalXY");
  
  var styleClass = (document.all ? "className" : "class");
  
  if(xml.getAttribute("continue") == "true"){
    if(continueXY){
      continueXY.removeAttribute(styleClass);
      continueXY.removeAttribute("disabled");
    }
  }else{
    if(continueXY){
      continueXY.setAttribute(styleClass, "hiddenButton");
      continueXY.setAttribute("disabled", true);
    }
  }
  if(xml.getAttribute("final") == "true"){
    if(finalXY){
      finalXY.removeAttribute(styleClass);
      finalXY.removeAttribute("disabled");
    }
  }else{
    if(finalXY){
      finalXY.setAttribute(styleClass, "hiddenButton");
      finalXY.setAttribute("disabled", true);
    }
  }

  var type_XYWIN = document.getElementById("type_XYWIN");
  if(type_XYWIN){
    type_XYWIN.innerHTML = xml.getAttribute("type");
  }
  var lastPoint_XYWIN = document.getElementById("lastPoint_XYWIN");
  
  if(lastPoint_XYWIN){
    var lastPointString = xml.getAttribute("lastPoint");
    lastPoint_XYWIN.innerHTML = lastPointString;
    var label_XYWIN = document.getElementById("lastPoint_label_XYWIN");
    
    if(label_XYWIN && lastPointString){
      label_XYWIN.innerHTML = "Entered:";
    }else{
      label_XYWIN.innerHTML = "";
    }
  }

  if(eventsource){
    EsriControls.maps[mapId].createCurrentToolItem(eventsource, eventsource, 'EsriMapServerAction', true, true, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');
  }
}

/* Process postback xml response and update content */
function editBeanHandler(xml) {
  if(!xml){
     return false;
  }
  var attsDiv = document.getElementById("attsDiv");
  var message = document.getElementById("editMessageBar");
  var styleClass = (document.all ? "className" : "class");
  
  var ids =new Array();
  ids[0] = "clearSelect";
  ids[1] = "showVertices";
  ids[2] = "delete";
  ids[3] = "move";
  ids[4] = "splitPolygon";
  ids[5] = "mergePolygon";
  ids[6] = "mergePolyline";
  ids[7] = "splitLine";
  ids[8] = "copyPoint";
  ids[9] = "copyPolygon";
  ids[10] = "copyPolyline";

  var shapeTypes =new Array();
  shapeTypes[0] = "";
  shapeTypes[1] = "";
  shapeTypes[2] = "";
  shapeTypes[3] = "";
  shapeTypes[4] = "POLYGON";
  shapeTypes[5] = "POLYGON";
  shapeTypes[6] = "LINE";
  shapeTypes[7] = "LINE";
  shapeTypes[8] = "POINT";
  shapeTypes[9] = "POLYGON";
  shapeTypes[10] = "LINE";
  
  var hiddenOnlyIds =new Array();
  hiddenOnlyIds[0] = "firstOID";
  hiddenOnlyIds[1] = "preOID";
  hiddenOnlyIds[2] = "nextOID";
  hiddenOnlyIds[3] = "lastOID";
  
  var reshapeIds =new Array();
  reshapeIds[0]="addVertex";
  reshapeIds[1]="moveVertex";
  reshapeIds[2]="deleteVertex";

  var newFeatureIds =new Array();
  newFeatureIds[0]="addPoint";
  newFeatureIds[1]="addPolygon";
  newFeatureIds[2]="addPolyline";

  var newFeatureShapeTypes =new Array();
  newFeatureShapeTypes[0]="POINT";
  newFeatureShapeTypes[1]="POLYGON";
  newFeatureShapeTypes[2]="LINE";
  
  var indexSelect = document.getElementById("indexSelect");
  if(indexSelect){
    indexSelect.innerHTML="";
  }
  if(message){
    message.innerHTML=xml.getAttribute("message");
  }
  
  
  showLayerList(xml.getElementsByTagName("EditLayers").item(0));
  configBeanHandler(xml.getElementsByTagName("ConfigBean").item(0));
  
  for(var ind=0; ind< newFeatureIds.length; ind++){
     var addfeature = document.getElementById(newFeatureIds[ind]);
     if(addfeature){
       if(xml.getAttribute("shape") == newFeatureShapeTypes[ind]){
         addfeature.removeAttribute(styleClass);
         addfeature.removeAttribute("disabled");
       } else {
         addfeature.setAttribute(styleClass, "hiddenButton");
         addfeature.setAttribute("disabled", true);
       }
     }
  }

  if(xml.getAttribute("selected") == "true"){
     for(var ind=0; ind< ids.length; ind++){
       var elem = document.getElementById(ids[ind]);
       if(elem){
         if(shapeTypes[ind] == "" || xml.getAttribute("shape") == shapeTypes[ind]){
           elem.removeAttribute(styleClass);
           elem.removeAttribute("disabled");
         }
       }
     }
     if(attsDiv){
       attsDiv.innerHTML="";
       attsDiv.setAttribute(styleClass,"attributesPanel");
       self.showSelectedAttributes(xml,attsDiv);
     }
  }else{
     for(var ind=0; ind< ids.length; ind++){
       var elem = document.getElementById(ids[ind]);
       if(elem){
          elem.setAttribute(styleClass, "disabledButton");
          elem.setAttribute("disabled", true);
       }
     }
     for(var ind=0; ind< hiddenOnlyIds.length; ind++){
       var elem = document.getElementById(hiddenOnlyIds[ind])
       if(elem){
         elem.setAttribute(styleClass, "hiddenButton");
       }
     }
     if(attsDiv){
       attsDiv.innerHTML = editorNullFeatureMessage;
       attsDiv.setAttribute(styleClass,"noAttributesPanel");
     }
  }
  
  var notpoint = document.getElementById("showVertices");
  if(notpoint && xml.getAttribute("shape")=="POINT"){
    notpoint.setAttribute(styleClass, "hiddenButton");
  }
  
  for(var ind=0; ind< ids.length; ind++){
    var elem = document.getElementById(ids[ind]);
    if(elem){
      if(shapeTypes[ind] != "" && xml.getAttribute("shape") != shapeTypes[ind]){
          elem.setAttribute(styleClass, "hiddenButton");
          elem.setAttribute("disabled", true);
      }
    }
  }

  var item = document.getElementById("undo");
  if(item){
    if(xml.getAttribute("undo") == "true"){
       item.removeAttribute(styleClass);
       item.removeAttribute("disabled");
    }else{
       item.setAttribute(styleClass, "disabledButton");
       item.setAttribute("disabled", true);
    }
  }
  
  item = document.getElementById("redo");
  if(item){
    if(xml.getAttribute("redo") == "true"){
       item.removeAttribute(styleClass);
       item.removeAttribute("disabled");
    }else{
       item.setAttribute(styleClass, "disabledButton");
       item.setAttribute("disabled", true);
    }
  }

  if(xml.getAttribute("shape") == "POINT"){
     for(var ind=0; ind< reshapeIds.length; ind++){
       var elem = document.getElementById(reshapeIds[ind]);
       if(elem){
         elem.setAttribute(styleClass, "hiddenButton");
         elem.setAttribute("disabled", true);
       }
     }
  } else {
    if(xml.getAttribute("vertices") == "true"){
     for(var ind=0; ind< reshapeIds.length; ind++){
       var elem = document.getElementById(reshapeIds[ind]);
       if(elem){
         elem.removeAttribute(styleClass);
         elem.removeAttribute("disabled");
       }
     }
    }else{
     for(var ind=0; ind< reshapeIds.length; ind++){
       var elem = document.getElementById(reshapeIds[ind]);
       if(elem){
         elem.setAttribute(styleClass, "disabledButton");
         elem.setAttribute("disabled", true);
       }
     }    
    }
  }
}

/* Process postback xml response and update content */
function configBeanHandler(xml) {
  if(!xml){
    return;
  }
  showSnapRules(document.getElementById(editSnappingRulesDiv),xml);
  updateSnapStatus(xml);  
}

function updateSnapStatus(xml){
  var snapEnabled = document.getElementById(snapEnabledId);
  if(snapEnabled){
    snapEnabled.setAttribute("value", xml.getAttribute("snapEnabled"));
  }
}

function showSnapRules(rulesDiv, xml){
  if(!rulesDiv){
    return;
  }
  
  var oldtable = document.getElementById("editorSnapRulesTable");
  if(oldtable){
    rulesDiv.removeChild(oldtable);
  }

  var table = document.createElement("table");
  
  table.setAttribute("id","editorSnapRulesTable");
  
  var thead = document.createElement("thead");
  var tr=document.createElement("tr");
  var td = document.createElement("td");
  var text = document.createTextNode("");
  td.appendChild(text);
  tr.appendChild(td);

  td = document.createElement("td");
  text = document.createTextNode("Vertex");
  td.appendChild(text);
  tr.appendChild(td);
  
  td = document.createElement("td");
  text = document.createTextNode("Edge");
  td.appendChild(text);
  tr.appendChild(td);

  td = document.createElement("td");
  text = document.createTextNode("End");
  td.appendChild(text);
  tr.appendChild(td);
  
  thead.appendChild(tr);
  table.appendChild(thead);
  
  var rules = xml.getElementsByTagName("SnapRules");
  var tbody = document.createElement("tbody");
  
  var isIE = EsriUtils.isIE;

  for(var k = 0; k < rules.length; k++) {
    var rule = rules[k];
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    text = document.createTextNode(rule.getAttribute("layer"));
    td.appendChild(text);
    tr.appendChild(td);
    
    td = document.createElement("td");
    
    var input;
    if (isIE){
      if(rule.getAttribute("vertex") == "true"){
        input = td.appendChild(document.createElement("<input type=\"checkbox\" checked=\"checked\" />"));
      }else{
        input = td.appendChild(document.createElement("<input type=\"checkbox\"/>"));
      }
    }else {
      input = td.appendChild(document.createElement("input"));
      input.type = "CHECKBOX";
      input.checked = (rule.getAttribute("vertex") == "true");
    }
    input.setAttribute("type","checkbox");
    input.setAttribute("id",rule.getAttribute("id")+"_vertex");
    input.setAttribute("name",rule.getAttribute("id"));
    input.setAttribute("value",rule.getAttribute("vertex"));
    if(rule.getAttribute("vertex") != "true"){
      input.checked = false;
    }
    input.onclick=function(){updateSettingsRequest("vertex",this.value,this.name);}
    tr.appendChild(td);

    td = document.createElement("td");
    
    if (isIE){
      if(rule.getAttribute("edge") == "true"){
        input = td.appendChild(document.createElement("<input type=\"checkbox\" checked=\"checked\" />"));
      }else{
        input = td.appendChild(document.createElement("<input type=\"checkbox\"/>"));
      }
    }else {
      input = td.appendChild(document.createElement("input"));
      input.type = "CHECKBOX";
      input.checked = (rule.getAttribute("edge") == "true");
    }
    input.setAttribute("id",rule.getAttribute("id")+"_edge");
    input.setAttribute("name",rule.getAttribute("id"));
    input.setAttribute("value",rule.getAttribute("edge"));
    
    input.onclick=function(){updateSettingsRequest("edge",this.value,this.name);}
    tr.appendChild(td);

    td = document.createElement("td");
    if (isIE){
      if(rule.getAttribute("end") == "true"){
        input = td.appendChild(document.createElement("<input type=\"checkbox\" checked=\"checked\" />"));
      }else{
        input = td.appendChild(document.createElement("<input type=\"checkbox\"/>"));
      }
    }else {
      input = td.appendChild(document.createElement("input"));
      input.type = "CHECKBOX";
      input.checked = (rule.getAttribute("end") == "true");
    }
    input.setAttribute("id",rule.getAttribute("id")+"_end");
    input.setAttribute("name",rule.getAttribute("id"));
    input.setAttribute("value",rule.getAttribute("end"));
    input.onclick=function(){updateSettingsRequest("end",this.value,this.name);}    
    tr.appendChild(td);
    
    tbody.appendChild(tr);  
  }

  table.appendChild(tbody);

  rulesDiv.innerHtml = "";
  rulesDiv.appendChild(table);
}

/* show layer list*/
function showLayerList(xml){
  if(!xml){
    return;
  }

  var layers = document.getElementById(selectEditLayerId);
  if(!layers){
    return;
  }
  
  var select_input = document.createElement("select");
  select_input.setAttribute("id","editSelectLayer_select");
  select_input.setAttribute("size","1");
  
  layers.innerHtml = "";
  var childnode = document.getElementById("editSelectLayer_select");
  if(childnode){
    layers.removeChild(childnode);
  }
  
  layers.appendChild(select_input);
  
  if(xml.getAttribute("size") == "0"){
    return;
  }
  
  select_input.onchange=refreshEditor;
    
  var options = xml.getElementsByTagName("option");
  
  for(var k = 0; k < options.length; k++) {
    var option = document.createElement("option");
    option.setAttribute("value",options[k].getAttribute("index"));
    if(options[k].getAttribute("selected") == "selected"){
        option.setAttribute("selected","selected");
    }
    var optiontext = document.createTextNode(options[k].getAttribute("name"));    
    option.appendChild(optiontext);
    select_input.appendChild(option);
  }
}

/* refresh editor window*/
function refreshEditor(){
  refreshEditorRequest(null,null);
}

/* show the attributes div*/
function showSelectedAttributes(xml, attsDiv){
  if(!xml){
    return;
  }
  var selected = xml.getElementsByTagName("selectedAttributes").item(0);
  var attributes = xml.getElementsByTagName("selectedAttribute");
  
  if(!attributes){
    return;
  }
  showAttributesIndex(selected);
  
  var table = document.createElement("table");
  var tablebody = document.createElement("tbody");
  
  var current_row=document.createElement("tr");
  
  var name_cell = document.createElement("td");
  var nametext = document.createTextNode("OID");
  name_cell.appendChild(nametext);
  current_row.appendChild(name_cell);
  
  name_cell = document.createElement("td");
  if(selected){
    nametext = document.createTextNode(selected.getAttribute("oid"));
    name_cell.appendChild(nametext);
  }
  current_row.appendChild(name_cell);
        
  tablebody.appendChild(current_row);

  for(var j = 0; j < attributes.length; j++) {
    var att = attributes[j];
    
    current_row=document.createElement("tr");
    
    name_cell = document.createElement("td");
    nametext = document.createTextNode(att.getAttribute("name"));

    name_cell.appendChild(nametext);
    
    var value_cell = document.createElement("td");
    
    var options = att.getElementsByTagName("option");
 
    if(options != null && options.length > 0){
      var select_input = document.createElement("select");
      select_input.setAttribute("id", att.getAttribute("index")+"_"+att.getAttribute("name"));
      select_input.setAttribute("size","1");
      if(att.getAttribute("readOnly") == "true"){
        select_input.setAttribute("disabled",true);
      }else{
        select_input.onchange=function(){updateAttributeRequest(this.id,this.value);}
      }
      
      for(var k = 0; k < options.length; k++) {
        var option = document.createElement("option");
        option.setAttribute("id", "_att_option_"+att.getAttribute("name"));
        option.setAttribute("value",options[k].getAttribute("value"));
        var optiontext = document.createTextNode(options[k].getAttribute("text"));
        if(options[k].getAttribute("selected") == "selected"){
            option.setAttribute("selected","selected");
        }    
        option.appendChild(optiontext);
        select_input.appendChild(option);
      }
      value_cell.appendChild(select_input);
    }else{
      var valueInput = document.createElement("input");
      valueInput.setAttribute("id", att.getAttribute("index")+"_"+att.getAttribute("name"));
      valueInput.setAttribute("type","text");
      valueInput.setAttribute("value",att.getAttribute("value"));
      if(att.getAttribute("readOnly") == "true"){
        valueInput.setAttribute("disabled",true);
      }else{
        valueInput.onchange=function(){updateAttributeRequest(this.id,this.value);}
      }
      value_cell.appendChild(valueInput);
    }
    
    current_row.appendChild(name_cell);
    current_row.appendChild(value_cell);
        
    tablebody.appendChild(current_row);
  }
  table.appendChild(tablebody);
  
  attsDiv.appendChild(table);
}
/* show the attributes index */
function showAttributesIndex(selected){
  if(!selected){
    return;
  }
  var preSelect = document.getElementById("preOID");
  var firstSelect = document.getElementById("firstOID");
  var nextSelect = document.getElementById("nextOID");
  var lastSelect = document.getElementById("lastOID");
  var indexSelect = document.getElementById("indexSelect");
  
  if(!(firstSelect && preSelect && nextSelect && lastSelect && indexSelect)){
    return;
  }
  
  firstSelect.setAttribute("type","image");
  preSelect.setAttribute("type","image");
  nextSelect.setAttribute("type","image");
  lastSelect.setAttribute("type","image");
  
  var index = parseInt(selected.getAttribute("index")) + 1;
  var styleClass = (document.all ? "className" : "class");
  
  indexSelect.innerHTML = index + " of " + selected.getAttribute("size"); 
         
  if(selected.getAttribute("pre") == "true"){
     preSelect.removeAttribute(styleClass);
     preSelect.removeAttribute("disabled");

     firstSelect.removeAttribute(styleClass);
     firstSelect.removeAttribute("disabled");
  }else{
     preSelect.setAttribute(styleClass, "disabledButton");
     preSelect.setAttribute("disabled", true);
     firstSelect.setAttribute(styleClass, "disabledButton");
     firstSelect.setAttribute("disabled", true);
  }
  
  if(selected.getAttribute("next") == "true"){
     nextSelect.removeAttribute(styleClass);
     nextSelect.removeAttribute("disabled");
     
     lastSelect.removeAttribute(styleClass);
     lastSelect.removeAttribute("disabled");

  }else{
     nextSelect.setAttribute(styleClass, "disabledButton");
     nextSelect.setAttribute("disabled", true);
     lastSelect.setAttribute(styleClass, "disabledButton");
     lastSelect.setAttribute("disabled", true);
  }
}

function refreshEditorRequest(action, eventsource) {
  var map = EsriControls.maps[mapId];
  //Get server URL
  var url = EsriUtils.getServerUrl(map.formId);
  //Set request parameters
  var params = "EditBean=EditBean&ajaxServerAction=refresh";

  var changedLayer = document.getElementById("editSelectLayer_select");
  if(changedLayer){
    params = params + "&layerId=" + changedLayer.value;
  }

  var selectEditVersion = document.getElementById(selectEditVersionId);
  if(selectEditVersion){
    params = params + "&version=" + selectEditVersion.value;
  }

  if(action){
    params = params + "&action=" + action;
  }

  //Send AJAX request and set response processing function
  EsriUtils.sendAjaxRequest(url, params, false, function(xmlHttp) { self.updateEditorResponse(xmlHttp, eventsource);});
}

function updateAttributeRequest(id, value) {
  var map = EsriControls.maps[mapId];

  //Get server URL
  var url = EsriUtils.getServerUrl(map.formId);
  //Set request parameters
  var params = "EditBean=EditBean&ajaxServerAction=updateAttributes&id=" + id + "&value=" + value;
  //Send AJAX request and set response processing function
  EsriUtils.sendAjaxRequest(url, params, false, updateEditorResponse);
}

function updateSettingsRequest(name, value, layer) {
  var map = EsriControls.maps[mapId];

  //Get server URL
  var url = EsriUtils.getServerUrl(map.formId);
  //Set request parameters
  var params = "EditBean=EditBean&ajaxServerAction=updateSettings&name=" + name + "&value=" + value;
  if(layer){
    params = params + "&layer=" + layer;
  }
  //Send AJAX request and set response processing function
  EsriUtils.sendAjaxRequest(url, params, false, updateSnapRules);
}

/* Process AJAX request and update content */
function updateSnapRules(xmlHttp) {
  if (xmlHttp != null && xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    //Get XML response
    var xml = xmlHttp.responseXML;

    //If error, show error message
    if (xml.getElementsByTagName("error").length > 0) {
      alert(xml.getElementsByTagName("error").item(0).firstChild.nodeValue);
      return;
    }
    
    var editTask = xml.getElementsByTagName("EditBean").item(0)

    if(editTask){
      var snapStatus = editTask.getElementsByTagName("ConfigBean").item(0);
      if(snapStatus){
         updateSnapStatus(snapStatus);
      }
    }
  }
}

/* Process AJAX request and update content */
function updateEditorResponse(xmlHttp, eventsource, action) {
  if (xmlHttp != null && xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    //Get XML response
    var xml = xmlHttp.responseXML;

    //If error, show error message
    if (xml.getElementsByTagName("error").length > 0) {
      alert(xml.getElementsByTagName("error").item(0).firstChild.nodeValue);
      return;
    }
    
    var editTask = xml.getElementsByTagName("EditBean").item(0)

    if(editTask){
      editBeanHandler(editTask);
    }
    
    editTask = xml.getElementsByTagName("EditorEnterXYWin").item(0);
    if(editTask){
      editorEnterXYWindowHandler(editTask, eventsource);
    }

    editTask = xml.getElementsByTagName("EditorExitConfirmWindow").item(0);
    if(editTask){
      editorExitWindowHandler(editTask,eventsource);
    }
    
    editTask = xml.getElementsByTagName("EditorWindow").item(0);
    if(editTask){
      editorShowWindowHandler(editTask, eventsource, action);
    }

  }
}

/**************************************************************************
 *From editing task *******************************************************
 **************************************************************************/
function EsriEditingDrawAction() {
  this.inheritsFrom(new EsriAction());
  this.isEditing = true;

  this.lineOpacity = 0.5;
  this.fillColor = "#ff0";
  this.fillOpacity = 0.25;
  
  this.symbol.lineOpacity = 0.5;
  this.symbol.fillColor = "#ff0";
  this.symbol.fillOpacity = 0.25

  this.snapping = false;
  this.snapDistance = 5;
  this.snapColor = "#f90";
  this.snapWidth = 8;
  this.snapSymbol = new EsriGraphicsSymbol("#f90",1,8,'#fff',1);

  this.snappedPoint = null;
  this.snapGraphics = null;
  this.snapPoint = null;
  this.snapText = null;
  this.clickTolerance = 3;
  this.clearSnapGraphics = function() {
    if(this.snapPoint) { 
      this.snapGraphics.remove(this.snapPoint);
      this.snapGraphics.remove(this.snapText);
    }
  }
  
  
}

function EsriEditingDrawPointAction() {
  this.inheritsFrom(new EsriEditingDrawAction());
  this.name = "EsriEditingDrawPointAction";

  var element, callback, contCallback, bounds, timer, currPt, gr, graphic;
  var callbackTimeout = 250;
  var createGraphic = true;
  var self = this;

  this.activate = function(elem, cb, ccb, ge) {
    element = elem;
    callback = cb;
    contCallback = ccb;

    element.style.cursor = this.cursor;
    element.onmousemove = processMouseMove;
    element.onclick = processClick;

    if (this.snapping) {
      if(ge) {
        gr = this.snapGraphics = ge;
        createGraphic = false;
      }
      else {
        gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
        EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
        
        this.snapGraphics = EsriUtils.createGraphicsElement(element.id + "sGr", element);
        EsriUtils.setElementStyle(this.snapGraphics.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      }

      gr.gc.onmousemove = this.snapGraphics.gc.onmousemove = processMouseMove;
      gr.gc.onclick = this.snapGraphics.gc.onclick = processClick;
    }
  }

  this.deactivate = function() {
    if (element != null) {
      element.onmousedown = element.onclick = element.onmousemove = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      if (graphic) gr.remove(graphic);
      if(createGraphic) {
        gr.destroy();
        this.snapGraphics.destroy();
      }
      gr.gc.onmousedown = gr.gc.onmousemove = gr.gc.onclick = this.snapGraphics.gc.onmousemove = this.snapGraphics.gc.onmousedown = this.snapGraphics.gc.onclick = null;
    }
    element = callback = gr = this.snapGraphics = this.snappedPoint = null;
  }

  this.reactivate = function() {
    var e = element;
    var c = callback;
    var cc = contCallback;
    var ge = createGraphic ? null : gr;
    this.deactivate();
    this.activate(e, c, cc, ge);
  }

  function getPoint(e) {
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if ((Math.abs(currPt.x - pt.x) <= self.clickTolerance && Math.abs(currPt.y - pt.y) <= self.clickTolerance) && self.snappedPoint) pt = self.snappedPoint;
    return pt;
  }

  function processMouseMove(e) {
    bounds = EsriUtils.getElementPageBounds(element);
    currPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (gr) {
      self.clearSnapGraphics();
      if (graphic) gr.remove(graphic);
      graphic = gr.drawCircle(currPt, self.snapDistance, self.symbol);
      restartTimer();
    }
    if (EsriUtils.isNav) EsriUtils.stopEvent(e);
    return false;
  }

  function processClick(e) {
    clearTimeout(timer);
    bounds = EsriUtils.getElementPageBounds(element);
    currPt = getPoint(e);
    EsriUtils.stopEvent(e);
    if (graphic) gr.remove(graphic);
    self.clearSnapGraphics();
    bounds = null;
    callback(currPt);
  }

  function restartTimer() {
    if (timer) clearTimeout(timer);
    var pt = currPt;
    timer = setTimeout(function() {if(self.snapGraphics) self.clearSnapGraphics();self.snappedPoint = null; contCallback(pt); }, callbackTimeout);
  }
}

function EsriEditingDrawLineAction() {
  this.inheritsFrom(new EsriEditingDrawAction());
  this.name = "EsriEditingDrawLineAction";

  var element, callback, bounds, timer, startPt, gr, tGr, currPt, contCallback, lineGraphic, circleGraphic;
  var callbackTimeout = 250;
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
      gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
      EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
    }

    element.style.cursor = this.cursor;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
    element.onmousemove = gr.gc.onmousemove = processMouseMove;

    if (this.snapping) {
      if (ge) tGr = this.snapGraphics = ge;
      else { 
        tGr = EsriUtils.createGraphicsElement(element.id + "tGr", element);
        EsriUtils.setElementStyle(tGr.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      
        this.snapGraphics = EsriUtils.createGraphicsElement(element.id + "sGr", element);
        EsriUtils.setElementStyle(this.snapGraphics.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      }

      tGr.gc.onmousedown = this.snapGraphics.gc.onmousedown = processMouseDown;
      tGr.gc.onmousemove = this.snapGraphics.gc.onmousemove = processMouseMove;
    }
  }

  this.deactivate = function() {
    if (element != null) {
      element.onmouseup = element.onmousemove = element.onmousedown = null;
      element.style.cursor = "default";
    }
    if (gr != null) {
      if (lineGraphic) gr.remove(lineGraphic);
      if (createGraphic) gr.destroy();
      gr.gc.onmouseup = gr.gc.onmousemove = gr.gc.onmousedown = null;
    }
    if (tGr) {
      if (circleGraphic) tGr.remove(circleGraphic);
      if (createGraphic) {
        tGr.destroy();
        this.snapGraphics.destroy();
      }
      tGr.gc.onmouseup = this.snapGraphics.gc.onmouseup = tGr.gc.onmousemove = this.snapGraphics.gc.onmousemove = tGr.gc.onmousedown = this.snapGraphics.gc.onmousedown = null;
    }
    element = startPt = gr = this.snapGraphics = this.snappedPoint = null;
  }

  this.reactivate = function() {
    var e = element;
    var c = callback;
    var ccb = contCallback;
    var ge = createGraphic ? null : gr;
    this.deactivate();
    this.activate(e, c, ccb, ge);
  }

  function getPoint(e) {
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if ((Math.abs(currPt.x - pt.x) <= self.clickTolerance && Math.abs(currPt.y - pt.y) <= self.clickTolerance) && self.snappedPoint) pt = self.snappedPoint;
    return pt;
  }

  function processMouseDown(e) {
    bounds = EsriUtils.getElementPageBounds(element);
    element.onmousedown = gr.gc.onmousedown = null;
    element.onmouseup = gr.gc.onmouseup = processMouseUp;
    if (tGr) {
      tGr.gc.onmousedown = self.snapGraphics.gc.onmousedown = null;
      tGr.gc.onmouseup = self.snapGraphics.gc.onmouseup = processMouseUp;
    }
    startPt = getPoint(e);
    if (lineGraphic) gr.remove(lineGraphic);
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    if (! bounds) bounds = EsriUtils.getElementPageBounds(element);
    currPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (startPt) {
      if (lineGraphic) gr.remove(lineGraphic);
      lineGraphic = gr.drawLine(startPt, currPt, self.symbol);
    }
    if (tGr) {
      self.clearSnapGraphics();
      if(circleGraphic) tGr.remove(circleGraphic);
      circleGraphic = tGr.drawCircle(currPt, self.snapDistance, self.symbol);
      restartTimer();
    }
    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseUp(e) {
    clearTimeout(timer);
    var sPt = startPt;
    startPt = null;
    if(lineGraphic) gr.remove(lineGraphic);
    element.onmouseup = gr.gc.onmouseup = null;
    element.onmousedown = gr.gc.onmousedown = processMouseDown;
    if (tGr) {
      self.clearSnapGraphics();
      if(circleGraphic) tGr.remove(circleGraphic);
      tGr.gc.onmouseup = self.snapGraphics.gc.onmouseup = null;
      tGr.gc.onmousedown = self.snapGraphics.gc.onmousedown = processMouseDown;
    }
    callback(sPt, getPoint(e));
    EsriUtils.stopEvent(e);
    return false;
  }

  function restartTimer() {
    if (timer) clearTimeout(timer);
    var pt = currPt;
    timer = setTimeout(function() {if(self.snapGraphics) self.clearSnapGraphics();self.snappedPoint = null; contCallback(pt); }, callbackTimeout);
  }
}

function EsriEditingDrawPolyShapeAction(isPolygon) {
  this.inheritsFrom(new EsriEditingDrawAction());
  this.name = (isPolygon) ? "EsriEditingDrawPolygonAction" : "EsriEditingDrawPolylineAction";

  var isPgon = isPolygon;
  var element, callback, contCallback, bounds, pts, index, gr, tGr, timer, currPt, lineGraphic, circleGraphic, closePolyGraphic, polyGraphics;;
  var callbackTimeout = 250;
  var createGraphic = true;
  var self = this;

  this.activate = function(elem, cb, ccb, ge) {
    element = elem;
    callback = cb;
    contCallback = ccb;
    pts = [];
    polyGraphics = [];
    
    if (ge) { 
      gr = (tGr = ge);
      createGraphic = false;
    }
    else {
      gr = EsriUtils.createGraphicsElement(element.id + "gr", element);
      EsriUtils.setElementStyle(gr.gc, "z-index:" + this.graphicsZIndex + ";");
      
      tGr = EsriUtils.createGraphicsElement(element.id + "tGr", element);
      EsriUtils.setElementStyle(tGr.gc, "z-index:" + this.graphicsZIndex + ";");
    }

    element.style.cursor = this.cursor;
    element.onmousedown = tGr.gc.onmousedown = processMouseDown;
    element.onmousemove = tGr.gc.onmousemove = processMouseMove;

    if (this.snapping) {
      if(ge) this.snapGraphics = ge;
      else {
        this.snapGraphics = EsriUtils.createGraphicsElement(element.id + "sGr", element);
        EsriUtils.setElementStyle(this.snapGraphics.gc, "z-index:" + (this.graphicsZIndex + 1) + ";");
      }

      this.snapGraphics.gc.onmousedown = processMouseDown;
      this.snapGraphics.gc.onmousemove = processMouseMove;
    }
    index = 0;
  }

  this.deactivate = function() {
    if (element != null) {
      element.onclick = element.ondblclick = element.onmousemove = element.onmouseup = element.onmousedown = null;
      element.style.cursor = "default";
    }
    
    clearGraphics();
    if (createGraphic) {
      if (gr != null) { 
        gr.gc.onclick = gr.gc.ondblclick = gr.gc.onmousemove = gr.gc.onmouseup = gr.gc.onmousedown = null;
        gr.destroy();
      }
      if (tGr != null) {
        tGr.gc.onclick = tGr.gc.ondblclick = tGr.gc.onmousemove = tGr.gc.onmouseup = tGr.gc.onmousedown = null;
        tGr.destroy();
      }
      if (this.snapGraphics) {
        this.snapGraphics.gc.onclick = this.snapGraphics.gc.ondblclick = this.snapGraphics.gc.onmousemove = this.snapGraphics.gc.onmouseup = this.snapGraphics.gc.onmousedown = null;
        this.snapGraphics.destroy();
      }
    }
    else {
      if (gr != null) {
        gr.gc.onclick = gr.gc.ondblclick = gr.gc.onmousemove = gr.gc.onmouseup = gr.gc.onmousedown = null;
      }
    }
    element = bounds = pts = index = gr = tGr = this.snapGraphics = this.snappedPoint = null;
  }
  
  function clearGraphics() {
    self.clearSnapGraphics();
    if (lineGraphic) tGr.remove(lineGraphic);
    if (circleGraphic) tGr.remove(circleGraphic);
    if (isPgon && closePolyGraphic) tGr.remove(closePolyGraphic);
    for (var i=polyGraphics.length - 1; i>=0; i--) gr.remove(polyGraphics[i]);
  }

  this.reactivate = function() {
    var e = element;
    var cb = callback;
    var ccb = contCallback;
    var ge = createGraphic ? null : gr;
    this.deactivate();
    this.activate(e, cb, ccb, ge);
  }

  function getPoint(e) {
    var pt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if ((Math.abs(currPt.x - pt.x) <= self.clickTolerance && Math.abs(currPt.y - pt.y) <= self.clickTolerance) && self.snappedPoint) pt = self.snappedPoint;
    return pt;
  }

  function processMouseDown(e) {
    bounds = EsriUtils.getElementPageBounds(element);
    pts.push(getPoint(e));

    element.onmousedown = tGr.gc.onmousedown = null;
    element.onclick = tGr.gc.onclick = processClick;
    element.ondblclick = tGr.gc.ondblclick = processDblClick;
    if (self.snapGraphics) {
      self.snapGraphics.gc.onmousedown = null;
      self.snapGraphics.gc.onclick = processClick;
      self.snapGraphics.gc.ondblclick = processDblClick;
    }

    EsriUtils.stopEvent(e);
    return false;
  }

  function processMouseMove(e) {
    if (! bounds) bounds = EsriUtils.getElementPageBounds(element);
    if (lineGraphic) tGr.remove(lineGraphic);
    if (circleGraphic) tGr.remove(circleGraphic);
    if (isPgon && closePolyGraphic) tGr.remove(closePolyGraphic);
    currPt = EsriUtils.getXY(e).offset(-bounds.left, -bounds.top);
    if (pts.length > 0) {
      lineGraphic = tGr.drawLine(pts[index], currPt, self.symbol);
      if (isPgon) closePolyGraphic = tGr.drawLine(currPt, pts[0], self.symbol);
    }
    if (self.snapping) {
      self.clearSnapGraphics();
      circleGraphic = tGr.drawCircle(currPt, self.snapDistance, self.symbol);
      restartTimer();
    }

    EsriUtils.stopEvent(e);
    return false;
  }

  function processClick(e) {
    pts.push(getPoint(e));
    index++;
    if (index > 0) polyGraphics.push(gr.drawLine(pts[index - 1], pts[index], self.symbol));
    EsriUtils.stopEvent(e);
    return false;
  }

  function processDblClick(e) {
    clearTimeout(timer);
    clearGraphics();
    tGr.gc.onclick = tGr.gc.ondblclick = element.onclick = element.ondblclick = null;
    element.onmousedown = tGr.gc.onmousedown = processMouseDown;
    if (self.snappingGraphics) {
      this.snapGraphics.gc.onclick = this.snapGraphics.gc.ondblclick = null;
      this.snapGraphics.gc.onmousedown = processMouseDown;
    }

    var newPts = [];
    for (var i=1;i<pts.length;i++) { if (pts[i].x != pts[i-1].x || pts[i].y != pts[i-1].y) newPts.push(pts[i-1]); }
    newPts.push(getPoint(e));

    pts = [];
    index = 0;
    currPt = bounds = timer = null;
    EsriUtils.stopEvent(e);
    callback(newPts);
  }

  function restartTimer() {
    if (timer) clearTimeout(timer);
    var pt = currPt;
    timer = setTimeout(function() {if(self.snapGraphics) self.clearSnapGraphics();self.snappedPoint = null; contCallback(pt); }, callbackTimeout);
  }
}

function EsriEditingToolItem(id, toolName, action) {
  this.inheritsFrom(new EsriMapToolItem(id, toolName, action, false));
  this.taskId = null;

  this.activate = function() {

    var sElem= document.getElementById(snapEnabledId);
    if(sElem){
      this.action.snapping = (sElem.value == "true");
      this.action.snapDistance = parseInt(document.getElementById(snapTolId).value);
      this.action.snapColor = new EsriColor().fromString(document.getElementById(snapColorId).value).toHex();
      this.action.snapWidth = snapWidth;
    }
  
    this.action.activate(this.element, this.postAction, this.continuousAction, this.control.graphics);
    this.isActive = true;
    
  }
}

function EsriEditingPoint(id, toolName) {
  this.inheritsFrom(new EsriEditingToolItem(id, toolName, new EsriEditingDrawPointAction()));
  var self = this;

  this.update = function() { self = this; }

  this.continuousAction = function(point) {
    self.update();
    var map = self.control;
    EsriEditingUtils.snapPointRequestHandler(self.taskId, map.id, point.offset(-map.viewBounds.left, -map.viewBounds.top), self.action);
  }

  this.postAction = function(point) {
    self.update();
    var map = self.control;
    if (self.showLoading) map.showLoading();
    point = point.offset(-map.viewBounds.left, -map.viewBounds.top);

    EsriUtils.addFormElement(map.formId, map.id, map.id);
    EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
    EsriUtils.addFormElement(map.formId, map.id + "_minx", point.x);
    EsriUtils.addFormElement(map.formId, map.id + "_miny", point.y);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }
}

function EsriEditingLine(id, toolName) {
  this.inheritsFrom(new EsriEditingToolItem(id, toolName, new EsriEditingDrawLineAction()));
  var self = this;

  this.update = function() { self = this; }

  this.continuousAction = function(point) {
    self.update();
    var map = self.control;
    EsriEditingUtils.snapPointRequestHandler(self.taskId, map.id, point.offset(-map.viewBounds.left, -map.viewBounds.top), self.action);
  }

  this.postAction = function(from, to) {
    if (from.x == to.x && from.y == to.y) return;

    self.update();
    var map = self.control;
    if (self.showLoading) map.showLoading();
    from = from.offset(-map.viewBounds.left, -map.viewBounds.top);
    to = to.offset(-map.viewBounds.left, -map.viewBounds.top);

    EsriUtils.addFormElement(map.formId, map.id, map.id);
    EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
    EsriUtils.addFormElement(map.formId, map.id + "_coords", from.x + ":" + from.y + "|" + to.x + ":" + to.y);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }
}

function EsriEditingPoly(id, toolName, isPgon) {
  this.inheritsFrom(new EsriEditingToolItem(id, toolName, new EsriEditingDrawPolyShapeAction(isPgon)));
  var isPolygon = isPgon;
  var self = this;

  this.update = function() { self = this; }

  this.continuousAction = function(point) {
    self.update();
    var map = self.control;
    EsriEditingUtils.snapPointRequestHandler(self.taskId, map.id, point.offset(-map.viewBounds.left, -map.viewBounds.top), self.action);
  }

  this.postAction = function(points) {
    if (points.length <= 1) return;

    self.update();
    var map = self.control;
    if (self.showLoading) map.showLoading();

    var pts = "";
    var viewLeft = map.viewBounds.left;
    var viewTop = map.viewBounds.top;
    for (var i=0;i<points.length;i++) {
      points[i] = points[i].offset(-viewLeft, -viewTop);
      if (i == 0) pts += points[i].x + ":" + points[i].y;
      else pts += "|" + points[i].x + ":" + points[i].y;
    }
    EsriUtils.addFormElement(map.formId, map.id, map.id);
    EsriUtils.addFormElement(map.formId, map.id + "_mode", self.id);
    EsriUtils.addFormElement(map.formId, map.id + "_coords", pts);
    if (self.clientPostBack) EsriUtils.addFormElement(map.formId, "doPostBack", "doPostBack");
    EsriUtils.submitForm(map.formId, self.clientPostBack, EsriControls.processPostBack);
  }
}

function EsriEditingPolyline(id, toolName) { return new EsriEditingPoly(id, toolName, false); }
function EsriEditingPolygon(id, toolName) { return new EsriEditingPoly(id, toolName, true); }

var EsriEditingUtils = new function() {
  var ccWin;
  var fontSize = 12;
  var snapPoint, snapText, txtSymbol, ptSymbol;
  var fontStyle = "font-size:" + fontSize + "px; font-stretch:narrower;background-color:#fff";
  this.showColorChooser = function(title, fieldId, butId) {
    var cs = document.getElementById(fieldId).value.split(",");
    var initColor;
    if (cs.length == 3) initColor = new EsriColor(parseInt(cs[0]), parseInt(cs[1]), parseInt(cs[2]));

    var cc = new EsriColorChooser("cc", document.body, function(color) { ccWin.hide();document.getElementById(fieldId).value = color.red + "," + color.green + "," + color.blue; document.getElementById(fieldId).onclick(); EsriUtils.setElementStyle(document.getElementById(butId), "background-color:rgb(" + color.red + "," + color.green + "," + color.blue + ");"); }, initColor);
    var ccWin = new EsriWindow(new Date().getTime(), title, cc);
    ccWin.movable = true;
    ccWin.collapsable = false;
    ccWin.resizable = false;
    ccWin.init();
    ccWin.fit();
    ccWin.center();
    ccWin.toFront();
  }

  this.snapPointRequestHandler = function(taskId, mapId, point, action) {
    var map = EsriControls.maps[mapId];
    var url = EsriUtils.getServerUrl(map.formId);
    var params = "EditBean=EditBean&ajaxServerAction=snapPoint&formId=" + map.formId + "&x=" + point.x + "&y=" + point.y + "&" + EsriUtils.buildRequestParams(map.formId);
    EsriUtils.sendAjaxRequest(url, params, false, function(xh) { EsriEditingUtils.snapPointResponseHandler(xh, mapId, action); });
  }

  this.snapPointResponseHandler = function(xh, mapId, action) {
    if (xh != null && xh.readyState == 4 && xh.status == 200) {
      var xml = EsriUtils.getXmlDocument(xh);
      var error = EsriUtils.getErrorFromDocument(xml);
      var map = EsriControls.maps[mapId];
      txtSymbol = new EsriGraphicsSymbol(action.snapColor,1.0,1.1,action.snapColor,1.0);
      ptSymbol = new EsriGraphicsSymbol(action.snapColor,1.0,3,action.snapColor,1.0);
      
      if (error) {
        alert(error);
        return;
      }

      var pointTags = xml.getElementsByTagName("point");
      var point;
      if (pointTags.length > 0) {
        var pointTag = pointTags.item(0);
        var x = parseInt(pointTag.getElementsByTagName("x").item(0).firstChild.nodeValue);
        var y = parseInt(pointTag.getElementsByTagName("y").item(0).firstChild.nodeValue);
        point = new EsriPoint(x, y);
      }

      var sg = action.snapGraphics;
      if (sg) {
        action.clearSnapGraphics();
        if (point) {
          var mvr = map.viewBounds;
          point = point.offset(mvr.left, mvr.top);
          action.snapPoint = sg.drawPoint(point, ptSymbol);

          action.snappedPoint = point;
          var label = pointTag.getElementsByTagName("label").item(0).firstChild.nodeValue;
          var lblWd = Math.round(label.length * fontSize * 0.667);
          var lblHt = fontSize + 4;
 
          var rect = new EsriRectangle(point.x - Math.round(lblWd / 2), point.y - (2 * lblHt), lblWd, lblHt);
          action.snapText = sg.drawText(label, rect, fontStyle, txtSymbol);
        }
      }
    }
  }
}
