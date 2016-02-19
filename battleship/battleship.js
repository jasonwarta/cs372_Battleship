PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
ShipsPlacement = new Mongo.Collection('ships');

if (Meteor.isClient) {
  Template.game.onRendered( function(){
    Meteor.call('intiGridMeteor');
  });

//Testing the Testing Framework :) ->Works!
AddTwo = function AddTwo(num){
  return num +2; 
}

  //Game will most likely be more on the client side (fast) 
    //Then information will be updated through the server

  Template.game.helpers({
    'cell': function(){
      var currentUserId = Meteor.userId();
      return BoardData.find({ ownedBy: currentUserId });
    },
    'cell_posX': function(){
      var currentUserId = Meteor.userId();
    },
    'cell_posY': function(){
      var currentUserId = Meteor.userId();
    }
  });

  Template.game.events({
    'click .resetGrid': function() {
      Meteor.call('intiGridMeteor');
    },
    'click .cell': function() {
      var cellId = this._id;
      var selectedCell = Session.set('selectedCell', cellId);

      console.log("You clicked a cell");
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
  'intiGridMeteor': function(){
    // TODO:
    // link images for the blank grid, ships, hits, misses, and sunk ships to the elements
    var currentUserId = Meteor.userId();

    if(currentUserId){
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
      return "success";
    } else {
      console.log("You aren't logged in!");
      return "faliure";
    }
    
  },

  'addThree': function(num){
    return num + 3; 
  }

});