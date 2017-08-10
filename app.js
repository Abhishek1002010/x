(function(){
'use strict';
angular.module('MenuApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  return {
    templateUrl: 'partials/found-items.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    transclude: true
  }
}

NarrowItDownController.$inject = ['MenuSearchService'];

function NarrowItDownController(MenuSearchService){
  var myCtrl = this;

  myCtrl.searchTerm = "";
  myCtrl.foundItems = [];
  myCtrl.loading = false;
  myCtrl.nothingFound = false;
  myCtrl.removeFoundItem = function (index) {
    myCtrl.foundItems.splice(index, 1);
  }
  myCtrl.getMenuItens = function () {
    if (!myCtrl.searchTerm) {
      myCtrl.foundItems = [];
      myCtrl.nothingFound = true;
      return;
    }
    myCtrl.nothingFound = false;
    myCtrl.loading = true;
    myCtrl.foundItems = [];
    MenuSearchService.getMatchedMenuItems(myCtrl.searchTerm).then(function(resp) {
      myCtrl.loading= false;
      myCtrl.nothingFound = resp.length == 0;
      myCtrl.foundItems = resp;
    });
  }
}

MenuSearchService.$inject = ['ApiBasePath','$http'];
function MenuSearchService(ApiBasePath,$http) {
  var service = this;
  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    return response.then(function(resp) {
      var result = resp.data;
      return result.menu_items.filter(function(it) {
        
        if (it.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
          return it;
      })
    })
  }
}

})();