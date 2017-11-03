var filterGroup = document.getElementById('filter-group');

 function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
      for (var i = 0, f; f = files[i]; i++) {
          output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
      }
    //puts it into html as a list
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    var dropped_building = ''
    for (var i = 0; i < files.length; i++) {
      var reader = new FileReader();
      reader.readAsText(files[i]);
      reader.onload = readSuccess; 

        function readSuccess(evt) {
          file_contents = evt.target.result;
                  dropped_building = JSON.parse(file_contents);
                  //console.log(JSON.parse(file_contents)); //JSON.stringify(json)--> string
                  

                map.addSource('dragndrop', {
                    'type': 'geojson',
                      'data': {
                        "type":"FeatureCollection",
                        "features": dropped_building.features
                      }
                  })
        map.addLayer({
                "id": "fromdragndrop",
                "type": "fill-extrusion",
                "source": "dragndrop",
                  'paint': {
                      'fill-extrusion-color' : {
                        'property': 'colour',
                        'type': 'identity'
                      },
                      'fill-extrusion-height' : {
                          'type': 'identity',
                          'property': 'height'
                      },
                      'fill-extrusion-base' : {
                          'type': 'identity',
                          'property': 'base_height'
                      }
                  }
        })

        var coordinates = (dropped_building['features'][0]["geometry"]["coordinates"][0][0])
        map.flyTo({
          center:coordinates

        })
       
        buttonVals = new Set([])

        function layerGetter(feature){
            layerVal = feature["properties"]["layer"]
            buttonVals.add(layerVal) //set
        }

        dropped_building.features.forEach(layerGetter)

        buttonMenu = Array.from(buttonVals) //iterator 


            // Add checkbox and label elements for the layer.
          selectedSet= new Set 
            for (var i in buttonMenu) {
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = buttonMenu[i];
            input.checked = true;
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', buttonMenu[i]);
            label.textContent = buttonMenu[i];
            filterGroup.appendChild(label);
          


          input.addEventListener('change', function(e) {

            id = e.target.checked?e.target.id:0
            if (id==0){
              selectedSet.delete(e.target.id)
            }else{
              selectedSet.add(e.target.id)
            }
            hiddenElements = Array.from(selectedSet)
            console.log(hiddenElements)
          
          hiddenFilters = ["any"]
          hiddenElements.forEach((element) => {
          hiddenFilters.push([
            '==',
            'layer',
            element.toString()
                ]);
          });
          console.log(JSON.stringify(hiddenFilters))
          map.setFilter( 'fromdragndrop', hiddenFilters);
            
});
        }
    
        }

    }


}




function removeButton() {
  //remove map layer and source
  map.removeLayer('fromdragndrop')
  map.removeSource('dragndrop')
  console.log("building removed")

  //clear list
  var output = []
  document.getElementById('list').innerHTML = ""
  console.log("list cleared")

  //remove buttons
  var menuID = document.getElementById('filter-group')
  while(menuID.firstChild) {
    menuID.removeChild(menuID.firstChild);
}
  console.log("buttons removed")

  //clear hiddenFilters array
  hiddenFilters = ["any"]
  console.log("array cleared")

}
    

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; 
}

// dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);


        // When a click event occurs near a polygon, open a popup at the location of
      // the feature, with description HTML from its properties.
      map.on('click', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: [ "fromdragndrop"] });
       if (!features.length) {
        return;
      }

    var feature = features[0];
    var feat = features.length;

    var popup = new mapboxgl.Popup()
        .setLngLat(map.unproject(e.point))
        .setHTML([feature.properties.layer] + ["<br>"] + [feature.properties.tag])
        .addTo(map);

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: [ "fromdragndrop"] });
    map.getCanvas().style.cursor = feat ? 'pointer' : '';
});
});