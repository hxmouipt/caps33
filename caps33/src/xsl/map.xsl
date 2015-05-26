<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Copyright (c) 2000-2003, Environmental Systems Research Institute, Inc. All rights reserved. -->
  <!-- XSL file for Map control -->
  <xsl:import href="core.xsl"/>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:variable name="contextpath"><xsl:value-of select="//context-path" />/</xsl:variable>

  <xsl:variable name="common" select="//common-resources-registered" />

  <!-- Read in the value for first occurrence of map control from the input XML file -->
  <xsl:variable name="first" select="//first-time" />

  <xsl:variable name="mapId"><xsl:value-of select="//id"/></xsl:variable>
  <xsl:variable name="isTiled"><xsl:value-of select="//tile" /></xsl:variable>
  <xsl:variable name="scaleBar"><xsl:value-of select="//scale-bar" /></xsl:variable>

  <!-- Build the div style string including only those attributes that have been defined. -->
  <xsl:variable name="styleString">
    <xsl:value-of select="//style"/>;
    width:<xsl:value-of select="//width"/>px;
    height:<xsl:value-of select="//height"/>px;
  </xsl:variable>

  <!-- Remove unnecessary whitespace from the div style string -->
  <xsl:variable name="normalizedStyleString">
    <xsl:value-of select="normalize-space($styleString)"/>
  </xsl:variable>

  <!-- Begin HTML output -->
  <xsl:template match="/">
    <xsl:comment>Map Control Renderer Start (<xsl:value-of select="$mapId"/>)</xsl:comment>
     <xsl:if test="$common = 'false'">
      <xsl:apply-imports/>
    </xsl:if>

    <!--
    If this is the first occurrence of the map control on the page, bring in the esri_map.js file.
    Otherwise, the file has already been included.
    -->
    <xsl:if test="$first = 'true'">
      <xsl:element name="script">
        <xsl:attribute name="type">text/javascript</xsl:attribute>
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_map.js</xsl:attribute>
      </xsl:element>
    </xsl:if>

    <xsl:if test="$scaleBar != ''">
      <xsl:element name="script">
        <xsl:attribute name="type">text/javascript</xsl:attribute>
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_scalebar.js</xsl:attribute>
      </xsl:element>
    </xsl:if>

    <xsl:variable name="mapcellid">EsriMapCell_<xsl:value-of select="$mapId"/></xsl:variable>
    <xsl:element name="div">
      <xsl:attribute name="id"><xsl:value-of select="$mapcellid"/></xsl:attribute>
      <xsl:attribute name="style"><xsl:value-of select="$normalizedStyleString"/></xsl:attribute>
      <xsl:if test="//style-class != ''">
        <xsl:attribute name="class"><xsl:value-of select="//style-class"/></xsl:attribute>
      </xsl:if>
    </xsl:element>

    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      function esriMapInit<xsl:value-of select="$mapId"/>() {
        var map = new EsriMap("<xsl:value-of select="$mapId"/>", null, "<xsl:value-of select="/map/form-id" />", <xsl:value-of select="/map/width" />, <xsl:value-of select="/map/height" />);
        map.isFuseGraphics = <xsl:value-of select="/map/control-fuse-graphics"/>;
        map.enableMapTips = <xsl:value-of select="/map/enable-info-window"/>;

        <xsl:if test="count(/map/tile-levels-count) = 1">
          map.numLevels = <xsl:value-of select="/map/tile-levels-count" />;
          map.level = <xsl:value-of select="/map/tile-level" />;
        </xsl:if>

        var ms = new Array();
        var msNames = new Array();
        var msImages = new Array();
        <xsl:for-each select="/map/data-sources/data-source">
          <xsl:variable name="ds">mapSource<xsl:value-of select="position()" /></xsl:variable>

          <xsl:variable name="tile" select="count(tile)"/>
          <xsl:variable name="dynamic" select="count(dynamic)"/>

          <xsl:choose>
            <xsl:when test="$tile = 1">
              <xsl:value-of select="$ds" /> = new EsriMapSourceTile("<xsl:value-of select="tile/base-url" />", <xsl:value-of select="tile/tile-width" />, <xsl:value-of select="tile/tile-height" />, <xsl:value-of select="tile/levels-count" />, <xsl:value-of select="tile/tile-level" />, <xsl:value-of select="tile/start-tile-column" />, <xsl:value-of select="tile/end-tile-column" />, <xsl:value-of select="tile/tile-column" />, <xsl:value-of select="tile/start-tile-row" />, <xsl:value-of select="tile/end-tile-row" />, <xsl:value-of select="tile/tile-row" />, <xsl:value-of select="tile/offset-x" />, <xsl:value-of select="tile/offset-y" />);
              <xsl:value-of select="$ds" />.filesys = <xsl:value-of select="tile/virtual-cache-directory-access" />;
              <xsl:value-of select="$ds" />.showNoData = false;
              <xsl:if test="tile/tile-image-format != ''"><xsl:value-of select="$ds" />.fileFormat = "<xsl:value-of select="tile/tile-image-format" />";</xsl:if>
              <xsl:if test="count(@transparency) = 1"><xsl:value-of select="$ds" />.imageOpacity = <xsl:value-of select="@transparency" />;</xsl:if>
              msImages.push("");
            </xsl:when>
            <xsl:when test="$dynamic = 1">
              <xsl:value-of select="$ds" /> = new EsriMapSourceDynamic(<xsl:value-of select="/map/width" />, <xsl:value-of select="/map/height" />);
              <xsl:if test="count(@transparency) = 1"><xsl:value-of select="$ds" />.imageOpacity = <xsl:value-of select="@transparency" />;</xsl:if>
              msImages.push("<xsl:value-of select="dynamic/image-url"/>");
            </xsl:when>
          </xsl:choose>

          msNames.push("<xsl:value-of select="$ds" />");
          ms.push(<xsl:value-of select="$ds" />);
        </xsl:for-each>

        for (var i=(msNames.length-1);i>=0;i--) {
          ms[i] = map.addMapSource(msNames[i], ms[i], i==0);
        }
        map.init(document.getElementById("<xsl:value-of select="$mapcellid"/>"));

        for (var i=(msNames.length-1);i>=0;i--) {
          if (msImages[i] != "")
            ms[i].addImage(0, 0, ms[i].generateTileId(0, 0), msImages[i]);
        }

        <xsl:if test="$scaleBar != ''">
          <xsl:choose>
            <xsl:when test="/map/scale-bar/@useFunctionality = 'true'">
              map.addScaleBar("<xsl:value-of select="/map/scale-bar/image-url" />", "<xsl:value-of select="/map/scale-bar/position" />");
            </xsl:when>
            <xsl:otherwise>
              map.addScaleBar(null, "<xsl:value-of select="/map/scale-bar/position" />", <xsl:value-of select="/map/scale-bar/width" />, <xsl:value-of select="/map/scale-bar/height" />, <xsl:value-of select="/map/scale-bar/screen-distance" />, <xsl:value-of select="/map/scale-bar/map-distance" />, "<xsl:value-of select="/map/scale-bar/units" />", "<xsl:value-of select="/map/scale-bar/type" />");
            </xsl:otherwise>
          </xsl:choose>
        </xsl:if>
      }
      esriInitItems.push("esriMapInit<xsl:value-of select="$mapId"/>()");
    </xsl:element>
    <xsl:comment>Map Control Renderer End (<xsl:value-of select="$mapId"/>)</xsl:comment>
  </xsl:template>
</xsl:stylesheet>
