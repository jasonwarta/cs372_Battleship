PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
PlayerAction = new Mongo.Collection('actions');
// {
//   _id: alphanumeric string
//   row: num, 0-9
//   col: num, 0-9
//   action: string, "ship","shot"
//   userId: alphanumeric string
// }

FriendlyCellArray = new Mongo.Collection('friendlyCells');
EnemyCellArray = new Mongo.Collection('enemyCells')
// {
//   _id: alphanumeric string
//   row: num, 0-9
//   col: num, 0-9
//   state: string, "empty","ship"
// }

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

});