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

import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getMapControl;

import java.io.IOException;

import javax.faces.context.FacesContext;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.esri.adf.web.ags.data.AGSMapFunctionality;
import com.esri.adf.web.ags.data.AGSMapResource;
import com.esri.adf.web.data.GISResource;
import com.esri.adf.web.data.MapFunctionality;
import com.esri.adf.web.data.WebContext;
import com.esri.adf.web.faces.component.MapControl;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXUtil;
import com.esri.adf.web.templates.ajax.AjaxCommand;
import com.esri.adf.web.util.XMLUtil;
import com.esri.arcgisws.MapLayerInfo;

public class CopyrightCommand implements AjaxCommand {

  private static final long serialVersionUID = 1L;

  public void handleAjaxRequest(FacesContext context) {
    MapControl mc = getMapControl(context);
    WebContext webContext = mc.getWebMap().getWebContext();
    GISResource[] resources = webContext.getResources().values().toArray(new GISResource[0]);
    Document xmlDoc = XMLUtil.newDocument();

    Element root = XMLUtil.createElement(xmlDoc, "copyright-info", null, null);
    for (int i = 0; i < resources.length; i++) {
      if (resources[i] instanceof AGSMapResource) {
        AGSMapResource agsRes = (AGSMapResource) resources[i];
        Element mapEl = XMLUtil.createElement("resource", null, root);
        XMLUtil.createElement("alias", agsRes.getAlias(), mapEl);
        XMLUtil.createElement("map-name", agsRes.getMapName(), mapEl);
        XMLUtil.createElement("end-point-url", agsRes.getEndPointURL(), mapEl);

        AGSMapFunctionality mapFunc = (AGSMapFunctionality) agsRes
            .getFunctionality(MapFunctionality.FUNCTIONALITY_NAME);

        MapLayerInfo[] infos = mapFunc.getLayerInfos();
        Element layersEl = XMLUtil.createElement("layers", null, mapEl);
        for (int j = 0; j < infos.length; j++) {
          Element layerEl = XMLUtil.createElement("layer", null, layersEl);
          XMLUtil.createElement("name", infos[j].getName(), layerEl);
          XMLUtil.createElement("id", String.valueOf(infos[j].getLayerID()), layerEl);
          XMLUtil.createElement("copyright-text", infos[j].getCopyrightText(), layerEl);
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
