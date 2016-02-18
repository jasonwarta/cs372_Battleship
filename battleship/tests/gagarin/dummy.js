// tests/gagarin/dummy.js
// describe('A dummy test suite', function () {
// 	var server = meteor();

//   // it('should do nothing', function () {});

//   // it('execute should work', function () {
//   //   // return a promise
//   //   return server.execute(function () {
//   //     expect(Meteor.release).not.to.be.empty;
//   //   });
//   // });

	
  
// });

describe("Cell generation test", function(){
	var server = meteor();
	var cleint = browser(server);

	it("Cells should created", function() {
		var output = client.execute( 'initGridMeteor' );

			expect(output).to.equal("success");
	});
});