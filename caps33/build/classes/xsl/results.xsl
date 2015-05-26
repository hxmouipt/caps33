<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Copyright (c) 2000-2003, Environmental Systems Research Institute, Inc. All rights reserved. -->
  <!-- XSL file for TOC control -->
  <xsl:import href="core.xsl"/>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <!--
    To customize the appearance of the TOC, enter values for each attribute you wish to customize in their
    respective opening and closing <xsl:variable> tags below.  You can customize as many or as few attributes
    as you wish.

    Any attributes defined in the web control's JSP tag will take precedence over custom values defined below.

    Both class and style attributes are permitted in a single tag.  Properties defined below or in the web control's JSP tag attributes
    will override class properties.  However, if a property that is defined in the class is not defined below or in the JSP tag attributes
    then the class definition will handle that property.

    Note:  All these variables have to be global, since different templates use them.
  -->
  <xsl:variable name="customStyle"></xsl:variable>
  <xsl:variable name="customStyleClass"></xsl:variable>
  <!-- Make sure to include the directory -->
  <xsl:variable name="customExpandedImage"></xsl:variable>
  <!-- Make sure to include the directory -->
  <xsl:variable name="customCollapsedImage"></xsl:variable>
  <!-- End of variable customization -->

  <!-- Context path variable -->
  <xsl:variable name="contextpath"><xsl:value-of select="//context-path" />/</xsl:variable>
  <!-- Determine if to import the core.xsl file -->
  <xsl:variable name="common" select="//common-resources-registered"/>
  <!-- Read in the value for first occurrence (of toc control on page) from the input XML file -->
  <xsl:variable name="first" select="//first-time"/>
  <xsl:variable name="tocId" select="//id" />

  <!-- Set a final value for the style attribute -->
  <xsl:variable name="style">
    <xsl:choose>
      <xsl:when test="/toc/style != ''"><xsl:value-of select="/toc/style"/></xsl:when>
      <xsl:when test="$customStyle != ''"><xsl:value-of select="$customStyle"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the styleClass attribute -->
  <xsl:variable name="styleClass">
    <xsl:choose>
      <xsl:when test="/toc/styleClass != ''"><xsl:value-of select="/toc/styleClass"/></xsl:when>
      <xsl:when test="$customStyleClass != ''"><xsl:value-of select="$customStyleClass"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the expanded image attribute. Set a default plus image so that something shows up. -->
  <xsl:variable name="expandedImage">
    <xsl:choose>
      <xsl:when test="/toc/expanded-image != ''"><xsl:value-of select="$contextpath" /><xsl:value-of select="/toc/expanded-image"/></xsl:when>
      <xsl:when test="$customExpandedImage != ''"><xsl:value-of select="$contextpath" /><xsl:value-of select="$customExpandedImage"/></xsl:when>
      <xsl:otherwise><xsl:value-of select="$contextpath" />images/minus.gif</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the collapsed image attribute.  Set a default minus image so that something shows up. -->
  <xsl:variable name="collapsedImage">
    <xsl:choose>
      <xsl:when test="/toc/collapsed-image != ''"><xsl:value-of select="$contextpath" /><xsl:value-of select="/toc/collapsed-image"/></xsl:when>
      <xsl:when test="$customCollapsedImage != ''"><xsl:value-of select="$contextpath" /><xsl:value-of select="$customCollapsedImage"/></xsl:when>
      <xsl:otherwise><xsl:value-of select="$contextpath" />images/plus.gif</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <!-- Begin html output -->
  <xsl:template match="/">
    <xsl:comment>TOC Control Renderer Start (<xsl:value-of select="$tocId"/>)</xsl:comment>
    <xsl:if test="$common = 'false'">
      <xsl:apply-imports/>
    </xsl:if>

    <!--
    If this is the first occurrence of the toc control on the page, bring in the display_toc.js
    file and create hidden form fields. Otherwise, these things have already been included.
    -->
    <xsl:if test="$first = 'true'">
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_toc.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_slider.js</xsl:attribute>
      </xsl:element>
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_task_gp.js</xsl:attribute>
      </xsl:element>
    </xsl:if>

    <xsl:variable name="nodeCnt" select="count(/toc/node)"/>
      <xsl:variable name="tocCellId">EsriTOCCell_<xsl:value-of select="$tocId"/></xsl:variable>

      <xsl:choose>
        <xsl:when test="/toc/show-open-result-link = 'true'">
          <xsl:variable name="openLabel">Open Result</xsl:variable>
          <xsl:element name="table">
            <xsl:if test="$style != ''">
              <xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
            </xsl:if>
            <xsl:if test="$styleClass != ''">
              <xsl:attribute name="class"><xsl:value-of select="$styleClass"/></xsl:attribute>
            </xsl:if>
            <xsl:element name="tbody">
              <xsl:element name="tr">
                <xsl:element name="td">
                  <xsl:attribute name="style">height:100%;</xsl:attribute>
                  <xsl:element name="div">
                    <xsl:attribute name="id"><xsl:value-of select="$tocCellId"/></xsl:attribute>
                    <xsl:attribute name="style">height:100%;</xsl:attribute>
                  </xsl:element>
                </xsl:element>
              </xsl:element>
              <xsl:element name="tr">
                <xsl:element name="td">
                  <xsl:element name="script">
                    <xsl:attribute name="language">Javascript</xsl:attribute>
                    <xsl:attribute name="type">text/javascript</xsl:attribute>
                    function esriOpenResultHandler<xsl:value-of select="$tocId" />(filename, id) {
                      if (! filename || ! id)
                        alert("File upload failed");
                      else {
                        var map = EsriControls.maps["<xsl:value-of select="//map-id" />"];
                        var url = EsriUtils.getServerUrl(map.formId);
                        var params = "__ADFPostBack__=true&amp;gpAsyncTaskResults=gpAsyncTaskResults&amp;formId=" + map.formId + "&amp;tocId=<xsl:value-of select="$tocId" />&amp;getResult=getResult&amp;id=" + id;
                        var xmlHttp = EsriUtils.sendAjaxRequest(url, params, true, function() { EsriControls.processPostBack(xmlHttp); });
                      }
                    }
                  </xsl:element>
                  <xsl:element name="a">
                    <xsl:attribute name="href">javascript:void(0);</xsl:attribute>
                    <xsl:attribute name="onclick">EsriUploadUtil.showUploadWindow('<xsl:value-of select="$openLabel" />', esriOpenResultHandler<xsl:value-of select="$tocId" />);</xsl:attribute>
                      <xsl:value-of select="$openLabel" />
                  </xsl:element>
                </xsl:element>
              </xsl:element>
            </xsl:element>
          </xsl:element>
        </xsl:when>
        <xsl:otherwise>
          <xsl:element name="div">
            <xsl:attribute name="id"><xsl:value-of select="$tocCellId"/></xsl:attribute>
            <xsl:if test="$style != ''">
              <xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
            </xsl:if>
            <xsl:if test="$styleClass != ''">
              <xsl:attribute name="class"><xsl:value-of select="$styleClass"/></xsl:attribute>
            </xsl:if>
          </xsl:element>
        </xsl:otherwise>
      </xsl:choose>

      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="type">text/javascript</xsl:attribute>
        function esriTocInit<xsl:value-of select="$tocId"/>() {
          var <xsl:value-of select="$tocId"/> = new EsriToc("<xsl:value-of select="$tocId"/>", document.getElementById("<xsl:value-of select="$tocCellId"/>"), "<xsl:value-of select="//map-id" />", new EsriWebMapResultsTocRenderer());
          <xsl:if test="$expandedImage != ''">
            <xsl:value-of select="$tocId"/>.renderer.expandedImage = "<xsl:value-of select="$expandedImage"/>";
          </xsl:if>
          <xsl:if test="$collapsedImage != ''">
            <xsl:value-of select="$tocId"/>.renderer.collapsedImage = "<xsl:value-of select="$collapsedImage"/>";
          </xsl:if>
          <xsl:if test="/toc/indent-width != ''">
            <xsl:value-of select="$tocId"/>.renderer.indentWidth = <xsl:value-of select="/toc/indent-width"/>;
          </xsl:if>
          <xsl:value-of select="$tocId"/>.clientPostBack = <xsl:value-of select="/toc/client-post-back" />;
          <xsl:value-of select="$tocId"/>.autoPostBack = <xsl:value-of select="/toc/auto-post-back" />;
          <xsl:variable name="showExpanded" select="/toc/show-expanded" />
          <xsl:value-of select="$tocId"/>.renderer.startRendering();
          <xsl:for-each select="toc/node">
            <!-- Adding Context Menu -->
            <xsl:variable name="vkey" select="key"/>
            <xsl:variable name="contextItemCount" select="count(content/context-menu/context-item)" />
            <xsl:if test="$contextItemCount > 0" >
              var contextMenuItems<xsl:value-of select="$tocId" />_<xsl:value-of select="$vkey" /> = new Array();
              <xsl:for-each select="content/context-menu/context-item">
                contextMenuItems<xsl:value-of select="$tocId" />_<xsl:value-of select="$vkey" />.push(new EsriContextMenuItem('<xsl:value-of select="@label"/>','<xsl:value-of select="@value"/>','<xsl:value-of select="@description"/>'));
              </xsl:for-each>
            </xsl:if>
            <xsl:value-of select="$tocId"/>.addTocNode("<xsl:value-of select="$vkey"/>", <!-- key -->
            "<xsl:value-of select="content/text"/>", <!-- label -->
            <xsl:value-of select="level"/>, <!-- level -->
            <xsl:choose> <!-- showExpanded -->
              <xsl:when test="$showExpanded = 'true'">
                <xsl:choose>
                  <xsl:when test="expanded != ''">true,</xsl:when>
                  <xsl:otherwise>false,</xsl:otherwise>
                </xsl:choose>
              </xsl:when>
              <xsl:otherwise>false,</xsl:otherwise>
            </xsl:choose>
            <xsl:choose> <!-- isExpanded -->
              <xsl:when test="expanded != ''"><xsl:value-of select="expanded"/>,</xsl:when>
              <xsl:otherwise>false,</xsl:otherwise>
            </xsl:choose>
            <xsl:choose> <!-- showChecked -->
              <xsl:when test="content/@checked != ''">true,</xsl:when>
              <xsl:otherwise>false,</xsl:otherwise>
            </xsl:choose>
            <xsl:choose> <!-- isChecked -->
              <xsl:when test="content/@checked != ''"><xsl:value-of select="content/@checked"/>,</xsl:when>
              <xsl:otherwise>false,</xsl:otherwise>
            </xsl:choose>
            <xsl:choose> <!-- isUrl -->
              <xsl:when test="content/@isurl = 'true'">true,</xsl:when>
              <xsl:otherwise>false,</xsl:otherwise>
            </xsl:choose>
            "<xsl:value-of select="content/image-url"/>", <!-- imageUrl -->
            <xsl:value-of select="content/@disabled"/>, <!-- isDisabled -->
            <xsl:value-of select="content/@selected"/>, <!-- isSelected -->
            <xsl:choose> <!-- contextMenuItems -->
              <xsl:when test="$contextItemCount > 0">contextMenuItems<xsl:value-of select="$tocId" />_<xsl:value-of select="$vkey" /></xsl:when>
              <xsl:otherwise>null</xsl:otherwise>
            </xsl:choose>);
          </xsl:for-each>
          <xsl:value-of select="$tocId"/>.renderer.endRendering();
        }
        esriInitItems.push("esriTocInit<xsl:value-of select="$tocId"/>()");
        <xsl:if test="/toc/toc-model-type = 'MapViewerResults'">
          function esriWebResultsAsyncTimer<xsl:value-of select="$tocId"/>() {
            new EsriTask_GPAsyncTaskResultsTimer("EsriWebResults_<xsl:value-of select="$tocId"/>_Timer", "<xsl:value-of select="$tocId"/>", 5);
          }
          esriInitItems.push("esriWebResultsAsyncTimer<xsl:value-of select="$tocId"/>()");
        </xsl:if>
      </xsl:element>
    <xsl:comment>TOC Control Renderer End (<xsl:value-of select="$tocId"/>)</xsl:comment>
  </xsl:template>
</xsl:stylesheet>