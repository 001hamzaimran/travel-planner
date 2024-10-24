const destinationList = document.getElementById('destination-list');
const destinationForm = document.getElementById('destination-form');
const destinationInput = document.getElementById('destination');
const datetimeInput = document.getElementById('datetime');
let destinations = []; // Array to hold destinations
let map;

function initMap() {
    map = L.map('map').setView([51.505, -0.09], 2); // Set default view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    loadDestinations(); // Load destinations from local storage
}

function loadDestinations() {
    const storedDestinations = localStorage.getItem('destinations');
    if (storedDestinations) {
        destinations = JSON.parse(storedDestinations); // Parse JSON string to object
        updateDestinationList(); // Update the displayed list
    }
}

function addDestination(destination, dateTime) {
    destinations.push({ destination, dateTime });
    localStorage.setItem('destinations', JSON.stringify(destinations)); // Save to local storage
    updateDestinationList();
    clearInputs();
    addMarker(destination); // Add a marker for the new destination
}

function updateDestinationList() {
    destinationList.innerHTML = ''; // Clear the list
    destinations.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'destination-item alert alert-light';
        div.innerHTML = `
            <div>
                <strong>${item.destination}</strong><br>
                <span>${new Date(item.dateTime).toLocaleString()}</span>
            </div>
            <div>
                <button onclick="editDestination(${index})" class="btn btn-warning btn-sm">Edit</button>
                <button onclick="deleteDestination(${index})" class="btn btn-danger btn-sm">Delete</button>
            </div>
        `;
        destinationList.appendChild(div);
    });
}

function clearInputs() {
    destinationInput.value = '';
    datetimeInput.value = '';
}

function deleteDestination(index) {
    destinations.splice(index, 1); // Remove the destination from the array
    localStorage.setItem('destinations', JSON.stringify(destinations)); // Update local storage
    updateDestinationList(); // Update the displayed list
}

function editDestination(index) {
    destinationInput.value = destinations[index].destination;
    datetimeInput.value = destinations[index].dateTime;
    deleteDestination(index); // Remove it from the list to edit
}

function addMarker(destination) {
    // Placeholder for marker positioning
    const coords = {
        "New York": [40.7128, -74.0060],
        "Los Angeles": [34.0522, -118.2437],
        "Chicago": [41.8781, -87.6298],
        "Houston": [29.7604, -95.3698],
        "Miami": [25.7617, -80.1918],
    };

    const location = coords[destination];
    if (location) {
        const marker = L.marker(location).addTo(map); // Add marker at specified coordinates
        marker.bindPopup(destination).openPopup();
        map.setView(location, 10); // Set map view to the location
    } else {
        alert(`Coordinates for ${destination} not found!`);
    }
}

destinationForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const destination = destinationInput.value;
    const dateTime = datetimeInput.value;
    addDestination(destination, dateTime);
});

// Initialize the map when the script loads
initMap();
