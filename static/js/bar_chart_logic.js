// Fetch the GeoJSON data from the API
fetch('https://data.casey.vic.gov.au/api/v2/catalog/datasets/picnic-settings/exports/geojson')
  .then(response => response.json())
  .then(data => {
    let filteredData = data.features; // Initial data to be used for sorting

    // Create a leaflet map instance
    const map = L.map('map').setView([-38.11, 145.12], 10);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(map);

    // Create GeoJSON layer for parks
    const parkLayer = L.geoJSON(filteredData, {
      onEachFeature: function(feature, layer) {
        // Add the location, suburb, and amenity type to the popup for each feature
        const popupContent = `
          <b>Suburb:</b> ${feature.properties.suburb_name}<br>
          <b>Amenity Type:</b> ${feature.properties.amenitytype}
        `;
        layer.bindPopup(popupContent);
      }
    }).addTo(map);

    // Prepare data for the distribution of amenity types
    const amenityTypes = {};
    data.features.forEach(feature => {
      const suburb = feature.properties.suburb_name;
      const amenity = feature.properties.amenitytype;

      if (!amenityTypes[suburb]) {
        amenityTypes[suburb] = {};
      }

      if (!amenityTypes[suburb][amenity]) {
        amenityTypes[suburb][amenity] = 1;
      } else {
        amenityTypes[suburb][amenity]++;
      }
    });

    const barChartData = Object.entries(amenityTypes).map(([suburb, amenities]) => ({
      x: Object.keys(amenities),
      y: Object.values(amenities),
      type: 'bar',
      name: suburb,
    }));

    const layout = {
      title: 'Distribution of Amenity Types in each Suburb',
      barmode: 'stack', // For the bar chart
      showlegend: true,
    };

    Plotly.newPlot('barChart1', barChartData, layout);

// Prepare data for the distribution of amenity types
const suburbCounts = {};
data.features.forEach(feature => {
  const suburb = feature.properties.suburb_name;

  if (!suburbCounts[suburb]) {
    suburbCounts[suburb] = 1;
  } else {
    suburbCounts[suburb]++;
  }
});

// Generate data for the bar chart
const barChartData2 = Object.entries(suburbCounts).map(([suburb, count]) => ({
  x: [suburb],
  y: [count],
  type: 'bar',
  name: suburb,
}));


// Configure layout for the graphs
const layout2 = {
  title: 'Number of Parks per Suburb',
  showlegend: true,
};

// Plot the bar chart
Plotly.newPlot('barChart2', barChartData2, layout2);
    // Create a dropdown menu to sort parks by amenity type
    const dropdown = document.getElementById('dropdown');
    Object.keys(amenityTypes).forEach(amenityType => {
      const option = document.createElement('option');
      option.value = amenityType;
      option.text = amenityType;
      dropdown.appendChild(option);
    });

    // Add event listener to the dropdown menu
    dropdown.addEventListener('change', (event) => {
      const selectedAmenity = event.target.value;
      filteredData = data.features.filter(feature => feature.properties.suburb_name === selectedAmenity);
      parkLayer.clearLayers();
      parkLayer.addData(filteredData);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
