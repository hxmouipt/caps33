<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Copyright (c) 2000-2003, Environmental Systems Research Institute, Inc. All rights reserved. -->
  <!-- XSL file for Overview Map control -->
  <xsl:import href="core.xsl"/>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <!--
    To customize the appearance of the Overview Map, enter values for each attribute you wish to customize in their
    respective opening and closing <xsl:variable> tags below.  You can customize as many or as few attributes
    as you wish.

    Any attributes defined in the web control's JSP tag will take precedence over custom values defined below.

    Both class and style attributes are permitted in a single tag.  Properties defined below or in the web control's JSP tag attributes
    will override class properties.  However, if a property that is defined in the class is not defined below or in the JSP tag attributes
    then the class definition will handle that property.
  -->
  <xsl:variable name="customStyle"></xsl:variable>
  <xsl:variable name="customStyleClass"></xsl:variable>
  <xsl:variable name="customLineColor"></xsl:variable>
  <xsl:variable name="customLineWidth"></xsl:variable>
  <!-- End of variable customization -->

  <!-- Context path variable -->
  <xsl:variable name="contextpath"><xsl:value-of select="//context-path" />/</xsl:variable>

  <!-- Determine if to import the core.xsl file -->
  <xsl:variable name="common" select="//common-resources-registered" />

  <!-- Read in the value for first occurrence (of map control on page) from the input XML file -->
  <xsl:variable name="first" select="//first-time" />
  <xsl:variable name="overviewId" select="/overview/id" />

  <!-- Set a final value for the style attribute -->
  <xsl:variable name="style">
    <xsl:choose>
      <xsl:when test="/overview/style != ''"><xsl:value-of select="/overview/style"/></xsl:when>
      <xsl:when test="$customStyle != ''"><xsl:value-of select="$customStyle"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the style class attribute -->
  <xsl:variable name="styleClass">
    <xsl:choose>
      <xsl:when test="/overview/css-class != ''"><xsl:value-of select="/overview/css-class" /></xsl:when>
      <xsl:when test="/overview/styleClass != ''"><xsl:value-of select="/overview/styleClass"/></xsl:when>
      <xsl:when test="$customStyleClass != ''"><xsl:value-of select="$customStyleClass"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the drag box color attribute -->
  <xsl:variable name="lineColor">
    <xsl:choose>
      <xsl:when test="/overview/line-color != ''"><xsl:value-of select="/overview/line-color"/></xsl:when>
      <xsl:when test="$customLineColor != ''"><xsl:value-of select="$customLineColor"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the drag line width attribute -->
  <xsl:variable name="lineWidth">
    <xsl:choose>
      <xsl:when test="/overview/line-width != ''"><xsl:value-of select="/overview/line-width"/></xsl:when>
      <xsl:when test="$customLineWidth != ''"><xsl:value-of select="$customLineWidth"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Build the div style string including only those attributes that have been defined. -->
  <xsl:variable name="styleString">
    <xsl:value-of select="$style"/>;
    width:<xsl:value-of select="//width"/>px;
    height:<xsl:value-of select="//height"/>px;
  </xsl:variable>

  <!-- Remove unnecessary whitespace from the div style string -->
  <xsl:variable name="normalizedStyleString">
    <xsl:value-of select="normalize-space($styleString)"/>
  </xsl:variable>

  <!-- Begin HTML output -->
  <xsl:template match="/">
    <xsl:comment>Overview Control Renderer Start (<xsl:value-of select="$overviewId"/>)</xsl:comment>
    <xsl:if test="$common = 'false'">
      <xsl:apply-imports/>
    </xsl:if>

    <!--
    If this is the first occurrence of the overview control on the page, bring in the esri_overview.js file.
    Otherwise, all this has already been included.
    -->
    <xsl:if test="$first = 'true'">
      <xsl:element name="script">
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_overview.js</xsl:attribute>
      </xsl:element>
    </xsl:if>


    <!-- Write out the table element, checking if to include the class attribute.  -->
    <xsl:variable name="overviewCellId">EsriOverviewCell_<xsl:value-of select="$overviewId" /></xsl:variable>
    <xsl:element name="div">
      <xsl:attribute name="id"><xsl:value-of select="$overviewCellId"/></xsl:attribute>
      <xsl:attribute name="style"><xsl:value-of select="$normalizedStyleString"/></xsl:attribute>
      <xsl:if test="//style-class != ''">
        <xsl:attribute name="class"><xsl:value-of select="//style-class"/></xsl:attribute>
      </xsl:if>
    </xsl:element>
    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      function esriOverviewInit<xsl:value-of select="$overviewId"/>() {
        var <xsl:value-of select="$overviewId" /> = new EsriOverview("<xsl:value-of select="$overviewId" />", null, "<xsl:value-of select="//map-id" />", <xsl:value-of select="//width" />, <xsl:value-of select="//height" />);
        <xsl:variable name="imageUrl" select="count(/overview/image-url)" />
        <xsl:choose>
          <xsl:when test="$imageUrl = 0">
            <xsl:value-of select="$overviewId" />.showNoData = true;
            <xsl:value-of select="$overviewId" />.init(document.getElementById("<xsl:value-of select="$overviewCellId" />"));
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$overviewId" />.clientPostBack = <xsl:value-of select="/overview/client-post-back" />;
            <xsl:if test="$lineColor != ''">
              <xsl:value-of select="$overviewId" />.boxLineColor = "<xsl:value-of select="$lineColor" />";
            </xsl:if>
            <xsl:if test="$lineWidth != ''">
              <xsl:value-of select="$overviewId" />.boxLineWidth = <xsl:value-of select="$lineWidth" />;
            </xsl:if>
            <xsl:value-of select="$overviewId" />.boxFillOpacity = 0.15;
            <xsl:value-of select="$overviewId" />.init(document.getElementById("<xsl:value-of select="$overviewCellId" />"));
            <xsl:value-of select="$overviewId" />.setOverviewImage("<xsl:value-of select="/overview/image-url" />");
            <xsl:value-of select="$overviewId" />.update(<xsl:value-of select="overview/extent-rectangle/left"/>,<xsl:value-of select="overview/extent-rectangle/top"/>,<xsl:value-of select="overview/extent-rectangle/width"/>,<xsl:value-of select="overview/extent-rectangle/height"/>);
          </xsl:otherwise>
        </xsl:choose>
      }
      esriInitItems.push("esriOverviewInit<xsl:value-of select="$overviewId"/>()");
    </xsl:element>
    <xsl:comment>Overview Control Renderer End (<xsl:value-of select="$overviewId"/>)</xsl:comment>    
  </xsl:template>
</xsl:stylesheet>

