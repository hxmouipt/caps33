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
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="src"><xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@default-image"/></xsl:attribute>
                            <xsl:attribute name="onmouseover">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@hover-image"/>';</xsl:attribute>
                            <xsl:attribute name="onmousedown">EsriUtils.getEventSource(event).src = '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@selected-image"/>';</xsl:attribute>
                            <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', <xsl:value-of select="$actionNode/action-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, null, null, '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@default-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@hover-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@selected-image"/>', '<xsl:value-of select="$contextpath" /><xsl:value-of select="$actionNode/action-properties/@disabled-image"/>'); return false;
                            </xsl:attribute>
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
                            <xsl:attribute name="onclick">createPrintMap('<xsl:value-of select="$taskId"/>','<xsl:value-of select="//map-id"/>','<xsl:value-of select="$taskActionId"/>', <xsl:value-of select="$actionNode/action-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>)</xsl:attribute>                       
                            <!--
                        <xsl:attribute name="onclick">EsriControls.maps['<xsl:value-of select="//map-id"/>'].createCurrentToolItem('<xsl:value-of select="$taskActionId"/>', 'button_<xsl:value-of select="$taskActionId" />', 'EsriMapServerAction', <xsl:value-of select="$actionNode/action-properties/@show-loading-image"/>, <xsl:value-of select="//client-post-back"/>, null, null, 'esriToolDefault', 'esriToolHover', 'esriToolSelected', 'esriToolDisabled'); return false;</xsl:attribute>
                         -->
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
                            <xsl:attribute name="class">esriToolDisabled</xsl:attribute>
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
        <xsl:param name="layout"/>
        <xsl:variable name="val" select="value"/>
        <xsl:choose>
            <xsl:when test="$paramNode/read-only = 'true'"> 
                <xsl:element name="span">
                    <xsl:attribute name="style">margin-left:3px;margin-top:5px;</xsl:attribute>
                    <xsl:value-of select="$val"/>
                </xsl:element>
            </xsl:when>
            <xsl:when test="$paramNode/@type = 'TEXT'">             
                <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
                    <xsl:element name="span">
                        <xsl:attribute name="style">margin-left:3px;margin-right:5px;</xsl:attribute>
                        <xsl:value-of select="$paramNode/display-name"/>
                    </xsl:element>
                </xsl:if>
                <xsl:element name="input">
                    <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                    <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                    <xsl:if test="$val !=''">
                        <xsl:attribute name="value">
                            <xsl:value-of select="$val"/>
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:if test="$paramNode/@disabled = 'true'">
                        <xsl:attribute name="disabled">true</xsl:attribute>
                    </xsl:if>
                    <xsl:attribute name="style">width:130px;</xsl:attribute>
                    <!-- 
                    <xsl:if test="$paramNode/@name = 'mapScale' or $paramNode/@name = 'mapResolution' ">
                        <xsl:attribute name="size">16</xsl:attribute>
                    </xsl:if> 
                    -->
                </xsl:element>            
            </xsl:when>
            <xsl:when test="$paramNode/@type = 'CHECKBOX'">   
                <xsl:element name="input">
                    <xsl:attribute name="type">CHECKBOX</xsl:attribute>
                    <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                    <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                    
                    <xsl:if test="$paramNode/@disabled = 'true'">
                        <xsl:attribute name="disabled">true</xsl:attribute>
                    </xsl:if>
                    
                    <xsl:if test="$val = 'true'">
                        <xsl:attribute name="checked">checked</xsl:attribute>
                    </xsl:if>     
                </xsl:element>
                
                <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
                    <xsl:choose>
                        <xsl:when test="$paramNode/@name ='printMapScalebar' or $paramNode/@name ='printMapNorthArrow'">
                            <xsl:element name="span">
                                <xsl:choose>
                                    <xsl:when test="$paramNode/@disabled = 'true'">
                                        <xsl:attribute name="style">margin-right:5px;color:rgb(204,204,204);</xsl:attribute>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:attribute name="style">margin-right:5px;</xsl:attribute>
                                    </xsl:otherwise>
                                </xsl:choose>
                                <xsl:value-of select="$paramNode/display-name"/>
                            </xsl:element>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$paramNode/display-name"/>
                        </xsl:otherwise>
                    </xsl:choose>
                    
                </xsl:if>
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
                <xsl:choose>
                    <!-- #### print-task begin ####-->
                    <xsl:when test="$paramNode/display-name = 'ResultList'">        
                        <xsl:element name="div">
                            <xsl:attribute name="id">results-id</xsl:attribute>
                            <xsl:attribute name="style">margin-left:3px;border:thin solid rgb(200,200,200);overflow:auto;width:230px;height:90px;</xsl:attribute>
                            
                            <!-- generate a hidden control to hold values -->
                            <xsl:element name="input">
                                <xsl:attribute name="type">hidden</xsl:attribute>
                                <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                                <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                            </xsl:element>
                            
                            <xsl:choose>                                
                                <xsl:when test="count($paramNode/select/option) =0">
                                    <xsl:element name="span">
                                        <xsl:attribute name="style">color:rgb(204,204,204);</xsl:attribute>
                                        [no data]
                                    </xsl:element>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:for-each select="$paramNode/select/option">   
                                        <xsl:element name="input">
                                            <xsl:attribute name="type">CHECKBOX</xsl:attribute>
                                            <xsl:attribute name="name">result</xsl:attribute>
                                            <xsl:attribute name="onclick">resultChecked(<xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/>);</xsl:attribute>
                                            <xsl:attribute name="value"><xsl:value-of select="./@value"/></xsl:attribute>
                                            <xsl:attribute name="id">print-result<xsl:number value="position()"/></xsl:attribute>
                                        </xsl:element> <!-- input -->
                                        
                                        <xsl:value-of select="./@value"/>  
                                        <xsl:element name="br"></xsl:element>
                                        <!-- <xsl:value-of select="./@name"/> -->
                                    </xsl:for-each>
                                </xsl:otherwise>
                            </xsl:choose>                             
                            
                        </xsl:element><!-- div --> 
                    </xsl:when>
                    <!-- print-task end-->
                    <xsl:otherwise>
                        <xsl:if test="$layout = 'tabularLayout' or $layout = 'absoluteLayout'">
                            <xsl:element name="span">
                                <xsl:attribute name="style">margin-left:3px;margin-right:6px;</xsl:attribute>
                                <xsl:value-of select="$paramNode/display-name"/>
                            </xsl:element>
                        </xsl:if>
                        <xsl:element name="select">
                            <xsl:attribute name="name"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                            <xsl:attribute name="id"><xsl:value-of select="$taskId"/>_param_<xsl:value-of select="$paramNode/@name"/></xsl:attribute>
                            <xsl:if test="$paramNode/@disabled = 'true'">
                                <xsl:attribute name="disabled">true</xsl:attribute>
                            </xsl:if>
                            <xsl:attribute name="style">width:135px;</xsl:attribute>
                            <xsl:for-each select="$paramNode/select/option">
                                <xsl:element name="option">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="./@value"/>
                                    </xsl:attribute>
                                    
                                    <xsl:if test="$val = ./@value">
                                        <xsl:attribute name="selected">true</xsl:attribute>
                                    </xsl:if>
                                    <xsl:value-of select="./@name"/>
                                </xsl:element>
                            </xsl:for-each>
                        </xsl:element>
                    </xsl:otherwise>
                </xsl:choose>
                
            </xsl:when>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
