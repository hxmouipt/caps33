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


  /**
   * The function is called back by the print task AJAX renderer.
   * It will open a new window to render the printing map.
   *
   * @param {Object} xml - an DOM object
   * @param {Object} eventSources
   */
  function processCreatePrintPage(xml, eventSources) {
    var printMapObj = new PrintMap(xml);
    closeWindow(printMapObj.getTaskId());

    var win = window.open("", "PrintingMap", "toolbar,menubar,scrollbars,status,resizable,alwaysRaised,width=672,height=660");
    win.focus();

    var doc = win.document;
    doc.title = printMapObj.getMapTitle();
    doc.body.innerHTML="";

    var docBody = doc.getElementsByTagName("body")[0];
    doc.writeln(getStyleSheetString());
    //Generate the printable page;
    doc.writeln(getPrintPage(printMapObj));
    doc.close();
    return false;
  }

  /**
   * Generates the print map page.
   *
   * @param {PrintMap Object} printMapObj
   */
  function getPrintPageLayoutOne(printMapObj) {
    var htmlStr = "";
    htmlStr += "<table width='100%'>";
    htmlStr += "<tr><td align='center' colspan='2'><h1>"+printMapObj.getMapTitle()+"</h1></td></tr>";
    htmlStr += "<tr style='vertical-align:top;'><td>"+renderPrintMapInHTML(printMapObj)+"</td><td>"+renderLegendTableInHTML(printMapObj)+"</td></tr>";
    htmlStr += "<tr><td colspan='2'>"+renderResultTableInHTML(printMapObj)+"</td></tr>";
    htmlStr += "</table>";
    return htmlStr;
  }

  /**
   * Generates the print map page.
   *
   * @param {PrintMap Object} printMapObj
   */
  function getPrintPage(printMapObj) {
    var htmlStr = "";
    htmlStr += "<table width='100%' align='left'>";
    htmlStr += "<tr><td><h1>"+printMapObj.getMapTitle()+"</h1></td></tr>";
    htmlStr += "<tr><td>"+renderPrintMapInHTML(printMapObj)+"</td></tr>";
    htmlStr += "<tr><td>"+renderLegendTableInHTML(printMapObj)+"</td></tr>";
    htmlStr += "<tr><td >"+renderResultTableInHTML(printMapObj)+"</td></tr>";
    htmlStr += "</table>";
    return htmlStr;
  }

  /**
   * The function is called before the print map button on printing task UI is clicked.
   * It does the client side data validation for map resolution and scale.
   *
   * @param {Object} taskId
   * @param {Object} mapId
   * @param {Object} taskActionId
   * @param {Object} showingLoadingImage
   * @param {Object} clientPostBack
   */
  function createPrintMap(taskId, mapId, taskActionId, showingLoadingImage, clientPostBack) {
    EsriControls.maps[mapId].createCurrentToolItem(taskActionId,
      'button_'+taskActionId,
      'EsriMapServerAction',
      showingLoadingImage,
      clientPostBack,
      null, null,
      'esriToolDefault',
      'esriToolHover',
      'esriToolSelected',
      'esriToolDisabled');

    return false;
  }

  /**
   * The function to close the print task window.
   */
  function closeWindow(taskId) {
    var printTaskId = "win_EsriTaskCell_"+taskId;
    if(taskWindowManager && taskWindowManager.windows[printTaskId]) {
      var w = taskWindowManager.windows[printTaskId];
      w.center();
      w.hide();
    }
  }


  /**
   * The function is called when the query result checkbox is clicked.
   * It will update the passed hidden input value. When the print
   * button is clicked, the value is passed to the server.
   *
   * @param {Object} nodeId
   */
  function resultChecked(nodeId) {
    var test = document.getElementsByTagName("input");
    var st = "";
    for (i=0; i<test.length; i++) {
      var n = test.item(i);
      if ( n.id.indexOf("print-result") >=0 && n.checked) {
        if (st .length == 0) {
          st +=  n.value;
        } else {
          st +=  ","+n.value ;
        }
      }
    }
    nodeId.value = st;
  }

  /**
   * Generates the legend table.
   *
   * @param {Object} printMapObj
   */
  function renderLegendTableInHTML(printMapObj) {
    var htmlStr = "";
    var numberOfLegendColumn = printMapObj.getLegendColumns();

    if (printMapObj.getIsPrintLegend().indexOf('true') >= 0) {
      var nodeArray = printMapObj.getLegendNodes();
      var legendNumInColumn = Math.ceil((nodeArray.length) / numberOfLegendColumn);

      htmlStr = "<table cellspacing='0' cellpadding='0' style='border:thin solid rgb(230,230,230);'>";
      htmlStr += "<tbody>";
      var node;
      var indexPos;
      for (var i=0; i<legendNumInColumn; i++) {
        htmlStr += "<tr>";
        for (var j=0; j<numberOfLegendColumn; j++) {
          indexPos =i+ j*legendNumInColumn;
          if (indexPos < nodeArray.length) {
            node = nodeArray[indexPos];
            htmlStr += renderLegendPatchInHTML(node.getLevel(), node.getLabel(), node.getImageUrl());
          }
        }
        htmlStr += "</tr>";
      }
      htmlStr += "</tbody>";
      htmlStr += "</table>";
    }
    return htmlStr;
  }

 /**
  * Generates the query result table.
  *
  * @param {Object} printMapObj
  */
  function renderResultTableInHTML(printMapObj) {
    var htmlStr = "";
    var printResultsArray = printMapObj.getPrintResults();
    if (printResultsArray.length > 0) {
      for(i=0; i<printResultsArray.length; i++) {
        var printResult = printResultsArray[i];
        htmlStr += "<table  style='result'><tbody>";
        htmlStr += "<tr><td>";
        htmlStr += "<span style='font-family:sans-serif;font-size:8pt;font-weight:bold'>"+printResult.getName()+"</span>";
        htmlStr += "</td></tr>";

        var layerQueryResults = printResult.getLayerQueryResults();
        for(k=0; k<layerQueryResults.length; k++) {
          var layerQueryResult = layerQueryResults[k];
          htmlStr += "<tr><td>";
          htmlStr += "<span style='font-family:sans-serif;font-size:8pt;font-weight:normal'>"+layerQueryResult.getName()+"("+layerQueryResult.getCount()+")"+"</span>";
          htmlStr += "</td></tr>";

          var detailKeys = layerQueryResult.getKeys();
          var detailVals = layerQueryResult.getValues();

          htmlStr += "<tr><td align='left'>"; //start

          htmlStr += "<table align='left' id='result'><tbody>";
          //render the title
          htmlStr += "<tr>";
          var keys = detailKeys[0];
          for (var j=0; j<keys.length; j++) {
            htmlStr += "<th>"+ keys[j] +"</th>";
          }
          htmlStr += "</tr>";

          //generates the data
          for (m=0; m<detailVals.length; m++) {
            var values = detailVals[m];
            htmlStr += "<tr>" ;
            for (var j=0;j<values.length;j++) {
              htmlStr += "<td>"+ values[j] +"</td>";
            }
            htmlStr += "</tr>" ;
          }
          htmlStr += "</tbody></table>";
          htmlStr += "</td></tr>";//end
        }
        htmlStr += "</tbody></table>";
        htmlStr += "</br>";
      }
    }
    return htmlStr;
  }


 /**
  * Generates each Query Result table.
  *
  * @param {Object} keys - an array object
  * @param {Object} values - an array object
  */
  function getQueryResultTableInHTML(keys, values) {
    var htmlStr = "<table align='left' id='result'><tbody>";
    htmlStr += "<tr>";
    for (var j=0; j<keys.length; j++) {
      htmlStr = htmlStr +"<th>"+ keys[j] +"</th>";
    }
    htmlStr += "</tr>";
    //generates the data
    htmlStr += "<tr>" ;
    for (var j=0;j<values.length;j++) {
      htmlStr = htmlStr +"<td>"+ values[j] +"</td>";
    }
    htmlStr += "</tr>" ;
    htmlStr += "</tbody></table><br><br>";
    return htmlStr;
  }

 /**
  * Writes the Stlyes for the Page.
  */
  function getStyleSheetString() {
    var cssStr = "<style type='text/css'>";
    cssStr += getResultStyleStr();
    cssStr += getLegendStyleStr();
    cssStr += "</style>";
    return cssStr;
  }

 /**
  * Returns the Result Stlyes.
  */
  function getResultStyleStr() {
    var styleStr = "#result {border-width: 1px 1px 1px 1px;border-spacing: 0px;border-style: none none none none;border-color: #cccccc #cccccc #cccccc #cccccc;border-collapse: collapse;font-family: 'Arial','Helvetica',sans-serif;font-size: 10px;}";
    styleStr    += "#result th {border-width: 1px 1px 1px 1px;padding: 1px 1px 1px 1px;border-style: inset inset inset inset;border-color: #cccccc #cccccc #cccccc #cccccc;}";
    styleStr    += "#result td {border-width: 1px 1px 1px 1px;padding: 1px 1px 1px 1px;border-style: inset inset inset inset;border-color: #cccccc #cccccc #cccccc #cccccc;}";
    return styleStr;
  }

 /**
  * Return the Legend Styles.
  */
  function getLegendStyleStr() {
    var styleStr = "td.esriTocLabelDataFrame { color:#000; font-family:Arial,Sans-Serif; font-size:8pt; font-weight:bold; }";
    styleStr    += "td.esriTocLabelLayer { color:#000; font-family:Arial,Sans-Serif; font-size:8pt; font-weight:bold; }";
    styleStr    += "td.esriTocLabelField { color:#000; font-family:Arial,Sans-Serif;font-style: italic; font-size:8pt; font-weight:normal; }";
    styleStr    += "td.esriTocLabel { color:#000; font-family:Arial,Sans-Serif; font-size:8pt; font-weight:normal; }";
    return styleStr;
  }

 /**
  * Renders the Printable Map in a HTML table.
  * @param {Object} printMapObj
  */
  function renderPrintMapInHTML(printMapObj) {
    var htmlStr = "";
    if (printMapObj.getIsPrintResultOnly().indexOf('false') >= 0) {
      htmlStr = "<table >";
      htmlStr += "<tr ><td>";
      htmlStr += "<img style='border:thin solid rgb(204,204,204);' src='"+printMapObj.getMapUrl()+"' alt='Map' width='"+printMapObj.getMapWidth()+"' height='"+printMapObj.getMapHeight()+"' />";
      htmlStr += "</td></tr>";
      htmlStr += "</table>";
      htmlStr += "<span style='font-family: Arial,Helvetica,sans-serif; font-size: 10px; z-index:99'>"+printMapObj.getCopyrightText()+"</span>";
    }
    return htmlStr;
  }

 /**
  * Generates the legend patch in a column row.
  * @param {Object} level
  * @param {Object} label
  * @param {Object} imageUrl
  */
  function renderLegendPatchInHTML(level, label, imageUrl ) {
    var htmlStr = "";
    if (level == 0) {
      htmlStr += "<td nowrap='' class='esriTocLabelDataFrame'>";
    } else if (level == 1) {
      htmlStr += "<td nowrap='' class='esriTocLabelLayer'>";
    } else if (level == 2 && imageUrl.length < 2 ) {
      htmlStr += "<td nowrap='' class='esriTocLabelField'>";
    } else {
      htmlStr += "<td nowrap='' class='esriTocLabel'>";
    }
    var indents = 5+5*level;
    htmlStr += "<img src='images/pixel.gif' style='width: "+indents+"px; height: 0px;'/>" ;
    if (imageUrl.length >1) {
      htmlStr += "<img src='images/pixel.gif' style='margin: 0px 4px 0px 0px; padding: 0px 4px 0px 0px; width: 9px; height: 0px;'/>";
      htmlStr += "<img src="+imageUrl+" style='margin: 0px 4px 0px 0px; padding: 0px 4px 0px 0px;'/>";
    }
    htmlStr += "<span>"+label+"</span>";
    htmlStr += "</td>";
    return htmlStr;
  }

 /**
  * The class represents a printing map object.
  * It wraps all information needed to generate a Printing page.
  *
  * @param {Object} xmlObj
  */
  PrintMap = function(xmlObj) {
    this.taskId = getNodeValue(xmlObj, "task-id");
    this.mapTitle = getNodeValue(xmlObj, "map-title");
    this.mapWidth = getNodeValue(xmlObj, "map-width");
    this.mapHeight = getNodeValue(xmlObj, "map-height");
    this.mapUrl = getNodeValue(xmlObj, "map-url");
    this.isPrintResultOnly = getNodeValue(xmlObj, "print-resultOnly");
    this.isPrintLegend = getNodeValue(xmlObj, "print-legend");
    this.copyrightText = getNodeValue(xmlObj, "map-copyright");
    this.legendColumns = parseInt(getNodeValue(xmlObj, "legend-columns"));

    this.legendNodes =  getLegendNodeArray(xmlObj);
    this.printResults = getThePrintResults(xmlObj);

   /*
    * Returns the node value
    */
    function getNodeValue(xml, tagName){
      var node = xml.getElementsByTagName(tagName);
      if (node !=null && node.length >0 && node.item(0).childNodes.length > 0) {
        return node.item(0).firstChild.nodeValue;
      }
      return "";
    }

   /*
    * Return an array of legend nodes.
    */
    function getLegendNodeArray(xml) {
      var legendNodes = xml.getElementsByTagName("node");
      var nodeArray = new Array();
      if (legendNodes.length > 0) {
        for(i=0; i<legendNodes.length; i++) {
          var legendNode = legendNodes.item(i);
          if (legendNode.hasChildNodes()) {
            var level = 0;
            var key = ' ';
            var label = ' ';
            var imageUrl = ' ';
            //extracts the level, patchUrl, and labelText values
            var legChildNodes = legendNode.childNodes;
            for (j=0; j< legChildNodes.length; j++) {
              var lcNode = legChildNodes.item(j);
              if (lcNode.nodeName == "level") {
                level = parseInt(lcNode.firstChild.nodeValue);
              } else if (lcNode.nodeName == "key") {
                key = lcNode.firstChild.nodeValue;
              } else if (lcNode.nodeName == "content") {
                if (lcNode.childNodes.length == 1) {
                  var cccnode = lcNode.childNodes.item(0);
                  if (cccnode.nodeName == "text" && cccnode.childNodes.length >0  ) {
                    label = cccnode.firstChild.nodeValue;
                  } else if (cccnode.nodeName == "image-url"){
                    imageUrl = cccnode.firstChild.nodeValue;
                  }
                }
                if (lcNode.childNodes.length == 2){
                  if (lcNode.childNodes.item(0).hasChildNodes()) {
                    label = lcNode.childNodes.item(0).firstChild.nodeValue;
                  }
                  if (lcNode.childNodes.item(1).hasChildNodes()) {
                    imageUrl = lcNode.childNodes.item(1).firstChild.nodeValue;
                  }
                }
              }
            } // end of for
          nodeArray.push(new LegendNode(level, key, label, imageUrl));
          }
        }
      } //if (legendNodes.length > 0) {
      return nodeArray;
    }

   /*
    * Returns the PrintResult
    */
    function getThePrintResults(xmlObj) {
      var print_Results = new Array();
      var printResultNodes = xmlObj.getElementsByTagName("print-result");
      if (printResultNodes.length > 0) {
        for(i=0; i<printResultNodes.length; i++) {
          var prname = printResultNodes[i].getAttribute("name");
          var printResult = new PrintResult(prname);
          var layers = printResultNodes[i].getElementsByTagName("layer");
          for(j=0; j<layers.length; j++) {
            var n = layers[j].getAttribute("name");
            var c = layers[j].getAttribute("results");
            var layerQueryResult = new LayerQueryResult(n, c);
            var details = layers[j].getElementsByTagName("details");
            for (var m=0; m<details.length; m++) {
              var detail = details[m].getElementsByTagName("detail");
              var keys = new Array();
              var vals = new Array();
              //generates the data
              for (var n=0; n<detail.length; n++) {
                keys.push(detail[n].getAttribute("key"));
                vals.push(detail[n].getAttribute("value"));
              }
              layerQueryResult.addDetail(keys, vals);
            } //end of for
            printResult.addLayerQueryResult(layerQueryResult);
          }
          print_Results.push(printResult);
        } //end of for
      } // end of if
      return print_Results;
    }
  }

  PrintMap.prototype.getTaskId = function() {
    return this.taskId;
  }

  PrintMap.prototype.getMapTitle = function() {
    return this.mapTitle;
  }

  PrintMap.prototype.getMapWidth = function() {
    return this.mapWidth;
  }

  PrintMap.prototype.getMapHeight = function() {
    return this.mapHeight;
  }

  PrintMap.prototype.getMapUrl = function() {
    return this.mapUrl;
  }

  PrintMap.prototype.getIsPrintResultOnly = function() {
   return this.isPrintResultOnly;
  }

  PrintMap.prototype.getIsPrintLegend = function() {
    return this.isPrintLegend;
  }

  PrintMap.prototype.getCopyrightText = function() {
    return this.copyrightText;
  }

  PrintMap.prototype.getLegendColumns = function() {
    return this.legendColumns;
  }

  PrintMap.prototype.getLegendNodes = function() {
    return this.legendNodes;
  }

  PrintMap.prototype.getPrintResults = function() {
    return this.printResults;
  }
  /* ===== End of the PrintMap class ===== */


 /**
  * A Legend Node class. It stores all properties to represent a legend.
  *
  * @param {Object} level
  * @param {Object} key
  * @param {Object} label
  * @param {Object} imageUrl
  */
  LegendNode = function(level, key, label, imageUrl) {
    this.level = (level != undefined) ? level : 0;
    this.key = (key != undefined) ? key : "";
    this.label = (label != undefined) ? label : "";
    this.imageUrl = (imageUrl != undefined) ? imageUrl : "";
  }

  LegendNode.prototype.getLevel = function() {
    return this.level;
  }

  LegendNode.prototype.getKey = function() {
    return this.key;
  }

  LegendNode.prototype.getLabel = function() {
    return this.label;
  }

  LegendNode.prototype.getImageUrl = function() {
    return this.imageUrl;
  }
  /* ===== End of the legend node class =====  */

  /**
  * The class represents the print-result tag data object.
  * @param {Object} name
  */
  PrintResult = function(name) {
    this.name   = (name != undefined) ? name : "";
    this.LayerQueryResults   = new Array();
  }

  PrintResult.prototype.getName = function() {
    return this.name;
  }

  PrintResult.prototype.setName = function(na) {
    this.name = (na != undefined) ? na : "";;
  }
  PrintResult.prototype.getLayerQueryResults = function() {
    return this.LayerQueryResults;
  }

  PrintResult.prototype.addLayerQueryResult = function(layerQR) {
    this.LayerQueryResults.push(layerQR);
  }

  /**
  * The class represents a query result data object.
  * The object wraps the XML portions,
  * For example,
  *  <layer name="usa" results="3">
  *    <details>
  *      <detail key="name" value="riverside" />
  *    </details>
  *  </layer>
  * @param {Object} name
  */
  LayerQueryResult = function(name, count) {
    this.name   = (name != undefined) ? name : "";
    this.count   = (count != undefined) ? count : 0;
    this.keysArray   = new Array();
    this.valuesArray = new Array();
  }

  LayerQueryResult.prototype.getName = function() {
    return this.name;
  }

  LayerQueryResult.prototype.getCount = function() {
    return this.count;
  }

  LayerQueryResult.prototype.getKeys = function() {
    return this.keysArray;
  }

  LayerQueryResult.prototype.getValues = function() {
    return this.valuesArray;
  }

  LayerQueryResult.prototype.addDetail = function(keys, vals) {
    this.keysArray.push(keys);
    this.valuesArray.push(vals);
  }
