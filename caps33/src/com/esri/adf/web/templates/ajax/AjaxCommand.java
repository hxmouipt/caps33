/*
 Copyright © 2006 ESRI

 All rights reserved under the copyright laws of the United States
 and applicable international laws, treaties, and conventions.

 You may freely redistribute and use this sample code, with or
 without modification, provided you include the original copyright
 notice and use restrictions.
 See use restrictions at /arcgis/developerkit/userestrictions.
 */

package com.esri.adf.web.templates.ajax;

import java.io.Serializable;

import javax.faces.context.FacesContext;

public interface AjaxCommand extends Serializable {

  public static final String AJAX_COMMAND = "ajaxCommand";

  public static final String AJAX_COMMAND_BEAN_ID = "ajaxCommandBeanId";

  public void handleAjaxRequest(FacesContext context);

}
