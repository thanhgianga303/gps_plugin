jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  kintone.events.on('mobile.app.record.index.show', function() {
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);

    var spaceElement = kintone.mobile.app.getHeaderSpaceElement();
    var fragment = document.createDocumentFragment();
    var headingEl = document.createElement('h3');
    var messageEl = document.createElement('p');

    messageEl.classList.add('plugin-space-message');
    messageEl.textContent = config.message;
    headingEl.classList.add('plugin-space-heading');
    headingEl.textContent = 'Hello kintone plugin!';

    fragment.appendChild(headingEl);
    fragment.appendChild(messageEl);
    spaceElement.appendChild(fragment);
  });
  //Set api key for script
  var api_key  = 'AIzaSyCdxeRN9HjX59mU4O4ymC3bYPKjwPugjfU'; 
  document.write('<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?key='+api_key+'"></script>');
  
  kintone.events.on(["mobile.app.record.create.show"], function(event){
    // get current postion
    
    navigator.geolocation.getCurrentPosition(
      function(res){
        disabled();
        setValueStart(res,event);
        setValueFinish(res,event);
      }, 
      errorCallback,
      {enableHighAccuracy:true}
    );
    
  });
  kintone.events.on(["mobile.app.record.edit.show"], function(event){
    navigator.geolocation.getCurrentPosition(
      function(res){
        setValueStart(res,event);
        setValueFinish(res,event);
      }, 
      errorCallback,
      {enableHighAccuracy:true}
    );
    disabledEdit(event);
    return event;
  });
  function disabledEdit(event)
  {
    console.log(event);
    var record= event.record;
    record["clockout_attendance"].disabled = true;
    record["GPS_off_work"].disabled = true;
    record["location_of_working"].disabled = true;
    record["clockin_attendance"].disabled = true;
    record["GPS_working"].disabled = true;
    record["location_off_work"].disabled = true;
  }
  function disabled()
  {
    var record = kintone.mobile.app.record.get();
    console.log(record);
    record.record["clockout_attendance"].disabled = true;
    record.record["GPS_off_work"].disabled = true;
    record.record["location_of_working"].disabled = true;

    record.record["clockin_attendance"].disabled = true;
    record.record["GPS_working"].disabled = true;
    record.record["location_off_work"].disabled = true;
    kintone.mobile.app.record.set(record);
  }
  function setValueStart(res,event) {  
    var startButton = document.createElement("button");
    startButton.id = "start_button";
    startButton.innerHTML="Start";
    startButton.onclick = function(){
    
      // document.getElementById("start_button").disabled = true;
      console.log("Start!");
      var record = event.record;
      var latY = res.coords.latitude;
      var lngX = res.coords.longitude;
      var record = kintone.mobile.app.record.get();
      var latlng = res.coords.latitude + ";" +  res.coords.longitude ;
      var current = new Date();
      var time = current.toLocaleTimeString('en-US', { hour12: false, 
                                            hour: "numeric", 
                                            minute: "numeric"});
      record.record["clockin_attendance"].value = time; 
      record.record['GPS_working'].value = latlng;
      
      var action = "start";
      setAddressByLatLng(latY,lngX,action);
     
      kintone.mobile.app.record.set(record);
    }
    kintone.mobile.app.record.getSpaceElement('start_work').appendChild(startButton);
    console.log("Finished add button start for space!");
  }
  function setValueFinish(res,event) {  
    var finishedButton = document.createElement("button");
      finishedButton.id="finished_button";
      finishedButton.innerHTML="Finish";
      finishedButton.onclick = function(){
    
        // document.getElementById("finished_button").disabled = true;
        var record = event.record;
        var latY = res.coords.latitude;
        var lngX = res.coords.longitude;
        var record = kintone.mobile.app.record.get();
        
        var latlng = res.coords.latitude + ";" +  res.coords.longitude ;
        var current = new Date();
        var time = current.toLocaleTimeString('en-US', { hour12: false, 
                                             hour: "numeric", 
                                             minute: "numeric"});

        record.record["clockout_attendance"].value = time;
        record.record['GPS_off_work'].value = latlng;
        
        var action = "finish";
        setAddressByLatLng(latY,lngX,action);

        kintone.mobile.app.record.set(record);

        console.log("Finished set value!");
      }
      kintone.mobile.app.record.getSpaceElement('off_work').appendChild(finishedButton);
      console.log("Finished add button finish for space!");
  }
    function setAddressByLatLng(lat,lng,action)
    {
      var geocoder = new google.maps.Geocoder();
      var latlng   = new google.maps.LatLng(
        lat,
        lng
      );
    
      geocoder.geocode({latLng: latlng},
        function(res,status){
          console.log("1");
          // console.log(res);
          // console.log(status); //=> REQUEST_DENIED
          
          console.log(res[0].formatted_address);
          if(status == google.maps.GeocoderStatus.OK){
              console.log("2");
              console.log(res[0].formatted_address);
              // フィールドコード「address」に取得した住所をセットする
              var  record = kintone.mobile.app.record.get();
              if(action == "start")
              {
                record["record"]["location_of_working"].value = res[0].formatted_address;
              }
              else
              {
                record["record"]["location_off_work"].value = res[0].formatted_address;
              }
              kintone.mobile.app.record.set(record);
              
          }else{
            console.log("3");
            alert("geocode 取得に失敗 :"+status);
          }
        }
      );
    }
   var errorCallback = function (e){
    console.log("4");
    alert(e.message);
  }
  
})(jQuery, kintone.$PLUGIN_ID);
