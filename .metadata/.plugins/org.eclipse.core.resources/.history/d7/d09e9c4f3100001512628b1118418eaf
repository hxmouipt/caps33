<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Copyright (c) 2000-2003, Environmental Systems Research Institute, Inc. All rights reserved. -->
  <!-- XSL file for Task control -->
  <xsl:import href="core.xsl"/>
  <xsl:import href="edittask-layout-nodes.xsl"/>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <!--
  To customize the appearance of the task control, enter values for each attribute you wish to customize in their
  respective opening and closing <xsl:variable> tags below.  You can customize as many or as few attributes
  as you wish.

  Any attributes defined in the web control's JSP tag will take precedence over custom values defined below.

  Both class and style attributes are permitted in a single tag.  Properties defined below or in the web control's JSP tag attributes
  will override class properties.  However, if a property that is defined in the class is not defined below or in the JSP tag attributes
  then the class definition will handle that property.
  -->
  <xsl:variable name="customStyle"/>
  <xsl:variable name="customStyleClass"/>
  <!-- End of variable customization -->

  <xsl:variable name="contextPath"><xsl:value-of select="//context-path"/>/</xsl:variable>

  <xsl:variable name="common" select="//common-resources-registered"/>

  <xsl:variable name="taskId"><xsl:value-of select="//id"/></xsl:variable>

  <xsl:variable name="activeTool"><xsl:value-of select="//active-tool"/></xsl:variable>

  <!-- Set a final value for the style attribute -->
  <xsl:variable name="style">
    <xsl:choose>
      <xsl:when test="//style != ''">
        <xsl:value-of select="//style"/>
      </xsl:when>
      <xsl:when test="$customStyle != ''">
        <xsl:value-of select="$customStyle"/>
      </xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the style class attribute -->
  <xsl:variable name="styleClass">
    <xsl:choose>
      <xsl:when test="//styleClass != ''">
        <xsl:value-of select="//styleClass"/>
      </xsl:when>
      <xsl:when test="$customStyleClass != ''">
        <xsl:value-of select="$customStyleClass"/>
      </xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Define the DIV Task Id -->
  <xsl:variable name="taskCellId">EsriTaskCell_<xsl:value-of select="$taskId"/></xsl:variable>

  <!-- Window Manager Name -->
  <xsl:variable name="winMgr">taskWindowManager</xsl:variable>

  <!-- Window Manager Hidden Element Name -->
  <xsl:variable name="winMgrElementName">taskWinProp</xsl:variable>

  <xsl:variable name="peSettings">pe_Settings<xsl:value-of select="$taskId"/></xsl:variable>
  <xsl:variable name="winSettings">win_Settings<xsl:value-of select="$taskId"/></xsl:variable>
  <xsl:variable name="settingsCellId">EsriTaskCell_SettingsCell_<xsl:value-of select="$taskId"/></xsl:variable>

  <xsl:variable name="peXY">pe_XY<xsl:value-of select="$taskId"/></xsl:variable>
  <xsl:variable name="winXY">win_XY<xsl:value-of select="$taskId"/></xsl:variable>
  <xsl:variable name="xyCellId">EsriTaskCell_xyCell_<xsl:value-of select="$taskId"/></xsl:variable>

  <!-- ################# -->
  <!-- Begin HTML output -->
  <!-- ################# -->
  <xsl:template match="/">
    <xsl:comment>Task Control Renderer Start (<xsl:value-of select="$taskId"/>)</xsl:comment>
    <xsl:if test="$common = 'false'">
      <xsl:apply-imports/>
    </xsl:if>
    <xsl:if test="//first-time = 'true'">
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextPath"/>js/esri_window.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextPath"/>js/esri_window_mgr.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextPath"/>js/esri_task.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="input">
        <xsl:attribute name="id"><xsl:value-of select="$winMgrElementName"/></xsl:attribute>
        <xsl:attribute name="name"><xsl:value-of select="$winMgrElementName"/></xsl:attribute>
        <xsl:attribute name="type">HIDDEN</xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="//window-properties"/>
        </xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
          var <xsl:value-of select="$winMgr"/> = new EsriWindowManager("<xsl:value-of select="$winMgr"/>", document.getElementById("<xsl:value-of select="$winMgrElementName"/>"));
        </xsl:element>
    </xsl:if>

    <xsl:element name="script">
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="src"><xsl:value-of select="$contextPath"/>js/esri_task_editing.js</xsl:attribute>
    </xsl:element>

    <xsl:element name="script">
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="src"><xsl:value-of select="$contextPath"/>js/esri_colorchooser.js</xsl:attribute>
    </xsl:element>

    <xsl:element name="script">
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="src"><xsl:value-of select="$contextPath"/>js/esri_slider.js</xsl:attribute>
    </xsl:element>

    <xsl:element name="div">
      <xsl:attribute name="id">
        <xsl:value-of select="$taskCellId"/>
      </xsl:attribute>
      <xsl:if test="$style != '' or //task-layout/@style != ''">
        <xsl:attribute name="style">
          <xsl:if test="//task-layout/@style != ''">
            <xsl:value-of select="//task-layout/@style"/>;
          </xsl:if>
          <xsl:if test="$style != ''">
            <xsl:value-of select="$style"/>
          </xsl:if>
        </xsl:attribute>
      </xsl:if>
      <xsl:if test="$styleClass != ''">
        <xsl:attribute name="class">
          <xsl:value-of select="$styleClass"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:choose>
        <!-- TabularLayout -->
        <xsl:when test='//task-layout/@layout="tabularLayout"'>
          <xsl:apply-templates select="/" mode="tabularLayout"/>
        </xsl:when>
      </xsl:choose>
    </xsl:element>

    <!-- Settings DIV  Start -->
    <xsl:element name="div">
      <xsl:attribute name="id"><xsl:value-of select="$settingsCellId"/></xsl:attribute>
      <xsl:attribute name="style">
        position:absolute; left:100px; top:30px; width:325px;
      </xsl:attribute>
      <xsl:element name="table">
        <xsl:attribute name="style">width:100%;</xsl:attribute>
        <xsl:if test="//task-layout/components/component = 'snappingRulesLabel'">
          <xsl:for-each select="//task-layout/components">
            <xsl:variable name="settingsCNT" select="count(component[@style = 'SETTINGS'])"/>
            <xsl:if test="$settingsCNT > 0">
              <xsl:element name="tr">
                <xsl:for-each select="component[@style = 'SETTINGS']">
                  <xsl:variable name="thisType"> <xsl:value-of select="@type"/>s</xsl:variable>
                  <xsl:variable name="thisName" select="."/>
                  <xsl:variable name="thisStyle" select="@style"/>
                  <xsl:variable name="thisStyleClass" select="@styleClass"/>
                  <xsl:variable name="thisColspan" select="@colspan"/>
                  <xsl:variable name="thisRowspan" select="@rowspan"/>
                  <xsl:choose>

                    <!-- Process the Params-->
                    <xsl:when test='$thisType="task-params"'>
                      <xsl:for-each select="//task-params/task-param[@visible = 'true' and $thisName=@name]">
                        <xsl:choose>
                          <xsl:when test="read-only = 'true' or @type != 'TEXT'"> <!-- Label Parameter-->
                            <xsl:element name="td">
                              <xsl:call-template name="processParamNodeByLayout">
                                <xsl:with-param name="paramNode" select="."/>
                                <xsl:with-param name="paramStyle" select="$thisStyle"/>
                              </xsl:call-template>
                            </xsl:element>
                          </xsl:when>
                          <xsl:when test="@name='verticesColor' or @name='highlightColor' or @name = 'snapTipsColor'">
                            <xsl:variable name="settingsStyle">width:100px;</xsl:variable>
                            <xsl:element name="td">
                              <xsl:value-of select="display-name" />
                            </xsl:element>
                            <xsl:element name="td">
	                            <xsl:if test="$thisColspan != ''">
	                              <xsl:attribute name="colspan">
	                                <xsl:value-of select="$thisColspan"/>
	                              </xsl:attribute>
	                            </xsl:if>
                              <xsl:call-template name="processColorNode">
                                <xsl:with-param name="paramNode" select="."/>
                                <xsl:with-param name="paramStyle" select="$settingsStyle"/>
                              </xsl:call-template>
                            </xsl:element>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:variable name="settingsStyle">width:40px;</xsl:variable>
                            <xsl:element name="td">
                              <xsl:value-of select="display-name" />
                            </xsl:element>
                            <xsl:element name="td">
                              <xsl:call-template name="processParamNodeByLayout">
                                <xsl:with-param name="paramNode" select="."/>
                                <xsl:with-param name="paramStyle" select="$settingsStyle"/>
                              </xsl:call-template>
                            </xsl:element>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:for-each>
                    </xsl:when>

                    <!-- Process the Actions -->
                    <xsl:when test='$thisType="task-actions"'>
                      <xsl:for-each select="//task-actions/task-action[action-properties/@visible = 'true' and $thisName=@name]">
                        <xsl:element name="td">
                          <xsl:attribute name="align">center</xsl:attribute>
                          <xsl:attribute name="height">50</xsl:attribute>
                          <xsl:if test="$thisColspan != ''">
                            <xsl:attribute name="colspan">
                              <xsl:value-of select="$thisColspan"/>
                            </xsl:attribute>
                          </xsl:if>
                          <xsl:call-template name="processActionNodeByLayout">
                            <xsl:with-param name="actionNode" select="."/>
                          </xsl:call-template>
                        </xsl:element>
                      </xsl:for-each>
                    </xsl:when>

                  </xsl:choose>
                </xsl:for-each>
              </xsl:element>
            </xsl:if>
          </xsl:for-each>
        </xsl:if>
      </xsl:element>
    </xsl:element>
    <!-- Settings DIV  End -->

    <!-- enterXY DIV  Start -->
    <xsl:element name="div">
      <xsl:attribute name="id"><xsl:value-of select="$xyCellId"/></xsl:attribute>
      <xsl:attribute name="style">position:absolute; left:300px; top:30px;</xsl:attribute>
      <xsl:variable name="xyCNT" select="count(//task-layout/components/component[@style = 'XYWIN'])"/>
      <xsl:if test="$xyCNT > 0">

      <xsl:element name="table">
        <xsl:for-each select="//task-layout/components">
          <xsl:for-each select="component[@style = 'XYWIN']">
            <xsl:element name="tr">
              <xsl:variable name="thisType"> <xsl:value-of select="@type"/>s</xsl:variable>
              <xsl:variable name="thisName" select="."/>
              <xsl:variable name="thisStyle" select="@style"/>
              <xsl:variable name="thisStyleClass" select="@styleClass"/>
              <xsl:variable name="thisColspan" select="@colspan"/>
              <xsl:variable name="thisRowspan" select="@rowspan"/>
              <xsl:choose>
                <!-- Process the Params-->
                <xsl:when test='$thisType="task-params"'>
                  <xsl:for-each select="//task-params/task-param[@visible = 'true' and $thisName=@name]">
                    <xsl:variable name="settingsStyle">width:200px;</xsl:variable>
                    <xsl:element name="td">
                      <xsl:attribute name="nowrap">true</xsl:attribute>
                      <xsl:value-of select="display-name" />
                    </xsl:element>
                    <xsl:element name="td">
                      <xsl:if test="$thisColspan != ''">
                        <xsl:attribute name="colspan">
                          <xsl:value-of select="$thisColspan" />
                        </xsl:attribute>
                      </xsl:if>
                      <xsl:call-template name="processParamNodeByLayout">
                        <xsl:with-param name="paramNode" select="." />
                        <xsl:with-param name="paramStyle" select="$settingsStyle" />
                      </xsl:call-template>
                    </xsl:element>
                  </xsl:for-each>
                </xsl:when>
              </xsl:choose>
            </xsl:element>
          </xsl:for-each>
        </xsl:for-each>
      </xsl:element>
      <xsl:element name="table">
        <xsl:element name="tr">
          <xsl:for-each select="//task-layout/components">
            <xsl:for-each select="component[@style = 'XYWIN']">
              <xsl:variable name="thisType"> <xsl:value-of select="@type"/>s</xsl:variable>
              <xsl:variable name="thisName" select="."/>
              <xsl:variable name="thisStyle" select="@style"/>
              <xsl:variable name="thisStyleClass" select="@styleClass"/>
              <xsl:variable name="thisColspan" select="@colspan"/>
              <xsl:variable name="thisRowspan" select="@rowspan"/>
              <xsl:choose>
                <!-- Process the Actions -->
                <xsl:when test='$thisType="task-actions"'>
                  <xsl:for-each select="//task-actions/task-action[action-properties/@visible = 'true' and $thisName=@name]">
                    <xsl:element name="td">
                      <xsl:attribute name="align">center</xsl:attribute>
                      <xsl:if test="$thisColspan != ''">
                        <xsl:attribute name="colspan">
                          <xsl:value-of select="$thisColspan"/>
                        </xsl:attribute>
                      </xsl:if>
                      <xsl:call-template name="processActionNodeByLayout">
                        <xsl:with-param name="actionNode" select="."/>
                      </xsl:call-template>
                    </xsl:element>
                  </xsl:for-each>
                </xsl:when>
              </xsl:choose>
            </xsl:for-each>
          </xsl:for-each>
        </xsl:element>
      </xsl:element>
      </xsl:if>
    </xsl:element>
    <!-- enterXY DIV  End -->

    <xsl:if test="$activeTool != ''">
      <xsl:if test="//task-layout/components/component[@type = 'task-tool' and . = substring($activeTool, string-length($taskId)+7)]">
        <xsl:comment>Setting Active Tool <xsl:value-of select="$activeTool"/></xsl:comment>
        <xsl:element name="script">
          <xsl:attribute name="type">text/javascript</xsl:attribute>
          <xsl:attribute name="language">Javascript</xsl:attribute>
            function esriTaskInitActiveTool() {
              document.getElementById("button_<xsl:value-of select="$activeTool"/>").click();
            }
            esriInitItems.push("esriTaskInitActiveTool()");
        </xsl:element>
      </xsl:if>
    </xsl:if>

    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      function esriTaskInit<xsl:value-of select="$taskId"/>() {
        new EsriTask("<xsl:value-of select="$taskId"/>", "<xsl:value-of select="//map-id"/>");
      }
      esriInitItems.push("esriTaskInit<xsl:value-of select="$taskId"/>()");
    </xsl:element>

    <!-- If the Task will be shown in a floating window -->
    <xsl:apply-templates select="/" mode="showInWindow" />

    <xsl:comment>Task Control Renderer End (<xsl:value-of select="$taskId"/>)</xsl:comment>
  </xsl:template>

  <!-- =================================================== -->
  <!-- Tabular Layout -->
  <!-- =================================================== -->
 <xsl:template match="/" mode="tabularLayout">
    <xsl:element name="table">
      <xsl:if test="//task-layout/@style != ''">
        <xsl:attribute name="style">
          <xsl:value-of select="@style"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:element name="tbody">
        <xsl:for-each select="//task-layout/components">
          <xsl:variable name="compCnt" select="count(component[count(@style) = 0 or (@style != 'SETTINGS' and @style != 'SETTINGSLINK' and @style != 'STATUSMSG' and @style != 'XYWIN')])" />
          <xsl:variable name="isAttribute" select="contains(component, 'attr_')" />
          <xsl:if test="$compCnt > 0 and $isAttribute = false">
            <xsl:element name="tr">
              <xsl:for-each select="component[count(@style) = 0 or (@style != 'SETTINGS' and @style != 'SETTINGSLINK' and @style != 'STATUSMSG' and @style != 'XYWIN')]">
                <xsl:variable name="thisType"> <xsl:value-of select="@type"/>s</xsl:variable>
                <xsl:variable name="thisName" select="."/>
                <xsl:variable name="thisStyle" select="@style"/>
                <xsl:variable name="thisColspan" select="@colspan"/>
                <xsl:choose>
                  <!-- Process the Actions -->
                  <xsl:when test='$thisType="task-actions"'>
                    <xsl:for-each select="//task-actions/task-action[action-properties/@visible = 'true' and $thisName=@name]">
                      <xsl:element name="td">
                        <xsl:if test="$thisColspan != ''">
                          <xsl:attribute name="colspan">
                            <xsl:value-of select="$thisColspan"/>
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:call-template name="processActionNodeByLayout">
                          <xsl:with-param name="actionNode" select="."/>
                        </xsl:call-template>
                      </xsl:element>
                    </xsl:for-each>
                  </xsl:when>

                  <!-- Process the Tools -->
                  <xsl:when test='$thisType="task-tools"'>
                    <xsl:for-each select="//task-tools/task-tool[tool-properties/@visible = 'true' and $thisName=@name]">
                      <xsl:element name="td">
                        <xsl:if test="$thisColspan != ''">
                          <xsl:attribute name="colspan">
                            <xsl:value-of select="$thisColspan"/>
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:call-template name="processToolNodeByLayout">
                          <xsl:with-param name="toolNode" select="."/>
                        </xsl:call-template>
                      </xsl:element>
                    </xsl:for-each>
                  </xsl:when>

                  <!-- Process the Params-->
                  <xsl:when test='$thisType="task-params"'>
                    <xsl:for-each select="//task-params/task-param[@visible = 'true' and $thisName=@name and (read-only = 'true' or @type != 'TEXT')]"><!-- Label Parameter-->
                      <xsl:element name="td">
                        <xsl:if test="$thisColspan != ''">
                          <xsl:attribute name="colspan">
                            <xsl:value-of select="$thisColspan"/>
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="read-only = 'true'">
                          <xsl:attribute name="style">background-color:#BEBEBE;</xsl:attribute>
                        </xsl:if>
                        <xsl:call-template name="processParamNodeByLayout">
                          <xsl:with-param name="paramNode" select="."/>
                          <xsl:with-param name="paramStyle" select="$thisStyle"/>
                        </xsl:call-template>
                      </xsl:element>
                    </xsl:for-each>
                    <!-- only for currentActionID -->
                    <xsl:for-each select="//task-params/task-param[@visible = 'true' and @name= 'currentActionID']">
                      <xsl:call-template name="processParamNodeByLayout">
                        <xsl:with-param name="paramNode" select="."/>
                        <xsl:with-param name="paramStyle" select="$thisStyle"/>
                      </xsl:call-template>
                    </xsl:for-each>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:element>
          </xsl:if>
        </xsl:for-each>

        <!-- Attributes value -->
        <xsl:variable name="isAttrExist" select="//task-layout/components/component[@type = 'task-param'] = 'editAttributesTitle'" />
        <xsl:if test="$isAttrExist = 'true'">
          <xsl:element name="tr">
            <xsl:element name="td">
              <xsl:attribute name="colspan">8</xsl:attribute>
              <xsl:element name="div">
                <xsl:attribute name="style">width:100%; height:210px; overflow:auto;</xsl:attribute>
                <xsl:element name="table">
                  <xsl:attribute name="style">font-weight:bold; font-size:8pt; font-family:Verdana; color:#000;</xsl:attribute>
                  <xsl:for-each select="//task-layout/components/component[@type = 'task-param']">
                    <xsl:variable name="attrParamName" select="." />
                    <xsl:variable name="thisStyle" select="@style" />
                    <xsl:if test="contains($attrParamName,'attr_')">
                      <xsl:element name="tr">
                        <xsl:for-each select="//task-params/task-param[@visible = 'true' and $attrParamName=@name]">
                          <xsl:element name="td">
                            <xsl:value-of select="display-name" />
                          </xsl:element>
                          <xsl:element name="td">
                            <xsl:call-template name="processParamNodeByLayout">
                              <xsl:with-param name="paramNode" select="."/>
                              <xsl:with-param name="paramStyle" select="$thisStyle"/>
                            </xsl:call-template>
                          </xsl:element>
                        </xsl:for-each>
                      </xsl:element>
                    </xsl:if>
                  </xsl:for-each>
                </xsl:element>
              </xsl:element>
            </xsl:element>
          </xsl:element>
        </xsl:if>

        <!-- Settings Hyper Link -->
        <xsl:variable name="settingsCnt" select="count(//task-layout/components/component[@style = 'SETTINGS'])" />
        <xsl:if test="$settingsCnt > 0">
          <xsl:variable name="settingsName">Settings</xsl:variable>
          <xsl:element name="tr">
            <xsl:element name="td">
              <xsl:attribute name="colspan">8</xsl:attribute>
                <xsl:attribute name="align">RIGHT</xsl:attribute>
                  <xsl:if test="//show-in-window = 'true'">
                    <xsl:element name="a"><xsl:attribute name="href">javascript:void(0);</xsl:attribute><xsl:attribute name="onclick"><xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winSettings"/>'].toggleVisibility();<xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winSettings"/>'].fit();return false;</xsl:attribute><xsl:value-of select="$settingsName"/><xsl:if test="$settingsName = ''">Settings</xsl:if></xsl:element>
                  </xsl:if>
               </xsl:element>
            </xsl:element>
        </xsl:if>

        <!-- Status Message -->
        <xsl:element name="tr">
          <xsl:element name="td">
            <xsl:attribute name="colspan">8</xsl:attribute>
            <xsl:attribute name="style">background-color:#BEBEBE;</xsl:attribute>
            <xsl:attribute name="align">CENTER</xsl:attribute>
              <xsl:value-of select="//task-params/task-param[@name = 'statusMessage']/value" />
            </xsl:element>
          </xsl:element>

        <xsl:element name="tr">
          <xsl:element name="td">
            <xsl:attribute name="colspan">8</xsl:attribute>
            <xsl:attribute name="style">height:20px;</xsl:attribute>
            <xsl:attribute name="align">CENTER</xsl:attribute>
          </xsl:element>
        </xsl:element>

      </xsl:element> <!-- Tbody End -->
    </xsl:element>  <!-- Table End -->
  </xsl:template>

  <!-- ############################## -->
  <!-- Show Task in Floating Window -->
  <!-- ############################## -->
  <xsl:template match="/" mode="showInWindow">
    <xsl:if test="//show-in-window = 'true'">
      <xsl:variable name="pe">pe_<xsl:value-of select="$taskCellId"/></xsl:variable>
      <xsl:variable name="win">win_<xsl:value-of select="$taskCellId"/></xsl:variable>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        function esriTaskWindowInit<xsl:value-of select="$taskId"/>(){
          var <xsl:value-of select="$pe"/> = new EsriPageElement("<xsl:value-of select="$pe"/>");
          <xsl:value-of select="$pe"/>.divObject = document.getElementById("<xsl:value-of select="$taskCellId"/>");
          <xsl:value-of select="$pe"/>.divId = "<xsl:value-of select="$taskCellId"/>";

          <xsl:choose>
            <xsl:when test="//task/task-descriptor/@visible = 'true'">
              var <xsl:value-of select="$win" /> = new EsriWindow("<xsl:value-of select="$win"/>", "<xsl:value-of select="//task/task-descriptor/display-name"/>", <xsl:value-of select="$pe"/>);
            </xsl:when>
            <xsl:otherwise>
              var <xsl:value-of select="$win" /> = new EsriWindow("<xsl:value-of select="$win"/>", "", <xsl:value-of select="$pe"/>);
            </xsl:otherwise>
          </xsl:choose>
          <!--//set window properties
          <xsl:value-of select="$win" />.closed = false; -->
          <xsl:value-of select="$win" />.init(document.forms[EsriControls.maps["<xsl:value-of select="//map-id"/>"].formId]);
          <xsl:value-of select="$win" />.fit();
          <xsl:value-of select="$winMgr"/>.addWindow(<xsl:value-of select="$win" />, true);
        }
        esriInitItems.push("esriTaskWindowInit<xsl:value-of select="$taskId"/>()");
      </xsl:element>

      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:variable name="settingsNameString">Settings</xsl:variable>
        function esriTaskWindowInit<xsl:value-of select="$taskId"/>Settings(){
          var <xsl:value-of select="$peSettings"/> = new EsriPageElement("<xsl:value-of select="$peSettings"/>");
          <xsl:value-of select="$peSettings"/>.divObject = document.getElementById("<xsl:value-of select="$settingsCellId"/>");
          <xsl:value-of select="$peSettings"/>.divId = "<xsl:value-of select="$settingsCellId"/>";
          var <xsl:value-of select="$winSettings" /> = new EsriWindow("<xsl:value-of select="$winSettings"/>", '<xsl:value-of select="$settingsNameString"/>', <xsl:value-of select="$peSettings"/>);
          <xsl:value-of select="$winSettings" />.closed = true;
          <xsl:value-of select="$winSettings" />.init(document.forms[EsriControls.maps["<xsl:value-of select="//map-id"/>"].formId]);
          <xsl:value-of select="$winSettings" />.fit();
          <xsl:value-of select="$winMgr"/>.addWindow(<xsl:value-of select="$winSettings" />);
        }
        esriInitItems.push("esriTaskWindowInit<xsl:value-of select="$taskId"/>Settings()");

        function esriTaskWindowInit<xsl:value-of select="$taskId"/>XY(){
          var <xsl:value-of select="$peXY"/> = new EsriPageElement("<xsl:value-of select="$peXY"/>");
          <xsl:value-of select="$peXY"/>.divObject = document.getElementById("<xsl:value-of select="$xyCellId"/>");
          <xsl:value-of select="$peXY"/>.divId = "<xsl:value-of select="$xyCellId"/>";
          var <xsl:value-of select="$winXY" /> = new EsriWindow("<xsl:value-of select="$winXY"/>", '<xsl:value-of select="//task-tool[@name='enterXY']/display-name"/>', <xsl:value-of select="$peXY"/>);
          <xsl:value-of select="$winXY" />.closed = true;
          <xsl:value-of select="$winXY" />.init(document.forms[EsriControls.maps["<xsl:value-of select="//map-id"/>"].formId]);
          <xsl:value-of select="$winMgr"/>.addWindow(<xsl:value-of select="$winXY" />);
        }
        esriInitItems.push("esriTaskWindowInit<xsl:value-of select="$taskId"/>XY()");

      </xsl:element>

      <xsl:variable name="taskActionId"><xsl:value-of select="$taskId"/>_action_executeCloseEditWindows</xsl:variable>

      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        var <xsl:value-of select="$taskId"/>_WindowClosed = false;

        function <xsl:value-of select="$taskId"/>_closeEditTaskWinFunction(win) {
          var edit_save_button = document.getElementById('button_<xsl:value-of select="$taskId"/>_action_executeStopEditingSave');
          var edit_close_button = document.getElementById('button_<xsl:value-of select="$taskId"/>_action_executeCloseEditWindows');
          var edit_discard_button = document.getElementById('button_<xsl:value-of select="$taskId"/>_action_executeStopEditingDiscard');

          if (!edit_save_button){
            return;
          }
          if(edit_close_button){
            if(edit_close_button.disabled){
              if (! <xsl:value-of select="$taskId"/>_WindowClosed) {
                if (win.closed) { 
                    <xsl:value-of select="$taskId"/>_WindowClosed = true;
                    EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', 'false', <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');
                    return false;
                }
              }else {
                if (! win.closed){
                  <xsl:value-of select="$taskId"/>_WindowClosed = false;
                } 
              }
            }
          }else{
            return;
          }
          var edit_close_win_message = 'Edits will be discarded, exit editing?';
          
          if (edit_save_button.disabled){
            if (! <xsl:value-of select="$taskId"/>_WindowClosed) {
              if (win.closed) { 
                  <xsl:value-of select="$taskId"/>_WindowClosed = true;
                  EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', 'false', <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');
                  win.resize(260, 120);
                  return false;
              }
            }
            else {
              if (! win.closed){
                <xsl:value-of select="$taskId"/>_WindowClosed = false;
              } 
            }
          }
          else {
            if (! <xsl:value-of select="$taskId"/>_WindowClosed) {
              if (win.closed) {
                if(edit_discard_button)
                  if(edit_discard_button.disabled == false){
                    if (confirm(edit_close_win_message)) {
                      <xsl:value-of select="$taskId"/>_WindowClosed = true;
                      EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', 'false', <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');
                      win.resize(260, 120);
                      return false;
                    }
                    else{
                      win.show();
                    }
                  }else{
                      <xsl:value-of select="$taskId"/>_WindowClosed = true;
                      EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', 'false', <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');
                      win.resize(260, 120);
                      return false;
                  }
              }
            }
            else {
              if (! win.closed){
                <xsl:value-of select="$taskId"/>_WindowClosed = false;
              }
            }
          }
        }

        function <xsl:value-of select="$taskId"/>CloseWinFunction() {
          var myEditWin = taskWindowManager.windows['<xsl:value-of select="$win"/>'];
          <xsl:value-of select="$taskId"/>_WindowClosed = myEditWin.closed;
          myEditWin.addUpdateListener("myEditWinListener", <xsl:value-of select="$taskId"/>_closeEditTaskWinFunction);
        }
        esriInitItems.push("<xsl:value-of select="$taskId"/>CloseWinFunction()");
      </xsl:element>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
