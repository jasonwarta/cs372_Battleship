Meteor.subscribe("shipArray"); 

//When the window is resized call function.
Meteor.startup(function() {
  $(window).resize(function(evt) {
    Session.set("resize", new Date());
  });
});

Template.titlebar.onRendered( function(){
  
});

Template.titlebar.helpers({
  'connected': function(){
    if(Session.get('connected') == "true") return true;
    else return false;
  },
  'enemy': function(){
    // console.log(Session.get('enemyId'));
    // Meteor.users.findOne()
    return Session;
  },
  'mouseStats':function(){
    return Session.get('mouseStats');
  },
  'userId':function(){
    return Meteor.userId();
  }

});

Template.titlebar.events({
  'submit form': function(event){
    event.preventDefault();
    
    var enemyID = event.target.enemy.value;

    Meteor.call('verifyID',enemyID,function(error,result){
      if(error){
        console.log(error);
      } else {
        if(result){
          Session.set('connected','true');
          Session.set('enemy',enemyID);
          Meteor.subscribe("enemyCells",enemyID);
        } else {
          console.log("invalid id");
        }
      }
    });
  },
});


function placeShipImages(rotation,shipLength,shipX,shipY, cell_coll, cell_roww){
  var ship = Session.get('selectedShip'); 
    if (rotation == "horizontal") {
      //Place the chosen ship at the given coordinates
      $('#'+ship+"_img").removeClass();  
      $('#'+ ship + "_img").addClass(Session.get('rotation') + "-" + ship);
      $('#' + ship + "_img").css({
        left: shipX,
        top: shipY
      }); 
    }
    else if(rotation == "vertical"){
      //Place the chosen ship at the given coordinates
      $('#'+ship+"_img").removeClass(); 
      $('#'+ ship + "_img").addClass(Session.get('rotation') + "-" + ship);
      $('#' + ship + "_img").css({
        left: shipX,
        top: shipY
      }); 
    }

    if(ShipArray.find({ qty: {ship_name: ship}}).fetch().ship_name == ship){
      //if ship is already in the ship array, don't add it
      console.log("ship already in array"); 
      //change orientation/update feature j-i-c
      //update cells placed
    }
    else{
      //put the ship in the collection
      ShipArray.insert({
            ship_name: ship,
            x_value : shipX,
            y_value : shipY,
            image : ship + "_img",
            image_source : "battleship_sprites_empty.png",
            rotation: rotation,
            ship_length : shipLength,
            placed : true,
            html_element : document.getElementById(ship + "_img").id,
            board_element : 'leftboard',
            cell_col: cell_coll,
            cell_row: cell_roww
          }); 
    }
}

Template.game.onRendered( function(){
 
  Meteor.call('removeAllShips'); 
  Meteor.call('initCellArray',Meteor.userId());
  
  var elems = document.getElementsByClassName('rotate');
  elems[0].focus();
  //session var to track state of rotation
  //changed by clicking 'rotate' button
  //starts at "down"
  Session.set('rotation',"vertical");
  Session.set('gameMode','init'); // 'init','placing','waiting','shooting','done'
  Session.set('selectedShip', 'none'); //'carrier', etc
  // console.log("userId: " + Meteor.call('findUser',"test2@test.com"));
  Session.set('enemyEmail','');
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
    var uId = Meteor.userId();
    return CellArray.find({createdBy:uId});
  },
  'enemyCell': function(){
    var uId = Meteor.userId();
    return CellArray.find({createdBy:{'$ne': uId} });
  },
  'shipArray': function(){
    return ShipArray.find(); 
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
        Meteor.call('placeShip',Meteor.userId(),posX,posY,rotation,shipLength);
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
  'shipArray': function(){
    console.log("in shiparray, access please?"); 
    console.log(ShipArray.find({ship_name: "carrier"}).fetch()); 
  },
  //When window resizes, change ships to correct position
  // 'resize': function(){
  //    var shiparray = ['carrier', 'submarine', 'destroyer', 'cruiser', 'battleship'];
  //   //Loop through ship array to put ships in correct location
  //   console.log("shot"); 
    
  //   for(var i=0; i<shiparray.length; ++i){
      
  //     var e = ShipArray.findOne({ship_name: shiparray[i]});

  //     if(e){
  //       var shipName = e.ship_name; 
  //       var shipImg = document.getElementById(shipName+"_img"); //element of corresponding ship image

  //         //get coordinates of cell for placing sprites
  //         var grid = document.getElementById("leftBoard"); 
  //         var leftgrid = grid.getBoundingClientRect();
  //         var top_left_cell_x = leftgrid.left; 
  //         console.log("Grid x: "+leftgrid.left);
  //         var top_left_cell_y = leftgrid.top; 
  //         console.log("Grid y: "+leftgrid.top);
                                              //GRID NEEDS TO BE 'ACCOUNTED' FOR
                                              //SEE BELOW FOR TERM (1)
  //         var cell_col = e.cell_col; 
  //         var cell_row = e.cell_row; 

  //         var cell_width = 32; 

  //         var cell_left = top_left_cell_x; 
  //         var cell_top = top_left_cell_y; 

  //         //find cell's coordinates based on grid position and col&row
  //         for(var i=0; i<cell_col; ++i){
  //           cell_left += cell_width;
  //         }
  //         for(var i=0; i<cell_row; ++i){
  //           cell_top += cell_width; 
  //         }

  //         var cell_right = cell_left + cell_width; 
  //         var shipLength = e.ship_length; 
          
  //         //To get offset of viewport
  //         var view = document.body.getBoundingClientRect(); 

  //         var topAccounted = (view.top-cell_top)*-1;        //<- LIKE THIS (2)
  //         var rightAccounted = (view.right-cell_right)*-1; 
  //         var leftAccounted = (view.left-cell_left)*-1; 

  //         //For Vertical Rotation
  //         if(Session.get('rotation')=='vertical'){
  //           //cell.top boundary + (shiplength*cell.width - height of image)/2
  //           var Y = topAccounted + (shipLength*cell_width - shipImg.height)/2; 
  //           //cell.right boundary - (width of image + (width of cell - width of image)/2)
  //           var X = cell_right - (shipImg.width + (cell_width-shipImg.width)/2); 

  //         }
  //         else{
  //           //Rotation is Horizontal
  //           var Y = topAccounted + (cell_width - shipImg.height)/2; 
  //           var X = cell_left + (cell_width*shipLength - shipImg.width)/2; 
  //         }
  //         //Place ship images on client side
  //         placeShipImages(e.rotation,shipLength,X,Y,cell_col,cell_row); 
  //       }

  //     } 
  //   //return Session.get("resize");
  // },

});

Template.game.events({
  'click .resetGrid': function() {
    Meteor.call('initCellArray',Meteor.userId());
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

      var topAccounted = (view.top-cell.top)*-1; 
      var rightAccounted = (view.right-cell.right)*-1; 
      var leftAccounted = (view.left-cell.left)*-1; 

      //For Vertical Rotation
      if(Session.get('rotation')=='vertical'){
        //cell.top boundary + (shiplength*cell.width - height of image)/2
        // var Y = cell.top + (shipLength*cell.height - shipImg.height)/2; 

        var Y = topAccounted + (shipLength*cell.height - shipImg.height)/2; 

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
        shipLength
      );

      //Place ship images on client side
      placeShipImages(Session.get('rotation'),shipLength,X,Y,this.col,this.row); 
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



Meteor.subscribe('friendlyCells',Meteor.userId());
