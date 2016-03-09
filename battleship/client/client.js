
var shiparray = ['carrier', 'submarine', 'destroyer', 'cruiser', 'battleship']; 


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

//When window changes (keep track of new grid coordinates?)
$(window).on("load resize scroll", function(){

  //Loop through ship array to put ships in correct location
  ShipArray.find(); 
  givenElementReturnProperShipPlacement(); 
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
      var posX = Session.get('posX');
      var posY = Session.get('posY');
      var rotation = Session.get('rotation');
      var ship = Session.get('selectedShip');
      var shipLength = Session.get('shipLength');

      if(Meteor.call('checkShipPosition',posX,posY,rotation,shipLength) == "valid position"){
        $('#shipPack').css({
          visibility: "hidden"
        });
        var shipString = ".SS"+ship;
        $(shipString).css({
          visibility: "hidden"
        });
        Meteor.call('placeShip',posX,posY,rotation,shipLength);
        Session.set('selectedShip',null);
      }

    } else if(Session.get('gameMode') == 'shooting'){
      if(cellId == hoverCell) {
        if(Session.get('mouseState') == 'enter'){
          return 'mouseenter';
        } else {
          return 'mouseleave';
        }
      }
    }  
  },
  'rotation': function(){
    return Session.get('rotation');
  },
  'hidden': function(){
    // if()
    // return "hidePlacedShip";
  },

  'shot': function(){

  },

  'givenElementReturnProperShipPlacement': function(elem){
    var ship = Session.get('selectedShip');
    var shipLength;

    var imgName; 

    if(ship == "carrier"){
      shipLength = 5;

    } 
    else if(ship == "battleship"){
      shipLength = 4;
    } 
    else if(ship == "cruiser"){
      shipLength = 3;
    } 
    else if(ship == "submarine"){
      shipLength = 3;
    } 
    else if(ship == "destroyer"){
      shipLength = 2;
    } 


    if(Session.get('gameMode') == 'placing'){
      //get coordinates of cell for placing sprites
      var cell = elem.target.getBoundingClientRect(); 
      var shipImg = document.getElementById('shipPack'); 

      //To get offset of viewport
      var view = document.body.getBoundingClientRect(); 
      console.log("View's top: "+view.top);
      console.log("Cell top " + cell.top); 
      console.log(cell.top-view.top); 

      var topAccounted = (view.top-cell.top)*-1; 
      var rightAccounted = (view.right-cell.right)*-1; 
      var leftAccounted = (view.left-cell.left)*-1; 

      //For Vertical Rotation
      if(Session.get('rotation')=='vertical'){
        //cell.top boundary + (shiplength*cell.width - height of image)/2
        // var Y = cell.top + (shipLength*cell.height - shipImg.height)/2; 

        var Y = topAccounted + (shipLength*cell.height - shipImg.height)/2; 
        console.log("Y of ship pos"+Y); 

        //cell.right boundary - (width of image + (width of cell - width of image)/2)
        var X = cell.right - (shipImg.width + (cell.width-shipImg.width)/2); 

      }
      else{
        //Rotation is Horizontal
        var Y = topAccounted + (cell.height - shipImg.height)/2; 
        var X = cell.left + (cell.height*shipLength - shipImg.width)/2; 
      }
      
      Meteor.call('placeShip',
        Session.get('posX'),
        Session.get('posY'),
        Session.get('rotation'),
        shipLength, 
        X,
        Y
      );
    }
  }
});

Template.game.events({
  'click .resetGrid': function() {
    Meteor.call('initCellArray');
  },

  'click .friendly': function(elem) {
    var cellId = this._id;
    var selectedCell = Session.set('selectedCell', cellId);
    var ship = Session.get('selectedShip');
    var shipLength;

    if(ship == "carrier") shipLength = 5; 
    else if(ship == "battleship") shipLength = 4; 
    else if(ship == "cruiser") shipLength = 3;
    else if(ship == "submarine") shipLength = 3;
    else if(ship == "destroyer") shipLength = 2;


    if(Session.get('gameMode') == 'placing'){
      //get coordinates of cell for placing sprites
      var cell = elem.target.getBoundingClientRect(); 
      var shipImg = document.getElementById('shipPack'); 

      //To get offset of viewport
      var view = document.body.getBoundingClientRect(); 
      console.log("View's top: "+view.top);
      console.log("Cell top " + cell.top); 
      console.log(cell.top-view.top); 

      var topAccounted = (view.top-cell.top)*-1; 
      var rightAccounted = (view.right-cell.right)*-1; 
      var leftAccounted = (view.left-cell.left)*-1; 

      //For Vertical Rotation
      if(Session.get('rotation')=='vertical'){
        //cell.top boundary + (shiplength*cell.width - height of image)/2
        // var Y = cell.top + (shipLength*cell.height - shipImg.height)/2; 

        var Y = topAccounted + (shipLength*cell.height - shipImg.height)/2; 
        console.log("Y of ship pos"+Y); 

        //cell.right boundary - (width of image + (width of cell - width of image)/2)
        var X = cell.right - (shipImg.width + (cell.width-shipImg.width)/2); 

      }
      else{
        //Rotation is Horizontal
        var Y = topAccounted + (cell.height - shipImg.height)/2; 
        var X = cell.left + (cell.height*shipLength - shipImg.width)/2; 
      }
      
      Meteor.call('placeShip',
        Session.get('posX'),
        Session.get('posY'),
        Session.get('rotation'),
        shipLength, 
        X,
        Y,
        Session.get('shipLength')
      );
    }
  },

  'click .enemy': function(e){
    if(Session.get('gameMode')=="shooting"){
      Meteor.call('shoot',
        Session.get('posX'),
        Session.get('posY')
      );
    }
  },


  //ship placement handlers
  'click .shipSelector': function(e){
    var ship = $(e.currentTarget).attr("id");
    Session.set('gameMode', 'placing'); 
    Session.set('selectedShip', ship); 
    var shipLength;

    if(ship == "carrier") shipLength = 5;
    else if(ship == "battleship") shipLength = 4;
    else if(ship == "cruiser") shipLength = 3;
    else if(ship == "submarine") shipLength = 3;
    else if(ship == "destroyer") shipLength = 2;

    Session.set('shipLength',shipLength);

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

    // if(Session.get('gameMode') == "")
  },

  'mouseleave .friendly': function() {
    var cellId = this._id;
    Session.set('mouseState','leave');
    Session.set('leaveCell',cellId);
  },

  //To have ships follow the mouse when it is selected
  'mousemove': function(e){
    if(Session.get('gameMode') == 'placing'){

      $("#shipPack").removeClass();

      //follows mouse, but gives space for mouse to click
      $("#friendlyBoard").mousemove(function(e){
        //change offset according to rotation
        $('#shipPack').css({
          left: e.pageX + 3, 
          top: e.pageY + 3,
          visibility: "visible",
        }); 
      });
      $('#shipPack').removeClass(); 
      $('#shipPack').addClass(Session.get('rotation') + "-" + Session.get('selectedShip')); 
     }
  }
});
