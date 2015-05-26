/*
 COPYRIGHT © 2006 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */

package com.esri.adf.web.templates;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import org.w3c.dom.Element;

import com.esri.adf.web.ags.data.gp.GPTaskResult;
import com.esri.adf.web.data.TocModel;
import com.esri.adf.web.data.results.ResultNode;
import com.esri.adf.web.data.results.WebResults;
import com.esri.adf.web.faces.component.TocControl;
import com.esri.adf.web.faces.renderkit.xml.ajax.AJAXRenderer;
import com.esri.adf.web.util.XMLUtil;

/**
 * <p>
 * AJAXRenderer to display Geoprocessing task results for gp task results. Renders
 * <code>&lt;gp-task-results-async&gt;</code> tag.
 * </p>
 */
public class GPAsyncTaskResultsRenderer implements AJAXRenderer {
  private static final Logger logger = Logger
      .getLogger(com.esri.adf.web.ags.faces.renderkit.xml.ajax.GPAsyncTaskResultsRenderer.class.getName());

  public Class<TocControl> getControlClass() {
    return com.esri.adf.web.faces.component.TocControl.class;
  }

  public Object getOriginalState(UIComponent component) {
    return null;
  }

  public void renderAjaxResponse(FacesContext context, UIComponent component, Object state, boolean isEventSource,
      Element parentElement) {
    TocModel tocModel = ((TocControl) component).getTocModel();
    if (!(tocModel instanceof MapViewerResults))
      return;

    try {
      WebResults results = ((MapViewerResults) tocModel).getResults();
      List<ResultNode> resultNodes = results.getResultNodes();
      Element gpAsyncElement = XMLUtil.createElement("gp-task-results-async", null, parentElement);
      XMLUtil.createElement("toc-id", component.getId(), gpAsyncElement);
      for (int i = 0; i < resultNodes.size(); i++) {
        Object result = (resultNodes.get(i)).getResult();
        if (result instanceof GPTaskResult) {
          GPTaskResult taskResult = (GPTaskResult) result;
          String jobID = taskResult.getJobID();
          if (jobID == null)
            continue;

          Element resultTag = XMLUtil.createElement("result", taskResult.getName(), gpAsyncElement);
          resultTag.setAttribute("job-id", jobID);
          resultTag.setAttribute("complete", String.valueOf(taskResult.isAsyncJobCompleted()));
        }
      }
    } catch (Exception e) {
      logger.log(Level.WARNING, "Unable to encode the GP task results.", e);
    }
  }
}