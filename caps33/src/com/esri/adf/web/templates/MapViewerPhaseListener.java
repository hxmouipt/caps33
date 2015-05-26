/*
 Copyright © 2006 ESRI

 All rights reserved under the copyright laws of the United States
 and applicable international laws, treaties, and conventions.

 You may freely redistribute and use this sample code, with or
 without modification, provided you include the original copyright
 notice and use restrictions.
 See use restrictions at /arcgis/developerkit/userestrictions.
 */

package com.esri.adf.web.templates;

import java.util.Map;
import java.util.Vector;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.component.UIComponent;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.faces.event.PhaseId;
import javax.faces.event.PhaseListener;

import org.w3c.dom.Document;

import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXResponseRenderer;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXUtil;

/**
 * <p>
 * A PhaseListener to process AJAX request from the mapping application.
 * </p>
 */
public class MapViewerPhaseListener implements PhaseListener {
  private static final long serialVersionUID = 1L;

  private static Logger logger = Logger.getLogger(com.esri.adf.web.templates.MapViewerPhaseListener.class.getName());

  private static String MAPVIEWER_AJAX = "mapViewerAjax";

  private static String FORM_ID = "formId";

  private static String AJAX_RESPONSE_RENDERER = "mapviewer.ajax.ResponseRenderer";

  /**
   * <p>
   * Implement PhaseListener.getPhaseId() method.
   * </p>
   */
  public PhaseId getPhaseId() {
    return PhaseId.INVOKE_APPLICATION;
  }

  /**
   * <p>
   * Implement PhaseListener.beforePhase(PhaseEvent) method.
   * </p>
   * <p>
   * Verify if request is to be processes by this PhaseListener. If so, setup objects. Initialize
   * {@link com.esri.adf.web.faces.renderkit.xml.ajax.AJAXResponseRenderer} object to render AJAX response.
   * </p>
   */
  @SuppressWarnings("unchecked")
  public void beforePhase(PhaseEvent phaseEvent) {
    FacesContext facesContext = phaseEvent.getFacesContext();
    ExternalContext externalContext = facesContext.getExternalContext();
    Map<String, String> paramMap = externalContext.getRequestParameterMap();

    // Verify if request is to be processed by this PhaseListener
    if (!MAPVIEWER_AJAX.equals(paramMap.get(MAPVIEWER_AJAX))) {
      return;
    }

    Map<String, Object> requestMap = externalContext.getRequestMap();

    try {
      String formId = paramMap.get(FORM_ID);
      UIComponent form = facesContext.getViewRoot().findComponent(formId);

      // Initialize ajax Response & write form info
      AJAXResponseRenderer responseRenderer = new AJAXResponseRenderer(facesContext, new Vector(), form);

      // Store responseRenderer in request scope
      requestMap.put(AJAX_RESPONSE_RENDERER, responseRenderer);
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Unable to process AJAX request", e);
    }
  }

  /**
   * <p>
   * Implement PhaseListener.afterPhase(PhaseEvent) method.
   * </p>
   * <p>
   * If request processed by this PhaseListener, render AJAX response using using
   * {@link com.esri.adf.web.faces.renderkit.xml.ajax.AJAXResponseRenderer} and write response using
   * {@link com.esri.adf.web.faces.renderkit.xml.ajax.AJAXUtil#writeResponse(FacesContext, Document)}. Set JSF flag
   * responseComplete to true, to return response to client.
   * </p>
   */
  @SuppressWarnings("unchecked")
  public void afterPhase(PhaseEvent phaseEvent) {
    FacesContext facesContext = phaseEvent.getFacesContext();
    ExternalContext externalContext = facesContext.getExternalContext();
    Map<String, String> paramMap = externalContext.getRequestParameterMap();

    // verify if request is to be processed by this PhaseListener
    if (!MAPVIEWER_AJAX.equals(paramMap.get(MAPVIEWER_AJAX))) {
      return;
    }

    Map<String, Object> requestMap = externalContext.getRequestMap();
    Document doc = null;

    try {
      // Render response
      AJAXResponseRenderer responseRenderer = (AJAXResponseRenderer) requestMap.get(AJAX_RESPONSE_RENDERER);
      doc = responseRenderer.renderResponse(facesContext);
      requestMap.remove(AJAX_RESPONSE_RENDERER);
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Unable to process AJAX request", e);
      doc = AJAXUtil.createErrorResponse("Unable to process AJAX request");
    } finally {
      try {
        AJAXUtil.writeResponse(facesContext, doc);
      } catch (Exception e) {
        logger.log(Level.SEVERE, "Unable to write AJAX response", e);
      }
      facesContext.responseComplete();
    }
  }
}