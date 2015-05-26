/*
 Copyright © 2006 ESRI

 All rights reserved under the copyright laws of the United States
 and applicable international laws, treaties, and conventions.

 You may freely redistribute and use this sample code, with or
 without modification, provided you include the original copyright
 notice and use restrictions.
 See use restrictions at /arcgis/developerkit/userestrictions.
 */

package com.esri.adf.web.templates.ajax.command;

import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getIdentifyResult;
import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getMapControl;
import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getWebContext;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.context.FacesContext;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.esri.adf.web.data.WebContext;
import com.esri.adf.web.data.WebMap;
import com.esri.adf.web.data.geometry.WebPoint;
import com.esri.adf.web.data.query.QueryResult;
import com.esri.adf.web.data.results.ResultNode;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXUtil;
import com.esri.adf.web.templates.IdentifyResult;
import com.esri.adf.web.templates.ajax.AjaxCommand;
import com.esri.adf.web.util.XMLUtil;

public class IdentifyResultCommand implements AjaxCommand {

  private static final long serialVersionUID = 1L;

  protected static Logger logger = Logger.getLogger(IdentifyResultCommand.class.getName());

  public void handleAjaxRequest(FacesContext context) {
    WebContext wc = getWebContext(context);
    IdentifyResult ir = getIdentifyResult(wc);
    Document xmlDoc = XMLUtil.newDocument();
    Element root = XMLUtil.createElement(xmlDoc, "identify-results", null, null);
    if (ir != null && ir.getLastIdentifyResult() != null) {

      WebMap map = getMapControl(context).getWebMap();
      String dn = ir.getLastIdentifyResult().getDisplayName();

      try {
        // TODO: the following lines of code rely on the WebPoint.toString() return value to get the identify criteria
        // Once the ADF supports getting query criteria from WebResults, this code needs to be updated
        String xStr = dn.substring(dn.indexOf("[") + 1, dn.indexOf(", "));
        String yStr = dn.substring(dn.indexOf(", ") + 2, dn.indexOf("]"));

        NumberFormat nf = NumberFormat.getInstance();
        WebPoint mapPoint = new WebPoint(nf.parse(xStr).doubleValue(), nf.parse(yStr).doubleValue());
        WebPoint screenPoint = mapPoint.fromMapGeometry(map);

        Element pointEl = XMLUtil.createElement("point", null, root);
        pointEl.setAttribute("x", String.valueOf(screenPoint.getX()));
        pointEl.setAttribute("y", String.valueOf(screenPoint.getY()));
      } catch (ParseException e) {
        logger.log(Level.WARNING, "Unable to parse coordinates from result display name (" + dn + ")");
        logger.log(Level.WARNING, e.getMessage());
      }

      for (ResultNode node : ir.getLastIdentifyResult().getChildren()) {
        if (node.getResult() instanceof QueryResult) {
          QueryResult qr = (QueryResult) node.getResult();
          Element result = XMLUtil.createElement(xmlDoc, "result", null, root);
          XMLUtil.createElement("id", qr.toString(), result);
          XMLUtil.createElement("name", qr.getName(), result);
          XMLUtil.createElement("resource", qr.getLayer().getResource().getAlias(), result);
          XMLUtil.createElement("layer", qr.getLayer().getName(), result);

          if (node.getDetails() != null) {
            if (qr.getLayerDefinition() != null && qr.getLayerDefinition().getCalloutTemplate() != null) {
              XMLUtil.createElement("content", qr.getLayerDefinition().getCalloutTemplate(), result);
            }

            Element attrsEl = XMLUtil.createElement("attributes", null, result);
            for (String key : node.getDetails().keySet()) {
              Element attrEl = XMLUtil.createElement("attribute", null, attrsEl);
              attrEl.setAttribute("name", key);
              attrEl.setAttribute("value", (String) node.getDetails().get(key));
            }
          }
        }
      }
    }

    try {
      AJAXUtil.writeResponse(context, xmlDoc);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
