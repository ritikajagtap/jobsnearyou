/* eslint-disable */
const locations = document.getElementById('map').dataset.locations;
//data.map(x => x.value)

mapboxgl.accessToken =
  'pk.eyJ1Ijoicml0aWthamFndGFwIiwiYSI6ImNreGRjNHR1cTRiN3EycXB6c2s4bTgxMW4ifQ.cAoyKnX4_Q4CjjvGi3qF7Q';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ritikajagtap/ckxdd2bo7ehdl14pcfp7thknd',
  center: [79.44869746989251, 22.875572001865702],
  zoom: 3.5,
});

const bound = new mapboxgl.LngLatBounds();

  const marker1 = new mapboxgl.Marker()
  .setLngLat([79.44869746989251, 22.875572001865702])
  .addTo(map);

/*
locations.forEach(function(loc)  {
  //Add marker
  console.log(loc);
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  bounds.extend(loc.coordinates);
}); */

map.findBounds(bounds);
