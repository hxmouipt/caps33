<html>
<head>
<title>Login Page for ArcGIS Java ADF Templates</title>
</head>
<body bgcolor="white">
<form method="POST" action='<%= response.encodeURL("j_security_check") %>'>
<table width="100%" style="height:100%">
  <tr>
    <td align="center">
      <table border="0" cellspacing="5">
        <tr>
          <th align="right">Username:</th>
          <td align="left">
            <input type="text" name="j_username">
          </td>
        </tr>
        <tr>
          <th align="right">Password:</th>
          <td align="left">
            <input type="password" name="j_password">
          </td>
        </tr>
        <tr>
          <td align="right" colspan="2">
            <input name="submit" type="submit" value="Log In">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input name="reset" type="reset">
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</form>
</body>
</html>
