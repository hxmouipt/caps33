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

import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getForm;
import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getIdentifyResult;
import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getMapControl;
import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getRequestParameterString;
import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.getWebContext;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.faces.context.FacesContext;

import org.w3c.dom.Document;

import com.esri.adf.web.data.WebContext;
import com.esri.adf.web.data.query.LayerDefinition;
import com.esri.adf.web.data.query.QueryResult;
import com.esri.adf.web.data.results.ResultDefinition;
import com.esri.adf.web.data.results.ResultNode;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXResponseRenderer;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXUtil;
import com.esri.adf.web.templates.IdentifyResult;
import com.esri.adf.web.templates.MapViewerUtil;
import com.esri.adf.web.templates.ajax.AjaxCommand;
import com.esri.adf.web.util.XMLUtil;

public class AddIdentifyToResultsCommand implements AjaxCommand {

  private static final long serialVersionUID = 1L;

  public static String IDENTIFY_RESULT_ID_KEY = "identifyResultId";

  public void handleAjaxRequest(FacesContext context) {
    AJAXResponseRenderer ajaxRenderer;
    Document xmlDoc = null;
    boolean success = false;

    ajaxRenderer = getAjaxResponseRenderer(context);
    success = addIdentifyResultToWebResults(context);

    if (ajaxRenderer != null) {
      try {
        xmlDoc = ajaxRenderer.renderResponse(context);
      } catch (Exception e) {
        e.printStackTrace();
        xmlDoc = XMLUtil.newDocument();
      }
    } else {
      xmlDoc = XMLUtil.newDocument();
    }

    // append the rest to the ajaxRender stuff
    XMLUtil.createElement(xmlDoc, "result-added", String.valueOf(success), xmlDoc.getDocumentElement());

    try {
      AJAXUtil.writeResponse(context, xmlDoc);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private static boolean addIdentifyResultToWebResults(FacesContext context) {
    boolean success = false;
    String id = getRequestParameterString(context, IDENTIFY_RESULT_ID_KEY, null);
    if (id != null) {
      WebContext mwContext = getWebContext(context);
      IdentifyResult identifyResult = getIdentifyResult(mwContext);
      if (identifyResult != null && identifyResult.getLastIdentifyResult() != null) {
        ResultNode resultNode = identifyResult.getResultNodeByQueryResultId(id);
        if (resultNode != null) {
          List<QueryResult> results = new ArrayList<QueryResult>(1);
          results.add((QueryResult) resultNode.getResult());
          ResultDefinition definition = getResultDefinition((QueryResult) resultNode.getResult());
          definition.setGraphicsResource(mwContext.getDefaultGraphicsResource());
          identifyResult.getResults().addQueryResults(results, definition);
          success = true;
        }
      }
    }
    return success;
  }

  private static ResultDefinition getResultDefinition(QueryResult result) {
    Map<String, String> actionMethodNames;
    List<LayerDefinition> layerDefinitions;
    ResultDefinition rd;

    actionMethodNames = new HashMap<String, String>();
    if (result.getHighlightGeometry() != null) {
      actionMethodNames.put(MapViewerUtil.getResourceString("WebResultAction.zoom"), "zoom");
    }

    layerDefinitions = new ArrayList<LayerDefinition>();
    if (result.getLayerDefinition() != null) {
      layerDefinitions.add(result.getLayerDefinition());
    }

    rd = new ResultDefinition();
    rd.setHeader(MapViewerUtil.getResourceString("IdentifyResult.identifyResult"));
    rd.setDisplayNameMethodName("getName");
    rd.setDetailsMethodName("getDetails");
    rd.setActionMethodNames(actionMethodNames);
    rd.setShowInfoWindow(true);
    rd.setLayerDefinitions(layerDefinitions);
    return rd;
  }

  private static AJAXResponseRenderer getAjaxResponseRenderer(FacesContext context) {
    AJAXResponseRenderer ajaxRenderer = null;
    Vector<String> eventSourceIds = new Vector<String>();
    eventSourceIds.add(getMapControl(context).getId());

    try {
      ajaxRenderer = new AJAXResponseRenderer(context, eventSourceIds, getForm(context));
    } catch (Exception e) {
      e.printStackTrace();
    }
    return ajaxRenderer;
  }

}
