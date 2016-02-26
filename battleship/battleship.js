PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
PlayerAction = new Mongo.Collection('actions');
// {
//   _id: alphanumeric string
//   row: num, 0-9
//   col: num, 0-9
//   action: string, "ship","shot"
// }

CellArray = new Mongo.Collection('cells');
// {
//   _id: alphanumeric string
//   row: num, 0-9
//   col: num, 0-9
//   state: string, "empty","ship"
// }


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

    'click .friendly': function() {

      var cellId = this._id;
      var selectedCell = Session.set('selectedCell', cellId);
      var ship = Session.get('selectedShip');
      var shipLength;

      if(ship == "carrier") shipLength = 5;
      else if(ship == "battleship") shipLength = 4;
      else if(ship == "cruiser") shipLength = 3;
      else if(ship == "submarine") shipLength = 3;
      else if(ship == "destroyer") shipLength = 2;


      console.log("you clicked " + Session.get('posX') + " " + Session.get('posY') + " " + ship);

      if(Session.get('gameMode') == 'placing'){
        Meteor.call('placeShip',
          Session.get('posX'),
          Session.get('posY'),
          Session.get('rotation'),
          shipLength
        );
      }




    },

    //ship placement handlers
    'click .shipSelector': function(e){
      var ship = $(e.currentTarget).attr("id");
      Session.set('gameMode', 'placing'); 
      Session.set('selectedShip', ship); 

      console.log( Session.get('gameMode') + " " + Session.get('selectedShip') );
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
    'mouseenter .friendly': function(e) {
      var cellId = this._id;
      Session.set('mouseState','enter');
      Session.set('enterCell',cellId);
      Session.set('posX',$(this).attr('row'));
      Session.set('posY',$(this).attr('col'));

      console.log(Session.get('gameMode') + " " +
                  Session.get('selectedShip') + " " +
                  Session.get('posX') + " " + 
                  Session.get('posY') + " " + 
                  Session.get('rotation') );
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
        // var ships = ["carrier", "destroyer", "cruiser", 
        //   "submarine", "battleship"]; 

        var rotation = Session.get('rotation');

        var rot = {
          up: "u_",
          down: "d_",
          left: "l_",
          right: "r_",
        };

        var angle = {
          down: "90deg",
          left: "180deg",
          up: "270deg",
          right: "0deg",
        }

        $('#shipPack').removeClass();

        //follows mouse, but gives space for mouse to click
        $("#friendlyBoard").mousemove(function(e){
          $('#shipPack').css({
            left: e.pageX + 2,
            top: e.pageY + 2,
            transform: "rotate("+angle[rotation]+")",
          }); 
        });

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
          row: i,
          col: j,
          state: "empty"
        });
      }
    }
  },


  'placeShip': function(posX,posY,rotation,shipLength){

    if(Meteor.call('checkShipPosition',posX,posY,rotation,shipLength) == "valid position"){

      if (rotation == "left"){
      
        CellArray.update(
          { '$and': [ 
            { col: {'$gt': posY-shipLength, } },
            { col: {'$lte': posY } }, 
            { row: posX } 
          ] },
          { '$set': 
            { state: "ship"} 
          },
          { 
            upsert: false,
            multi: true 
          }, 
            function(error){
              if(error) console.log(error);
            } );

      } else if (rotation == "right") {
        
        CellArray.update(
          { '$and': [ 
            { col: {'$gte': posY, } },
            { col: {'$lt': posY+shipLength } }, 
            { row: posX } 
          ] },
          { '$set': 
            { state: "ship"} 
          },
          { 
            upsert: false,
            multi: true 
          }, 
            function(error){
              if(error) console.log(error);
            } );

      } else if (rotation == "up") {

        CellArray.update(
          { '$and': [ 
            { row: {'$gt': posX-shipLength, } },
            { row: {'$lte': posX } }, 
            { col: posY } 
          ] },
          { '$set': 
            { state: "ship"} 
          },
          { 
            upsert: false,
            multi: true 
          }, 
            function(error){
              if(error) console.log(error);
            } );

      } else if (rotation == "down") {
        
        CellArray.update(
          { '$and': [ 
            { row: {'$gte': posX, } },
            { row: {'$lt': posX+shipLength } }, 
            { col: posY } 
          ] },
          { '$set': 
            { state: "ship"} 
          },
          { 
            upsert: false,
            multi: true 
          }, 
            function(error){
              if(error) console.log(error);
            } );

      }

    }

    

  },
  'findUser': function(){
    return Meteor.users.find(("email"));
  },



});