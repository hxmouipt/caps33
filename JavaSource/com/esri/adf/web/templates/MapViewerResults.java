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
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Logger;

import com.esri.adf.web.data.AddressCandidate;
import com.esri.adf.web.data.TocModel;
import com.esri.adf.web.data.TocNode;
import com.esri.adf.web.data.WebContext;
import com.esri.adf.web.data.WebContextInitialize;
import com.esri.adf.web.data.WebLayerInfo;
import com.esri.adf.web.data.query.QueryResult;
import com.esri.adf.web.data.results.ResultNode;
import com.esri.adf.web.data.results.WebResults;
import com.esri.adf.web.data.results.WebResultsObserver;
import com.esri.adf.web.data.results.WebResultsToc;
import com.esri.adf.web.templates.MapViewerResultContent.ContentType;

public class MapViewerResults extends TocModel implements WebContextInitialize, WebResultsObserver, Serializable {

  private static final long serialVersionUID = 1L;

  private static final Logger logger = Logger.getLogger(WebResultsToc.class.getName());

  protected static final String TOC_MODEL_TYPE = "MapViewerResults";

  List<TocNode> nodes = new ArrayList<TocNode>();

  WebResults results = new WebResults();

  ResultNode selectedResult = null;

  private HashMap<String, HashMap<WebLayerInfo, TocNode>> layers = new HashMap<String, HashMap<WebLayerInfo, TocNode>>();

  private int nextId = 0;

  /**
   * Default constructor. Registers <code>this</code> instance of <code>MapViewerResults</code> to a list of
   * {@link WebResults} observers.
   */
  public MapViewerResults() {
    results.addObserver(this);
  }

  public void init(WebContext context) {
    logger.fine(getTocModelType() + ".init");
    this.setResults(context.getWebResults());
  }

  public void destroy() {
  }

  @Override
  public String getTocModelType() {
    return TOC_MODEL_TYPE;
  }

  @Override
  public Collection<TocNode> getRootNodes() {
    return nodes;
  }

  public WebResults getResults() {
    return results;
  }

  /**
   * If <code>this.results</code> is already set, this method un-registers <code>this</code> as an observer on the
   * current <code>this.results</code>. Then, sets the <code>WebResults results</code> property and registers
   * <code>this</code> as an observer.
   * 
   * @param results
   */
  public void setResults(WebResults results) {
    logger.fine(getTocModelType() + ".setResults(" + results + ")");
    if (results == null) {
      return;
    }
    if (this.results != null) {
      this.results.removeObserver(this);
    }
    this.results = results;
    this.results.addObserver(this);
    reload();
  }

  public ResultNode getSelectedResult() {
    return selectedResult;
  }

  /**
   * @param selectedResult
   */
  public void setSelectedResult(ResultNode selectedResult) {
    this.selectedResult = selectedResult;
  }

  /**
   * Re-builds the list of <code>TocNode</code>s from <code>result.getResultNodes()</code>.
   */
  public void reload() {
    nodes.clear();
    layers.clear();
    selectedResult = null;
    List<ResultNode> resultNodes = results.getResultNodes();
    for (int i = 0; i < resultNodes.size(); i++) {
      nodes.add(createTocNode(resultNodes.get(i), null));
    }
  }

  public void webResultsUpdate(WebResults results, int updateType, ResultNode affectedNode, Object args) {

    if (affectedNode == null) {
      reload();
      return;
    }

    switch (updateType) {
      case WebResultsObserver.RESULT_ADDED:
        if (!IdentifyResult.isIdentifyResult(affectedNode)) {
          nodes.add(0, createTocNode(affectedNode, null));
        }
        return;
      case WebResultsObserver.RESULT_REMOVED:
        removeResult(affectedNode);
        checkSelectedResult();
        return;
      case WebResultsObserver.RESULT_MODIFIED: // (e.g. GP async)
        TocNode tocnode = getTocNodeContainingResult(affectedNode);
        if (tocnode == null) {
          reload();
        } else {
          tocnode.getChildren().clear();
          createChildTocNodes(affectedNode, tocnode);
          checkSelectedResult();
        }
        return;
      case WebResultsObserver.RESULT_REPLACED: // (e.g. GP re-execute)
        if (args == null || !(args instanceof ResultNode)) {
          reload();
        } else {
          ResultNode replacenode = (ResultNode) args;
          tocnode = getTocNodeContainingResult(replacenode);
          if (tocnode == null) {
            reload();
          } else {
            nodes.set(nodes.indexOf(tocnode), createTocNode(affectedNode, null));
            checkSelectedResult();
          }
        }
        return;
      default:
        reload();
        return;
    }
  }

  @Override
  public boolean isShowOpenResultLink() {
    return results.isShowOpenResultLink();
  }

  private TocNode getTocNodeContainingResult(ResultNode result) {
    if (result == null) {
      return null;
    }

    for (TocNode tnode : nodes) {
      MapViewerResultContent content = (MapViewerResultContent) tnode.getContent();
      ResultNode rnode = content.getResult();
      if (rnode == result) {
        return tnode;
      }
    }
    return null;
  }

  private void removeResult(ResultNode result) {
    if (result == null) {
      return;
    }

    for (TocNode tnode : nodes) {
      MapViewerResultContent content = (MapViewerResultContent) tnode.getContent();
      ResultNode rnode = content.getResult();
      if (rnode == result) {
        nodes.remove(tnode);
        return;
      }
    }
  }

