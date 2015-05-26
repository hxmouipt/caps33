/*
 Copyright © 2006 ESRI

 All rights reserved under the copyright laws of the United States
 and applicable international laws, treaties, and conventions.

 You may freely redistribute and use this sample code, with or
 without modification, provided you include the original copyright
 notice and use restrictions.
 See use restrictions at /arcgis/developerkit/userestrictions.
 */

package com.esri.adf.web.templates.task;

import com.esri.adf.web.data.tasks.TaskToolDescriptor;
import com.esri.adf.web.data.tasks.TaskUtils;
import com.esri.adf.web.faces.event.ClientActionArgs;
import com.esri.adf.web.faces.event.PointArgs;

public class MapToolsTaskInfo extends com.esri.adf.web.tasks.MapToolsTaskInfo {

  private static final long serialVersionUID = 1L;

  private static final String MAP_VIEWER_IDENTIFY_CLIENT_ACTION = "MapViewerIdentifyMapPoint";

  static {
    ClientActionArgs.addClientActionArgs(MAP_VIEWER_IDENTIFY_CLIENT_ACTION, PointArgs.class.getName());
  }

  public MapToolsTaskInfo() {
    TaskToolDescriptor panTool = (TaskToolDescriptor) TaskUtils.getToolDescriptor("pan", this);
    panTool.setClientAction("EsriMapContinuousPan");
    TaskToolDescriptor identifyTool = (TaskToolDescriptor) TaskUtils.getToolDescriptor("identify", this);
    identifyTool.setClientAction(MAP_VIEWER_IDENTIFY_CLIENT_ACTION);
  }

}
