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
import java.util.ResourceBundle;

public class MapViewerUtil {

  private static String DEFAULT_RESOURCE_BUNDLE_LOCATION = "res/mapviewer";

  public static String getKeyValuePairsString(Map<String, Object> details, String valueDelimiter, String groupDelimiter) {
    String s = "";
    if (details != null) {
      for (String key : details.keySet())
        s += key + valueDelimiter + details.get(key) + groupDelimiter;
    }

    return s.substring(0, s.lastIndexOf(groupDelimiter));
  }

  public static String getResourceString(String key) {
    String data;
    try {
      ResourceBundle bundle = ResourceBundle.getBundle(DEFAULT_RESOURCE_BUNDLE_LOCATION);
      data = bundle.getString(key);
    } catch (Exception e) {
      data = e.getMessage();
    }
    return data;
  }
}
