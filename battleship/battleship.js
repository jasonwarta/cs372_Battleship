PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
PlayerAction = new Mongo.Collection('actions');
CellArray = new Mongo.Collection('cells');

//Meteor Client Code
if (Meteor.isClient) {
  Template.game.onRendered( function(){
    
    Meteor.call('initCellArray');
    var elems = document.getElementsByClassName('rotate');
    elems[0].focus();
    //session var to track state of rotation
    //changed by clicking 'rotate' button
    //starts at "down"
    Session.set('rotation',"down");
    Session.set('gameMode','init'); // 'init','placing','waiting','shooting','done'
    Session.set('selectedShip', 'none'); //'carrier', etc
  });

  Template.game.helpers({
    //for hiding the ship images, a boolean for html
    'placing': function(){
      if(Session.get('gameMode') == 'placing'){
        return true; 
      }
      else{
        return false; 
      }
    },
    'cell': function(){
      return CellArray.find();
    },
    'mouseover': function(){
      var cellId = this._id;
      var hoverCell = Session.get('enterCell');
      if(Session.get('gameMode') == 'init'){
        if(cellId == hoverCell) {
          if(Session.get('mouseState') == 'enter'){
            return 'mouseenter';
          } else {
            return 'mouseleave';
          }
        }
      } else if(Session.get('gameMode') == 'placing'){
        //place the ship 
      } else if(Session.get('gameMode') == 'shooting'){

      }  
    },
    'rotation': function(){
      return Session.get('rotation');
    },
  });

  Template.game.events({
    'click .resetGrid': function() {
      Meteor.call('initCellArray');
    },

    'click .cell': function() {
      var cellId = this._id;
      var selectedCell = Session.set('selectedCell', cellId);

      if(Session.get('gameMode') == 'placing'){
        $('#shipPack').css({left:  3, top:  3}); 
        //$('.' + Session.get('selectedShip')).css({left:  3, top:  3})
        // Session.set('gameMode', 'waiting'); 
        // $('#shipPack').css({left:  3, top:  3}); 
        // $('#shipPack').addClass(Session.get('selectedShip'));
      }
    },

    //ship placement handlers
    'click .shipSelector': function(e){
      var itemId = $(e.currentTarget).attr("id");
      Session.set('selectedShip', itemId); 
      Session.set('gameMode', 'placing'); 
    },

    //rotate button handler
    'click .rotate': function(){
      //rotation happens clockwise, starting at down
      var state = Session.get('rotation');

      if(state == "down") Session.set('rotation','left');
      else if(state == "left") Session.set('rotation','up');
      else if(state == "up") Session.set('rotation','right');
      else if(state == "right") Session.set('rotation','down');
      else Session.set('rotation','down');
    },

    'keyup': function(event) {
      if(event.which == 82){
        var state = Session.get('rotation');
      
        if(state == "down") Session.set('rotation','left');
        else if(state == "left") Session.set('rotation','up');
        else if(state == "up") Session.set('rotation','right');
        else if(state == "right") Session.set('rotation','down');
        else Session.set('rotation','down');
      }
    },

    //mouseover handlers for friendly cells
    'mouseenter .friendly': function() {
      var cellId = this._id;
      Session.set('mouseState','enter');
      Session.set('enterCell',cellId);
    },

    'mouseleave .friendly': function() {
      var cellId = this._id;
      Session.set('mouseState','leave');
      Session.set('leaveCell',cellId);
    },

    //To have ships follow the mouse when it is selected
    'mousemove': function(e){
      if(Session.get('gameMode') == 'placing'){
         var ship = Session.get('selectedShip')
         var ships = ["carrier", "destroyer", "cruiser", 
         "submarine", "battleship"]; 

        //delete former classes if user has clicked on any 
          //(ex: switched carrier to sub)
        for(var i=0; i<5; ++i){
          $('#shipPack').removeClass(ships[i]); 
        }
        //follows mouse, but gives space for mouse to click
        $('#shipPack').css({left: e.pageX + 3, top: e.pageY + 3}); 
        //add the appropriate sprite class for width,height,etc
        $('#shipPack').addClass(ship);
       }
    }
  });
}

//Meteor Server Code
if (Meteor.isServer) {
  Meteor.startup(function () {

  });
}

//Meteor Methods
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
  //ship is a string: "carrier","battleship","cruiser","submarine","destroyer"
  'checkShipPosition': function(posX,posY,rotation,ship){
    var ships = {"carrier":5,"battleship":4,"cruiser":3,"submarine":3,"sub":3,"destroyer":2,5:5,4:4,3:3,2:2};

    if(rotation == "up"){
      if(posY - ships.ship < 0){
        return "invalid position";
      } else {
        return "valid position";
      };
    } else if (rotation == "left"){
      if(posX - ships.ship < 0){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else if (rotation == "down"){
      if(posY + ships.ship > 9){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else if (rotation == "right"){
      if(posX + ships.ship > 9){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else {
      return "invalid position";
    }
  },

  'initCellArray': function(){
    CellArray.remove({});
    for(var i = 0; i < 10; i++){
      for(var j = 0; j < 10; j++){
        CellArray.insert({
          x: i,
          y: j,
          state: "empty"
        });
      }
    }
  }
});