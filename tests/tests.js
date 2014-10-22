var es = require("../elasticsearch-orm");
var expect = require("expect.js");

describe("Schema", function() {
    it("can be instantiated", function() {
        new es.Schema();
    });

    it("can be instantiated with empty object", function() {
        new es.Schema({});
    });

    it("can be instantiated with basic schema", function() {
        new es.Schema({
            name: String
        });
    });
});

describe("Model", function() {
    var schema;

    before(function() {
        schema = new es.Schema({
            name: String
        });
    });

    it("throws an error if it doesn't exist", function() {
        expect(function() {
            es.model("Nope");
        }).to.throwError(/Model not registered: Nope/);
    });

    it("can be built from a schema", function() {
        es.model("Test", schema);
    });

    it("can be accessed later", function() {
        es.model("Test", schema);
        var Test = es.model("Test");
        expect(Test).to.be.ok();
    });

    it("can be instantiated", function() {
        var Test = es.model("Test", schema);
        var test = new Test();
        expect(test).to.be.ok();
    });

    it("can set and get a property", function() {
        var Test = es.model("Test", schema);
        var test = new Test();
        test.name = "John";
        expect(test.name).to.equal("John");
    });
});

describe("String Schema Type", function() {
    it("check validation on property set", function() {
        var Test = es.model("Test", new es.Schema({
            name: String
        }));

        var test = new Test();
        test.name = false;
        expect(test.name).to.equal("false");

        expect(function() {
            test.name = null;
        }).to.throwError(/Not a valid string/);

        expect(function() {
            test.name = undefined;
        }).to.throwError(/Not a valid string/);

        expect(function() {
            test.name = {};
        }).to.throwError(/Not a valid string/);
    });

    it("check schema type", function() {
        var Test = es.model("Test", new es.Schema({
            name: {type: String}
        }));

        var test = new Test();
        test.name = false;
        expect(test.name).to.equal("false");
    });

    it("check schema string type", function() {
        var Test = es.model("Test", new es.Schema({
            name: {type: "string"}
        }));

        var test = new Test();
        test.name = false;
        expect(test.name).to.equal("false");
    });

    it("check default value", function() {
        var Test = es.model("Test", new es.Schema({
            name: {type: String, default: "test"}
        }));

        var test = new Test();
        expect(test.name).to.equal("test");

        test.name = 4;
        expect(test.name).to.equal("4");
    });

    it("check schema enum type", function() {
        var Test = es.model("Test", new es.Schema({
            name: {type: String, "enum": [
                "cat", "dog"
            ]}
        }));

        var test = new Test();
        test.name = "cat";
        expect(test.name).to.equal("cat");

        expect(function() {
            test.name = "test";
        }).to.throwError(/Expected enum value not found/);
    });

    it("lowercase", function() {
        var Test = es.model("Test", new es.Schema({
            name: {type: String, lowercase: true}
        }));

        var test = new Test();
        test.name = "Cat";
        expect(test.name).to.equal("cat");
    });

    it("uppercase", function() {
        var Test = es.model("Test", new es.Schema({
            name: {type: String, uppercase: true}
        }));

        var test = new Test();
        test.name = "Cat";
        expect(test.name).to.equal("CAT");
    });

    it("trim", function() {
        var Test = es.model("Test", new es.Schema({
            name: {type: String, trim: true}
        }));

        var test = new Test();
        test.name = "       Cat   \n\t ";
        expect(test.name).to.equal("Cat");
    });
});

describe("Number Schema Type", function() {
    it("check validation on property set", function() {
        var Test = es.model("Test", new es.Schema({
            val: Number
        }));

        var test = new Test();
        test.val = 5;
        expect(test.val).to.equal(5);

        test.val = "3";
        expect(test.val).to.equal(3);

        test.val = "3.1459";
        expect(test.val).to.equal(3.1459);

        expect(function() {
            test.val = "lemon";
        }).to.throwError(/Not a number/);
    });

    it("check schema type", function() {
        var Test = es.model("Test", new es.Schema({
            val: {type: Number}
        }));

        var test = new Test();
        test.val = "3";
        expect(test.val).to.equal(3);
    });

    it("check schema number type", function() {
        var Test = es.model("Test", new es.Schema({
            val: {type: "number"}
        }));

        var test = new Test();
        test.val = "3";
        expect(test.val).to.equal(3);
    });

    it("check default value", function() {
        var Test = es.model("Test", new es.Schema({
            val: {type: Number, default: 3}
        }));

        var test = new Test();
        expect(test.val).to.equal(3);

        test.val = "4";
        expect(test.val).to.equal(4);
    });

    it("check min", function() {
        var Test = es.model("Test", new es.Schema({
            val: {type: Number, min: 2}
        }));

        var test = new Test();

        test.val = 3;
        expect(test.val).to.equal(3);

        expect(function() {
            test.val = 1;
        }).to.throwError(/Expected value to be greater than 2/);
    });

    it("check max", function() {
        var Test = es.model("Test", new es.Schema({
            val: {type: Number, max: 3}
        }));

        var test = new Test();

        test.val = 2;
        expect(test.val).to.equal(2);

        expect(function() {
            test.val = 4;
        }).to.throwError(/Expected value to be less than 3/);
    });
});