  private void checkSelectedResult() {
    if (selectedResult == null) {
      return;
    }

    ResultNode root = selectedResult;
    ResultNode parent;
    while ((parent = root.getParent()) != null) {
      root = parent;
    }

    for (TocNode tnode : nodes) {
      MapViewerResultContent content = (MapViewerResultContent) tnode.getContent();
      ResultNode rnode = content.getResult();
      if (rnode == root) {
        return;
      }
    }

    selectedResult = null;
  }

  /**
   * Creates a <code>TocNode</code> with the provided <code>ResultNode</code>. If <code>parentTocNode</code> is
   * null, a root level <code>TocNode</code> is created to represent an entirely new set of results for a given query.
   * <p>
   * If <code>parentTocNode</code> is not null, the <code>ResultNode</code> can either be a <code>String</code>
   * message stating no results were found, or it will contain the data about the query result. If there are no results,
   * a child <code>TocNode</code> is attached to the root with the <code>String</code> message as its text value.
   * <p>
   * If results are present, they are grouped by an intermediate <code>TocNode</code> keyed by the
   * <code>com.esri.adf.web.data.WebLayerInfo</code> contained by the <code>ResultNode</code>. The result
   * <code>TocNode</code> is then attached as a child of the <code>WebLayerInfo</code> keyed <code>TocNode</code>.
   * <p>
   * Lastly, another <code>TocNode</code> is attached the result child node and displays as set of details for the
   * result (key-value pairs).
   * 
   * @param result
   * @param parentTocNode
   */
  private TocNode createTocNode(ResultNode result, TocNode parentTocNode) {

    TocNode tocnode;
    if (parentTocNode == null) { // is a root node
      ContentType type = ContentType.DEFAULT;
      if (result.getChildren().size() > 0) {
        Object firstChild = result.getChildren().get(0).getResult();
        if (firstChild instanceof QueryResult || firstChild instanceof AddressCandidate) {
          type = ContentType.ROOT;
        }
      }

      MapViewerResultContent content = new MapViewerResultContent(result, this, true, type);
      tocnode = new TocNode(content, nextId++);
      tocnode.setExpanded(true);

    } else { // is a result node

      TocNode layerNode = null;
      String rootKey = parentTocNode.getKey();

      if (result.getResult() instanceof QueryResult && ((QueryResult) result.getResult()).getLayer() != null) {
        // handle grouping of QueryResult instances by each WebLayerInfo
        TocNode resultParentNode = parentTocNode;

        WebLayerInfo layerInfo = ((QueryResult) result.getResult()).getLayer();
        MapViewerResultContent layerContent;

        // cache references to all WebLayerInfo so results can be grouped
        if (!layers.containsKey(rootKey)) {
          layers.put(rootKey, new HashMap<WebLayerInfo, TocNode>());
        }

        if (!layers.get(rootKey).containsKey(layerInfo)) {
          layerContent = new MapViewerResultContent(result, this, false, ContentType.LAYER);
          layerNode = parentTocNode.addChild(layerContent);
          layers.get(rootKey).put(layerInfo, layerNode);
        } else {
          layerNode = layers.get(rootKey).get(layerInfo);
          layerContent = (MapViewerResultContent) layerNode.getContent();
        }

        resultParentNode = layerNode;
        resultParentNode.setExpanded(false);
        layerContent.setChildCount(layerContent.getChildCount() + 1);

        MapViewerResultContent resultContent = new MapViewerResultContent(result, this, false, ContentType.RESULT);
        tocnode = resultParentNode.addChild(resultContent);

        if (result.getDetails() != null && !result.getDetails().isEmpty()) {
          // add a detail node as a child (leaf node)
          MapViewerResultContent detailContent = new MapViewerResultContent(result, this, false, ContentType.DETAIL);
          tocnode.addChild(detailContent).setExpanded(false);
        }
      } else if (result.getResult() instanceof AddressCandidate) {
        MapViewerAddressResultContent resultContent = new MapViewerAddressResultContent(result, this);
        tocnode = parentTocNode.addChild(resultContent);
      } else {
        // since its not a QueryResult, we don't want introduce any grouping...
        MapViewerResultContent emptyContent = new MapViewerResultContent(result, this, false, ContentType.DEFAULT);
        tocnode = parentTocNode.addChild(emptyContent);
        parentTocNode.setExpanded(true);
      }

      tocnode.setExpanded(false);
    }

    createChildTocNodes(result, tocnode);
    return tocnode;
  }

  /**
   * @param result
   * @param tocNode
   */
  private void createChildTocNodes(ResultNode result, TocNode tocNode) {
    List<ResultNode> childrenResults = result.getChildren();
    if (childrenResults != null) {
      for (ResultNode rnode : childrenResults) {
        createTocNode(rnode, tocNode);
      }
    }
  }
}

class MapViewerAddressResultContent extends MapViewerResultContent {
  private static final long serialVersionUID = 1L;

  public MapViewerAddressResultContent(ResultNode result, MapViewerResults toc) {
    super(result, toc, false, ContentType.RESULT);
  }

  @Override
  public String getText() {
    String text = "contentType=" + getContentType() + KEY_DELIM;
    text += "resultId=" + (result.getResult()) + KEY_DELIM;
    text += result.getDisplayName();
    return text;
  }
}
