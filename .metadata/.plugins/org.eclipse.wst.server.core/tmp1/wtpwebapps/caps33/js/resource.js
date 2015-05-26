/*
COPYRIGHT 1995-2005 ESRI

TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
Unpublished material - all rights reserved under the 
Copyright Laws of the United States.

For additional information, contact:
Environmental Systems Research Institute, Inc.
Attn: Contracts Dept
380 New York Street
Redlands, California, USA 92373

email: contracts@esri.com
*/

var Res = new function() {
  this.base = new Array();

  this.base["Tasks"] = "Tasks";
  this.base["Results"] = "Results";
  this.base["Result Details"] = "Result Details";
  this.base["Map Contents"] = "Map Contents";
  this.base["Navigation"] = "Navigation";
  this.base["Map Overview"] = "Map Overview";

  this.base["Actions"] = "Actions";
  
  //Custom identify
  this.base["add_to_results"] = "add to results";
  this.base["no_results"] = "No Results!";
  this.base["no_results_desc"] = "This location returned no results.";
  this.base[""] = "";
  this.base[""] = "";
  this.base[""] = "";

  this.getString = function(s) { return this.base[s]; }
}