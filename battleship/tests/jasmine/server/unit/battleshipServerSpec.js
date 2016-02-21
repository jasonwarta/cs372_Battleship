describe('Setting Up Grid: ', function(){
  

  it("Initialize Grid", function(){
    var result = Meteor.call('initGrid');
    expect(result).toEqual("finished init");
  });

}); 


describe('Placing Ships:', function(){

  it("Place ship: 0,0,up,carrier", function(){
    var result = Meteor.call('checkShipPosition',0,0,5,"up");
    expect(result).toEqual("valid position");
  });

  it("Place ship: 0,0,left,carrier", function(){
    var result = Meteor.call('checkShipPosition');
    expect(result).toEqual("valid position");
  });

  it("Place ship: 9,0,down,carrier", function(){
    var result = Meteor.call('checkShipPosition');
    expect(result).toEqual("valid position");
  });

  it("Place ship: 0,9,right,carrier", function(){
    var result = Meteor.call('checkShipPosition');
    expect(result).toEqual("valid position");
  });

});