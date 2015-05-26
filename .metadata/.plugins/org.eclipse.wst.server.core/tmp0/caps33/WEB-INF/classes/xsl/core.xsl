<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Copyright (c) 2000-2002, Environmental Systems Research Institute, Inc. All rights reserved. -->
  <!-- XSL file defining elements that all other XSL files have common.  -->
  <xsl:variable name="contextpath"><xsl:value-of select="//context-path" />/</xsl:variable>
  <xsl:variable name="userAgent"><xsl:value-of select="//user-agent" /></xsl:variable>

  <xsl:template match="/">
    <!-- Include JavaScript file -->
    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_core.js</xsl:attribute>
    </xsl:element>

    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_callout.js</xsl:attribute>
    </xsl:element>

    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_maptip.js</xsl:attribute>
    </xsl:element>

    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_upload.js</xsl:attribute>
    </xsl:element>

    <!-- Include CSS file -->
    <xsl:element name="link">
      <xsl:attribute name="type">text/css</xsl:attribute>
      <xsl:attribute name="rel">stylesheet</xsl:attribute>
      <xsl:attribute name="href"><xsl:value-of select="$contextpath" />css/esri_styles.css</xsl:attribute>
    </xsl:element>

    <xsl:element name="input">
      <xsl:attribute name="type">hidden</xsl:attribute>
      <xsl:attribute name="name">__ADFPostBack__</xsl:attribute>
      <xsl:attribute name="value">true</xsl:attribute>
    </xsl:element>

    <!-- Need if condition to determine browser type and use appropriate graphics implementation -->
    <xsl:choose>
      <xsl:when test="contains($userAgent, 'MSIE')">
        <xsl:element name="script">
          <xsl:attribute name="type">text/javascript</xsl:attribute>
          <xsl:attribute name="language">Javascript</xsl:attribute>
          <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_graphics_vml.js</xsl:attribute>
        </xsl:element>
      </xsl:when>
      <xsl:otherwise>
        <xsl:element name="script">
          <xsl:attribute name="type">text/javascript</xsl:attribute>
          <xsl:attribute name="language">Javascript</xsl:attribute>
          <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_graphics_svg.js</xsl:attribute>
        </xsl:element>
      </xsl:otherwise>
    </xsl:choose>

    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
        var esriInitItems = new Array();
        var userOnload = window.onload;
        window.onload = esriInitApp;
        EsriControls.contextPath = "<xsl:value-of select="$contextpath" />";

        function esriInitApp(e) {
          var mapInitializers = new Array();
          for (var i=0;i&lt;esriInitItems.length;i++) {
            if (esriInitItems[i].toString().indexOf("esriMapInit") == 0) {
              eval(esriInitItems[i]);
              mapInitializers.push(i);
            }
          }

          for (var i=0;i&lt;esriInitItems.length;i++) {
            if (mapInitializers.indexOf(i) == -1) {
              eval(esriInitItems[i]);
            }
          }

          if (userOnload)
            userOnload(e);
        }
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>
