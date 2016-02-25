//Get Testing Framework to Work
  //Run tests like this if they are not in any blocks (basic javascript)
//   describe('Battleship Tests', function(){
//     beforeEach(function(){
//     });  
//   it('Testing AddTwo Function', function(){
//      expect(AddTwo(2)).toEqual(4); 
//   }); 
// }); 

//Client Side Testing
//Testing Ship Selection
describe('Ship Selection: ', function(){
	var ships = ["carrier", "destroyer", "cruiser", 
         "submarine", "battleship"]; 

	it("Selecting Carrier", function(){
		var shipNum = 0; 
		Meteor.call('shipSelector',ships[shipNum]); 
		expect(Session.get('gameMode')==ships[shipNum]); 
	}); 
	it("Selecting Destroyer", function(){
		var shipNum = 1; 
		Meteor.call('shipSelector',ships[shipNum]); 
		expect(Session.get('gameMode')==ships[shipNum]); 
	}); 
	it("Selecting Cruiser", function(){
		var shipNum = 2; 
		Meteor.call('shipSelector',ships[shipNum]); 
		expect(Session.get('gameMode')==ships[shipNum]); 
	}); 
	it("Selecting Submarine", function(){
		var shipNum = 3; 
		Meteor.call('shipSelector',ships[shipNum]); 
		expect(Session.get('gameMode')==ships[shipNum]); 
	}); 
	it("Selecting Battleship", function(){
		var shipNum = 4; 
		Meteor.call('shipSelector',ships[shipNum]); 
		expect(Session.get('gameMode')==ships[shipNum]); 
	}); 
}); 
	