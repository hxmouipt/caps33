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

import java.io.Serializable;

import com.esri.adf.web.data.WebContext;
import com.esri.adf.web.data.WebContextInitialize;
import com.esri.adf.web.data.query.QueryResult;
import com.esri.adf.web.data.results.ResultNode;
import com.esri.adf.web.data.results.WebResults;
import com.esri.adf.web.data.results.WebResultsObserver;

public class IdentifyResult implements WebResultsObserver, WebContextInitialize, Serializable {

  private static final long serialVersionUID = 1L;

  protected WebResults results;

  protected ResultNode lastIdentifyResult;

  private static String identifyResultKey = "Identify";

  public IdentifyResult() {
  }

  public void webResultsUpdate(WebResults results, int updateType, ResultNode affectedNode, Object args) {
    if (updateType == WebResultsObserver.RESULT_ADDED && isIdentifyResult(affectedNode)) {
      lastIdentifyResult = affectedNode;
      results.removeResultNode(affectedNode);
    }
  }

  public void destroy() {
    if (results != null)
      results.removeObserver(this);
  }

  public void init(WebContext context) {
    this.setResults((WebResults) context.getAttribute("results"));
  }

  public ResultNode getLastIdentifyResult() {
    return lastIdentifyResult;
  }

  public void setLastIdentifyResult(ResultNode lastIdentifyResult) {
    this.lastIdentifyResult = lastIdentifyResult;
  }

  public static boolean isIdentifyResult(ResultNode node) {
    return node.getDisplayName().indexOf(identifyResultKey) >= 0;
  }

  public WebResults getResults() {
    return this.results;
  }

  public void setResults(WebResults results) {
    if (results == null) {
      return;
    }
    if (this.results != null) {
      this.results.removeObserver(this);
    }
    this.results = results;
    this.results.addObserver(this);
    this.lastIdentifyResult = null;
  }

  public ResultNode getResultNodeByQueryResultId(String id) {
    if (this.lastIdentifyResult != null)
      return findResultNode(this.lastIdentifyResult, id);
    return null;
  }

  private static ResultNode findResultNode(ResultNode root, String queryResultId) {
    if (contains(root, queryResultId))
      return root;
    for (ResultNode child : root.getChildren()) {
      ResultNode find = null;
      if ((find = findResultNode(child, queryResultId)) != null)
        return find;
    }
    return null;
  }

  private static boolean contains(ResultNode rn, String id) {
    return (rn.getResult() instanceof QueryResult && ((QueryResult) rn.getResult()).toString().equals(id));
  }

  public void setIdentifyResultKey(String key) {
    identifyResultKey = key;
  }
}
