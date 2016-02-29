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



describe('Check ship positions: ', function(){

  //top left corner
  it("0,0,horizontal,cruiser",function(){
    var result = Meteor.call('checkShipPosition',0,0,"horizontal",3);
    expect(result).toEqual("valid position");
  });

  it("0,0,vertical,cruiser",function(){
    var result = Meteor.call('checkShipPosition',0,0,"vertical",3);
    expect(result).toEqual("valid position");
  });

  //bottom left corner
  it("9,0,horizontal,cruiser",function(){
    var result = Meteor.call('checkShipPosition',9,0,"horizontal",3);
    expect(result).toEqual("valid position");
  });

  it("9,0,vertical,cruiser",function(){
    var result = Meteor.call('checkShipPosition',9,0,"vertical",3);
    expect(result).toEqual("invalid position");
  });

  //top right corner
  it("0,9,horizontal,cruiser",function(){
    var result = Meteor.call('checkShipPosition',0,9,"horizontal",3);
    expect(result).toEqual("invalid position");
  });

  it("0,9,vertical,cruiser",function(){
    var result = Meteor.call('checkShipPosition',0,9,"vertical",3);
    expect(result).toEqual("valid position");
  });

  //bottom right corner
  it("9,9,horizontal,cruiser",function(){
    var result = Meteor.call('checkShipPosition',9,9,"horizontal",3);
    expect(result).toEqual("invalid position");
  });

  it("9,9,vertical,cruiser",function(){
    var result = Meteor.call('checkShipPosition',9,9,"vertical",3);
    expect(result).toEqual("invalid position");
  });
});