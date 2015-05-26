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

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import org.w3c.dom.Element;

import com.esri.adf.web.data.WebContext;
import com.esri.adf.web.data.WebNorthArrow;
import com.esri.adf.web.faces.component.MapControl;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXRenderer;
import com.esri.adf.web.util.XMLUtil;

/**
 * <p>
 * Class implementing the {@link com.esri.adf.web.faces.renderkit.xml.ajax.AJAXRenderer} interface to render xml content
 * for elements on the rendered page.
 * </p>
 */
public class MapViewerElementsRenderer implements AJAXRenderer {
  private static final long serialVersionUID = 1L;

  private Logger logger = Logger.getLogger(com.esri.adf.web.templates.MapViewerElementsRenderer.class.getName());

  private String CONTEXT_ID = "mapContext";

  private String NORTHARROW_BEAN_ID = "webappNorthArrow";

  private WebNorthArrow northArrow;

  /**
   * <p>
   * Contruct a new MapViewerElementsRenderer object.
   * </p>
   * <p>
   * Create binding and get the WebNorthArrow and ScaleBarBean objects to get updated values.
   * </p>
   */
  public MapViewerElementsRenderer() {
    FacesContext facesContext = FacesContext.getCurrentInstance();

    try {
      WebContext context = (WebContext) facesContext.getApplication().createValueBinding("#{" + CONTEXT_ID + "}")
          .getValue(facesContext);
      northArrow = (WebNorthArrow) context.getAttribute(NORTHARROW_BEAN_ID);
    } catch (NullPointerException npE) {
      // ok no binding
    } catch (Exception e) {
      logger.log(Level.WARNING, "Unable to get NorthArrowBean", e);
    }
  }

  /**
   * See {@link com.esri.adf.web.faces.renderkit.xml.ajax.AJAXRenderer#getControlClass()}
   */
  public Class<MapControl> getControlClass() {
    return MapControl.class;
  }

  /**
   * See {@link com.esri.adf.web.faces.renderkit.xml.ajax.AJAXRenderer#getOriginalState(UIComponent)}
   */
  public Object getOriginalState(UIComponent component) {
    return null;
  }

  /**
   * See
   * {@link com.esri.adf.web.faces.renderkit.xml.ajax.AJAXRenderer#renderAjaxResponse(FacesContext, UIComponent, Object, boolean, Element)}
   */
  public void renderAjaxResponse(FacesContext context, UIComponent component, Object state, boolean isEventSource,
      Element parentElement) {
    try {
      Element mapViewer = XMLUtil.createElement("mapviewer-elements", null, parentElement);
      if (northArrow != null) {
        XMLUtil.createElement("north-arrow-url", northArrow.getImageUrl(), mapViewer);
      }
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Unable to encode MapViewerElements XML", e);
    }
  }
}
