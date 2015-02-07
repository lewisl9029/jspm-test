import angular from 'angular';
import template from './home.html!text';

//function name gets mangled even with --no-mangle flag
let homeController = function HomeController() {

};

let home = angular.module('jspmTest.views.home', [])
  .config(function config($stateProvider) {
    $stateProvider.state('app.home', {
      url: '/home',
      views: {
        'content': {
          template: template,
          controller: homeController.name + ' as vm'
        }
      }
    });
  })
  .controller(homeController.name, homeController);

export default home;
