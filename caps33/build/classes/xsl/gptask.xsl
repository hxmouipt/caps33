<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Copyright (c) 2000-2003, Environmental Systems Research Institute, Inc. All rights reserved. -->
  <!-- XSL file for Task control -->
  <xsl:import href="core.xsl"/>
  <xsl:import href="gptask-layout-nodes.xsl"/>
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

  <xsl:variable name="cellFeaturesIdPrefix">EsriTaskCell_Features_<xsl:value-of select="$taskId"/></xsl:variable>
  <xsl:variable name="winFeaturesIdPrefix">win_Features_<xsl:value-of select="$taskId"/></xsl:variable>

  <!-- Window Manager Name -->
  <xsl:variable name="winMgr">taskWindowManager</xsl:variable>

  <!-- Window Manager Hidden Element Name -->
  <xsl:variable name="winMgrElementName">taskWinProp</xsl:variable>

  <!-- Layout Name -->
  <xsl:variable name="layout" select="task/task-layout/@name"/>

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
        <xsl:attribute name="src">
          <xsl:value-of select="$contextPath"/>js/esri_window.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src">
          <xsl:value-of select="$contextPath"/>js/esri_window_mgr.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src">
          <xsl:value-of select="$contextPath"/>js/esri_task.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="input">
        <xsl:attribute name="id"><xsl:value-of select="$winMgrElementName"/></xsl:attribute>
        <xsl:attribute name="name"><xsl:value-of select="$winMgrElementName"/></xsl:attribute>
        <xsl:attribute name="type">HIDDEN</xsl:attribute>
        <xsl:attribute name="value"><xsl:value-of select="//window-properties"/></xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
          var <xsl:value-of select="$winMgr"/> = new EsriWindowManager("<xsl:value-of select="$winMgr"/>", document.getElementById("<xsl:value-of select="$winMgrElementName"/>"));
        </xsl:element>
    </xsl:if>

    <xsl:element name="div">
      <xsl:attribute name="id">
        <xsl:value-of select="$taskCellId"/>
      </xsl:attribute>
      <xsl:if test="$style != '' or //task-layout/properties/@style != ''">
        <xsl:attribute name="style">
          <xsl:if test="//task-layout/properties/@style != ''">
            <xsl:value-of select="//task-layout/properties/@style"/>;
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
      <xsl:apply-templates select="/" mode="defaultLayout"/>
    </xsl:element>

    <xsl:if test="//show-in-window = 'true'">
      <xsl:for-each select="/task/task-params/task-param[@type = 'GPRecordSet']">
        <xsl:element name="div">
          <xsl:attribute name="id">
            <xsl:value-of select="$cellFeaturesIdPrefix"/>_<xsl:value-of select="@name" />
          </xsl:attribute>
          <xsl:if test="count(attributes/attribute) > 0">
            <xsl:call-template name="processGPRecordSetAttribute" />
          </xsl:if>
        </xsl:element>
      </xsl:for-each>
    </xsl:if>

    <xsl:if test="$activeTool != ''">
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
  <!-- Default Layout -->
  <!-- =================================================== -->
  <xsl:template match="/" mode="defaultLayout">
    <xsl:variable name="toolCnt" select="count(//task/task-tools/task-tool)"/>
    <xsl:variable name="actionCnt" select="count(/task/task-actions/task-action)"/>

    <xsl:element name="table">
      <xsl:element name="tbody">
        <xsl:if test="//show-in-window = 'false' and /task/task-descriptor/@visible = 'true'">
          <xsl:element name="tr">
            <xsl:element name="th">
              <xsl:value-of select="/task/task-descriptor/display-name"/>
            </xsl:element>
          </xsl:element>
        </xsl:if>

        <xsl:if test="count(/task/task-descriptor/help-url) > 0">
          <xsl:element name="tr">
            <xsl:element name="td">
              <xsl:attribute name="valign">TOP</xsl:attribute>
              <xsl:attribute name="align">RIGHT</xsl:attribute>
              <xsl:element name="a">
                <xsl:attribute name="target">_blank</xsl:attribute>
                <xsl:attribute name="href"><xsl:value-of select="/task/task-descriptor/help-url" /></xsl:attribute>
                  Help
              </xsl:element>
            </xsl:element>
          </xsl:element>
        </xsl:if>

          <!-- Param Descriptions-->
        <xsl:for-each select="/task/task-params/task-param[@visible = 'true']">
          <xsl:element name="tr">
            <xsl:element name="td">
              <xsl:value-of select="display-name"/>
            </xsl:element>
          </xsl:element>
          <xsl:element name="tr">
            <xsl:element name="td">
              <xsl:attribute name="valign">TOP</xsl:attribute>
              <xsl:call-template name="processParamNodeByLayout">
                <xsl:with-param name="paramNode" select="."/>
              </xsl:call-template>
            </xsl:element>
          </xsl:element>
        </xsl:for-each>

          <!-- Tool Descriptions & Action Descriptions -->
        <xsl:if test="$toolCnt > 0 or $actionCnt > 0">
          <xsl:element name="tr">
            <xsl:element name="td">
              <xsl:attribute name="align">RIGHT</xsl:attribute>
              <xsl:element name="table">
                <xsl:element name="tbody">
                  <xsl:element name="tr">
                    <!-- Process Tool Node -->
                    <xsl:for-each select="/task/task-tools/task-tool[tool-properties/@visible = 'true']">
                      <xsl:element name="td">
                        <xsl:call-template name="processToolNodeByLayout">
                          <xsl:with-param name="toolNode" select="."/>
                        </xsl:call-template>
                      </xsl:element>
                    </xsl:for-each>

                    <!-- Process Action Node -->
                    <xsl:for-each select="/task/task-actions/task-action[action-properties/@visible = 'true']">
                      <xsl:element name="td">
                        <xsl:call-template name="processActionNodeByLayout">
                          <xsl:with-param name="actionNode" select="."/>
                        </xsl:call-template>
                      </xsl:element>
                    </xsl:for-each>
                  </xsl:element>
                </xsl:element>
              </xsl:element>

            </xsl:element><!-- td end -->
          </xsl:element> <!-- tr end -->
          <xsl:element name="tr">
            <xsl:element name="td">
              <xsl:attribute name="style">height:5px;</xsl:attribute>
            </xsl:element>
          </xsl:element>
        </xsl:if>

      </xsl:element>
    </xsl:element> <!-- table end -->
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
          <xsl:value-of select="$win" />.init(document.forms[EsriControls.maps["<xsl:value-of select="//map-id"/>"].formId]);
          <xsl:value-of select="$win" />.fittable = <xsl:value-of select="$layout != 'absoluteLayout'" />;
          <xsl:value-of select="$win" />.fit();
          <xsl:value-of select="$winMgr"/>.addWindow(<xsl:value-of select="$win" />, true);
        }
        esriInitItems.push("esriTaskWindowInit<xsl:value-of select="$taskId"/>()");
      </xsl:element>

      <xsl:for-each select="/task/task-params/task-param[@type = 'GPRecordSet']">
        <xsl:variable name="cellFeatures"><xsl:value-of select="$cellFeaturesIdPrefix"/>_<xsl:value-of select="@name" /></xsl:variable>
        <xsl:variable name="peFeatures">pe_Features<xsl:value-of select="$taskId"/>_<xsl:value-of select="@name" /></xsl:variable>
        <xsl:variable name="winFeatures"><xsl:value-of select="$winFeaturesIdPrefix"/>_<xsl:value-of select="@name" /></xsl:variable>
        <xsl:element name="script">
          <xsl:attribute name="language">Javascript</xsl:attribute>
          function esriTaskWindowInit<xsl:value-of select="$taskId"/>Features<xsl:value-of select="@name" />(){
            var <xsl:value-of select="$peFeatures"/> = new EsriPageElement("<xsl:value-of select="$peFeatures"/>");
            <xsl:value-of select="$peFeatures"/>.divObject = document.getElementById("<xsl:value-of select="$cellFeatures"/>");
            <xsl:value-of select="$peFeatures"/>.divId = "<xsl:value-of select="$cellFeatures"/>";
            var <xsl:value-of select="$winFeatures" /> = new EsriWindow("<xsl:value-of select="$winFeatures"/>", "Features", <xsl:value-of select="$peFeatures"/>);
            <xsl:value-of select="$winFeatures" />.init(document.forms[EsriControls.maps["<xsl:value-of select="//map-id"/>"].formId]);
            <xsl:value-of select="$winFeatures" />.fit();
            <xsl:value-of select="$winMgr"/>.addWindow(<xsl:value-of select="$winFeatures" />);
          }
          esriInitItems.push("esriTaskWindowInit<xsl:value-of select="$taskId"/>Features<xsl:value-of select="@name" />()");
        </xsl:element>
      </xsl:for-each>

    </xsl:if>
  </xsl:template>
</xsl:stylesheet>