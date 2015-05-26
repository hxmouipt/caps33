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
import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getWebContext;

import java.io.IOException;

import javax.faces.context.FacesContext;

import org.w3c.dom.Document;

import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXUtil;
import com.esri.adf.web.templates.ajax.AjaxCommand;
import com.esri.adf.web.util.XMLUtil;

public class ClearIdentifyResultCommand implements AjaxCommand {

  private static final long serialVersionUID = 1L;

  public void handleAjaxRequest(FacesContext context) {
    Document xmlDoc = XMLUtil.newDocument();
    getIdentifyResult(getWebContext(context)).setLastIdentifyResult(null);
    XMLUtil.createElement(xmlDoc, "result-cleared", String.valueOf("true"), null);
    try {
      AJAXUtil.writeResponse(context, xmlDoc);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
