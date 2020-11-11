/*global angular, queryString, mobileDetect, moment*/

export default function indexRouterConfig($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider
    .state('main', {
      url: '/fr',
      abstract: true,
      templateUrl: 'app/templates/default.jade',
      access: 'public',
      platform: 'all'
    })
    .state('main.home', {
      url: '',
      access: 'public',
      platform: 'all',
    });


  $urlRouterProvider.otherwise($injector => {
    let
      $state = $injector.get('$state'),
      $window = $injector.get('$window'),
      params = queryString.parse($window.location.search);

    if (params.hasOwnProperty('route')) {
      let route = params.route;
      delete params.route;

      $window.location.href = `/${$state.href(route, params)}`;
    } else if (params.hasOwnProperty('platform')) {
      delete params.platform;
    } else {
      $state.go('main.home');
    }
  });
}
