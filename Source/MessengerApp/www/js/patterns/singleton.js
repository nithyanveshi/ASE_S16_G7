var Admin = (function () {
  // Instance stores a reference to the Singleton
  var instance;

  function init() {
    // Singleton
    // Private methods and variables
    function privateMethod(){
        console.log( "I am private" );
    }

    var privateVariable = "Im also private";

    return {
      // Public methods
      adminName: function () {
        return instance.firstName +" "+instance.lastName;
      },
      //Public Properties
      firstName : "Santosh",
      lastName : "Kumar"
    };
  };

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }
  };
})();