// for user ip address https://api.ipify.org?format=json
// geoAPiKey = at_KNHTMUE6uQHFT0IvnL1uK3FYqJYdK

const getUserIP = async () => {
    const req = await fetch('https://api.ipify.org?format=json');
    let res = await req.json();
    return res.ip;
};

const getIpDetails = async (input = '') => {
    const ip = await getUserIP();
    let domain = typeof input === 'string' ? input : '';
    let inputIp = Number.isInteger(Number(input[0])) ? input : '';
    const geoApiKey = 'at_KNHTMUE6uQHFT0IvnL1uK3FYqJYdK';
    const geoApiUrl = 'https://geo.ipify.org/api/v1';

    const endpoint = inputIp
        ? `${geoApiUrl}?apiKey=${geoApiKey}&ipAddress=${inputIp}`
        : `${geoApiUrl}?apiKey=${geoApiKey}&domain=${domain}`;
    try {
        const req = await fetch(endpoint);
        const res = await req.json();
        return res;
    } catch (error) {
        console.error(error);
    }
};

const renderMap = (lat, lon) => {
    // check if map exists
    let container = L.DomUtil.get('ip-map');
    if (container != null) {
        container._leaflet_id = null;
    }
    const attribution = `&copy; <a href="https://www.openstreetmap.org/copyright">openStreetMap</a> contributors`;
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    const ipIcon = L.icon({
        iconUrl: '../assets/icon-location.svg',
        iconAnchor: [23, 56],
    });
    let mymap = L.map('ip-map').setView([lat, lon], 18);

    tiles.addTo(mymap);

    L.marker([lat, lon], { icon: ipIcon }).addTo(mymap);
};

const renderIpDetails = async (input) => {
    const ipDetails = await getIpDetails(input);
    const lat = ipDetails.location.lat;
    const lon = ipDetails.location.lng;
    const ip = ipDetails.ip;

    const region = ipDetails.location.region;
    const country = ipDetails.location.country;
    const postal = ipDetails.location.postalCode;
    const timezone = ipDetails.location.timezone;
    const isp = ipDetails.as.name;
    ipAddress.textContent = ip;
    ipLocation.textContent = `${region}, ${country} ${postal}`;
    ipTimezone.textContent = `UTC ${timezone}`;
    ipIsp.textContent = isp;

    renderMap(lat, lon);
};

const inputForm = document.querySelector('.input-form');
const ipInput = document.querySelector('.ip-input');
const ipAddress = document.querySelector('.ip-address');
const ipLocation = document.querySelector('.ip-location');
const ipTimezone = document.querySelector('.ip-timezone');
const ipIsp = document.querySelector('.ip-isp');

renderIpDetails(getUserIP());

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (ipInput.value.trim() === '') {
        console.log('null');
        return;
    } else {
        renderIpDetails(ipInput.value);
    }
});
