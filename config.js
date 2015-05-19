System.config({
  "baseURL": "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "depCache": {
    "github:angular/bower-angular-animate@1.3.15/angular-animate": [
      "github:angular/bower-angular@1.3.15"
    ],
    "github:angular/bower-angular-sanitize@1.3.15/angular-sanitize": [
      "github:angular/bower-angular@1.3.15"
    ],
    "github:angular/bower-angular@1.3.15": [
      "github:angular/bower-angular@1.3.15/angular"
    ],
    "github:angular/bower-angular-animate@1.3.15": [
      "github:angular/bower-angular-animate@1.3.15/angular-animate"
    ],
    "github:angular/bower-angular-sanitize@1.3.15": [
      "github:angular/bower-angular-sanitize@1.3.15/angular-sanitize"
    ],
    "github:angular-ui/ui-router@0.2.10": [
      "github:angular-ui/ui-router@0.2.10/release/angular-ui-router"
    ],
    "github:systemjs/plugin-css@0.1.0": [
      "github:systemjs/plugin-css@0.1.0/css"
    ],
    "github:driftyco/ionic@1.0.0-rc.5/css/ionic.css!github:systemjs/plugin-css@0.1.0": [
      "github:systemjs/plugin-css@0.1.0"
    ],
    "github:driftyco/ionic@1.0.0-rc.5/js/ionic-angular": [
      "github:driftyco/ionic@1.0.0-rc.5/css/ionic.css!github:systemjs/plugin-css@0.1.0",
      "github:driftyco/ionic@1.0.0-rc.5/js/ionic",
      "github:angular/bower-angular@1.3.15",
      "github:angular/bower-angular-animate@1.3.15",
      "github:angular/bower-angular-sanitize@1.3.15",
      "github:angular-ui/ui-router@0.2.10"
    ],
    "github:driftyco/ionic@1.0.0-rc.5": [
      "github:driftyco/ionic@1.0.0-rc.5/js/ionic-angular"
    ],
    "app": [
      "github:driftyco/ionic@1.0.0-rc.5",
      "npm:angular-toastr@1.3.1"
    ],
    "npm:angular-toastr@1.3.1": [
      "npm:angular-toastr@1.3.1/dist/angular-toastr.tpls"
    ],
    "github:driftyco/ionic@1.0.0/css/ionic.css!github:systemjs/plugin-css@0.1.0": [
      "github:systemjs/plugin-css@0.1.0"
    ],
    "github:driftyco/ionic@1.0.0/js/ionic-angular": [
      "github:driftyco/ionic@1.0.0/css/ionic.css!github:systemjs/plugin-css@0.1.0",
      "github:driftyco/ionic@1.0.0/js/ionic",
      "github:angular/bower-angular@1.3.15",
      "github:angular/bower-angular-animate@1.3.15",
      "github:angular/bower-angular-sanitize@1.3.15",
      "github:angular-ui/ui-router@0.2.10"
    ],
    "github:driftyco/ionic@1.0.0": [
      "github:driftyco/ionic@1.0.0/js/ionic-angular"
    ]
  }
});

System.config({
  "map": {
    "angular-toastr": "npm:angular-toastr@1.3.1",
    "babel": "npm:babel-core@5.2.17",
    "babel-runtime": "npm:babel-runtime@5.2.17",
    "core-js": "npm:core-js@0.9.8",
    "driftyco/ionic": "github:driftyco/ionic@1.0.0-rc.5",
    "github:angular-ui/ui-router@0.2.10": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular/bower-angular-animate@1.3.15": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular/bower-angular-sanitize@1.3.15": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:driftyco/ionic@1.0.0-rc.5": {
      "angular": "github:angular/bower-angular@1.3.15",
      "angular-animate": "github:angular/bower-angular-animate@1.3.15",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.3.15",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.10",
      "css": "github:systemjs/plugin-css@0.1.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:angular-toastr@1.3.1": {
      "angular": "npm:angular@1.3.15"
    },
    "npm:angular@1.3.15": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.8": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

