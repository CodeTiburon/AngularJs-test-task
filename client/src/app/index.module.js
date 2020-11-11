/**
 * Application module
 */

import angular from 'angular';
angular.lowercase = angular.$$lowercase;

import queryString from 'query-string';
window.queryString = queryString;


import 'angular-ui-router';
import 'angular-cookies'
import 'angular-animate';
import 'angular-aria';
import 'angular-messages';
import 'angular-material/angular-material';
import 'angular-sanitize';
import 'angular-material/angular-material.css';


// Import CSS project modules
import './index.scss';

/* Import angular modules */
import './modules/list/list.module';

/* Import module configurations */
import indexRouteConfig from './index.route';

angular
  .module('app', [
    // Angular and third-party modules
    'ngAnimate', 'ngSanitize', 'ngMaterial', 'ui.router',
    // Application modules
    'app.list'
  ])
  .config(indexRouteConfig)
  .run($templateCache => {
    function requireAll(requireContext) {
      return requireContext.keys().map(val => {
        return {
          // tpl will hold the value of your html string because thanks to webpack "raw-loader" **important**
          tpl: requireContext(val),
          //name is just the filename
          name: val.substring(2)
        }
      });
    }

    let modules = requireAll(require.context("../", true, /\.jade$/));
    modules.map(val => $templateCache.put(val.name, val.tpl))
  });
