<!DOCTYPE HTML PUBLIC "-//W3C/DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page contentType="text/html" pageEncoding="UTF-8" %>

<%@taglib uri="http://www.esri.com/adf/web" prefix="a"%>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h"%>

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Web Mapping Application</title>
    <link rel="stylesheet" title="base" href="css/base-style.css" type="text/css" media="screen" />
    <link rel="stylesheet" title="base" href="css/esri_styles.css" type="text/css" media="screen" />
    <link rel="stylesheet" title="base" href="css/results.css" type="text/css" media="screen" />
    <link rel="stylesheet" title="base" href="css/taskmenu.css" type="text/css" media="screen"/>
    <link rel="stylesheet" title="base" href="themes/blue.css" type="text/css" media="screen" />

    <script type="text/javascript" language="javascript" src="js/resource.js"></script>
    <script type="text/javascript" language="javascript" src="js/esri_navigator.js" ></script>
    <script type="text/javascript" language="javascript" src="js/slider.js"></script>
    <script type="text/javascript" language="javascript" src="js/taskbox.js"></script>
    <script type="text/javascript" language="javascript" src="js/mapviewer.js"></script>
    <script type="text/javascript" language="javascript" src="js/results.js"></script>
    <script type="text/javascript" language="Javascript" src="js/esri_edit.js"></script>  
    <script type="text/javascript" language="Javascript" src="js/esri_colorchooser.js"></script>
    <script type="text/javascript" language="javascript" src="js/identify.js"></script>
  </head>

  <f:view>
    <f:loadBundle basename="res.mapviewer" var="res"/>
    <a:context value="#{mapContext}" />
    <body onload="initLayout();">
      <h:form id="mapForm">
        <div id="page">
          <div id="header">
            <div id="title">
              <table style="padding-right: 10px;" align="right" cellspacing="0" cellpadding="0" width="100%" valign="top">
                <tr>
                  <td class="xlarge bold" style="color: #fff;">Web Mapping Application</td>
                  <td align="right" valign="top">
                    <table align="right">
                      <tr>
                        <td align="right">
                          <a class="appLink" href="help/index.html" target="_blank">Help</a>
                        </td>
                      </tr>
                      <tr>
                        <td align="right">
                          <h:outputText styleClass="appNote" value="#{res.LoggedInAs}: #{mapContext.attributes.webappSecurityInfo.user} " rendered="#{mapContext.attributes.webappSecurityInfo.secured}"/>
                          <h:commandLink styleClass="appLink" action="#{mapContext.attributes.webappSecurityInfo.logOut}" rendered="#{mapContext.attributes.webappSecurityInfo.logoutAvailable}">
                             <h:outputText value=" #{res.LogOut}"/>
                          </h:commandLink>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <div id="subHeader">
            </div>
          </div>

          <div id="panel">
            <div id="taskCenterPanel">
              <!-- task panel here -->
            </div>
          </div>

          <div id="layoutslider" class="slider" callbackFunction="resizePanelContentLayout">
            <img src="images/pixel.gif" width="7" height="1"/>
          </div>
          <div id="content">
            <a:map value="#{mapContext.webMap}" id="map1" width='<%= request.getParameter("width") %>' height='<%= request.getParameter("height") %>' scaleBar="#{mapContext.attributes['webappScaleBar']}" />
            
            <div id="nav-slider">
              <table cellspacing="0" cellpadding="0">
                <tbody>
                  <tr>
                    <td id="nav-container">
                      <img src="images/pixel.gif" height="52" width="52"/>
                    </td>
                  </tr>
                  <tr>
                    <td id="slider-container" style="padding-left: 18px;">
                    </td>
                  </tr>                  
                </tbody>
              </table>
            </div>

            <div id="copyright">
              <span id="copyright-label" onclick="requestCopyrightInfo();">
                &copy; Copyright
              </span>
            </div>

            <div id="overview">
              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" valign="middle">
                    <a:overview id="ov1" value="#{mapContext.webOverview}" mapId="map1" width="280" height="190" lineColor="#f00" />
                  </td>
                </tr>
              </table>
            </div>

          </div>
        </div>

        <div id="statusDiv">
          <!-- status here  mandy 2015-05-08 -->
        </div>

        <div id="task-menu" class="tasks-menu">
          <ul>
            <li class="menu-bar">
            <a href="#" class="menu-header" title="Search Attributes Task" onclick="toggleWindow('win_EsriTaskCell_searchAttributesTask');">
                <span>Search Attributes</span>
              </a>
            </li>
            <li class="menu-bar">
               <a href="#" class="menu-header" onclick="toggleWindow('win_EsriTaskCell_addGeorssTask');" > 
                <span>Add Georss Layer </span>
              </a> 
            </li>
          </ul>
        </div>


        <div id="map-tools">
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 0px; padding-left: 10px;" align="right"
                valign="top"><a:task id="mapToolsTask"
                value="#{mapContext.attributes.webappMapToolsTask}"
                taskInfo="#{mapContext.attributes.webappMapToolsTask.taskInfo}"
                mapId="map1" windowingSupport="false"
                style="padding:0px;margin:0px;" xslFile="maptoolstask.xsl" />
              </td>
              <td style="width: 25px; padding: 0px; padding-left: 0px;" align="right">
                <input width="25px" type="image"
                  height="25px" title="Toggle Overview Map"
                  onmouseout="//EsriUtils.setImageSrc(this, 'images/show-overview-map.png');"
                  onclick="esriToggleOverviewMap(); return false;"
                  onmousedown="//EsriUtils.setImageSrc(this, 'images/show-overview-map.png');"
                  onmouseover="//EsriUtils.setImageSrc(this, 'images/show-overview-map.png');"
                  onload="EsriUtils.setImageSrc(this, 'images/show-overview-map.png');"
                  src="images/show-overview-map.png"
                  id="button_mapToolsTask_action_toggleOverview"
                  name="button_mapToolsTask_action_toggleOverview" />
              </td>
            </tr>
          </table>          
        </div>

        <!-- Panel Content Divs  mandy 2015-05-08 -->

        <div id="resultsPanelContent" class="content" style="width:100%; height:300px; overflow: hidden;">
          <a:results id="results" value="#{mapContext.attributes.webappResults}" mapId="map1" clientPostBack="true" xslFile="results.xsl" />
        </div>

        <div id="tocPanelContent" class="content">
          <a:toc id="toc1" value="#{mapContext.webToc}" mapId="map1" style="height:400px;" clientPostBack="true" />
        </div>

        <a:task mapId = "map1" id = "addGeorssTask" value = "#{addGeorssTask}" style = "width:400px;height:100px;" /  >

        <a:task id="searchAttributesTask" value="#{mapContext.attributes.webappSearchAttributesTask}" taskInfo="#{mapContext.attributes.webappSearchAttributesTask.taskInfo}" mapId="map1" />
        <h:inputHidden id="taskWindows"/>
      </h:form>

    </body>
  </f:view>
</html>