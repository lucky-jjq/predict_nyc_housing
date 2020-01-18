// Retracting header - smaller height value as the page scrolls down
$(function() {
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 75) {
            $("header").addClass('retract');
        } else {
            $("header").removeClass("retract");
        }
    });
    submitPropertyData();
});

function submitPropertyData () {
  $('#submit').on('click', function(e) {
    e.preventDefault();
    // Register user inputs
    var purchasePrice = parseInt($("#purchasePrice").val(),10);
    var district = $("#district").val();
    var roomType = parseInt($("#roomType").val(),10);
    var numOfBed = parseInt($("#numOfBed").val(),10);
    var numOfBath = parseInt($("#numOfBath").val(),10);
    var hasWifi = $("#wifi").is(":checked");
    var hasTV = $("#tv").is(":checked");
    var hasKitchen = $("#kitchen").is(":checked");
    var hasCoffeeMachine = $("#coffeeMachine").is(":checked");
    var hasWasher = $("#washer").is(":checked");
    var hasDryer = $("#dryer").is(":checked");
    var districtCode = codifyDistrict(district);
    var numOfAmenities = countAmenities(hasWifi, hasTV, hasKitchen, hasCoffeeMachine, hasWasher, hasDryer);
    var dataArray = predictionData;
    var errorCount = 0;
        
    var userInput = {
        purchasePrice,
        districtCode,
        roomType,
        numOfBed,
        numOfBath,
        numOfAmenities
    }
    
    if (!checkValid(userInput.purchasePrice)) {
        errorCount++;
    }
    if (!checkValid(userInput.districtCode)) {
        errorCount++;
    }
    if (!checkValid(userInput.roomType)) {
        errorCount++;
    }
    if (!checkValid(userInput.numOfBed)) {
        errorCount++;
    }
    if (!checkValid(userInput.numOfBath)) {
        errorCount++;
    }
    if (!checkValid(userInput.numOfAmenities)) {
        errorCount++;
    }
    if(errorCount > 0) {
        alert("Please make sure you input in all fields");
        return
    }

    $("html, body").animate({ scrollTop: $('#returnProfile').offset().top - 60 }, 500);
    console.log(userInput);
    console.log(dataArray);
    var returnedData = lookup(userInput,dataArray);
    console.log(returnedData[0]);
    console.log(returnedData[1]);
    $("#irr").html((returnedData[1]*100).toFixed(0) + "%");
    $("#nightlyRate").html("$" + (returnedData[0]).toFixed(0));
    
    $('#displayGraphs').css("visibility","visible");
  });
}

// Object storing one row of data in the csv file into an "entry" object
function Entry(dataPrice, dataDistrictCode, dataRoomType, dataNumOfBed, dataNumOfBath, dataNumOfAmenities, dataNightlyRate, dataIRR) {
    this.dataPrice = dataPrice;
    this.dataDistrictCode = dataDistrictCode;
    this.dataRoomType = dataRoomType;
    this.dataNumOfBed = dataNumOfBed;
    this.dataNumOfBath = dataNumOfBath;
    this.dataNumOfAmenities = dataNumOfAmenities;
    this.dataNightlyRate = dataNightlyRate;
    this.dataIRR = dataIRR;
}

// The following function counts the number of amenities boxes checked by the user
// The check boxes will be simplified and the number of checks is counted
function countAmenities(amenityOne, amenityTwo, amenityThree, amenityFour, amenityFive, amenitySix) {
    var numOfAmenities = 0;
    if (amenityOne == true) {
        numOfAmenities++;
    }
    if (amenityTwo == true) {
        numOfAmenities++;
    }
    if (amenityThree == true) {
        numOfAmenities++;
    }
    if (amenityFour == true) {
        numOfAmenities++;
    }
    if (amenityFive == true) {
        numOfAmenities++;
    }
    if (amenitySix == true) {
        numOfAmenities++;
    }
    return numOfAmenities;
}

// The following function converts the district into codes from 1 to 6
// Collapsing the data in six columns into one key-value pair where the value is a district code
function codifyDistrict(district) {
    var districtCode;
    if(district == "middle_south") {
        districtCode = 1;
    } else if (district == "near_south") {
        districtCode = 2;
    } else if (district == "west") {
        districtCode = 3;
    } else if (district == "east") {
        districtCode = 4;
    } else if (district == "north") {
        districtCode = 5;
    } else if (district == "center") {
        districtCode = 6;
    }
    return districtCode;
}

// Look up combination of user inputs from data array
// At the index number where all six attributes matches, the IRR and nightly rate data will be stored in the result array
// Return result array
function lookup(userInput, dataArray) {
    var dataReturnArray = [];
    for(var i = 0; i < dataArray.length; i++) {
        var numOfMatchingAttributes = 0;
        if (userInput.purchasePrice == dataArray[i].dataPrice) {
            numOfMatchingAttributes++;
        }
        if (userInput.districtCode == dataArray[i].dataDistrictCode) {
            numOfMatchingAttributes++;
        }
        if (userInput.roomType == dataArray[i].dataRoomType) {
            numOfMatchingAttributes++;
        }
        if (userInput.numOfBed == dataArray[i].dataNumOfBed) {
            numOfMatchingAttributes++;
        }
        if (userInput.numOfBath == dataArray[i].dataNumOfBath) {
            numOfMatchingAttributes++;
        }
        if (userInput.numOfAmenities == dataArray[i].dataNumOfAmenities) {
            numOfMatchingAttributes++;
        }
        if (numOfMatchingAttributes == 6) {
            dataReturnArray = [dataArray[i].dataNightlyRate, dataArray[i].dataIRR]
//            console.log(userInput.numOfAmenities + " AND " + dataArray[i].dataNumOfAmenities);
//            console.log(i);
        }
    }
    return dataReturnArray;
}

// If all user inputs are valid, the resulting value of each key-value pair is an int
// Through this logic, check if the user has input in each field
function checkValid(input) {
    return Number.isInteger(input);
}

