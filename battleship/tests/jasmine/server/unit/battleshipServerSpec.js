describe('Setting Up Grid: ', function(){
  

  it("Initialize Grid", function(){
    var result = Meteor.call('initGrid');
    expect(result).toEqual("finished init");
  });

  it("check validity", function(){
    var result = Meteor.call('checkGridInit');
    expect(result).toEqual("good");
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