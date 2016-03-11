
Meteor.startup(function () {

});

//Meteor Methods
Meteor.methods({

  //posX is the X position of the cell
  //posY is the Y position of the cell
  //rotation is in directions "up","left","down","right" from the clicked location
  //shipLength is the length of the ship 2-5
  'checkShipPosition': function(posX,posY,rotation,shipLength){
    if (rotation == "vertical"){
      if(posX + shipLength > 9){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else if (rotation == "horizontal"){
      if(posY + shipLength > 9){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else {
      return "invalid position";
    }
  },

  'initCellArray': function(userId){
    CellArray.remove({createdBy: userId});
    for(var i = 0; i < 10; i++){
      for(var j = 0; j < 10; j++){
        CellArray.insert({
          row: i,
          col: j,
          state: "empty",
          createdBy: userId
        });
      }
    }
  },


  'placeShip': function(userId,posX,posY,rotation,shipLength){
    // if(Meteor.call('checkShipPosition',posX,posY,rotation,shipLength) == "valid position"){
       if (rotation == "horizontal") {
        
        CellArray.update(
          { '$and': [ 
            { col: {'$gte': posY, } },
            { col: {'$lt': posY+shipLength } }, 
            { row: posX },
            { createdBy: userId } 
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
            } 
        );

      } else if (rotation == "vertical") {
        
        CellArray.update(
          { '$and': [ 
            { row: {'$gte': posX, } },
            { row: {'$lt': posX+shipLength } }, 
            { col: posY } ,
            { createdBy: userId } 
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
            } 
        );
      } 
    // }
    // else {
    //   console.log("invalid position");
    // }
  },

  'verifyID': function(id){
    // console.log("ID: " + id)
    var arr = Meteor.users.find({_id:id}).fetch();
    if( arr.length > 0 ){
      // console.log("valid id");
      return true;
    }
    // console.log("Invalid ID: " + id)
    return false;
  },
  'removeAllShips': function(){
    ShipArray.remove({}); 
  },
  'getShip': function(shipname){
      return ShipArray.find(); 
  },

  'positionShip': function(ship,shipX,shipY,rotation,shipLength,cell_coll,cell_roww){
    ShipArray.upsert(
      {
        ship_name: ship
      },
      {$set: 
        {
          ship_name: ship,
          x_value : shipX,
          y_value : shipY,
          image : ship + "_img",
          image_source : "battleship_sprites_empty.png",
          rotation: rotation,
          ship_length : shipLength,
          placed : true,
          // html_element : document.getElementById(ship + "_img").id,
          board_element : 'leftboard',
          cell_col: cell_coll,
          cell_row: cell_roww
        }
      }
    );
  },

  'shoot': function(userId,posX,posY){
    // var cell = CellArray.findOne({createdBy:userId,row:posX,col:posY}).state ;
    if(CellArray.findOne({createdBy:userId,row:posX,col:posY}).state == "ship"){
      CellArray.update({
        createdBy: userId, 
        row:posX,
        col:posY
      },
      {
        '$set': 
          {state:"hit"}
      });
    } else {
      CellArray.update({
        createdBy: userId,
        row:posX,
        col:posY
      },
      {
        '$set': 
          {state:"miss"}
      });
    }
  },


});

Meteor.publish("friendlyCells",function(userId){
  return CellArray.find({createdBy:userId});
});

Meteor.publish("enemyCells", function(enemyId){
  return CellArray.find({createdBy:enemyId});
});

Meteor.publish("shipArray", function () {
  return ShipArray.find();
});
