(function(){
'use strict';
angular.module('NarrowItDownApp', [ ])
       .controller('NarrowItDownController',NarrowItDownController)
       .directive('foundItems',FoundItemsDirective)
       .service( 'MenuSearchService', MenuSearchService)
  //     .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")

NarrowItDownController.$inject=['MenuSearchService'];

       function NarrowItDownController(MenuSearchService){
         var narrow = this;
narrow.getMatchedMenuItems = function (searchTerm){
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
}
/*  controller:FoundItemsDirectiveController,
  controllerAs:'ctrl',
  bindToController:true,
*/
         };
         return ddo;
       }
  /*     function FoundItemsDirectiveController(){
         var ctrl=this;
         ctrl.onRemove=function(index){
           console.log("k");
         };
       }
*/
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
        if(service.found.menu_items[i].description.indexOf(searchTerm)>=0 ||  service.found.menu_items[i].name.indexOf(searchTerm)>=0)
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
