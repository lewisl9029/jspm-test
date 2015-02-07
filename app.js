import 'ionic';
import template from 'app.html!text';
import home from './views/home/home';

let app = angular.module('jspmTest', [
    'ionic',
    home.name
  ])
  .run(function run($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default
      // Remove this to show the accessory bar above the keyboard for form inputs
      if (window.cordova && window.cordova.plugins.Keyboard) {
        window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
      }
    });
  })
  .config(function config($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      template: template
    });
    $urlRouterProvider.otherwise('/app/home');
  });

export default app;
export function initialize() {
  angular.element(document)
    .ready(function bootstrap() {
      angular.bootstrap(document.querySelector('[data-jspm-app]'), [
        app.name
      ]);
    });
};
