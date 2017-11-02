// our token: pk.eyJ1Ijoid2lsbGlhbXd1MTIzMCIsImEiOiJjajZ2bjl5dm4xMm54MzJvNGsyZHF0YjFiIn0.FarZV4Y4imev3VjQQb460w
//our style: mapbox://styles/williamwu1230/cj7fuqy4535ny2rlsn1h4qlak

mapboxgl.accessToken = 'pk.eyJ1IjoibWFkZWxlaW5lam9oYW5zb24iLCJhIjoiY2lzczduYzJ4MDZrODJucGh0Mm1xbmVxNCJ9.i7q4iT8FFgh_y5v4we5UhQ';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v9',
    center: [150.786056, -34.077212],

    // homebush [151.08223, -33.8680],
    // sydney pier [151.2056, -33.8572],
    zoom: 15,
    pitch: 45,
    bearing: -17.6,
    container: 'map'
});
map.on('load', function() {
    // map.addSource('json-buildings', {
    //                 'type': 'geojson',
    //                 'data': './GeoJSON/homebush.GeoJSON'
    //             }),
    // map.addSource('json-buildings1', {
    //                 'type': 'geojson',
    //                 'data': './GeoJSON/rob_building.GeoJSON'
    //             }),
//     var draw = new MapboxDraw({
//     displayControlsDefault: false,
//     controls: {
//         polygon: true,
//         trash: true
//     }
// });
// map.addControl(draw);

// var calcButton = document.getElementById('calculate');
// calcButton.onclick = function() {
//     var data = draw.getAll();
//     if (data.features.length > 0) {
//         var area = turf.area(data);
//         // restrict to area to 2 decimal points
//         var rounded_area = Math.round(area*100)/100;
//         var answer = document.getElementById('calculated-area');
//         answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
//     } else {
//         alert("Use the draw tools to draw a polygon!");
//     }
// };


        map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': .6
        }
    });
    // map.addLayer({
    //     "id": "fromgrasshopper",
    //     "type": "fill-extrusion",
    //     "source": "json-buildings",
    //        'paint': {
    //             'fill-extrusion-color' : {
    //                 'property': 'colour',
    //                 'type': 'identity'
    //             },
    //             'fill-extrusion-height' : {
    //                 'type': 'identity',
    //                 'property': 'height'
    //             },
    //             'fill-extrusion-base' : {
    //                 'type': 'identity',
    //                 'property': 'base_height'
    //             },
    //              //'fill-extrusion-opacity': .6
    //         }
    // });
    // map.addLayer({
    //     "id": "fromgrasshopper2",
    //     "type": "fill-extrusion",
    //     "source": "json-buildings1",
    //        'paint': {
    //             'fill-extrusion-color' : {
    //                 'property': 'colour',
    //                 'type': 'identity'
    //             },
    //             'fill-extrusion-height' : {
    //                 'type': 'identity',
    //                 'property': 'height'
    //             },
    //             'fill-extrusion-base' : {
    //                 'type': 'identity',
    //                 'property': 'base_height'
    //             },
    //              //'fill-extrusion-opacity': .6
    //         }
    // });
    

});

var toggleableLayerIds = ['3d-buildings']; //'fromgrasshopper', 'fromgrasshopper2',

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
         e.preventDefault();
         e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}

// When a click event occurs near a polygon, open a popup at the location of
// the feature, with description HTML from its properties.
// map.on('click', function (e) {
//     var features = map.queryRenderedFeatures(e.point, { layers: [ 'fromgrasshopper', 'fromgrasshopper2'] });
//     if (!features.length) {
//         return;
//     }

//     var feature = features[0];
//     var feat = features.length;

//     var popup = new mapboxgl.Popup()
//         .setLngLat(map.unproject(e.point))
//         .setHTML(feature.properties.tag)
//         .addTo(map);

// // Use the same approach as above to indicate that the symbols are clickable
// // by changing the cursor style to 'pointer'.
// map.on('mousemove', function (e) {
//     var features = map.queryRenderedFeatures(e.point, { layers: [ 'fromgrasshopper', 'fromgrasshopper2'] });
//     map.getCanvas().style.cursor = feat ? 'pointer' : '';
// });

// });