describe("Date Schema Type", function() {
    it("check validation on property set", function() {
        var Test = es.model("Test", new es.Schema({
            val: Date
        }));

        var testTime = (new Date("2014/10/17")).getTime();

        var test = new Test();
        test.val = "2014/10/17";
        expect(test.val.getTime()).to.equal(testTime);

        test.val = new Date("2014/10/17");
        expect(test.val.getTime()).to.equal(testTime);

        expect(function() {
            test.val = "foo";
        }).to.throwError(/Invalid time value/);
    });

    it("check schema type", function() {
        var Test = es.model("Test", new es.Schema({
            val: {type: Date}
        }));

        var testTime = (new Date("2014/10/17")).getTime();

        var test = new Test();
        test.val = "2014/10/17";
        expect(test.val.getTime()).to.equal(testTime);
    });

    it("check schema date type", function() {
        var Test = es.model("Test", new es.Schema({
            val: {type: "date"}
        }));

        var testTime = (new Date("2014/10/17")).getTime();

        var test = new Test();
        test.val = "2014/10/17";
        expect(test.val.getTime()).to.equal(testTime);
    });

    it("check default value", function() {
        var nowTime = Date.now();

        var Test = es.model("Test", new es.Schema({
            val: {
                type: Date,
                default: function() {
                    return nowTime;
                }
            }
        }));

        var test = new Test();
        expect(test.val.getTime()).to.equal(nowTime);

        var testTime = (new Date("2014/10/17")).toString();
        test.val = "2014/10/17";
        expect(test.val.toString()).to.equal(testTime);
    });
});

describe("Array Schema Type", function() {
    it("check validation on property set", function() {
        var Test = es.model("Test", new es.Schema({
            names: [String]
        }));

        var test = new Test();
        test.names = [false];
        expect(test.names[0]).to.equal("false");

        expect(function() {
            test.names = [{}];
        }).to.throwError(/Not a valid string/);

        expect(function() {
            test.names = null;
        }).to.throwError(/Not a valid array/);

        expect(function() {
            test.names = undefined;
        }).to.throwError(/Not a valid array/);

        expect(function() {
            test.names = "foo";
        }).to.throwError(/Not a valid array/);
    });

    it("check validation on push", function() {
        var Test = es.model("Test", new es.Schema({
            names: [String]
        }));

        var test = new Test();
        test.names = ["test"];
        test.names.push(false);
        expect(test.names[1]).to.equal("false");
    });

    it("check validation on unshift", function() {
        var Test = es.model("Test", new es.Schema({
            names: [String]
        }));

        var test = new Test();
        test.names = ["test"];
        test.names.unshift(false);
        expect(test.names[0]).to.equal("false");
    });

    it("should exist by default", function() {
        var Test = es.model("Test", new es.Schema({
            names: [String]
        }));

        var test = new Test();
        test.names.push(false);
        expect(test.names[0]).to.equal("false");
    });

    it("allow for anything to be inside of it", function() {
        var Test = es.model("Test", new es.Schema({
            names: []
        }));

        var test = new Test();
        test.names.push(false);
        test.names.push("hello");
        expect(test.names[0]).to.equal(false);
        expect(test.names[1]).to.equal("hello");
    });

    it("verify Array schema", function() {
        var Test = es.model("Test", new es.Schema({
            names: Array
        }));

        var test = new Test();
        test.names.push(false);
        test.names.push("hello");
        expect(test.names[0]).to.equal(false);
        expect(test.names[1]).to.equal("hello");
    });

    it("check default value", function() {
        var Test = es.model("Test", new es.Schema({
            names: {
                type: Array,
                default: function() {
                    return [false];
                }
            }
        }));

        var test = new Test();
        test.names.push(true);
        expect(test.names[0]).to.equal(false);
        expect(test.names[1]).to.equal(true);
    });
});

// TODO: Test enumerable status of objects
// Also enumerable of model properties

describe("Object Schema Type", function() {
    it("check validation on property set", function() {
        var Test = es.model("Test", new es.Schema({
            names: {
                name: String,
                age: Number
            }
        }));

        var test = new Test();
        test.names = {
            name: false,
            age: "30"
        };
        expect(test.names.name).to.equal("false");
        expect(test.names.age).to.equal(30);

        expect(function() {
            test.names = {name: {}};
        }).to.throwError(/Not a valid string/);

        expect(function() {
            test.names = null;
        }).to.throwError(/Not a valid object/);

        expect(function() {
            test.names = undefined;
        }).to.throwError(/Not a valid object/);

        expect(function() {
            test.names = "foo";
        }).to.throwError(/Not a valid object/);
    });

    it("check validation on property set", function() {
        var Test = es.model("Test", new es.Schema({
            names: {
                name: String,
                age: Number
            }
        }));

        var test = new Test();
        test.names = {};
        test.names.name = false;
        expect(test.names.name).to.equal("false");
    });

    it("should exist by default", function() {
        var Test = es.model("Test", new es.Schema({
            names: {
                name: String,
                age: Number
            }
        }));

        var test = new Test();
        test.names.name = false;
        expect(test.names.name).to.equal("false");
    });

    it("allow for anything to be inside of it", function() {
        var Test = es.model("Test", new es.Schema({
            names: {}
        }));

        var test = new Test();
        test.names.name = false;
        test.names.age = "hello";
        expect(test.names.name).to.equal(false);
        expect(test.names.age).to.equal("hello");
    });

    it("verify Object schema", function() {
        var Test = es.model("Test", new es.Schema({
            names: Object
        }));

        var test = new Test();
        test.names.name = false;
        test.names.age = "hello";
        expect(test.names.name).to.equal(false);
        expect(test.names.age).to.equal("hello");
    });

    it("check default value", function() {
        var Test = es.model("Test", new es.Schema({
            names: {
                type: Object,
                name: String,
                val: Number,
                default: function() {
                    return {
                        name: false,
                        val: "3"
                    };
                }
            }
        }));

        var test = new Test();
        expect(test.names.name).to.equal("false");
        expect(test.names.val).to.equal(3);
    });
});