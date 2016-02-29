
Template.titlebar.onRendered( function(){
  
});

Template.titlebar.helpers({
  'connected': function(){
    if(Session.get('connected') != "true") return false;
    else return true;
  },
  'enemy': function(){
    // console.log(Session.get('enemyId'));
    // Meteor.users.findOne()
    var email = Meteor.call('getEmailFromID',Session.get('enemyId'))
    return email;
  },
  'mouseStats':function(){
    return Session.get('mouseStats');
  }

});

Template.titlebar.events({
  'submit form': function(event){
    event.preventDefault();
    var email = event.target.enemyEmail.value;

    var userId = Meteor.userId();
    var userEmail = Meteor.call('getEmailFromID',userId);
    var enemyId = Meteor.call('getIDFromEmail',email);
    var enemyEmail = Meteor.call('getEmailFromID',enemyId);

    console.log("userId: "+userId+" email: "+userEmail);
    console.log("enemyId: "+enemyId+" email: "+enemyEmail);

    if(enemyId){
      if(userId == enemyId){
        Session.set('connected',"false");
      } else if(enemyId == ""){
        Session.set('connected',"false");
      } else {
        Session.set('enemyId',enemyId);
        Session.set('connected',"true");
      }
    }
  },

});





Template.game.onRendered( function(){
  
  Meteor.call('initCellArray');
  var elems = document.getElementsByClassName('rotate');
  elems[0].focus();
  //session var to track state of rotation
  //changed by clicking 'rotate' button
  //starts at "down"
  Session.set('rotation',"vertical");
  Session.set('gameMode','init'); // 'init','placing','waiting','shooting','done'
  Session.set('selectedShip', 'none'); //'carrier', etc
  // console.log("userId: " + Meteor.call('findUser',"test2@test.com"));
  Session.set('enemyId','');
  Session.set('connected',false);
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
  'friendlyCell': function(){
    return FriendlyCellArray.find();
  },
  'enemyCell': function(){
    return EnemyCellArray.find();
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

    if(state == "vertical") Session.set('rotation','horizontal');
    else if (state == "horizontal") Session.set('rotation','vertical');
    // else Session.set('rotation','vertical');
  },

  'keyup': function(event) {
    if(event.which == 82){
      var state = Session.get('rotation');

      if(state == "vertical") Session.set('rotation','horizontal');
      else if (state == "horizontal") Session.set('rotation','vertical');
      // else Session.set('rotation','vertical');
    }
  },

  //mouseover handlers for friendly cells
  'mouseenter .friendly': function(e) {
    var cellId = this._id;
    Session.set('mouseState','enter');
    Session.set('enterCell',cellId);
    Session.set('posX',$(this).attr('row'));
    Session.set('posY',$(this).attr('col'));

    Session.set(
      'mouseStats',
      Session.get('gameMode') + " " +
      Session.get('selectedShip') + " " +
      Session.get('posX') + " " + 
      Session.get('posY') + " " + 
      Session.get('rotation'));
  },

  'mouseleave .friendly': function() {
    var cellId = this._id;
    Session.set('mouseState','leave');
    Session.set('leaveCell',cellId);
  },

  //To have ships follow the mouse when it is selected
  'mousemove': function(e){
    if(Session.get('gameMode') == 'placing'){

      //follows mouse, but gives space for mouse to click
      $("#friendlyBoard").mousemove(function(e){
        //change offset according to rotation
        $('#shipPack').css({
          left: e.pageX + 3, 
          top: e.pageY + 3
        }); 
      });
      
      $('#shipPack').addClass(Session.get('rotation') + "-" + Session.get('selectedShip')); 
     }
  }
});

// Meteor.subscribe('friendlyCells');
// Meteor.subscribe('enemyCells');