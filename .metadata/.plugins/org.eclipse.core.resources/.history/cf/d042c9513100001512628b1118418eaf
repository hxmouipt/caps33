<%@taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@taglib uri="http://www.esri.com/adf/web" prefix="a"%>
<%@taglib uri="http://java.sun.com/jstl/core" prefix="c"%>

<f:subview id="settingsSubview">
<h:panelGroup>
<f:verbatim>
	<div id ="editSnappingRulesDiv"></div>
  <input id ="editconfig_snapEnabled" value="<c:out value="${mapContext.attributes.mapEditor.snapEnabled}"/>" style="display:none;"/>
</f:verbatim>
</h:panelGroup>

<h:panelGrid columns="3">
	<h:outputLabel value="#{mapContext.attributes.mapEditor.toleranceLabel}" />
	<f:verbatim>
		<input id="editconfig_snapTolerance" value="<c:out value="${mapContext.attributes.mapEditor.taskConfig.snapTolerance}"/>" style="width:40px" onchange="updateSettingsRequest('setSnapTolerance',this.value);"/>
	</f:verbatim>
	<h:outputLabel value="#{mapContext.attributes.mapEditor.pixelsLabel}" />
</h:panelGrid>

<h:panelGrid style="width:100%;" styleClass="esriWindowTitleBar">
	<h:outputText styleClass="esriWindowTitleText" value="#{mapContext.attributes.mapEditor.selectFeaturesLabel}" />
</h:panelGrid>

<h:panelGrid columns="2">
	<h:outputLabel value="#{mapContext.attributes.mapEditor.toleranceLabel}" />
	<h:panelGroup>
	<f:verbatim>
		<input id="editconfig_tolerance" value="<c:out value="${mapContext.attributes.mapEditor.taskConfig.tolerance}"/>" style="width:40px" onchange="updateSettingsRequest('setTolerance',this.value);"/>
	</f:verbatim>
	<h:outputLabel value="#{mapContext.attributes.mapEditor.pixelsLabel}" />
	</h:panelGroup>
	<h:outputLabel value="#{mapContext.attributes.mapEditor.maxCountLabel}" />
	<h:panelGroup>
	<f:verbatim>
		<input id="editconfig_maxSelectionCount" value="<c:out value="${mapContext.attributes.mapEditor.taskConfig.maxSelectionCount}"/>" style="width:40px" onchange="updateSettingsRequest('setMaxSelectionCount',this.value);"/>
	</f:verbatim>
	<h:outputLabel value="#{mapContext.attributes.mapEditor.featuresLabel}" />
	</h:panelGroup>
	<h:outputLabel id="selectionLable" value="#{mapContext.attributes.mapEditor.selectColorLabel}:" />
	<f:verbatim>
		<input id="editconfig_hlColor_button" type="button" onclick="EsriEditingUtils.showColorChooser('<c:out value="${mapContext.attributes.mapEditor.selectColorLabel}"/>', 'editconfig_hlColor', 'editconfig_hlColor_button');return false;" class="esriToolDefault" style="background-color: rgb(<c:out value="${mapContext.attributes.mapEditor.taskConfig.hlColor}"/>); width: 40px;" />
		<input id="editconfig_hlColor" value="<c:out value="${mapContext.attributes.mapEditor.taskConfig.hlColor}"/>" style="display:none" onclick="updateSettingsRequest('setHlColor',this.value);"/>		
	</f:verbatim>
	<h:outputLabel id="verticesLable" value="#{mapContext.attributes.mapEditor.verticesColorLabel}:" />
	<f:verbatim>
		<input id="editconfig_verticesColor_button" type="button" onclick="EsriEditingUtils.showColorChooser('<c:out value="${mapContext.attributes.mapEditor.verticesColorLabel}"/>', 'editconfig_verticesColor', 'editconfig_verticesColor_button');return false;" class="esriToolDefault" style="background-color: rgb(<c:out value="${mapContext.attributes.mapEditor.taskConfig.verticesColor}"/>); width: 40px;"/>
		<input id="editconfig_verticesColor" value="<c:out value="${mapContext.attributes.mapEditor.taskConfig.verticesColor}"/>" style="display:none" onclick="updateSettingsRequest('setVerticesColor',this.value);"/>
	</f:verbatim>
	<h:outputLabel id="snapTipsLable" value="#{mapContext.attributes.mapEditor.snapColorLabel}:" />
	<f:verbatim>
    <input id="editconfig_snapTipsColor_button" type="button" onclick="EsriEditingUtils.showColorChooser('<c:out value="${mapContext.attributes.mapEditor.snapColorLabel}"/>', 'editconfig_snapTipsColor', 'editconfig_snapTipsColor_button');return false;" class="esriToolDefault" style="background-color: rgb(<c:out value="${mapContext.attributes.mapEditor.taskConfig.snapTipsColor}"/>); width: 40px;"/>
		<input id="editconfig_snapTipsColor" value="<c:out value="${mapContext.attributes.mapEditor.taskConfig.snapTipsColor}"/>" style="display:none" onclick="updateSettingsRequest('setSnapTipsColor',this.value);"/>
	</f:verbatim>
</h:panelGrid>
<h:messages styleClass="error" />
</f:subview>
