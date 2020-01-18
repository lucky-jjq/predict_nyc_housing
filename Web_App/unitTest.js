 // Unit Test Array 
var testDataArray = predictionData;
//var entryOne = new Entry(500000,1,1,1,1,0,136.741056,0.135685359987395);
//var entryTwo = new Entry(500000,2,1,1,1,0,180.3688934,0.271782058788936);
//var entryThree = new Entry(500000,3,1,1,1,0,134.5000217,0.127334022954844);
//var entryFour = new Entry(500000,4,1,1,1,0,135.2876258,0.130289793413019);
//var entryFive = new Entry(500000,5,1,1,1,0,190.6744534,0.298799044411335);
//var entrySix = new Entry(500000,6,1,1,1,0,199.5891334,0.321073332490463);
//testDataArray.push(entryOne,entryTwo,entryThree,entryFour,entryFive,entrySix);

// Unit Test User Input
var testUserInputOne = {
    purchasePrice: 500000,
    districtCode: 3,
    roomType: 1,
    numOfBed: 1,
    numOfBath: 1,
    numOfAmenities: 0
}

var testUserInputTwo = {
    purchasePrice: 1750000,
    districtCode: 2,
    roomType: 1,
    numOfBed: 1,
    numOfBath: 1,
    numOfAmenities: 0
}

var testUserInputThree = {
    purchasePrice: 1500000,
    districtCode: 6,
    roomType: 1,
    numOfBed: 1,
    numOfBath: 1,
    numOfAmenities: 6
}

// Unit Test User Ameniites Check Boxes
    var hasWifi = true;
    var hasTV = false;
    var hasKitchen = true;
    var hasCoffeeMachine = false;
    var hasWasher = false;
    var hasDryer = false;

$(document).ready(function(){
    // Testing lookup function - input One
    console.log("Testing lookup function - ")
    console.log(lookup(testUserInputOne, testDataArray)[1]);
    console.log("Expected: 0.127334022954845");
    console.log(lookup(testUserInputOne, testDataArray)[0]);
    console.log("Expected: 134.5000217");  
    
    // Testing lookup function - input Two
    console.log("Testing lookup function - ")
    console.log(lookup(testUserInputTwo, testDataArray)[1]);
    console.log("Expected: -0.5");
    console.log(lookup(testUserInputTwo, testDataArray)[0]);
    console.log("Expected: 180.3688934"); 
    
    // Testing lookup function - input Three
    console.log("Testing lookup function - ")
    console.log(lookup(testUserInputThree, testDataArray)[1]);
    console.log("Expected: -0.378139438797655");
    console.log(lookup(testUserInputThree, testDataArray)[0]);
    console.log("Expected: 199.5891334"); 
    
    // Testing countAmenities function
    console.log("Testing countAmenities function - ")
    console.log(countAmenities(hasWifi, hasTV, hasKitchen, hasCoffeeMachine, hasWasher, hasDryer));
    console.log("Expected: 2");
});

