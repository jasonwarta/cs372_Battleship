Meteor.startup(function () {

});

// Meteor.publish('friendlyCells', function(){
//   return FriendlyCellArray.find();
// });

// Meteor.publish('enemyCells', function(){
//   return EnemyCellArray.find();
// });

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

  'noShipPresent': function(posX,posY,rotation,shipLength){
    var ships = FriendlyCellArray.find({state:"ship"}).fetch();

    if(rotation == "horizontal"){
      
    } else if (rotation == "vertical"){

    }

  },

  'initCellArray': function(){
    FriendlyCellArray.remove({});
    for(var i = 0; i < 10; i++){
      for(var j = 0; j < 10; j++){
        FriendlyCellArray.insert({
          row: i,
          col: j,
          state: "empty"
        });
      }
    }
    EnemyCellArray.remove({});
    for(var i = 0; i < 10; i++){
      for(var j = 0; j < 10; j++){
        EnemyCellArray.insert({
          row: i,
          col: j,
          state: "empty"
        });
      }
    }
  },


  'placeShip': function(posX,posY,rotation,shipLength){

    if(Meteor.call('checkShipPosition',posX,posY,rotation,shipLength) == "valid position"){

      if (rotation == "horizontal") {
        
        FriendlyCellArray.update(
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

        PlayerAction.insert({
           row: posX,
           col: posY,
           action: "ship",
           rotation: rotation,
           shipLength: shipLength,
           userId: this.userId()
        });

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

        PlayerAction.insert({
           row: posX,
           col: posY,
           action: "ship",
           rotation: rotation,
           shipLength: shipLength,
           userId: this.userId()
        });

      }
    } else {
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
    return userId;

    // return Meteor.users.findOne({ "emails.address": email})._id;
    // // Accounts.findUserByEmail(email);
  },
  'getEmailFromID': function(id){
    var doc = Meteor.users.findOne({"_id": id},{});
    var email = null;
    if(doc){
      email = doc.emails[0].address;
    }
    console.log("IDtoEMail - ID: "+id+" Email: "+email);
    return email;
  },

  'getFriendlyCells': function(){
    return FriendlyCellArray.find();
  },
  'getEnemyCells': function(){
    return EnemyCellArray.find();
  },


});

