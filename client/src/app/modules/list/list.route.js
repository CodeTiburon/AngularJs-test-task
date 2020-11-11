import ListController            from './controllers/list.controller';

export default function listRouteConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('list', {
      url: '/fr',
      abstract: true,
      templateUrl: 'app/templates/default.jade',
      access: 'public',
      platform: 'all'
    })
    .state('list.collection', {
      url: '/list',
      templateUrl: 'app/modules/list/templates/list.jade',
      // controller: ListController,
      // controllerAs: 'listCtrl',
      access: 'public',
      platform: 'all'
    })
}
