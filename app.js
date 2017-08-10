(function(){
'use strict';
angular.module('NarrowItDownApp', [ ])
       .controller('NarrowItDownController',NarrowItDownController)
       .directive('foundItems',FoundItemsDirective)
       .service( 'MenuSearchService', MenuSearchService)
  //     .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")

NarrowItDownController.$inject=['MenuSearchService','$scope'];

       function NarrowItDownController(MenuSearchService,$scope){
         var narrow = this;

narrow.getMatchedMenuItems = function (searchTerm){
  narrow.foundItems=[];
    MenuSearchService.foundItems=[];

  if(searchTerm==undefined)
  {$scope.x=1;
    return;}
$scope.x=0;

  narrow.foundItems= MenuSearchService.getMatchedMenuItems(searchTerm);
console.log(narrow.foundItems);
};

narrow.remove= function(index){
  narrow.foundItems.splice(index,1);
MenuSearchService.remove(index);
};
}


       function FoundItemsDirective(){
         var ddo = {
templateUrl:'abc.html',
scope:{
  foundItem: '<',
  onRemove:'&'
},
  controller:FoundItemsDirectiveController,
  controllerAs:'ctrl',
  bindToController:true,

         };
         return ddo;
       }
       function FoundItemsDirectiveController(){
         var ctrl=this;
         //ctrl.onRemove=function(index){
           //ctrl.foundItem.splice(index,1);
         //};
       }

MenuSearchService.$inject=['$http'];
       function MenuSearchService($http){
         var service=this;
service.foundItems=[];
service.remove=function(index){
  service.foundItems.splice(index,1);
};
         service.getMatchedMenuItems=function(searchTerm){

        var response =  $http({
        method : "GET",
        url : ("https://davids-restaurant.herokuapp.com/menu_items.json")
         });

      response.then(function(result) {

        service.found=result.data;
        for(var i=0;i<service.found.menu_items.length;i++)
        if(service.found.menu_items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase())>=0 ||  service.found.menu_items[i].name.toLowerCase().indexOf(searchTerm.toLowerCase())>=0)
        { //console.log("hi");
          var q = {
            name:service.found.menu_items[i].name,
            des:service.found.menu_items[i].description,
            sn:service.found.menu_items[i].short_name
          };
          service.foundItems.push(q);
        }
      })
  return service.foundItems;  }
  ;
}

})();
