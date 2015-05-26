<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page contentType="text/html" pageEncoding="UTF-8"%>

<html>
  <head>
    <title>Upload</title>
    <script type="text/javascript" language="Javascript">
      function validate() {
        if (document.getElementById("upload").value == "") {
          alert("No file chosen.");
          return false;
        }
        return true;
      }
    </script>
  </head>
  <body>
    <% 
      if (request.getParameter("error") != null) {
        out.println("<span style=\"color:#f00;\">" + request.getParameter("error") + "</span><br />");
      }
    %>
    <form id="f" action="upload" method="POST" enctype="multipart/form-data">
      Choose File :
      <input type="hidden" name="requestPage" value="<%= request.getParameter("requestPage") %>" />
      <input type="hidden" name="successPage" value="<%= request.getParameter("successPage") %>" />
      <table>
        <tbody>
          <tr height="100%">
            <td>
              <input type="file" id="upload" name="upload" value='<%= request.getParameter("filename") %>' size="40" />
            </td>
          </tr>
          <tr>
            <td align="right">
              <br />
              <input type="submit" onclick="if (! validate()) return false;" value="Upload" />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </form>
  </body>
</html>