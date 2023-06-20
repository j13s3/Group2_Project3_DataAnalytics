// Store our API endpoint as queryUrl.
let queryUrl = "https://yo3dxhxhsj.execute-api.ap-southeast-2.amazonaws.com/prod/tattwamasi-project"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    const geojsonData = {
        type: 'FeatureCollection',
        features: []
      };

      // Iterate over the results and convert them to GeoJSON features
      data.results.forEach(result => {
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [result.geometry.location.lng, result.geometry.location.lat]
          },
          properties: {
            name: result.name,
            vicinity: result.vicinity,
            rating: result.rating
          }
        };

        geojsonData.features.push(feature);
      });
      createFeatures(geojsonData);
});

function createFeatures(PicnicplacesData) {
    console.log("PicnicplacesData: ", PicnicplacesData)
  console.log(PicnicplacesData);
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the Picnicplaces.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.name}</h3><hr><p>Rating: ${feature.properties.rating}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the picnicplacesData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let Picnicplaces = L.geoJSON(PicnicplacesData, {
    onEachFeature: onEachFeature
  });


  // Send our earthquakes layer to the createMap function/
  createMap(Picnicplaces);
}

function createMap(Picnicplaces) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    picnicplacesdata: Picnicplaces
  };

  // Create our map, giving it the streetmap and picnicplaces layers to display on load.
  let myMap = L.map("map", {
    center: [
        -37.8136276, 144.9630576
    ],
    zoom: 16,
    layers: [street]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};









