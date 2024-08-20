document.getElementById('getLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    
});

function successCallback(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    document.getElementById('address').textContent = `Latitude: ${lat}, Longitude: ${lng}`;
    console.log(`Latitude: ${lat}, Longitude: ${lng}`); // Print to console
    initMap(lat, lng);
}

function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function initMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: 15
    });

    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map
    });

    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ 'latLng': latlng }, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
                document.getElementById('address').textContent = results[1].formatted_address;
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

function useGoogleGeolocationAPI() {
    fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDv356gW92xpoEQItB3O1rYVZtvmwL51nQ', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        const lat = data.location.lat;
        const lng = data.location.lng;
        document.getElementById('address').textContent = `Latitude: ${lat}, Longitude: ${lng}`;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`); // Print to console
        initMap(lat, lng);
    })
    .catch(error => {
        console.error('Error using Google Geolocation API:', error);
    });
}

