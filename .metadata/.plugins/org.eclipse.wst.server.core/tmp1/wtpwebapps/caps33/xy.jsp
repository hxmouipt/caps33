<%@taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@taglib uri="http://www.esri.com/adf/web" prefix="a"%>
<%@taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<f:subview id="xySubview">
<f:verbatim>
	<table>
		<tr>
			<td><c:out value="${mapContext.attributes.mapEditor.typeLabel}"/></td>
			<td>
			<div id="type_XYWIN" />
			</td>
		</tr>
		<tr>
			<td>
			<div id="lastPoint_label_XYWIN" />
			</td>
			<td>
			<div id="lastPoint_XYWIN" />
			</td>
		</tr>
		<tr>
			<td>X:</td>
			<td><input id="xValue_XYWIN" value="" /></td>
		</tr>
		<tr>
			<td>Y:</td>
			<td><input id="yValue_XYWIN" value="" /></td>
		</tr>
	</table>
</f:verbatim>
<a:button id="continueEnterXY" mapId="map1" type="button" value="#{mapContext.attributes.mapEditor.continueLabel}" onclick="enterXYRequest('continueEnterXY','xValue_XYWIN','yValue_XYWIN');return false;"
	serverAction="#{mapContext.attributes.mapEditor.refresh}" />
<a:button id="enterFinalXY" mapId="map1" type="button" value="#{mapContext.attributes.mapEditor.finalLabel}" onclick="enterXYRequest('enterFinalXY','xValue_XYWIN','yValue_XYWIN');return false;"
	serverAction="#{mapContext.attributes.mapEditor.refresh}" />
</f:subview>
