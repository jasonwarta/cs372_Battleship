// tests/gagarin/dummy.js
describe('A dummy test suite', function () {
	var server = meteor();

  it('should do nothing', function () {});

  it('execute should work', function () {
    // return a promise
    return server.execute(function () {
      expect(Meteor.release).not.to.be.empty;
    });
  });

  
});