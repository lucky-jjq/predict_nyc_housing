$(function() {
    submitPropertyData();
});


function submitPropertyData () {
  $('#submit').on('click', function(e) {
    e.preventDefault();
    var dataArray = [];
    console.log(data);

    // Check if user file format is valid
    if(!checkInputFile($("#csv-file").val(),".csv")) {
          alert("Please submit the valid CSV file");
          return;
    }
    
    // Parse csv data into right format
    for(var i = 0; i < data.data.length; i++) {
    var csvUnitCost = parseInt(data.data[i].unitCost,10);

    var csvDistrictCode = 0;
    if (parseInt(data.data[i].is_middle_south,10) == 1) {
        csvDistrictCode = 1;
    } else if (parseInt(data.data[i].is_near_south,10) == 1) {
        csvDistrictCode = 2;
    } else if (parseInt(data.data[i].is_west,10) == 1) {
        csvDistrictCode = 3;
    } else if (parseInt(data.data[i].is_east,10) == 1) {
        csvDistrictCode = 4;
    } else if (parseInt(data.data[i].is_north,10) == 1) {
        csvDistrictCode = 5;
    } else if (parseInt(data.data[i].is_center,10) == 1) {
        csvDistrictCode = 6;
    }

    var csvRoomType = 0;
    if (parseInt(data.data[i].room_type_Entire_homeapt,10) ==1) {
        csvRoomType = 1;
    } else if (parseInt(data.data[i].room_type_Private_room,10) ==1) {
        csvRoomType = 0;
    }

    var csvNumOfBed = parseInt(data.data[i].bedrooms,10);
    var csvNumOfBath = parseInt(data.data[i].bathrooms,10);
    var csvNumOfAmenities = parseInt(data.data[i].numOfAmenity,10);
    var csvNightlyRate = parseFloat(data.data[i].predicted_price,10);
    var csvIRR = parseFloat(data.data[i].IRR,10);

    var entry = new Entry(csvUnitCost, csvDistrictCode, csvRoomType, csvNumOfBed, csvNumOfBath, csvNumOfAmenities, csvNightlyRate, csvIRR);
    dataArray.push(entry);
    }
    console.log(JSON.stringify(dataArray));
    $('#displayResult').html(JSON.stringify(dataArray));
  }
)}

// Object storing one row of data in the csv file
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

var data;
 
// Check if the user submitted a proper CSV file
function checkInputFile(filePath,fileName) {
    var path = filePath;
    var validFileName = fileName;
    if (path.indexOf(validFileName) < 0) {
        return false;
    } else {
        return true;
    }
}

  function handleFileSelect(evt) {
    var file = evt.target.files[0];
 
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        data = results;
      }
    });
  }
 
  $(document).ready(function(){
    $("#csv-file").change(handleFileSelect);
  });