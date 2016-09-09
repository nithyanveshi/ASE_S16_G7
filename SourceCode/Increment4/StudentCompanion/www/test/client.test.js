/**
 * Created by meets on 3/2/2016.
 */
module('Records test');
test('test records', function(){
    var getProductsStatus = getAllProducts();
    assert.equal(getProductsStatus, "success", "Products fetched correctly");
});
