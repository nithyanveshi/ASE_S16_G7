/**
 * Created by meets on 3/2/2016.
 */
module('Records test');
test('test records', function(){
    var dbString = getAllProducts();
    assert.ok(dbString, "Connection success");
});