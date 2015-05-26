<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- =========================== -->
  <!-- Process the Action Node -->
  <!-- =========================== -->
  <xsl:template name="processActionNodeByLayout">
    <xsl:param name="actionNode"/>
    <xsl:variable name="taskActionId"><xsl:value-of select="$taskId"/>_action_<xsl:value-of select="$actionNode/@name"/></xsl:variable>
    <xsl:element name="input">
      <xsl:attribute name="name">button_<xsl:value-of select="$taskActionId" /></xsl:attribute>
      <xsl:attribute name="id">button_<xsl:value-of select="$taskActionId" /></xsl:attribute>
      <xsl:choose>
        <xsl:when test="$actionNode/action-properties/@renderer-type = 'IMAGEONLY'">
          <xsl:attribute name="type">IMAGE</xsl:attribute>
          <xsl:choose>
            <xsl:when test="$actionNode/action-properties/@disabled = 'true'">
              <xsl:attribute name="src"><xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@disabled-image"/></xsl:attribute>
              <xsl:attribute name="onclick">return false;</xsl:attribute>
              <xsl:attribute name="style">cursor:default;</xsl:attribute>
            </xsl:when>
            <xsl:otherwise>
              <xsl:attribute name="src"><xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@default-image"/></xsl:attribute>
              <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@hover-image"/>';</xsl:attribute>
              <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@selected-image"/>';</xsl:attribute>
              <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', <xsl:value-of select="$actionNode/action-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, null, null, '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@default-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@hover-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@selected-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@disabled-image"/>'); return false;</xsl:attribute>
              <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@default-image"/>';</xsl:attribute>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="type">BUTTON</xsl:attribute>
          <xsl:attribute name="value"><xsl:value-of select="$actionNode/display-name"/></xsl:attribute>
          <xsl:choose>
            <xsl:when test="$actionNode/action-properties/@disabled = 'true'">
              <xsl:attribute name="class">esriToolDisabled</xsl:attribute>
              <xsl:attribute name="onclick">return false;</xsl:attribute>
            </xsl:when>
            <xsl:otherwise>
              <xsl:attribute name="class">esriToolDefault</xsl:attribute>
              <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).className = 'esriToolHover';</xsl:attribute>
              <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).className = 'esriToolSelected';</xsl:attribute>
              <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', <xsl:value-of select="$actionNode/action-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled'); return false;</xsl:attribute>
              <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).className = 'esriToolDefault';</xsl:attribute>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:attribute name="title"><xsl:value-of select="$actionNode/action-properties/@tool-tip"/></xsl:attribute>
    </xsl:element>
  </xsl:template>

  <!-- =========================== -->
  <!-- Process the Tool Node -->
  <!-- =========================== -->
  <xsl:template name="processToolNodeByLayout">
    <xsl:param name="toolNode"/>
    <xsl:variable name="taskToolId"><xsl:value-of select="$taskId"/>_tool_<xsl:value-of select="$toolNode/@name"/></xsl:variable>
    <xsl:element name="input">
      <xsl:attribute name="name">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
      <xsl:attribute name="id">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
      <xsl:choose>
        <xsl:when test="$toolNode/tool-properties/@renderer-type = 'IMAGEONLY'">
          <xsl:attribute name="type">IMAGE</xsl:attribute>
          <xsl:choose>
            <xsl:when test="$toolNode/tool-properties/@disabled = 'true'">
              <xsl:attribute name="src"><xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@disabled-image"/></xsl:attribute>
              <xsl:attribute name="style">cursor:default;</xsl:attribute>
              <xsl:attribute name="onclick">return false;</xsl:attribute>
            </xsl:when>
            <xsl:otherwise>
              <xsl:choose>
                <xsl:when test="contains(//active-tool, $taskToolId) = 'true'">
                  <xsl:attribute name="src"><xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@selected-image"/></xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:attribute name="src"><xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@default-image"/></xsl:attribute>
                </xsl:otherwise>
              </xsl:choose>
              <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@hover-image"/>';</xsl:attribute>
              <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@selected-image"/>';</xsl:attribute>
              <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskToolId"/>', 'button_<xsl:value-of select="$taskToolId"/>', '<xsl:value-of select="$toolNode/tool-properties/@client-action"/>', <xsl:value-of select="$toolNode/tool-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, '<xsl:value-of select="$toolNode/tool-properties/@line-color"/>', <xsl:value-of select="$toolNode/tool-properties/@line-width"/>, '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@default-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@hover-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@selected-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@disabled-image"/>'); return false;</xsl:attribute>
              <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@default-image"/>';</xsl:attribute>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="type">BUTTON</xsl:attribute>
          <xsl:attribute name="value"><xsl:value-of select="$toolNode/display-name"/></xsl:attribute>
          <xsl:choose>
            <xsl:when test="$toolNode/tool-properties/@disabled = 'true'">
              <xsl:attribute name="style"><xsl:value-of select="$toolNode/tool-properties/@disabled-style"/></xsl:attribute>
              <xsl:attribute name="onclick">return false;</xsl:attribute>
            </xsl:when>
            <xsl:otherwise>
              <xsl:choose>
                <xsl:when test="contains(//active-tool, $taskToolId) = 'true'">
                  <xsl:attribute name="class">esriToolSelected</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:attribute name="class">esriToolDefault</xsl:attribute>
                </xsl:otherwise>
              </xsl:choose>
              <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).className = 'esriToolHover';</xsl:attribute>
              <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).className = 'esriToolSelected';</xsl:attribute>
              <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskToolId"/>', 'button_<xsl:value-of select="$taskToolId"/>', '<xsl:value-of select="$toolNode/tool-properties/@client-action"/>', <xsl:value-of select="$toolNode/tool-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, '<xsl:value-of select="$toolNode/tool-properties/@line-color"/>', <xsl:value-of select="$toolNode/tool-properties/@line-width"/>, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled'); return false;</xsl:attribute>
              <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).className = 'esriToolDefault';</xsl:attribute>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:attribute name="title"><xsl:value-of select="$toolNode/tool-properties/@tool-tip"/></xsl:attribute>
    </xsl:element>
  </xsl:template>

  <!-- =========================== -->
  <!-- Process the Param Node -->
  <!-- =========================== -->
  <xsl:template name="processParamNodeByLayout">
    <xsl:param name="paramNode"/>
    <xsl:variable name="val" select="value"/>
    <xsl:choose>
      <xsl:when test="$paramNode/read-only = 'true'">
        <xsl:value-of select="$val"/>
      </xsl:when>
      <xsl:when test="$paramNode/@type = 'TEXT'">
        <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
          <xsl:element name="span">
            <xsl:attribute name="style">margin-right:10px;</xsl:attribute>
            <xsl:value-of select="$paramNode/display-name"/>
          </xsl:element>
        </xsl:if>
        <xsl:element name="input">
          <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:if test="$val !=''">
            <xsl:attribute name="value"><xsl:value-of select="$val"/></xsl:attribute>
          </xsl:if>
          <xsl:if test="$paramNode/@disabled = 'true'">
            <xsl:attribute name="disabled">true</xsl:attribute>
          </xsl:if>
        </xsl:element>
      </xsl:when>
      <xsl:when test="$paramNode/@type = 'CHECKBOX'">
        <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
          <xsl:element name="span">
            <xsl:attribute name="style">margin-right:10px;</xsl:attribute>
            <xsl:value-of select="$paramNode/display-name"/>
          </xsl:element>
        </xsl:if>
        <xsl:element name="input">
          <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:if test="$paramNode/@disabled = 'true'">
            <xsl:attribute name="disabled">true</xsl:attribute>
          </xsl:if>
          <xsl:attribute name="type">CHECKBOX</xsl:attribute>
          <xsl:choose>
            <xsl:when test="$val = 'true'">
              <xsl:attribute name="checked">checked</xsl:attribute>
            </xsl:when>
          </xsl:choose>
        </xsl:element>
      </xsl:when>
      <xsl:when test="$paramNode/@type = 'RADIO'">
        <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
          <xsl:element name="span">
            <xsl:attribute name="style">margin-right:10px;</xsl:attribute>
            <xsl:value-of select="$paramNode/display-name"/>
          </xsl:element>
        </xsl:if>
        <xsl:for-each select="select/option">
          <xsl:element name="input">
            <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
            <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
            <xsl:attribute name="type">RADIO</xsl:attribute>
            <xsl:if test="$paramNode/@disabled = 'true'">
              <xsl:attribute name="disabled">true</xsl:attribute>
            </xsl:if>
            <xsl:attribute name="value">
              <xsl:value-of select="./@value"/>
            </xsl:attribute>
            <xsl:if test="$val = ./@value">
              <xsl:attribute name="checked">checked</xsl:attribute>
            </xsl:if>
            <xsl:value-of select="./@name"/>
          </xsl:element>
          <br/>
        </xsl:for-each>
      </xsl:when>
      <xsl:when test="$paramNode/@type = 'SELECT'">
        <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
          <xsl:element name="span">
            <xsl:attribute name="style">margin-right:10px;</xsl:attribute>
            <xsl:value-of select="$paramNode/display-name"/>
          </xsl:element>
        </xsl:if>
        <xsl:element name="select">
          <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:if test="$paramNode/@disabled = 'true'">
            <xsl:attribute name="disabled">true</xsl:attribute>
          </xsl:if>
          <xsl:for-each select="$paramNode/select/option">
            <xsl:element name="option">
              <xsl:attribute name="value"><xsl:value-of select="./@value"/></xsl:attribute>
              <xsl:if test="$val = ./@value">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>
              <xsl:value-of select="./@name"/>
            </xsl:element>
          </xsl:for-each>
        </xsl:element>
      </xsl:when>
      <xsl:when test="$paramNode/@type = 'GPLinearUnit'">
        <xsl:call-template name="gpLinearUnit" />
      </xsl:when>
      <xsl:when test="$paramNode/@type = 'GPRecordSet'">
        <xsl:call-template name="gpRecordSet" />
      </xsl:when>
      <xsl:when test="$paramNode/@type = 'GPDataFile'">
        <xsl:call-template name="gpDataFile" />
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="gpDataFile">
    <xsl:variable name="paramName">
      <xsl:value-of select="$taskId"/>_param_<xsl:value-of select="@name"/>
    </xsl:variable>
    <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
      <xsl:element name="span">
        <xsl:attribute name="style">margin-right:10px;</xsl:attribute>
        <xsl:value-of select="display-name"/>
      </xsl:element>
    </xsl:if>

    <xsl:element name="input">
      <xsl:attribute name="name"><xsl:value-of select="$paramName"/>:value</xsl:attribute><xsl:attribute name="id">
      <xsl:value-of select="$paramName"/>:value</xsl:attribute>
      <xsl:if test="value/value !=''">
        <xsl:attribute name="value"><xsl:value-of select="value/value"/></xsl:attribute>
      </xsl:if>
      <xsl:attribute name="type">HIDDEN</xsl:attribute>
    </xsl:element>

    <xsl:element name="input">
      <xsl:attribute name="name"><xsl:value-of select="$paramName"/>:file-name</xsl:attribute>
      <xsl:attribute name="id"><xsl:value-of select="$paramName"/>:file-name</xsl:attribute>
      <xsl:if test="value/file-name !=''">
        <xsl:attribute name="value"><xsl:value-of select="value/file-name"/></xsl:attribute>
      </xsl:if>
      <xsl:attribute name="disabled">true</xsl:attribute>
      <xsl:attribute name="style">display:none;</xsl:attribute>
    </xsl:element>

    <xsl:element name="span">
      <xsl:attribute name="id"><xsl:value-of select="$paramName"/>_span_filename</xsl:attribute>
      <xsl:attribute name="style">font-style:italic; padding-right:5px; margin-right:5px;</xsl:attribute>
    </xsl:element>

    <xsl:variable name="openLabel">Open File...</xsl:variable>
    <xsl:element name="script">
      <xsl:attribute name="language">Javascript</xsl:attribute>
      <xsl:attribute name="type">text/javascript</xsl:attribute>
      function esriGpDataFileHandler<xsl:value-of select="$paramName" />(filename, id) {
        if (id) {
          document.getElementById("<xsl:value-of select="$paramName"/>_span_filename").innerHTML = filename;
          document.getElementById("<xsl:value-of select="$paramName"/>:file-name").value = filename;
          document.getElementById("<xsl:value-of select="$paramName"/>:value").value = id;
        }
        else
          alert("Error");
      }
    </xsl:element>
    <xsl:element name="a">
      <xsl:attribute name="href">javascript:void(0);</xsl:attribute>
      <xsl:attribute name="onclick">EsriUploadUtil.showUploadWindow('<xsl:value-of select="$openLabel" />', esriGpDataFileHandler<xsl:value-of select="$paramName" />);</xsl:attribute>
      <xsl:value-of select="$openLabel" />
    </xsl:element>
  </xsl:template>

  <xsl:template name="gpLinearUnit">
    <xsl:element name="table">
      <xsl:attribute name="style">width:280px;</xsl:attribute>
      <xsl:element name="tr">
        <xsl:element name="td">

          <xsl:element name="input"> <!-- Input Start -->
            <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="@name"/>:value</xsl:attribute>
            <xsl:attribute name="value"><xsl:value-of select="value/value"/></xsl:attribute>
            <xsl:if test="@disabled = 'true'">
              <xsl:attribute name="disabled">true</xsl:attribute>
            </xsl:if>
          </xsl:element> <!-- Input END -->

        </xsl:element>
        <xsl:element name="td">
          <xsl:element name="select"> <!-- Select Start -->
            <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="@name"/>:units</xsl:attribute>
            <xsl:if test="@disabled = 'true'">
              <xsl:attribute name="disabled">true</xsl:attribute>
            </xsl:if>
            <xsl:element name="option">
              <xsl:attribute name="value">esriCentimeters</xsl:attribute>
              <xsl:if test="value/units = 'esriCentimeters'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Centimeters
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriDecimeters</xsl:attribute>
              <xsl:if test="value/units = 'esriDecimeters'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Decimeters
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriInches</xsl:attribute>
              <xsl:if test="value/units = 'esriInches'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Inches
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriKilometers</xsl:attribute>
              <xsl:if test="value/units = 'esriKilometers'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Kilometers
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriMiles</xsl:attribute>
              <xsl:if test="value/units = 'esriMiles'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Miles
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriMillimeters</xsl:attribute>
              <xsl:if test="value/units = 'esriMillimeters'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Millimeters
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriPoints</xsl:attribute>
              <xsl:if test="value/units = 'esriPoints'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Points
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriUnknown</xsl:attribute>
              <xsl:if test="value/units = 'esriUnknown'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Unknown
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriYards</xsl:attribute>
              <xsl:if test="value/units = 'esriYards'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Yards
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriDecimalDegrees</xsl:attribute>
              <xsl:if test="value/units = 'esriDecimalDegrees'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>DecimalDegrees
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriFeet</xsl:attribute>
              <xsl:if test="value/units = 'esriFeet'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Feet
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriMeters</xsl:attribute>
              <xsl:if test="value/units = 'esriMeters'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>Meters
            </xsl:element>
            <xsl:element name="option">
              <xsl:attribute name="value">esriNauticalMiles</xsl:attribute>
              <xsl:if test="value/units = 'esriNauticalMiles'">
                <xsl:attribute name="selected">true</xsl:attribute>
              </xsl:if>NauticalMiles
            </xsl:element>
          </xsl:element>  <!-- Select END -->

        </xsl:element>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <xsl:template name="gpRecordSet">
    <xsl:variable name="taskParamName">
      <xsl:value-of select="@name"/>
    </xsl:variable>
    <xsl:variable name="multiSelectId">
      <xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$taskParamName"/>:record</xsl:variable>

    <xsl:element name="table"> <!-- GP Recordset Table Start -->
      <xsl:element name="tr">
        <xsl:element name="td"> <!-- Column One -->
          <xsl:attribute name="rowspan">3</xsl:attribute>
          <xsl:element name="select">
            <xsl:attribute name="id"><xsl:value-of select="$multiSelectId" /></xsl:attribute>
            <xsl:attribute name="name"><xsl:value-of select="$multiSelectId" /></xsl:attribute>
            <xsl:attribute name="size">10</xsl:attribute>
            <xsl:attribute name="style">width:250px;</xsl:attribute>
            <xsl:attribute name="multiple">multiple</xsl:attribute>
            <xsl:if test="@disabled = 'true'">
              <xsl:attribute name="disabled">true</xsl:attribute>
            </xsl:if>
            <xsl:for-each select="records/record">
              <xsl:element name="option">
                <xsl:attribute name="value"><xsl:value-of select="@id"/></xsl:attribute>
                <xsl:value-of select="@value"/>
              </xsl:element>
            </xsl:for-each>
          </xsl:element>
        </xsl:element>

        <xsl:element name="td"> <!-- Column Two -->
          <xsl:attribute name="valign">top</xsl:attribute>
          <xsl:variable name="addRecordToolCnt" select="count(add-record-tool)" />
          <xsl:variable name="addRecordActionCnt" select="count(add-record-action)" />
          <xsl:choose>
            <xsl:when test="$addRecordToolCnt > 0">
              <xsl:variable name="toolNode" select="add-record-tool" />
              <xsl:variable name="taskToolId"><xsl:value-of select="$taskId"/>_tool_<xsl:value-of select="add-record-tool/@name"/></xsl:variable>
              <xsl:choose>
                <xsl:when test="$toolNode/tool-properties/@client-action = 'EsriMapPoint'">
                  <xsl:element name="input"> <!-- Input Start -->
                    <xsl:attribute name="name">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
                    <xsl:attribute name="id">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
                    <xsl:attribute name="type">IMAGE</xsl:attribute>
                    <xsl:attribute name="title"><xsl:value-of select="$toolNode/display-name"/></xsl:attribute>
                    <xsl:choose>
                      <xsl:when test="$toolNode/tool-properties/@disabled = 'true'">
                        <xsl:attribute name="src">images/tasks/geoprocessing/gpPointX.gif</xsl:attribute>
                        <xsl:attribute name="onclick">return false;</xsl:attribute>
                        <xsl:attribute name="style">cursor:default;</xsl:attribute>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="contains(//active-tool, $taskToolId) = 'true'">
                            <xsl:attribute name="src">images/tasks/geoprocessing/gpPointD.gif</xsl:attribute>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:attribute name="src">images/tasks/geoprocessing/gpPoint.gif</xsl:attribute>
                          </xsl:otherwise>
                        </xsl:choose>
                        <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPointU.gif';</xsl:attribute>
                        <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPointD.gif';</xsl:attribute>
                        <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPoint.gif';</xsl:attribute>
                        <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskToolId"/>', 'button_<xsl:value-of select="$taskToolId"/>', '<xsl:value-of select="$toolNode/tool-properties/@client-action"/>', true, <xsl:value-of select="//client-post-back"/>, '#FF0000', 2, 'images/tasks/geoprocessing/gpPoint.gif', 'images/tasks/geoprocessing/gpPointU.gif', 'images/tasks/geoprocessing/gpPointD.gif', 'images/tasks/geoprocessing/gpPointX.gif'); return false;</xsl:attribute>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:element> <!-- Input End -->
                </xsl:when>
                <xsl:when test="$toolNode/tool-properties/@client-action = 'EsriMapPolyline'">
                  <xsl:element name="input"> <!-- Input Start -->
                    <xsl:attribute name="name">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
                    <xsl:attribute name="id">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
                    <xsl:attribute name="type">IMAGE</xsl:attribute>
                    <xsl:attribute name="title"><xsl:value-of select="$toolNode/display-name"/></xsl:attribute>
                    <xsl:choose>
                      <xsl:when test="$toolNode/tool-properties/@disabled = 'true'">
                        <xsl:attribute name="src">images/tasks/geoprocessing/gpPolylineX.gif</xsl:attribute>
                        <xsl:attribute name="onclick">return false;</xsl:attribute>
                        <xsl:attribute name="style">cursor:default;</xsl:attribute>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="contains(//active-tool, $taskToolId) = 'true'">
                            <xsl:attribute name="src">images/tasks/geoprocessing/gpPolylineD.gif</xsl:attribute>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:attribute name="src">images/tasks/geoprocessing/gpPolyline.gif</xsl:attribute>
                          </xsl:otherwise>
                        </xsl:choose>
                        <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPolylineU.gif';</xsl:attribute>
                        <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPolylineD.gif';</xsl:attribute>
                        <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPolyline.gif';</xsl:attribute>
                        <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskToolId"/>', 'button_<xsl:value-of select="$taskToolId"/>', '<xsl:value-of select="$toolNode/tool-properties/@client-action"/>', true, <xsl:value-of select="//client-post-back"/>, '#FF0000', 2, 'images/tasks/geoprocessing/gpPolyline.gif', 'images/tasks/geoprocessing/gpPolylineU.gif', 'images/tasks/geoprocessing/gpPolylineD.gif', 'images/tasks/geoprocessing/gpPolylineX.gif'); return false;</xsl:attribute>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:element> <!-- Input End -->
                </xsl:when>
                <xsl:when test="$toolNode/tool-properties/@client-action = 'EsriMapPolygon'">
                  <xsl:element name="input"> <!-- Input Start -->
                    <xsl:attribute name="name">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
                    <xsl:attribute name="id">button_<xsl:value-of select="$taskToolId"/></xsl:attribute>
                    <xsl:attribute name="type">IMAGE</xsl:attribute>
                    <xsl:attribute name="title"><xsl:value-of select="$toolNode/display-name"/></xsl:attribute>
                    <xsl:choose>
                      <xsl:when test="$toolNode/tool-properties/@disabled = 'true'">
                        <xsl:attribute name="src">images/tasks/geoprocessing/gpPolygonX.gif</xsl:attribute>
                        <xsl:attribute name="onclick">return false;</xsl:attribute>
                        <xsl:attribute name="style">cursor:default;</xsl:attribute>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="contains(//active-tool, $taskToolId) = 'true'">
                            <xsl:attribute name="src">images/tasks/geoprocessing/gpPolygonD.gif</xsl:attribute>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:attribute name="src">images/tasks/geoprocessing/gpPolygon.gif</xsl:attribute>
                          </xsl:otherwise>
                        </xsl:choose>
                        <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPolygonU.gif';</xsl:attribute>
                        <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPolygonD.gif';</xsl:attribute>
                        <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpPolygon.gif';</xsl:attribute>
                        <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskToolId"/>', 'button_<xsl:value-of select="$taskToolId"/>', '<xsl:value-of select="$toolNode/tool-properties/@client-action"/>', true, <xsl:value-of select="//client-post-back"/>, '#FF0000', 2, 'images/tasks/geoprocessing/gpPolygon.gif', 'images/tasks/geoprocessing/gpPolygonU.gif', 'images/tasks/geoprocessing/gpPolygonD.gif', 'images/tasks/geoprocessing/gpPolygonX.gif'); return false;</xsl:attribute>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:element> <!-- Input End -->
                </xsl:when>
              </xsl:choose>
            </xsl:when>
            <xsl:when test="$addRecordActionCnt > 0">
              <xsl:variable name="actionNode5" select="add-record-action" />
              <xsl:variable name="taskActionId5"><xsl:value-of select="$taskId"/>_action_<xsl:value-of select="$actionNode5/@name"/></xsl:variable>
              <xsl:element name="input">
                <xsl:attribute name="name">button_<xsl:value-of select="$taskActionId5" /></xsl:attribute>
                <xsl:attribute name="id">button_<xsl:value-of select="$taskActionId5" /></xsl:attribute>
                <xsl:attribute name="type">IMAGE</xsl:attribute>
                <xsl:attribute name="title"><xsl:value-of select="$actionNode5/display-name"/></xsl:attribute>
                <xsl:choose>
                  <xsl:when test="$actionNode5/action-properties/@disabled = 'true'">
                    <xsl:attribute name="src">images/tasks/geoprocessing/gpAddX.gif</xsl:attribute>
                    <xsl:attribute name="onclick">return false;</xsl:attribute>
                    <xsl:attribute name="style">cursor:default;</xsl:attribute>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:attribute name="src">images/tasks/geoprocessing/gpAdd.gif</xsl:attribute>
                    <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpAddU.gif';</xsl:attribute>
                    <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpAddD.gif';</xsl:attribute>
                    <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpAdd.gif';</xsl:attribute>
                    <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId5"/>', 'button_<xsl:value-of select="$taskActionId5" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null, null, 'images/tasks/geoprocessing/gpAdd.gif', 'images/tasks/geoprocessing/gpAddU.gif', 'images/tasks/geoprocessing/gpAddD.gif', 'images/tasks/geoprocessing/gpAddX.gif'); return false;</xsl:attribute>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:element>
            </xsl:when>
          </xsl:choose>
        </xsl:element>
      </xsl:element>

      <xsl:element name="tr">
        <xsl:element name="td">
          <xsl:attribute name="valign">middle</xsl:attribute>
          <xsl:variable name="actionNode1" select="show-attributes-action" />
          <xsl:variable name="taskActionId1">
            <xsl:value-of select="$taskId"/>_action_<xsl:value-of select="show-attributes-action/@name"/>
          </xsl:variable>
          <xsl:element name="input">
            <xsl:attribute name="name">button_<xsl:value-of select="$taskActionId1" /></xsl:attribute>
            <xsl:attribute name="id">button_<xsl:value-of select="$taskActionId1" /></xsl:attribute>
            <xsl:attribute name="type">IMAGE</xsl:attribute>
            <xsl:attribute name="title"><xsl:value-of select="$actionNode1/display-name"/></xsl:attribute>
            <xsl:choose>
              <xsl:when test="$actionNode1/action-properties/@disabled = 'true' or count(records/record) = 0">
                <xsl:attribute name="src">images/tasks/geoprocessing/gpEditAttributesX.gif</xsl:attribute>
                <xsl:attribute name="onclick">return false;</xsl:attribute>
                <xsl:attribute name="style">cursor:default;</xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:attribute name="src">images/tasks/geoprocessing/gpEditAttributes.gif</xsl:attribute>
                <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpEditAttributesU.gif';</xsl:attribute>
                <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpEditAttributesD.gif';</xsl:attribute>
                <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpEditAttributes.gif';</xsl:attribute>
                <xsl:choose>
                  <xsl:when test="//show-in-window = 'true'">
                    <xsl:attribute name="onclick">if (!document.getElementById('<xsl:value-of select="$multiSelectId" />').value) document.getElementById('<xsl:value-of select="$multiSelectId" />').value = 1;<xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winFeaturesIdPrefix"/>_<xsl:value-of select="@name" />'].show(); EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId1"/>', 'button_<xsl:value-of select="$taskActionId1" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null, null, 'images/tasks/geoprocessing/gpEditAttributes.gif', 'images/tasks/geoprocessing/gpEditAttributesU.gif', 'images/tasks/geoprocessing/gpEditAttributesD.gif', 'images/tasks/geoprocessing/gpEditAttributesX.gif'); return false;</xsl:attribute>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:attribute name="onclick">if (!document.getElementById('<xsl:value-of select="$multiSelectId" />').value) document.getElementById('<xsl:value-of select="$multiSelectId" />').value = 1; EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId1"/>', 'button_<xsl:value-of select="$taskActionId1" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null, null, 'images/tasks/geoprocessing/gpEditAttributes.gif', 'images/tasks/geoprocessing/gpEditAttributesU.gif', 'images/tasks/geoprocessing/gpEditAttributesD.gif', 'images/tasks/geoprocessing/gpEditAttributesX.gif'); return false;</xsl:attribute>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:element>
        </xsl:element>
      </xsl:element>

      <xsl:element name="tr">
        <xsl:element name="td">
          <xsl:attribute name="valign">bottom</xsl:attribute>
          <xsl:variable name="actionNode2" select="remove-record-action" />
          <xsl:variable name="taskActionId2">
            <xsl:value-of select="$taskId"/>_action_<xsl:value-of select="remove-record-action/@name"/>
          </xsl:variable>
          <xsl:element name="input">
            <xsl:attribute name="name">button_<xsl:value-of select="$taskActionId2" /></xsl:attribute>
            <xsl:attribute name="id">button_<xsl:value-of select="$taskActionId2" /></xsl:attribute>
            <xsl:attribute name="type">IMAGE</xsl:attribute>
            <xsl:attribute name="title"><xsl:value-of select="$actionNode2/display-name"/></xsl:attribute>
            <xsl:choose>
              <xsl:when test="$actionNode2/action-properties/@disabled = 'true'">
                <xsl:attribute name="src">images/tasks/geoprocessing/gpDeleteX.gif</xsl:attribute>
                <xsl:attribute name="onclick">return false;</xsl:attribute>
                <xsl:attribute name="style">cursor:default;</xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:attribute name="src">images/tasks/geoprocessing/gpDelete.gif</xsl:attribute>
                <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpDeleteU.gif';</xsl:attribute>
                <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpDeleteD.gif';</xsl:attribute>
                <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).src = 'images/tasks/geoprocessing/gpDelete.gif';</xsl:attribute>
                <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId2"/>', 'button_<xsl:value-of select="$taskActionId2" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null, null, 'images/tasks/geoprocessing/gpDelete.gif', 'images/tasks/geoprocessing/gpDeleteU.gif', 'images/tasks/geoprocessing/gpDeleteD.gif', 'images/tasks/geoprocessing/gpDeleteX.gif'); return false;</xsl:attribute>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:element>
        </xsl:element>
      </xsl:element>
    </xsl:element>  <!-- GP Recordset Table End -->
    <xsl:if test="//show-in-window = 'false' and count(attributes/attribute) > 0">
      <xsl:element name="tr">
        <xsl:element name="td">
          <xsl:call-template name="processGPRecordSetAttribute" />
        </xsl:element>
      </xsl:element>
    </xsl:if>
  </xsl:template>

  <xsl:template name="processGPRecordSetAttribute">
    <xsl:variable name="taskParamName">
      <xsl:value-of select="@name"/>
    </xsl:variable>
    <xsl:element name="div">        <!-- Div element for Attributes for auto scroll Start -->
      <xsl:attribute name="style">overflow:auto;width:300px;height:175px;</xsl:attribute>
      <xsl:element name="table"> <!-- Attribute Table Start -->
        <xsl:attribute name="style">width:100%;background-color:#CDCDCD;</xsl:attribute>
        <xsl:attribute name="cellpadding">0</xsl:attribute>
        <xsl:attribute name="cellspacing">2</xsl:attribute>
        <xsl:element name="tr">
          <xsl:attribute name="style">background-color:#CCCC99;</xsl:attribute>
          <xsl:element name="th">Field</xsl:element>
          <xsl:element name="th">Value</xsl:element>
        </xsl:element>
        <xsl:for-each select="attributes/attribute">
          <xsl:element name="tr">
            <xsl:attribute name="style">background-color:#FFFFFF;</xsl:attribute>
            <xsl:element name="td">
              <xsl:value-of select="@name"/>
            </xsl:element>
            <xsl:element name="td">
              <xsl:choose>
                <xsl:when test="@read-only = 'true'">
                  <xsl:value-of select="@value"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:element name="input">
                    <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$taskParamName"/>:attribute:<xsl:value-of select="@name"/></xsl:attribute>
                    <xsl:attribute name="value"><xsl:value-of select="@value"/></xsl:attribute>
                  </xsl:element>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:element>
          </xsl:element>
        </xsl:for-each>
      </xsl:element> <!-- Attribute Table End -->
    </xsl:element>   <!-- Div element for Attributes for auto scroll End -->
    <xsl:element name="table"><!-- Table Action Start -->
      <xsl:attribute name="width">100%</xsl:attribute>
      <xsl:attribute name="cellspacing">20</xsl:attribute>
      <xsl:element name="tr">
        <xsl:element name="td">
          <xsl:attribute name="width">50%</xsl:attribute>
          <xsl:attribute name="align">RIGHT</xsl:attribute>

          <xsl:variable name="actionNode3" select="save-attribute-edits-action" />
          <xsl:variable name="taskActionId3">
            <xsl:value-of select="$taskId"/>_action_<xsl:value-of select="$actionNode3/@name"/>
          </xsl:variable>
          <xsl:element name="input"> <!-- Input Element Start -->
            <xsl:attribute name="name">button_<xsl:value-of select="$taskActionId3" />
            </xsl:attribute>
            <xsl:attribute name="id">button_<xsl:value-of select="$taskActionId3" />
            </xsl:attribute>
            <xsl:attribute name="title">
              <xsl:value-of select="$actionNode3/display-name"/>
            </xsl:attribute>
            <xsl:attribute name="type">BUTTON</xsl:attribute>
            <xsl:attribute name="style">width:100px;</xsl:attribute>
            <xsl:attribute name="value">
              <xsl:value-of select="$actionNode3/display-name"/>
            </xsl:attribute>
            <xsl:choose>
              <xsl:when test="$actionNode3/action-properties/@disabled = 'true'">
                <xsl:attribute name="class">esriToolDisabled</xsl:attribute>
                <xsl:attribute name="onclick">return false;</xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:attribute name="class">esriToolDefault</xsl:attribute>
                <xsl:attribute name="style">width:100px;</xsl:attribute>
                <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).className = 'esriToolHover';</xsl:attribute>
                <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).className = 'esriToolSelected';</xsl:attribute>
                <xsl:choose>
                  <xsl:when test="//show-in-window = 'true'">
                    <xsl:attribute name="onclick"><xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winFeaturesIdPrefix"/>_<xsl:value-of select="$taskParamName" />'].hide(); EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId3"/>', 'button_<xsl:value-of select="$taskActionId3" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null,   null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled'); return false;</xsl:attribute>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId3"/>', 'button_<xsl:value-of select="$taskActionId3" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null,   null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled'); return false;</xsl:attribute>
                  </xsl:otherwise>
                </xsl:choose>

                <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).className = 'esriToolDefault';</xsl:attribute>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:element> <!-- Input Element end -->

        </xsl:element>
        <xsl:element name="td">
          <xsl:attribute name="width">50%</xsl:attribute>
          <xsl:attribute name="align">LEFT</xsl:attribute>
          <xsl:variable name="actionNode4" select="cancel-attribute-edits-action" />
          <xsl:variable name="taskActionId4"><xsl:value-of select="$taskId"/>_action_<xsl:value-of select="cancel-attribute-edits-action/@name"/></xsl:variable>
          <xsl:element name="input">
            <xsl:attribute name="name">button_<xsl:value-of select="$taskActionId4" /></xsl:attribute>
            <xsl:attribute name="id">button_<xsl:value-of select="$taskActionId4" /></xsl:attribute>
            <xsl:attribute name="type">BUTTON</xsl:attribute>
            <xsl:attribute name="title"><xsl:value-of select="$actionNode4/display-name"/></xsl:attribute>
            <xsl:attribute name="value"><xsl:value-of select="$actionNode4/display-name"/></xsl:attribute>
            <xsl:choose>
              <xsl:when test="$actionNode4/action-properties/@disabled = 'true'">
                <xsl:attribute name="class">esriToolDisabled</xsl:attribute>
                <xsl:attribute name="onclick">return false;</xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:attribute name="class">esriToolDefault</xsl:attribute>
                <xsl:attribute name="style">width:100px;</xsl:attribute>
                <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).className = 'esriToolHover';</xsl:attribute>
                <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).className = 'esriToolSelected';</xsl:attribute>
                <xsl:choose>
                  <xsl:when test="//show-in-window = 'true'">
                    <xsl:attribute name="onclick"><xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winFeaturesIdPrefix"/>_<xsl:value-of select="$taskParamName" />'].hide(); EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId4"/>', 'button_<xsl:value-of select="$taskActionId4" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');return false;</xsl:attribute>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId4"/>', 'button_<xsl:value-of select="$taskActionId4" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');return false;</xsl:attribute>
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:attribute name="onmouseout">EsriUtils.getEventSource(event).className = 'esriToolDefault';</xsl:attribute>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:element>
        </xsl:element>
      </xsl:element>
    </xsl:element> <!-- Table Action End -->
  </xsl:template>

</xsl:stylesheet>