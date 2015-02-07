System.config({
  "paths": {
    "*": "*.js",
    "app/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.12",
    "ionic": "github:driftyco/ionic-bower@1.0.0-beta.14",
    "remotestorage.js": "github:remotestorage/remotestorage.js@0.11.1",
    "text": "github:systemjs/plugin-text@0.0.2",
    "github:angular-ui/ui-router@0.2.13": {
      "angular": "github:angular/bower-angular@1.3.12"
    },
    "github:angular/bower-angular-animate@1.3.12": {
      "angular": "github:angular/bower-angular@1.3.12"
    },
    "github:angular/bower-angular-sanitize@1.3.12": {
      "angular": "github:angular/bower-angular@1.3.12"
    },
    "github:driftyco/ionic-bower@1.0.0-beta.14": {
      "angular": "github:angular/bower-angular@1.3.12",
      "angular-animate": "github:angular/bower-angular-animate@1.3.12",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.3.12",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.13",
      "css": "github:systemjs/plugin-css@0.1.0"
    }
  }
});

