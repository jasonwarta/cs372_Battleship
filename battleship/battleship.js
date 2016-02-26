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
        var posX = Session.get('posX');
        var posY = Session.get('posY');
        var rotation = Session.get('rotation');
        var ship = Session.get('selectedShip');
        var mouseState = Session.get('mouseState');

        // Meteor.call('mouseoverShip',posX,posY,rotation,ship);
        // Meteor.call('mouseoverShip',
        //   Session.get('posX'),
        //   Session.get('posY'),
        //   Session.get('rotation'),
        //   Session.get('selectedShip'),
        //   function(error){
        //     if(error) console.log(error);
        //   } );

        // // if(Session.get('mouseState') == 'enter'){
          // if(rotation == "left") {
        // //     var cells = CellArray.find({ $and:[
        // //       { y: posY }, 
        // //       { x: { $lte: posX } }, //cell x lte posX
        // //       { x: { $gt: (posX - ships.ship) } } //cell x gt posX - shipLength
               
        // //       ] }).fetch();

        //     for(var i = 0; i < cells.length; i++){
        //       console.log("Cell ID: " + cellId[i].get("_id",function(error){
        //         if(error) console.log(error);
        //       }));
        //       CellArray.update({_id: cells[i]._id }, 
        //                        { $set: { state: "hover" } });
        //     }
          

        //     // CellArray.update({ $and:[
        //     //   { x: { $lte: posX } }, //cell x lte posX
        //     //   { x: { $gt: (posX - ships.ship) } }, //cell x gt posX - shipLength
        //     //   { y: { $eq: posY } } ] }, //cell y = posY
        //     //   { $set: { state: "hover" } } ); //set the state to hover
          // } else 
          // if (rotation == "right" || rotation == "left") {
          //   console.log(rotation);
          //   var cells = CellArray.find( { "col": posY }).fetch();
          //   for(var i = 0; i < cells.length; i++){
          //     var cellId = cells[i]._id;

          //     if( cells[i].row >= Session.get('posX') && cells[i].row < (posX+ships.ship) ) {
          //       console.log("updating cell: " + cellId);
          //       CellArray.update({_id: cellId},
          //                        {$set: { state: "hover" } } );
          //     }
          //   }
          // }
        //     CellArray.update({ $and:[
        //       { x: { $gte: posX } }, //cell x gte posX
        //       { x: { $lt: (posX + ships.ship) } }, //cell x lt posX + shipLength
        //       { y: { $eq: posY } } ] }, //cell y = posY
        //       { $set: { state: "hover" } } ); //set the state to hover
          // } else if (rotation == "up") {
        //     CellArray.update({ $and:[
        //       { y: { $lte: posY } }, //cell y gte posY
        //       { y: { $gt: (posY - ships.ship) } }, //cell y lt posY + shipLength
        //       { x: { $eq: posX } } ] }, //cell x = posX
        //       { $set: { state: "hover" } } ); //set the state to hover
          // } else 
          // else if (rotation == "down" || rotation == 'up') {
          //   console.log(rotation);
          //   // var cells = CellArray.find( { $and: [
          //   //   { "x": posX },
          //   //   { "y": { "$gte": posY, "$lt": (posY + ships.ship) }}
          //   //   ]}).fetch();


          //   var cells = CellArray.find( { "row": posX }).fetch();

          //   // console.log("entering loop with " + cells.length + " items");

          //   // cells.forEach(function(item){
          //   //   console.log("entering for loop: got " + cells.length + " items in fetch op");
          //   //   CellArray.update({id: item._id},{ $set: { state: "hover" } });
          //   // });

          //   // var cells = CellArray.find( { "x": posX }).fetch();
          //   for(var i = 0; i < cells.length; i++){
          //     var cellId = cells[i]._id;

          //     if( cells[i].col >= Session.get('posY') && cells[i].col < (posY+ships.ship) ) {
          //       console.log("updating cell: " + cellId);
          //       CellArray.update({_id: cellId},
          //                        {$set: { state: "hover" } } );
          //     }
          //   }
          //   // for (var item in cells){
          //   //   console.log("Cell ID: " + item._id);
          //   //   CellArray.update({_id: item._id},
          //   //                     { $set: { state: "hover" } });
          //   // }
          // }


        


      // } else if(Session.get('gameMode') == 'shooting'){


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
          Session.get('rotation'),shipLength
          // Session.get('selectedShip') 
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

      // if(Session.get('gameMode') == 'placing'){
      //   Meteor.call('mouseoverShip',
      //     Session.get('posX'),
      //     Session.get('posY'),
      //     Session.get('rotation'),
      //     Session.get('selectedShip'),
      //     Session.get('mouseState'),
      //     function(error){
      //       if(error) console.log(error);
      //     } );
      // }

    },

    'mouseleave .friendly': function() {
      var cellId = this._id;
      Session.set('mouseState','leave');
      Session.set('leaveCell',cellId);
      // Session.set('posX',$(e.currentTarget).attr('x'));
      // Session.set('posY',$(e.currentTarget).attr('y'));
      // Session.set('mouse',e);
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
  // 'initGrid': function(){
  //   // TODO:
  //   // link images for the blank grid, ships, hits, misses, and sunk ships to the elements
  //   var currentUserId = Meteor.userId();

  //   while(BoardData.findOne({ ownedBy: currentUserId })) {
  //     BoardData.remove({ ownedBy: currentUserId })
  //   }

  //   for(var i = 0; i < 10; i++){
  //     for(var j = 0; j < 10; j++){
  //       BoardData.insert({
  //         row: i,
  //         col: j,
  //         ownedBy: currentUserId,
  //         state: "empty"
  //       });
  //     }
  //   }
  //   return "finished init";
  // },

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
          row: i,
          col: j,
          state: "empty"
        });
      }
    }
  },

  'mouseoverShip': function(posX,posY,rotation,ship){
    var ships = {"carrier":5,"battleship":4,"cruiser":3,"submarine":3,"sub":3,"destroyer":2,5:5,4:4,3:3,2:2};

    // if(mouseState == 'enter'){
      if(rotation == "left") {
        CellArray.update({ $and:[
          { x: { $lte: posX, $gt: (posX - ships.ship) } }, //cell x lte posX
          // { x: { $gt: (posX - ships.ship) } }, //cell x gt posX - shipLength
          { y: posY } ] }, //cell y = posY
          { $set: { state: "hover" } } ); //set the state to hover
      } else if (rotation == "right") {
        CellArray.update({ $and:[
          { x: { $gte: posX, $lt: (posX + ships.ship) } }, //cell x gte posX
          // { x: { $lt: (posX + ships.ship) } }, //cell x lt posX + shipLength
          { y: posY } ] }, //cell y = posY
          { $set: { state: "hover" } } ); //set the state to hover
      } else if (rotation == "up") {
        CellArray.update({ $and:[
          { y: { $lte: posY, $gt: (posY - ships.ship) } }, //cell y gte posY
          // { y: { $gt: (posY - ships.ship) } }, //cell y lt posY + shipLength
          { x: posX } ] }, //cell x = posX
          { $set: { state: "hover" } } ); //set the state to hover
      } else if (rotation == "down") {
        CellArray.update( { $and: [
              { x: posX },
              { y: { $gte: posY, $lt: posY+ships.ship } } ] },//, $lt: (posY + ships.ship)
              { $set: { state: "hover" } } );

        // CellArray.update({ $and:[
        //   { y: { $gte: posY, $lt: (posY + ships.ship) } }, //cell y gte posY
        //   // { y: { $lt: (posY + ships.ship) } }, //cell y lt posY + shipLength
        //   { x: posX } ] }, //cell x = posX
        //   { $set: { state: "hover" } } ); //set the state to hover
      }

    // } else { //mouseState == 'leave'
    //   CellArray.update(
    //     { state: "hover" }, 
    //     { $set: { state:"empty" } } );
      
    // }

  },

  'placeShip': function(posX,posY,rotation,shipLength){

    console.log("X:"+posX+" Y:"+posY+" R:"+rotation+" S:"+shipLength);

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

  },
  'findUser': function(){
    return Meteor.users.find(("email"));
  },



});