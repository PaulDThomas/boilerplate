# ASUP Boiler plate

Add secrets to /public_html/ecrf/php2/app.info.json in the form

```
{
  "SiteName": "asup-boiler-plate",
  "SiteUrl": "http://asup.uk",
  "Database": {
    "Host": "localhost",
    "Name": "db_name",
    "Username": "db_user",
    "Pass": "db_pass"
  },
  "Secret": "secret_key"
}
```

To create a package build, you need to add these lines back into package.json

```
  "main": "dist/cjs/main.js",
  "module": "dist/main.js",
  "types": "dist/<packagename>.d.ts",
```
