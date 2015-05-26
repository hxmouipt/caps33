<%@ page isErrorPage="true" %>
<%
java.util.ArrayList invalidSessions = (java.util.ArrayList) application.getAttribute("invalidSessions");
if (invalidSessions == null) {
  invalidSessions = new java.util.ArrayList();
  application.setAttribute("invalidSessions", invalidSessions);
}

String jsessionid = request.getSession().getId();
if (! invalidSessions.contains(jsessionid)) {
  invalidSessions.add(jsessionid);
}

session.invalidate();
System.out.println("Session invalidated...");
%>
<html>
<head><title>Error Page</title></head>
<body>
<h1>An error occurred while processing your request.</h1>
<h2>Your session has been terminated.</h2>
<%
Throwable t = (exception != null) ? exception : (Throwable)request.getAttribute("javax.servlet.error.exception");
if(t != null) {
	Throwable root = t;
	Throwable adfe = (root instanceof com.esri.adf.web.ADFException ? root : null);
	Throwable rt;
	while((rt = root.getCause()) != null) {
		root = rt;
		if(root instanceof com.esri.adf.web.ADFException)
			adfe = root;
	}
%>
<hr>
<h3>Root cause:</h3>
<pre>
<font color="red"><%= root %></font>
</pre>
<% if(adfe != null) { %>
<hr>
<h3>ADF Error Message:</h3>
<pre>
<font color="red"><%= adfe %></font>
</pre>
<% } %>
<h3>Root cause details:</h3>
<pre>
<% root.printStackTrace(new java.io.PrintWriter(out)); %>
</pre>
<hr>
<h3>Error Message:</h3>
<pre>
<font color="red"><%= t %></font>
</pre>
<h3>Error details:</h3>
<pre>
<% t.printStackTrace(new java.io.PrintWriter(out)); %>
</pre>
<% } %>
</body>
</html>
