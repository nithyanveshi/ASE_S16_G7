function augment( receivingClass, givingClass ) {
    // only provide certain methods
    if ( arguments[2] ) {
        for ( var i = 2, len = arguments.length; i < len; i++ ) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }
    // provide all methods
    else {
        for ( var methodName in givingClass.prototype ) {
            // check to make sure the receiving class doesn't
            // have a method of the same name as the one currently
            // being processed
            if ( !Object.hasOwnProperty.call(receivingClass.prototype, methodName) ) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }

            // Alternatively (check prototype chain as well):
            // if ( !receivingClass.prototype[methodName] ) {
            //      receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            // }
        }
    }
}

var Mixin  = function() {}
Mixin.prototype = {
    postMethod: function(){
        console.log( "Inside http POST for inserting")
    },
    putMethod: function(){
        console.log( "Inside http PUT to udpate" );
    },
    deleteMethod: function(){
        console.log( "Inside http DELETE to delete" );
    },
    getMethod: function(){
        console.log( "Inside http GET for retreiving" );
    }
};

// A skeleton carAnimator constructor
function Inside() {
    //this.inside = function(){
    // console.log( "move left" );
    // };
}

// A skeleton personAnimator constructor


augment(Inside, Mixin);

var inside = new Inside();
