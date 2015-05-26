<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Copyright (c) 2000-2003, Environmental Systems Research Institute, Inc. All rights reserved. -->
  <!-- XSL file for Toolbar control -->
  <xsl:import href="core.xsl"/>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <!--
    To customize the appearance of the Toolbar, enter values for each attribute you wish to customize in their
    respective opening and closing <xsl:variable> tags below.  You can customize as many or as few attributes
    as you wish.

    Any attributes defined in the web control's JSP tag will take precedence over custom values defined below.

    Both class and style attributes are permitted in a single tag.  Properties defined below or in the web control's JSP tag attributes
    will override class properties.  However, if a property that is defined in the class is not defined below or in the JSP tag attributes
    then the class definition will handle that property.
  -->
  <xsl:variable name="customToolbarStyle"></xsl:variable>
  <xsl:variable name="customToolbarStyleClass"></xsl:variable>
  <xsl:variable name="customToolDefaultStyle"></xsl:variable>
  <xsl:variable name="customToolHoverStyle"></xsl:variable>
  <xsl:variable name="customToolDisabledStyle"></xsl:variable>
  <xsl:variable name="customToolSelectedStyle"></xsl:variable>
  <xsl:variable name="customClientToolAction">false</xsl:variable>
  <!-- End of variable customization -->

  <xsl:variable name="contextpath"><xsl:value-of select="//context-path" />/</xsl:variable>

  <!-- Determine if to import the core.xsl file -->
  <xsl:variable name="common" select="//common-resources-registered"/>

  <!-- Read in the value for first occurrence (of toolbar control on page) from the input XML file -->
  <xsl:variable name="first" select="//first-time" />

  <!-- Set a final value for the toolbar style attribute -->
  <xsl:variable name="style">
    <xsl:choose>
      <xsl:when test="/toolbar/style != ''"><xsl:value-of select="/toolbar/style"/></xsl:when>
      <xsl:when test="$customToolbarStyle != ''"><xsl:value-of select="$customToolbarStyle"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the toolbar style class attribute -->
  <xsl:variable name="styleClass">
    <xsl:choose>
      <xsl:when test="/toolbar/style-class != ''"><xsl:value-of select="/toolbar/style-class"/></xsl:when>
      <xsl:when test="$customToolbarStyleClass!= ''"><xsl:value-of select="$customToolbarStyleClass"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the tool style attribute -->
  <xsl:variable name="toolDefaultStyle">
    <xsl:choose>
      <xsl:when test="/toolbar/default-style != ''"><xsl:value-of select="/toolbar/default-style"/></xsl:when>
      <xsl:when test="$customToolDefaultStyle != ''"><xsl:value-of select="$customToolDefaultStyle"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the tool hover style attribute -->
  <xsl:variable name="toolHoverStyle">
    <xsl:choose>
      <xsl:when test="/toolbar/hover-style != ''"><xsl:value-of select="/toolbar/hover-style"/></xsl:when>
      <xsl:when test="$customToolHoverStyle != ''"><xsl:value-of select="$customToolHoverStyle"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the tool disabled style attribute -->
  <xsl:variable name="toolDisabledStyle">
    <xsl:choose>
      <xsl:when test="/toolbar/disabled-style != ''"><xsl:value-of select="/toolbar/disabled-style"/></xsl:when>
      <xsl:when test="$customToolDisabledStyle != ''"><xsl:value-of select="$customToolDisabledStyle"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <!-- Set a final value for the tool selected style attribute -->
  <xsl:variable name="toolSelectedStyle">
    <xsl:choose>
      <xsl:when test="/toolbar/selected-style != ''"><xsl:value-of select="/toolbar/selected-style"/></xsl:when>
      <xsl:when test="$customToolSelectedStyle != ''"><xsl:value-of select="$customToolSelectedStyle"/></xsl:when>
    </xsl:choose>
  </xsl:variable>

  <xsl:variable name="toolbarId" select="//id"/>

  <!-- Begin HTML output -->
  <xsl:template match="/">
    <xsl:comment>Toolbar Control Renderer Start (<xsl:value-of select="$toolbarId"/>)</xsl:comment>
    <xsl:if test="$common = 'false'">
      <xsl:apply-imports/>
    </xsl:if>

    <!--
    If this is the first occurrence of the map control on the page, bring in the esri_map.js and  esri_toolbar.js file.
    Otherwise, the file has already been included.
    -->
    <xsl:if test="$first = 'true'">
      <xsl:element name="script">
        <xsl:attribute name="type">text/javascript</xsl:attribute>
        <xsl:attribute name="language">Javascript</xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="$contextpath" />js/esri_toolbar.js</xsl:attribute>
      </xsl:element>
    </xsl:if>

    <xsl:variable name="toolBarCellId">EsriToolBarCell_<xsl:value-of select="$toolbarId"/></xsl:variable>
    <xsl:element name="div">
      <xsl:attribute name="id"><xsl:value-of select="$toolBarCellId"/></xsl:attribute>
      <xsl:if test="$style != ''">
        <xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
      </xsl:if>
      <xsl:if test="$styleClass != ''">
        <xsl:attribute name="class"><xsl:value-of select="$styleClass"/></xsl:attribute>
      </xsl:if>
      <xsl:comment>Toolbar Control</xsl:comment>
    </xsl:element>

    <xsl:element name="script">
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      <xsl:attribute name="language">Javascript</xsl:attribute>
      function esriToolBarInit<xsl:value-of select="$toolbarId"/>() {
      <xsl:choose>
        <xsl:when test="/toolbar/toolbar-style = 'IMAGEONLY'">
          var <xsl:value-of select="$toolbarId"/> = new EsriImageToolbar("<xsl:value-of select="$toolbarId"/>", null, "<xsl:value-of select="/toolbar/map-id"/>");
        </xsl:when>
        <xsl:when test="/toolbar/toolbar-style = 'IMAGEANDTEXT'">
          var <xsl:value-of select="$toolbarId"/> = new EsriImageAndTextToolbar("<xsl:value-of select="$toolbarId"/>", null, "<xsl:value-of select="/toolbar/map-id"/>");
        </xsl:when>
        <xsl:otherwise>
          var <xsl:value-of select="$toolbarId"/> = new EsriTextToolbar("<xsl:value-of select="$toolbarId"/>", null, "<xsl:value-of select="/toolbar/map-id"/>");
        </xsl:otherwise>
      </xsl:choose>
      <xsl:choose>
        <xsl:when test="/toolbar/orientation = 'VERTICAL'">
          <xsl:value-of select="$toolbarId"/>.orientation = <xsl:value-of select="$toolbarId"/>.ORIENTATION_VERTICAL;
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$toolbarId"/>.orientation = <xsl:value-of select="$toolbarId"/>.ORIENTATION_HORIZONTAL;
        </xsl:otherwise>
      </xsl:choose>
      <xsl:value-of select="$toolbarId"/>.textPos="<xsl:value-of select="/toolbar/text-position"/>";

      <xsl:if test="$toolDefaultStyle != ''">
        <xsl:value-of select="$toolbarId"/>.defaultStyle = "<xsl:value-of select="$toolDefaultStyle"/>";
      </xsl:if>
      <xsl:if test="$toolHoverStyle != ''">
        <xsl:value-of select="$toolbarId"/>.hoverStyle = "<xsl:value-of select="$toolHoverStyle"/>";
      </xsl:if>
      <xsl:if test="$toolDisabledStyle != ''">
        <xsl:value-of select="$toolbarId"/>.disabledStyle = "<xsl:value-of select="$toolDisabledStyle"/>";
      </xsl:if>
      <xsl:if test="$toolSelectedStyle != ''">
        <xsl:value-of select="$toolbarId"/>.selectedStyle = "<xsl:value-of select="$toolSelectedStyle"/>";
      </xsl:if>

      <xsl:value-of select="$toolbarId"/>.init(document.getElementById("<xsl:value-of select="$toolBarCellId"/>"));

      <xsl:for-each select="/toolbar/toolbar-items/toolbar-item">
        <xsl:variable name="toolid" select="@id" />
        <xsl:choose>
          <xsl:when test="@type = 'SELECTONE'">
            <!-- TODO -->
          </xsl:when>
          <xsl:when test="@type = 'SEPARATOR'">
            <xsl:if test="@image != ''">
              <xsl:value-of select="$toolbarId"/>.addImageSeparator("<xsl:value-of select="@image"/>", '<xsl:value-of select="@style-class"/>', '<xsl:value-of select="@style"/>');
            </xsl:if>
          </xsl:when>
          <xsl:when test="@type =  'TOOL'">
            var <xsl:value-of select="$toolid"/> = new <xsl:value-of select="@client-action" />("<xsl:value-of select="$toolid" />", "<xsl:value-of select="@tool-text" />", false);
            <xsl:if test="@style != ''">
              <xsl:value-of select="$toolid"/>.style = "<xsl:value-of select="@style"/>";
            </xsl:if>
            <xsl:if test="@style-class != ''">
              <xsl:value-of select="$toolid"/>.styleClass = "<xsl:value-of select="@style-class"/>";
            </xsl:if>
            <xsl:value-of select="$toolid" />.clientPostBack = <xsl:value-of select="@client-post-back" />;
            <xsl:if test="@tool-tip != ''">
              <xsl:value-of select="$toolid"/>.toolTip = "<xsl:value-of select="@tool-tip"/>";
            </xsl:if>
            <xsl:if test="@default-image != ''">
              <xsl:value-of select="$toolid"/>.defaultImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@default-image"/>";
            </xsl:if>
            <xsl:if test="@hover-image != ''">
              <xsl:value-of select="$toolid"/>.hoverImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@hover-image"/>";
            </xsl:if>
            <xsl:if test="@selected-image != ''">
              <xsl:value-of select="$toolid"/>.selectedImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@selected-image"/>";
            </xsl:if>
            <xsl:if test="@disabled-image != ''">
              <xsl:value-of select="$toolid"/>.disabledImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@disabled-image"/>";
            </xsl:if>
            <xsl:value-of select="$toolid"/>.isDisabled = <xsl:value-of select="@disabled"/>;
            <xsl:if test="@cursor != ''">
              <xsl:value-of select="$toolid" />.action.cursor = "<xsl:value-of select="@cursor" />";
            </xsl:if>
            <xsl:if test="@show-loading-image != ''">
              <xsl:value-of select="$toolid" />.showLoading = <xsl:value-of select="@show-loading-image" />;
            </xsl:if>
            <xsl:if test="@line-color != ''">
              <xsl:value-of select="$toolid" />.action.lineColor = "<xsl:value-of select="@line-color" />";
            </xsl:if>
            <xsl:if test="@line-width != ''">
              <xsl:value-of select="$toolid" />.action.lineWidth = <xsl:value-of select="@line-width" />;
            </xsl:if>
            <xsl:value-of select="$toolbarId"/>.addToolItem(<xsl:value-of select="$toolid"/>);
          </xsl:when>
          <xsl:when test="@type =  'COMMAND'">
            <xsl:choose>
              <xsl:when test="@onclick != ''">
                var <xsl:value-of select="$toolid"/> = new EsriMapServerAction("<xsl:value-of select="$toolid" />", "<xsl:value-of select="@tool-text" />", <xsl:value-of select="@onclick" />);
              </xsl:when>
              <xsl:otherwise>
                var <xsl:value-of select="$toolid"/> = new EsriMapServerAction("<xsl:value-of select="$toolid" />", "<xsl:value-of select="@tool-text" />");
              </xsl:otherwise>
            </xsl:choose>
            <xsl:if test="@style != ''">
              <xsl:value-of select="$toolid"/>.style = "<xsl:value-of select="@style"/>";
            </xsl:if>
            <xsl:if test="@style-class != ''">
              <xsl:value-of select="$toolid"/>.styleClass = "<xsl:value-of select="@style-class"/>";
            </xsl:if>
            <xsl:value-of select="$toolid" />.clientPostBack = <xsl:value-of select="@client-post-back" />;
            <xsl:if test="@tool-tip != ''">
              <xsl:value-of select="$toolid"/>.toolTip = "<xsl:value-of select="@tool-tip"/>";
            </xsl:if>
            <xsl:if test="@default-image != ''">
              <xsl:value-of select="$toolid"/>.defaultImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@default-image"/>";
            </xsl:if>
            <xsl:if test="@hover-image != ''">
              <xsl:value-of select="$toolid"/>.hoverImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@hover-image"/>";
            </xsl:if>
            <xsl:if test="@selected-image != ''">
              <xsl:value-of select="$toolid"/>.selectedImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@selected-image"/>";
            </xsl:if>
            <xsl:if test="@disabled-image != ''">
              <xsl:value-of select="$toolid"/>.disabledImage = "<xsl:value-of select="$contextpath" /><xsl:value-of select="@disabled-image"/>";
            </xsl:if>
            <xsl:value-of select="$toolid"/>.isDisabled = <xsl:value-of select="@disabled"/>;
            <xsl:if test="@show-loading-image != ''">
              <xsl:value-of select="$toolid" />.showLoading = <xsl:value-of select="@show-loading-image" />;
            </xsl:if>
            <xsl:value-of select="$toolbarId"/>.addToolItem(<xsl:value-of select="$toolid"/>);
          </xsl:when>
        </xsl:choose>

      </xsl:for-each>

      <xsl:if test="/toolbar/active-tool != ''">
        EsriControls.maps['<xsl:value-of select="/toolbar/map-id"/>'].setCurrentToolItem(<xsl:value-of select="/toolbar/active-tool"/>, "<xsl:value-of select="$toolbarId"/>");
      </xsl:if>
      }
      esriInitItems.push("esriToolBarInit<xsl:value-of select="$toolbarId"/>()");
    </xsl:element>
    <xsl:comment>Toolbar Control Renderer End (<xsl:value-of select="$toolbarId"/>)</xsl:comment>
  </xsl:template>
</xsl:stylesheet>
