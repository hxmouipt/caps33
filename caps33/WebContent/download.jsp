<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page contentType="text/html" pageEncoding="UTF-8"%>

<html>
  <head>
    <title>Download</title>
  </head>
  <body style="border:0px NONE;">
    <table width="100%" height="100%">
      <tbody>
        <tr>
          <td width="100%" height="100%">
            Download
          </td>
        </tr>
        <tr>
          <td align="right" width="100%" height="100%">
            <br />
            <a href="javascript:void(0);" onclick="window.parent.EsriUploadUtil.closeDownloadWindow()">Close Window</a>
          </td>
        </tr>
      <tbody>
    </table>
    <br />
    <br />

    <form id="f" action="download" method="POST" enctype="application/x-www-form-urlencoded" style="display:none;">
      <input type="hidden" name="type" value="xml" />
      <input type="text" id="downloadId" name="downloadId" size="80" />
      <input type="submit" value="Download" />
    </form>
    <script type="text/javascript" language="Javascript">
      document.getElementById("downloadId").value = "<%= request.getParameter("downloadId") %>";
      document.forms["f"].submit();
    </script>
  </body>
</html>