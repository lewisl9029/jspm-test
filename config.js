System.config({
  "paths": {
    "*": "*.js",
    "app/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "remotestorage.js": "github:remotestorage/remotestorage.js@0.11.1"
  }
});
