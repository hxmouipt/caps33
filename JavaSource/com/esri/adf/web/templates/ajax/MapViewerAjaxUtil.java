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

import static com.esri.adf.web.templates.ajax.AjaxCommand.AJAX_COMMAND;
import static com.esri.adf.web.templates.ajax.AjaxCommand.AJAX_COMMAND_BEAN_ID;

import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import com.esri.adf.web.data.WebContext;
import com.esri.adf.web.faces.component.MapControl;
import com.esri.adf.web.templates.IdentifyResult;

public class MapViewerAjaxUtil {

  protected static Logger logger = Logger.getLogger(MapViewerAjaxUtil.class.getName());

  /**
   * Checks for request parameter AjaxCommand.AJAX_COMMAND. Returns true if parameter key is present and its value is
   * equal to the key.
   * 
   * @param context
   */
  public static boolean isAjaxCommand(FacesContext context) {
    boolean isAjaxCommand = false;

    Map<String, String> rp = getRequestParameterMap(context);
    if (rp.containsKey(AjaxCommand.AJAX_COMMAND)) {
      isAjaxCommand = rp.get(AJAX_COMMAND).equals(AJAX_COMMAND);
    }

    return isAjaxCommand;
  }

  /**
   * Instantiates a ValueBinding for the managed bean id found in the request parameters.
   * 
   * @param context
   * @throws NullPointerException
   * @throws ClassCastException
   */
  public static AjaxCommand getAjaxCommandBean(FacesContext context) throws NullPointerException, ClassCastException {
    String beanId = getAjaxCommandBeanId(context);
    AjaxCommand ac = null;
    if (beanId == null) {
      throw new NullPointerException("Ajax request encountered a null bean id.");
    }

    try {
      ac = (AjaxCommand) context.getApplication().createValueBinding("#{" + beanId + "}").getValue(context);
    } catch (ClassCastException e) {
      logger.log(Level.WARNING, "Bean with id \"" + beanId
          + "\" does not implment com.esri.adf.web.tempaltes.ajax.AjaxCommand");
    } catch (Exception e) {
      logger.log(Level.WARNING, "Exception while getting bean with id \"" + beanId + "\"." + e);
    }

    return ac;
  }

  /**
   * Retrieves the AJAX command bean id from the FacesContext request parameter map. Returns null if command bean id key
   * is not present.
   * 
   * @param context
   */
  public static String getAjaxCommandBeanId(FacesContext context) {
    Map<String, String> rp = getRequestParameterMap(context);
    String beanName = null;

    if (!rp.containsKey(AJAX_COMMAND_BEAN_ID)) {
      logger.log(Level.WARNING, "Command bean name key(\"" + AJAX_COMMAND_BEAN_ID
          + "\") not found in request parameters.");
    } else {
      beanName = rp.get(AJAX_COMMAND_BEAN_ID);
      logger.log(Level.INFO, "Comand bean name found: \"" + beanName + "\".");
    }

    return beanName;
  }

  /**
   * Returns the request parameter map found in the FacesContext
   * 
   * @param context
   */
  @SuppressWarnings("unchecked")
  public static Map<String, String> getRequestParameterMap(FacesContext context) {
    return context.getExternalContext().getRequestParameterMap();
  }

  public static UIComponent getForm(FacesContext context) {
    return context.getViewRoot().findComponent(getRequestParameterMap(context).get("formId"));
  }

  public static MapControl getMapControl(FacesContext context) {
    Map<String, String> rp = getRequestParameterMap(context);
    UIComponent form = getForm(context);
    return (MapControl) form.findComponent(rp.get("mapId"));
  }

  @SuppressWarnings("unchecked")
  public static WebContext getWebContext(FacesContext context) {
    Map<String, Object> params = context.getExternalContext().getRequestMap();
    for (Object o : params.values()) {
      if (o instanceof WebContext)
        return (WebContext) o;
    }
    return null;
  }

  /**
   * Gets the IdentifyResult bean from the WebContext attributes list.
   * 
   * @param wc
   */
  public static IdentifyResult getIdentifyResult(WebContext wc) {
    if (wc != null)
      for (Object o : wc.getAttributes().values())
        if (o instanceof IdentifyResult)
          return (IdentifyResult) o;
    return null;
  }

  public static String getRequestParameterString(FacesContext context, String key, String defaultValue) {
    return getRequestParameterMap(context).containsKey(key) ? getRequestParameterMap(context).get(key) : defaultValue;
  }

  public static Integer getRequestParameterInteger(FacesContext context, String key, Integer defaultValue) {
    Integer i = defaultValue;
    try {
      i = new Integer(getRequestParameterMap(context).get(key));
    } catch (Exception e) {
      logger.log(Level.WARNING, "Exception caught while parsing integer from request parameters. " + e);
    }
    return i;
  }

  public static Double getRequestParameterDouble(FacesContext context, String key, Double defaultValue) {
    Double d = defaultValue;
    try {
      d = new Double(getRequestParameterMap(context).get(key));
    } catch (Exception e) {
      logger.log(Level.WARNING, "Exception caught while parsing integer from request parameters. " + e);
    }
    return d;
  }
}
