<%@taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@taglib uri="http://www.esri.com/adf/web" prefix="a"%>

<f:subview id="editVersionSubview">
<h:panelGrid columns="1" styleClass="gridShow">
	<h:outputText id="selectversion" value="#{mapContext.attributes.mapEditor.selectVersionLabel}"></h:outputText>
	<h:selectOneMenu id="selectEditVersionId" value="#{mapContext.attributes.mapEditor.version}" immediate="true">
		<f:selectItems value="#{mapContext.attributes.mapEditor.versions}" />
	</h:selectOneMenu>

	<a:button id="startEditing" mapId="map1" type="button" value="#{mapContext.attributes.mapEditor.startEditingLabel}" 
	onclick="refreshEditorRequest('startEditing','startEditing');" serverAction="#{mapContext.attributes.mapEditor.refresh}" />
</h:panelGrid>
</f:subview>