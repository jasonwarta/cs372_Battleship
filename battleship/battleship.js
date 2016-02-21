PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
PlayerAction = new Mongo.Collection('actions');


if (Meteor.isClient) {
  Template.game.onRendered( function(){
    Meteor.call('initGrid');

    //session var to track state of rotation
    //changed by clicking 'rotate' button
    //starts at "down"
    Session.set('rotation',"down");
  });

//Testing the Testing Framework :) ->Works!
// AddTwo = function AddTwo(num){
//   return num +2;
// }


  //Game will most likely be more on the client side (fast) 
    //Then information will be updated through the server

  Template.game.helpers({
    'cell': function(){
      var currentUserId = Meteor.userId();
      return BoardData.find({ ownedBy: currentUserId });
    }
  });

  Template.game.events({
    'click .resetGrid': function() {
      Meteor.call('intiGrid');
    },
    'click .cell': function() {
      var cellId = this._id;
      var selectedCell = Session.set('selectedCell', cellId);

      console.log("You clicked a cell");
    },
    'click .rotate': function(){

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
    var currentUserId = Meteor.userId();

    while(BoardData.findOne({ ownedBy: currentUserId })) {
      BoardData.remove({ ownedBy: currentUserId })
    }

    for(var i = 0; i < 10; i++){
      for(var j = 0; j < 10; j++){
        BoardData.insert({
          x: i,
          y: j,
          ownedBy: currentUserId,
          state: "empty"
        });
      }
    }
    return "finished init";
  },

  //posX is the X position of the cell
  //posY is the Y position of the cell
  //rotation is in directions "up","left","down","right" from the clicked location
  'placeShip': function(posX, posY, rotation){
    // var currentUserId = Meteor.userId();



  },
  //posX is the X position of the cell
  //posY is the Y position of the cell
  //rotation is in directions "up","left","down","right" from the clicked location
  'checkShipPosition': function(posX,posY,rotation,shipLength){
    if(rotation == "up"){

    } else if (rotation == "left"){

    } else if (rotation == "down"){

    } else if (rotation == "right"){

    } else {
      return "invalid position";
    }
  }


});