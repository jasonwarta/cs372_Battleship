describe('Testing Meteor Methods', function(){
  // it('Testing addThree, added method', function(){
  //   Meteor.call('addThree',4), function(error, result){
  //     if (error){
  //       console.log(error.reason); 
  //       return; 
  //     }
  //       expect(Meteor.call('addThree',4)).toEqual(7); 
  //   }
  // }); 

  it('Testing Grid initialization', function(){


    var result = Meteor.call('initGrid');
    expect(result).toEqual("success");

    
  });

  // it('Testing adding three method', function() {
  //   expect(Meteor.call('addThree',4)).toEqual(7);
  // });
}); 
