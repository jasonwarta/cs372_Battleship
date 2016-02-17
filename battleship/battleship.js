PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
ShipsPlacement = new Mongo.Collection('ships');

if (Meteor.isClient) {
  Template.game.onRendered( function(){
    Meteor.call('initGrid');
  });

  //Game will most likely be more on the client side (fast) 
    //Then information will be updated through the server

  // Template.battleship.helpers({
  // });

  Template.game.events({
    'click .resetGrid': function (){
      Meteor.call('initGrid');
    }

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}

Meteor.methods({
  //initGrid
  //takes no parameters
  //populates the gridContainers with elements for each cell
  'initGrid': function(){
    // TODO:
    // link images for the blank grid, ships, hits, misses, and sunk ships to the elements

    if(Meteor.isClient){
      var gridElem = document.getElementsByClassName('gridContainer');
      for(var grid = 0; grid < gridElem.length; grid++){

        //delete all child elements in the grid container
        while( gridElem[grid].hasChildNodes() ){
          gridElem[grid].removeChild(gridElem[grid].lastChild);
        }

        //populate the grid container with cells
        for(var i = 0; i < 10; i++){
          for(var j = 0; j < 10; j++){
            var elem = document.createElement('div');
            elem.setAttribute('data-posX',i);
            elem.setAttribute('data-posY',j);
            elem.setAttribute('class', 'cell cell-' + i + '-' + j);
            gridElem[grid].appendChild(elem);
            //log creation of cells. this line should be commented out once images are added
            // console.log("called initGrid, x=" + i + ", y=" + j + " : " + elem.getAttribute('class'));
          }
        }
      }
    }
  }

});