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

import java.util.Map;

import javax.faces.component.UIComponent;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.esri.adf.web.ags.data.gp.GPTaskResult;
import com.esri.adf.web.data.TocNode;
import com.esri.adf.web.data.results.ResultNode;
import com.esri.adf.web.faces.component.TocControl;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXUtil;
import com.esri.adf.web.templates.MapViewerResultContent;
import com.esri.adf.web.templates.ajax.AjaxCommand;
import com.esri.adf.web.util.ADFDownloadServlet;
import com.esri.adf.web.util.XMLUtil;

public class SaveGPTaskResultCommand implements AjaxCommand {

  private static final long serialVersionUID = 1L;

  static final String FORM_ID = "formId";

  static final String TOC_ID = "tocId";

  static final String GP_JOB_RESULTS_TASK_ID = "GPJobResults";

  @SuppressWarnings("unchecked")
  public void handleAjaxRequest(FacesContext facesContext) {
    try {
      ExternalContext externalContext = facesContext.getExternalContext();
      Map<String, String> paramMap = externalContext.getRequestParameterMap();

      UIComponent form = facesContext.getViewRoot().findComponent(paramMap.get(FORM_ID));
      TocControl tocControl = (TocControl) form.findComponent(paramMap.get(TOC_ID));

      String key = paramMap.get("key");
      TocNode tocNode = tocControl.getTocModel().findNode(key);
      MapViewerResultContent resultContent = (MapViewerResultContent) tocNode.getContent();
      ResultNode resultNode = resultContent.getResult();
      Object result = resultNode.getResult();
      GPTaskResult gpTaskResult = (GPTaskResult) result;
      if (gpTaskResult.getJobID() != null) {
        Document resultDoc = gpTaskResult.saveResult();
        byte[] data = XMLUtil.transform(resultDoc, null).getBytes();

        String id = ADFDownloadServlet.generateId();
        // webContext.getWebSession().setMimeData(id, data);
        externalContext.getSessionMap().put(id, data);

        Document doc = XMLUtil.newDocument();
        Element responseElement = XMLUtil.createElement(doc, "response", null, null);
        XMLUtil.createElement(doc, "content-type", "text/xml", responseElement);
        XMLUtil.createElement(doc, "download-id", id, responseElement);
        AJAXUtil.writeResponse(facesContext, doc);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
