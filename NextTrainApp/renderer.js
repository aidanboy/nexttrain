document.addEventListener('DOMContentLoaded', async () => {
    const fromStation = document.getElementById('fromStation');
    const toStation = document.getElementById('toStation');
    const switchButton = document.getElementById('switchStations');
    const fetchButton = document.getElementById('fetchTimes');
    const resultDiv = document.getElementById('result');
    const departureTimeSpan = document.getElementById('departureTime');
    const platformSpan = document.getElementById('platform');
    const statusSpan = document.getElementById('status');

    // Load saved route if exists
    const savedRoute = await window.trainAPI.getSavedRoute();
    if (savedRoute.status === 'success' && savedRoute.data) {
        fromStation.value = savedRoute.data.from;
        toStation.value = savedRoute.data.to;
    }

    // Switch stations
    switchButton.addEventListener('click', () => {
        const temp = fromStation.value;
        fromStation.value = toStation.value;
        toStation.value = temp;
    });

    // Fetch train times
    fetchButton.addEventListener('click', async () => {
        if (!fromStation.value || !toStation.value) {
            alert('Please enter both stations');
            return;
        }

        // Save the route
        await window.trainAPI.saveRoute(fromStation.value, toStation.value);

        // Get train times
        const result = await window.trainAPI.getTrainTimes(fromStation.value, toStation.value);
        
        if (result.status === 'success') {
            resultDiv.style.display = 'block';
            departureTimeSpan.textContent = result.data.nextTrain;
            platformSpan.textContent = result.data.platform;
            
            const status = result.data.status;
            statusSpan.textContent = status;
            statusSpan.className = 'status ' + (status === 'On time' ? 'on-time' : 'delayed');
        } else {
            alert('Error fetching train times: ' + result.message);
        }
    });
});
