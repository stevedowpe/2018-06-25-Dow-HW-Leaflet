// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	accessToken: 'pk.eyJ1Ijoic3RldmVkb3dwZSIsImEiOiJjamlkdjhuYTAwNmcyNDFvY3JheTE5azJhIn0.bhs1hNEkOfk9eWcLi3fUAQ',
	id: 'mapbox.pirates',
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  ZERO: new L.LayerGroup(),
  ONE: new L.LayerGroup(),
  TWO: new L.LayerGroup(),
  THREE: new L.LayerGroup(),
  FOUR: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [39.83, -98.58],
  zoom: 5,
  layers: [
    layers.ZERO,
    layers.ONE,
    layers.TWO,
    layers.THREE,
    layers.FOUR
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Magnitude: 0 to 1": layers.ZERO,
  "Magnitude:1+ to 2": layers.ONE,
  "Magnitude:2+ to 3": layers.TWO,
  "Magnitude:3+ to 4": layers.THREE,
  "Magnitude:4+": layers.FOUR
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  ZERO: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "white",
    size: 1,
    shape: "circle"
  }),
  ONE: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "yellow",
    markerColor: "yellow",
    size:2,
    shape: "circle"
  }),
  TWO: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "orange",
    markerColor: "orange",
    size 3, 
    shape: "circle"
  }),
  THREE: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "red",
    markerColor: "red",
    size: 4, 
    shape: "circle"
  }),
  FOUR: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "black",
    markerColor: "black",
    size: 5,
    shape: "circle"
  })
};

// Perform an API call to the Earthquake Information
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(Earthquake_Info) {

  // var Info = EQInfo.feautures.properties

  // // When the first API call is complete, perform another call to the Citi Bike Station Status endpoint
  // d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json", function(statusRes) {
  //   var updatedAt = infoRes.last_updated;
  //   var stationStatus = statusRes.data.stations;
  //   var stationInfo = infoRes.data.stations;

    // Initialize an Magnitudes variable, which will be used as a key to access the appropriate layers and icons for layer group
    var Magnitude_Code = [];

    // Loop through the Earthquake_Info
    for (var i = 0; i < Earthquake_Info.length; i++) {

      // var station = Object.assign({}, stationInfo[i], stationStatus[i]);

      if (features.properties.mag[i] < 1) {
        Magnitude_Code = "ZERO";
      }
      else if (features.properties.mag[i] < 2) {
        Magnitude_Code = "ONE";
      }
      else if (features.properties.mag[i] < 3) {
        Magnitude_Code = "TWO";
      }
      else if (features.properties.mag[i] < 4) {
        Magnitude_Code = "THREE";
      }
      else {
        Magnitude_Code = "FOUR";
      };


      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([features.geometry.coordinates[0], features.geometry.coordinates[1]], {
        icon: icons[Magnitude_Code]
      });

       // Add the new marker to the appropriate layer
      newMarker.addTo(layers[Magnitude_Code]);

      // Dow -Also trying based on the Citi Bike "basic" way because "Advanced" example version not working
      Magnitude_Code.push(newMarker);


      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      // newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
      newMarker.bindPopup("Magnitude:" + features.properties.mag + "<br> Location: " + features.properties.place);
    };


});


