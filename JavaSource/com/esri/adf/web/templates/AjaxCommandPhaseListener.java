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

import static com.esri.adf.web.templates.ajax.MapViewerAjaxUtil.isAjaxCommand;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.faces.event.PhaseId;
import javax.faces.event.PhaseListener;

import com.esri.adf.web.templates.ajax.AjaxCommand;
import com.esri.adf.web.templates.ajax.MapViewerAjaxUtil;

public class AjaxCommandPhaseListener implements PhaseListener {

  protected Logger logger = Logger.getLogger(AjaxCommandPhaseListener.class.getName());

  private static final long serialVersionUID = 1L;

  public void afterPhase(PhaseEvent event) {

  }

  public void beforePhase(PhaseEvent event) {
    FacesContext c = event.getFacesContext();
    if (isAjaxCommand(c)) {
      AjaxCommand bean = MapViewerAjaxUtil.getAjaxCommandBean(c);
      if (bean != null) {
        bean.handleAjaxRequest(c);
      } else {
        logger.log(Level.WARNING, "AjaxCommand class is null, cannont handle ajax request.");
      }
      c.responseComplete();
    }
  }

  public PhaseId getPhaseId() {
    return PhaseId.INVOKE_APPLICATION;
  }

}
