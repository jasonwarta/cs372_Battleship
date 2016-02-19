//Get Testing Framework to Work
  //Run tests like this if they are not in any blocks (basic javascript)
  describe('Battleship Tests', function(){
    beforeEach(function(){
    });  
  it('Testing AddTwo Function', function(){
     expect(AddTwo(2)).toEqual(4); 
  }); 
}); 

//Test Meteor Method Functions
  //Test method functions in this format or they will return undefined
    //see-> http://stackoverflow.com/questions/17460123/meteor-methods-returns-undefined
describe('Testing Meteor Methods', function(){
  it('Testing addThree, added method', function(){
    Meteor.call('addThree',4), function(error, result){
      if (error){
        console.log(error.reason); 
        return; 
      }
        expect(Meteor.call('addThree',4)).toEqual(7); 
    }
  }); 

  it('Testing intiGridMeteor', function(){
    Meteor.call('intiGridMeteor'), function(error, result){
      if (error){
        console.log(error.reason); 
        return; 
      }
        expect(Meteor.call('intiGridMeteor')).toEqual("success"); 
    }
  }); 
}); 
