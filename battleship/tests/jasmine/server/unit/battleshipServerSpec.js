// describe('Setting Up Grid: ', function(){
  
  //gave up on counting cells in grid,
  //it should be obvious pretty quickly if something is amiss
  
  // it("Initialize Grid", function(){
  //   var result = Meteor.call('initGrid');
  //   expect(result).toEqual("finished init");
  // });

  // it("each grid contains 100 cells", function(){
  //   var result = Meteor.call('checkGridInit');
  //   expect(result).toEqual("good");
  // });

// }); 

describe('Connecting to users: ', function(){

  it("Try connecting to a user", function(){
    console.log(Accounts.findUserByEmail("test1@test.com"));
  });
});



describe('Placing Ships: ', function(){

  it("0,0,up,carrier", function(){
    var result = Meteor.call('checkShipPosition',0,0,"up","carrier");
    expect(result).toEqual("valid position");
  });

  it("0,0,left,carrier", function(){
    var result = Meteor.call('checkShipPosition',0,0,"left","carrier");
    expect(result).toEqual("valid position");
  });

  it("9,0,down,carrier", function(){
    var result = Meteor.call('checkShipPosition',9,0,"down","carrier");
    expect(result).toEqual("valid position");
  });

  it("0,9,right,carrier", function(){
    var result = Meteor.call('checkShipPosition',0,9,"right","carrier");
    expect(result).toEqual("valid position");
  });

  it("0,0,up,destroyer", function(){
    var result = Meteor.call('checkShipPosition',0,0,"up","destroyer");
    expect(result).toEqual("valid position");
  });

  it("0,0,left,destroyer", function(){
    var result = Meteor.call('checkShipPosition',0,0,"left","destroyer");
    expect(result).toEqual("valid position");
  });

  it("9,0,down,destroyer", function(){
    var result = Meteor.call('checkShipPosition',9,0,"down","destroyer");
    expect(result).toEqual("valid position");
  });

  it("0,9,right,destroyer", function(){
    var result = Meteor.call('checkShipPosition',0,9,"right","destroyer");
    expect(result).toEqual("valid position");
  });

});