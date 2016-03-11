
// A constructor for defining new cars
function Storage(options) {
    // some defaults
    this.username = options.username || localStorage.getItem("username");
    this.age=options.age || 23;
    this.root=options.root || "ASE LAB PROJECT";
}

// A constructor for defining new trucks


// Define a skeleton vehicle factory
function StorageFactory() {}
// Define the prototypes and utilities for this factory

// Our default vehicleClass is Car
StorageFactory.prototype.storageClass = Storage;

// Our Factory method for creating new Vehicle instances
StorageFactory.prototype.createStorage = function ( options ) {


    return new this.storageClass( options );
};

// Create an instance of our factory that makes cars
//var storageFactory = new StorageFactory();
//var storage = storageFactory.createStorage({});

// Test to confirm our car was created using the vehicleClass/prototype Car

// Outputs: true
//console.log(car instanceof Car);

// Outputs: Car object of color "yellow", doors: 6 in a "brand new" state
//onsole.log(car.username);
