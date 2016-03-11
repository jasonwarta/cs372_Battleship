
Meteor.startup(function () {

});

// Meteor.publish('friendlyCells', function(){
//   return FriendlyCellArray.find();
// });

// Meteor.publish('enemyCells', function(){
//   return EnemyCellArray.find();
// });

Meteor.publish("shipArray", function () {
    return ShipArray.find();
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

  // 'noShipPresent': function(posX,posY,rotation,shipLength){
  //   var ships = CellArray.find({state:"ship"}).fetch();

  //   if(rotation == "horizontal"){

  //   } else if (rotation == "vertical"){

  //   }

  // },

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
    // EnemyCellArray.remove({createdBy: userId});
    // for(var i = 0; i < 10; i++){
    //   for(var j = 0; j < 10; j++){
    //     EnemyCellArray.insert({
    //       row: i,
    //       col: j,
    //       state: "empty",
    //       createdBy: userId
    //     });
    //   }
    // }
  },


  'placeShip': function(posX,posY,rotation,shipLength){
    if(Meteor.call('checkShipPosition',posX,posY,rotation,shipLength) == "valid position"){
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
        
        FriendlyCellArray.update(
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
    else {
      console.log("invalid position");
    }
  },

  'getIDFromEmail': function(email){
    var doc = Meteor.users.findOne({"emails.address": email},{});
    var userId = null;
    if(doc){
      userId = doc._id;
    }
    console.log("EMailtoID - ID: "+userId+" Email: "+email);
    if(userId)
      return "connected";
    return "failed";

    // return Meteor.users.findOne({ "emails.address": email})._id;
    // // Accounts.findUserByEmail(email);
  },

  'getEmailFromID': function(id){
    var doc = Meteor.users.findOne({"_id": id},{});
    var email = null;
    if(doc){
      return "connected";
      // email = doc.emails[0].address;
    }
    // console.log("IDtoEMail - ID: "+id+" Email: "+email);
    return "failed";
  },

  'getFriendlyCells': function(userId){
    return CellArray.find();
  },

  'getEnemyCells': function(email){
    var doc = Meteor.users.findOne({"emails.address": email},{});
    var userId = null;
    if(doc){
      userId = doc._id;

      return CellArray.find({createdBy:userId});
    }
  },

  'verifyID': function(id){
    console.log("ID: " + id)
    var arr = Meteor.users.find({_id:id}).fetch();
    if( arr.length > 0 ){
      console.log("valid id");
      return true;
    }
    console.log("Invalid ID: " + id)
    return false;
  },
  'removeAllShips': function(){
    ShipArray.remove({}); 
  },
  'getShip': function(shipname){
      return ShipArray.find(); 
  }
});

Meteor.publish("friendlyCells",function(userId){
  return CellArray.find({createdBy:userId});
});

Meteor.publish("enemyCells", function(enemyId){
  return CellArray.find({createdBy:enemyId});
)};