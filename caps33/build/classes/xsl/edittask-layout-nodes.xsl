<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- =========================== -->
  <!-- Process the Action Node -->
  <!-- =========================== -->
  <xsl:template name="processActionNodeByLayout">
    <xsl:param name="actionNode"/>
    <xsl:variable name="taskActionId">
      <xsl:value-of select="$taskId"/>_action_<xsl:value-of select="$actionNode/@name"/>
    </xsl:variable>

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
              <xsl:attribute name="disabled"><xsl:value-of select="$actionNode/action-properties/@disabled" /></xsl:attribute>
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
          <xsl:if test="$actionNode/@name = 'executeCloseEditWindows' or $actionNode/@name = 'executeEnterXY'">
            <xsl:attribute name="style">display:none;</xsl:attribute>
          </xsl:if>
          <xsl:attribute name="type">BUTTON</xsl:attribute>
          <xsl:attribute name="value"><xsl:value-of select="$actionNode/display-name"/></xsl:attribute>
          <xsl:choose>
            <xsl:when test="$actionNode/action-properties/@disabled = 'true'">
              <xsl:attribute name="class">esriToolDisabled</xsl:attribute>
              <xsl:attribute name="onclick">return false;</xsl:attribute>
              <xsl:attribute name="disabled"><xsl:value-of select="$actionNode/action-properties/@disabled" /></xsl:attribute>
            </xsl:when>
            <xsl:otherwise>
              <xsl:attribute name="class">esriToolDefault</xsl:attribute>
              <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).className = 'esriToolHover';</xsl:attribute>
              <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).className = 'esriToolSelected';</xsl:attribute>
              <xsl:choose>
                <xsl:when test="$actionNode/@name ='executeEnterFinalXY'">
                  <xsl:variable name="winMgr">taskWindowManager</xsl:variable>
                  <xsl:variable name="winXY">win_XY<xsl:value-of select="$taskId"/></xsl:variable>
                  <xsl:attribute name="onclick"><xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winXY"/>'].hide();EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', <xsl:value-of select="$actionNode/action-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled'); return false;</xsl:attribute>
                </xsl:when>
                <xsl:when test="$actionNode/@name ='executeHelp'">
                  <xsl:attribute name="onclick">var info = document.getElementById('<xsl:value-of select="$taskId"/>_param_helpInfo');if(!info){return false;}var helpInfo = info.value;if(!helpInfo){return false;}alert(helpInfo);</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', <xsl:value-of select="$actionNode/action-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled'); return false;</xsl:attribute>
                </xsl:otherwise>
              </xsl:choose>
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
    <xsl:variable name="taskToolId">
      <xsl:value-of select="$taskId"/>_tool_<xsl:value-of select="$toolNode/@name"/>
    </xsl:variable>
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
              <xsl:choose>
                <xsl:when test="starts-with($toolNode/tool-properties/@client-action, 'SCRIPT:enterXY')">
                  <xsl:variable name="taskActionId"><xsl:value-of select="$taskId"/>_action_executeEnterXY</xsl:variable>
                  <xsl:variable name="winMgr">taskWindowManager</xsl:variable>
                  <xsl:variable name="winXY">win_XY<xsl:value-of select="$taskId"/></xsl:variable>
                  <xsl:attribute name="onclick">var hiddenid = document.getElementById('<xsl:value-of select="$taskId"/>_param_currentActionID');if(!hiddenid){return false;}var cTool = EsriControls.maps['<xsl:value-of select="//map-id"/>'].currentTool;if(!cTool){ return false;}var editingCurrentTaskName = cTool.name;if(editingCurrentTaskName.indexOf('<xsl:value-of select="$taskId"/>') != 0) {return false;}if(editingCurrentTaskName){hiddenid.value = editingCurrentTaskName;var editaction = EsriControls.maps['<xsl:value-of select="//map-id"/>'].currentTool.action;if(!editaction){return false;}var editactionName = EsriControls.maps['<xsl:value-of select="//map-id"/>'].currentTool.action.name;if(!editactionName){return false;}<xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winXY"/>'].toggleVisibility();EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', true, <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled');return false;}</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:attribute name="onclick">var ti = EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskToolId"/>', 'button_<xsl:value-of select="$taskToolId" />', '<xsl:value-of select="$toolNode/tool-properties/@client-action"/>', <xsl:value-of select="$toolNode/tool-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, '<xsl:value-of select="$toolNode/tool-properties/@line-color"/>', <xsl:value-of select="$toolNode/tool-properties/@line-width"/>, '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@default-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@hover-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@selected-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$toolNode/tool-properties/@disabled-image"/>'); ti.taskId = '<xsl:value-of select="$taskId"/>'; if (document.getElementById('<xsl:value-of select="$taskId"/>_param_snapEnabled').checked) { if (ti.action.isEditing) { EsriControls.maps['<xsl:value-of select="//map-id"/>'].reactivateCurrentToolItem(); }} return false;</xsl:attribute>
                </xsl:otherwise>
              </xsl:choose>
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
    <xsl:param name="paramStyle"/>

    <xsl:variable name="val" select="value"/>
    <xsl:choose>
      <xsl:when test="$paramNode/read-only = 'true'">
        <xsl:value-of select="$val"/>
      </xsl:when>

      <xsl:when test="$paramNode/@type = 'TEXT'">
        <xsl:element name="input">
          <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:if test="$val != ''">
            <xsl:attribute name="value"><xsl:value-of select="$val"/></xsl:attribute>
          </xsl:if>
          <xsl:if test="$paramStyle != ''">
            <xsl:attribute name="style"><xsl:value-of select="$paramStyle" /></xsl:attribute>
          </xsl:if>
          <xsl:if test="$paramNode/@disabled = 'true'">
            <xsl:attribute name="disabled">true</xsl:attribute>
          </xsl:if>
          <xsl:if test="$paramNode/@name = 'currentActionID' or $paramNode/@name = 'helpInfo' or $paramNode/@name = 'verticesSize'">
            <xsl:attribute name="type">HIDDEN</xsl:attribute>
          </xsl:if>
        </xsl:element>
      </xsl:when>

      <xsl:when test="$paramNode/@type = 'CHECKBOX'">
        <xsl:if test="$paramNode/@name != 'snapEnabled'">
          <xsl:element name="span">
            <xsl:attribute name="style">margin-right:10px;</xsl:attribute>
            <xsl:value-of select="$paramNode/display-name"/>
          </xsl:element>
        </xsl:if>
        <xsl:element name="input">
          <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
          <xsl:if test="$paramNode/@name='snapEnabled'">
            <xsl:attribute name="style">display:none;</xsl:attribute>
          </xsl:if>
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

      <xsl:when test="$paramNode/@type = 'SELECT'">
        <xsl:if test="contains($paramNode/@name, 'attr_')=false">
          <xsl:element name="span">
            <xsl:attribute name="style">margin-right:10px;</xsl:attribute>
            <xsl:value-of select="$paramNode/display-name"/>
          </xsl:element>
          <xsl:element name="br" />
        </xsl:if>
        <xsl:variable name="selId"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:variable>
        <xsl:if test="contains($selId , '_param_layerId')">
          <xsl:element name="input">
            <xsl:attribute name="id"><xsl:value-of select="$taskId"/></xsl:attribute>
            <xsl:attribute name="name"><xsl:value-of select="$taskId"/></xsl:attribute>
            <xsl:attribute name="type">HIDDEN</xsl:attribute>
          </xsl:element>
        </xsl:if>

        <xsl:element name="select">
          <xsl:attribute name="name"><xsl:value-of select="$selId"/></xsl:attribute>
          <xsl:attribute name="id"><xsl:value-of select="$selId"/></xsl:attribute>
          <xsl:if test="$paramNode/@disabled = 'true'">
            <xsl:attribute name="disabled">true</xsl:attribute>
          </xsl:if>
          <xsl:if test="contains($selId , '_param_layerId') or contains($selId , '_param_attr_s_')">
            <xsl:variable name="winMgr">taskWindowManager</xsl:variable>
            <xsl:variable name="winXY">win_XY<xsl:value-of select="$taskId"/></xsl:variable>
            <xsl:attribute name="onchange">var myEditWin=<xsl:value-of select="$winMgr"/>.windows['<xsl:value-of select="$winXY"/>'];var closed= myEditWin.closed;if(!closed){myEditWin.hide();}EsriControls.maps['<xsl:value-of select="//map-id"/>'].clearCurrentToolItem();document.getElementById('<xsl:value-of select="$taskId"/>').value = '<xsl:value-of select="$taskId"/>';EsriUtils.addFormElement(EsriControls.maps['<xsl:value-of select="//map-id"/>'].formId, 'doPostBack', 'doPostBack');EsriControls.maps['<xsl:value-of select="//map-id"/>'].showLoading();EsriUtils.submitForm(EsriControls.maps['<xsl:value-of select="//map-id"/>'].formId, <xsl:value-of select="//client-post-back"/>, EsriControls.processPostBack);</xsl:attribute>
          </xsl:if>
          <xsl:if test="$paramStyle != ''">
            <xsl:attribute name="style">width:100%; <xsl:value-of select="$paramStyle" /></xsl:attribute>
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
    </xsl:choose>
  </xsl:template>

  <!-- ============================== -->
  <!-- Process the Color Chooser Node -->
  <!-- ============================== -->
  <xsl:template name="processColorNode">
    <xsl:param name="paramNode"/>
    <xsl:param name="paramStyle"/>

    <xsl:variable name="val" select="value"/>

    <xsl:element name="input">
      <xsl:attribute name="type">HIDDEN</xsl:attribute>
      <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
      <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
      <xsl:if test="$val != ''">
        <xsl:attribute name="value"><xsl:value-of select="$val"/></xsl:attribute>
      </xsl:if>
    </xsl:element>

    <xsl:element name="input">
      <xsl:attribute name="type">BUTTON</xsl:attribute>
      <xsl:attribute name="id">but_<xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
      <xsl:if test="$paramStyle != ''">
        <xsl:attribute name="style"><xsl:value-of select="$paramStyle" /></xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">esriToolDefault</xsl:attribute>
      <xsl:attribute name="style">background-color:rgb(<xsl:value-of select="$val"/>); width:50px;</xsl:attribute>
      <xsl:attribute name="onclick">EsriEditingUtils.showColorChooser('<xsl:value-of select="$paramNode/display-name"/>', '<xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/>', 'but_<xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/>'); return false;</xsl:attribute>
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>