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

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.faces.model.SelectItem;

import com.esri.adf.web.data.WebLayerInfo;
import com.esri.adf.web.data.query.QueryResult;
import com.esri.adf.web.data.results.ResultNode;
import com.esri.adf.web.faces.event.TocEvent;
import com.esri.adf.web.util.ADFSessionTimeoutFilter;

public class MapViewerResultContent extends com.esri.adf.web.data.TocNodeContent {

  private static final long serialVersionUID = 1L;

  protected ResultNode result;

  protected MapViewerResults toc;

  private List<SelectItem> items = new ArrayList<SelectItem>();

  private int childCount = 0;

  private boolean checked;

  private boolean disabled;

  public static enum ContentType {
    DEFAULT, ROOT, LAYER, RESULT, DETAIL
  }

  private ContentType contentType;

  public final String VALUE_DELIM = "|";

  public final String KEY_DELIM = ";";

  /**
   * @param result
   * @param toc
   * @param topLevelNode
   * @param type
   */
  public MapViewerResultContent(ResultNode result, MapViewerResults toc, boolean topLevelNode, ContentType type) {

    this.result = result;
    this.toc = toc;
    this.contentType = type == null ? ContentType.DEFAULT : type;
    this.checked = true;
    this.disabled = false;

    if (topLevelNode) {
      items.add(new SelectItem("_remove_", "Remove"));
    }

    List<String> actions = result.getActionNames();
    if (actions != null) {
      for (String action : actions) {
        items.add(new SelectItem(action, action));
      }
    }
  }

  @Override
  public List<SelectItem> getContextMenuItems() {
    if (contentType.equals(ContentType.LAYER)) {
      return null;
    }
    return items;
  }

  @Override
  public void handleContextMenuEvent(String contextMenuItemValue, TocEvent args) throws Exception {
    if ("_remove_".equals(contextMenuItemValue)) {
      toc.getResults().removeResultNode(result);
      return;
    }
    result.processAction(contextMenuItemValue);
  }

  @Override
  public void handleNodeEvent(TocEvent args) throws Exception {
  }

  @Override
  public String getText() {

    String text = "contentType=" + getContentType() + KEY_DELIM;
    if (contentType == ContentType.DETAIL) {
      text += getDetailsString();

    } else if (contentType == ContentType.LAYER) {
      String resultIds = "";
      WebLayerInfo layer = ((QueryResult) result.getResult()).getLayer();
      for (ResultNode child : result.getParent().getChildren()) {
        if (((QueryResult) child.getResult()).getLayer().equals(layer)) {
          resultIds += ((QueryResult) child.getResult()).toString() + VALUE_DELIM;
        }
      }
      if (resultIds.length() > 0) {
        resultIds = resultIds.substring(0, resultIds.lastIndexOf(VALUE_DELIM));
        text += "resultIds=" + resultIds + KEY_DELIM;
      }
      text += ((QueryResult) result.getResult()).getLayer().getName() + " (" + childCount + ")";

      // add the calloutTemplate for these details
      String resultTemplate = null;
      if (result.getResult() != null) {
        if (((QueryResult) result.getResult()).getLayerDefinition() == null) {
          resultTemplate = "default";
        } else {
          resultTemplate = ((QueryResult) result.getResult()).getLayerDefinition().getResultTemplate();
        }
      }
      
      String encodeTemp = "";
      try {
        if (resultTemplate != null) {
          encodeTemp = URLEncoder.encode(resultTemplate, ADFSessionTimeoutFilter.DEFAULT_CHARACTER_ENCODING);
          encodeTemp = encodeTemp.replaceAll("\\+", " ");
        }
      } catch (Exception ex) {
        ex.printStackTrace();
      }
      text += KEY_DELIM + "resultTemplate=" + encodeTemp + KEY_DELIM;
    } else if (contentType == ContentType.RESULT) {
      text += "resultId=" + (result.getResult()) + KEY_DELIM + result.getDisplayName();

    } else if (contentType == ContentType.ROOT) {
      int size = result.getChildren().size();
      if (size == 1 && ((result.getChildren().get(0)).getResult() instanceof String)) {
        size = 0;
      }

      String resultIds = "";
      for (ResultNode child : result.getChildren()) {
        resultIds += child.getResult().toString() + VALUE_DELIM;
      }
      if (resultIds.length() > 0) {
        resultIds = resultIds.substring(0, resultIds.lastIndexOf(VALUE_DELIM));
        text += "resultIds=" + resultIds + KEY_DELIM;
      }

      text += result.getDisplayName() + " (" + size + ")";

    } else {
      text = result.getDisplayName();

    }
    return text;
  }

  @Override
  public boolean isSelected() {
    return toc.getSelectedResult() == result;
  }

  @Override
  public boolean isCheckable() {
    return (contentType != ContentType.DETAIL && contentType != ContentType.DEFAULT);
  }

  @Override
  public boolean isUrl() {
    return false;
  }

  public ResultNode getResult() {
    return result;
  }

  public ContentType getContentType() {
    return contentType;
  }

  public void setContentType(ContentType type) {
    this.contentType = type;
  }

  public List<String> getActionNames() {
    return result.getActionNames();
  }

  /**
   * Builds a String representing key-value pairs delimited by the <code>VALUE_DELIM</code> and <code>KEY_DELIM</code>.
   */
  private String getDetailsString() {
    String text = new String();
    if (result.isHasDetails()) {
      // i'm details
      Map<String, Object> details = result.getDetails();
      for (String key : details.keySet()) {
        try {
          text += key + VALUE_DELIM + details.get(key) + KEY_DELIM;
        } catch (Exception e) {
          System.out.println(e + ":" + e.getMessage());
          e.printStackTrace();
        }
      }
    }
    return text.substring(0, text.length() - 1);
  }

  @Override
  public boolean isChecked() {
    return checked;
  }

  public void setChecked(boolean checked) {
    this.checked = checked;
  }

  @Override
  public boolean isDisabled() {
    return disabled;
  }

  public void setDisabled(boolean disabled) {
    this.disabled = disabled;
  }

  public void setChildCount(int childCount) {
    this.childCount = childCount;
  }

  public int getChildCount() {
    return this.childCount;
  }
}