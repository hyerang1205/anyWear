var listOfImgs = ["https://dummyimage.com/200x200/FFF3DA/ffffff&text=Img+1",
                      "https://dummyimage.com/200x200/FFF3DA/ffffff&text=Img+2",
                      "https://dummyimage.com/200x200/FFF3DA/ffffff&text=Img+3",
                      "https://dummyimage.com/200x200/FFF3DA/ffffff&text=Img+4",
                      "https://dummyimage.com/200x200/FFF3DA/ffffff&text=Img+5",
                      "https://dummyimage.com/200x200/FFF3DA/ffffff&text=Img+6"];

var listOfDestinations = ["Japan",
                          "Canada",
                          "Tokyo, Japan",
                          "Seoul, Korea",
                          "Toronto, Canada",
                          "Florida, USA"];

var listOfDates = ["October 21, 2018, November 30, 2018",
                  "October 21, 2018, November 30, 2018",
                  "October 21, 2018, November 30, 2018",
                  "October 21, 2018, November 30, 2018",
                  "October 21, 2018, November 30, 2018",
                  "October 21, 2018, November 30, 2018"];

var listOfBag = ["20-30l",
                  "35-40l",
                  "40-45l",
                  "45-50l",
                  "50-65l",
                  "65-75l"  ];



var nameOfUser = "Group 33"




$(document).ready(function(){

  $.ajaxSetup({
      headers: { 'x-auth-token': localStorage.getItem('token') }
    });

  function getTrips(callback){
    $.ajax({
        type: 'get',
        url: '/api/trips',
        success: function(data){
          console.log(data.trips);
          callback(data.trips);
        },
        error: function(e){
            console.log(e.responseText); 
            // TODO: Display error to user
        }
    });
  }

  function getUser(callback) {
    $.ajax({
      type: 'get',
      url: '/api/users/me'

    })
  }

  $('#trips_nav').addClass('active');
  var tripContainer = $('#trip_container');

  // NAMING THE TRIPS WITH THE USERS NAME
  var page_title = $('#page_title');
  page_title.text(nameOfUser + " Trips");

// <div class="trip_con">
//   <div class="trip_background_con">
//     <h2 class="trip_title"></h2>
//     <p class="white-text trip_description"></p>
//   </div>
// </div>
  function populatePage(trips){
    for (var i = 0; i < listOfImgs.length; i++) {
      var tripCon = $('<div class="trip_con"></div>');
      var tripBackgroundCon = $('<div class="trip_background_con"></div>');
      var tripTitle = $('<h5 class="trip_title"></h5>');
      var tripDate = $('<p class="white-text trip_description"></p>');
      var tripBag = $('<p class="white-text trip_description"></p>');

      var icon = $('<i class="icon_delete grey-text material-icons">more_vert</i>');

      var overlayMenu = $('<div class="overlay_menu"></div>');
      var overlayCon = $('<div class="overlay_con"></div>');
      overlayMenu.append(overlayCon);

      var overlayTop = $('<div class="overlay_top"></div>');
      var overlayPTop = $('<p class="overlay_p_top">Edit</p>');
      overlayTop.append(overlayPTop);

      var overlayBottom = $('<div class="overlay_bottom"></div>');
      var overlayPBottom = $('<p class="overlay_p_bottom">Remove</p>');
      overlayBottom.append(overlayPBottom);

      overlayCon.append(overlayTop, overlayBottom);

      tripBackgroundCon.append(icon, tripTitle, tripDate, tripBag);
      tripCon.append(tripBackgroundCon, overlayMenu);

      //setting each trip con with it's relevant details.
      tripCon.attr("data-key", `key ${i}`);
      tripCon.attr("data-destination", `destination ${i}`);
      tripCon.attr("data-checkin", `checkin ${i}`);
      tripCon.attr("data-checkout", `checkOut ${i}`);
      tripCon.attr("data-bagsize", listOfBag[i]);



      tripTitle.html(listOfDestinations[i]);
      tripDate.html(listOfDates[i]);
      tripBag.html(listOfBag[i]);
      var backgroundStyle = {'background-image': 'url(' + '\"' + listOfImgs[i] + '\"'+ ')'}
      tripCon.css(backgroundStyle);
      tripCon.attr('data-key', i);

      tripContainer.append(tripCon);

    }
  }

  // getTrips will grab all related trips to the user,
  // populatePage will be called as a callback once all the trips are found
  getTrips(populatePage);


  // OPENING A TRIP SO I NEED TO GO TO A DIFFERENT PAGE
  $('.trip_con').on('click', function(e) {
    if($(e.target).hasClass('icon_delete')
        || $(e.target).hasClass('overlay_top')
        || $(e.target).hasClass('overlay_p_bottom')
        || $(e.target).hasClass('overlay_bottom')
        || $(e.target).hasClass('overlay_p_top')) {

    } else {
      //GO TO THE SPECIFIED PAGE USING KEY VALUE
      // // TODO post the url with key of trip.
      // var tripKey = $(this).data('key');
      // $.ajax({
      //   type: 'POST',
      //   url: '/....../${tripKey}',
      //   data: ,
      //   success: function(content) {
      //     $()
      //   }
      // });
      // return false;

      // window.location='/trip';

      window.location='/trip';
    }
  });







  //CLOSING ANY OPEN SUBMENU IF YOU CLICK OUTSIDE OF IT
  var submenuOpen = 0;
  $(document).mouseup(function (e) {
     if (!$('.cloth_figure').is(e.target) // if the target of the click isn't the container...
     && $('.cloth_figure').has(e.target).length === 0
      && submenuOpen == 1) // ... nor a descendant of the container
     {
       $('.overlay_menu').slideUp(200);
       submenuOpen = 0;
    }
   });

   var selectedTrip = 0;
   var selectedTripKey = 0;
  //OPENING THE SUBMENU FOR A TRIP
  $('.icon_delete').on('click', function() {
    selectedTrip = $(this).parent().parent();
    if (selectedTrip.children('.overlay_menu').css('display') == "none") {
      $('.overlay_menu').slideUp(200);
    }
    selectedTrip.children('.overlay_menu').slideToggle(200);
    submenuOpen = 1;
  });



  //REMOVING A TRIP
  $('.overlay_bottom').on('click', function() {
    // TODO: Provide a warning if you try to remove.
    $(this).parent().parent().parent().fadeOut('200', function() {
      $(this).remove();
      //TODO REMOVE FROM THE DATABASE
    });;
  });


  //OPENING CALENDAR WITH RESTRICTIONS:
  //WHEN CHECKIN CALENDAR IS OPENED, THEN CHECKOUT CANNOT BE LESS THAT CHECKIN
  //CHECKIN MUST ALSO START ON TODAY
  //WHEN CHECKOUT IS SELECTED FIRST, THEN CHECK IN CANNOT EXCEED CHECKIN
  var date = new Date();
  var checkInDate = 0;
  var maxDate = 0;
  $("#check_in_input").datepicker({
      startDate: date,
      defaultDate: date,
      minDate: date,
      minYear: '2018',
      onClose: function() {
        date = new Date($('#check_in_input').val());
        console.log(date);
        $('#check_out_input').datepicker({
            startDate: date,
            minYear: '2018',
            minDate: date,
            defaultDate: date
        });
      }
  });

  $("#check_out_input").datepicker({
      startDate: date,
      defaultDate: date,
      minDate: date,
      minYear: '2018',
      onClose: function() {
        date = new Date($('#check_out_input').val());
        console.log(date);
        $('#check_in_input').datepicker({
            startDate: new Date(),
            minYear: '2018',
            minDate: new Date(),
            maxDate: date,
            defaultDate: new Date()
        });
      }
  });
  // .on("onClose", function(e) {
  //   var checkInDate = e.date;
  //   console.log(checkInDate);
  //   var $checkOut = $('#check_out_input');
  //   $checkOut.datepicker("setStartDate", checkInDate);
  //   $checkOut.datepicker("setDate", checkInDate);
  //   $checkOut.datepicker("minDate", checkInDate);
  //
  // });




  //OPENING OVERLAYMENU TO EDIT TRIP
  $('.overlay_top').on('click', function() {

    //OPENING Edit MENU extracting key value to place into value of edit fields
    // Setting the edit menu to the trips params
    selectedTrip.data('key');
    $('#search_term_input').attr('value', selectedTrip.data('destination'));
    $('#check_in_input').attr('value', selectedTrip.data('checkin'));
    $('#check_out_input').attr('value', selectedTrip.data('checkout'));
    $('#bag_size_input').attr('value', selectedTrip.data('bagsize'));
    $(`option[value="${selectedTrip.data('bagsize')}"]`).attr('selected', "");

    // reinitializing the dropdown
    $('select').formSelect();
    M.updateTextFields();


    $('#edit-overlay').fadeIn('400', function() {
    });
  });


  //CLOSE OVERLAYMENU
  $(document).mousedown(function(e) {
      var container = $("#edit-con");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('#edit-overlay').fadeOut('400', function() {
        });
      }
  });

  // HANDLING THE PUT EDIT TRIP
  $('#buttonNext').on('click', function() {
    console.log('button pressed');
    console.log($('#bag_size_input').val());

    $("#edit-overlay").fadeOut('400', function() {

    });

    //now send the trip key with all the new info to the backend
    // key into the URL
    // Everything else in the body data
    // also send the trip id here too.
    // TODO AJAX CALL
    selectedTrip.data('key');
    selectedTrip.data('destination');
    selectedTrip.data('checkin');
    selectedTrip.data('checkout');
    selectedTrip.data('bagsize');

    // // TODO post the url with key of trip.
    // var tripKey = $(this).data('key');
    // $.ajax({
    //   type: 'POST',
    //   url: '/....../${tripKey}',
    //   data: ,
    //   success: function(content) {
    //     $()
    //   }
    // });
    // return false;

    // $.ajax({
    //   url: "/post-form",
    //   dataType: "json",
    //   type: "POST",
    //   data: formData,
    //   success: function(data) {
    //       console.log("SUCCESS JSON:", data);
    //       // how do we know what we are getting?
    //       $("#p2").html(data[0] + " " + data[1]['firstName']
    //                     + " " + data[1]['lastName']
    //                     + " " + data[1]['email']
    //                    );
    //
    //   },
    //   error: function(jqXHR, textStatus, errorThrown) {
    //       $("#p2").text(jqXHR.statusText);
    //       console.log("ERROR:", jqXHR, textStatus, errorThrown);
    //   }
    //  });
    // })

    $.ajax({
      type: 'POST',



    })

  });


  // HANDLING THE CANCEL BUTTON WHEN EDIT TRIP OVERLAY IS OPEN
  $('#cancelNext').on('click', function(e) {
    console.log('button pressed');
    console.log($('#bag_size_input').val());
    e.preventDefault();
    $("#edit-overlay").fadeOut('400', function() {

    });

    //now send the old key and new key to the backend
    // also send the trip id here too.
    // oldArticleKey.send
    // newArticleSwap.send
    // TODO AJAX CALL


  });
});
