let my_ip ="";
let lati = "";
let longi = "";
$(document).ready(()=>{
    $.getJSON("https://ipinfo.io",
    function (response) {
        $('#span_id_first_page').html(`${response.ip}`);
        $('#span_id_second_page').html(`${response.ip}`)
        my_ip = response.ip;
    }, "jsonp");
}) 

const token = '335d64a4de1833';
const url = `https://ipinfo.io/${my_ip}?token=${token}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const [latitude, longitude] = (data.loc).split(',');
        lati = parseFloat(latitude);
        longi = parseFloat(longitude);
        const d = new Date();
        // pincode = parseInt(data.postal);
        postOfficeFound(data.postal);
        // console.log(pincode);
        document.getElementById('dateandtime_span').innerHTML = `${d.getFullYear()}-${d.getMonth()}-${d.getDay()} / ${d.getHours()}:${d.getMinutes()}`;
        document.getElementById('time_zone_span').innerHTML = `${data.timezone}`;
        document.getElementById('pincode_span').innerHTML = `${data.postal}`;
        document.getElementById('lat_span').innerHTML = `${latitude}`;
        document.getElementById('long_span').innerHTML = `${longitude}`;
        document.getElementById('city_span').innerHTML = `${data.city}`;
        document.getElementById('Organisation_span').innerHTML = `${data.org}`;
        document.getElementById('region_span').innerHTML = `${data.region}`;
        document.getElementById('hostname_span').innerHTML = `${data.timezone}`;
    })
    .catch(error => {
        console.error('Error fetching IP information:', error);
    });
    
    


    function initMap() {
        setTimeout(() => {
        // Create a map centered at the specified latitude and longitude
        const location = { lat: lati, lng: longi }; // Example coordinates: London
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: location
        });

        // Add an Advanced Marker at the specified location
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: location,
            map: map,
            title: "Hello world!"
        });

        // Add a simple tooltip to the marker
        const tooltip = new google.maps.InfoWindow({
            content: "<b>Hello world!</b><br>I am a popup."
        });

        marker.addListener("click", () => {
            tooltip.open({
                anchor: marker,
                map,
                shouldFocus: false,
            });
        });
        }, "2000");
            
        }

        function findPostOffice() {
            let searchInput = document.getElementById('search-bar');
            let searchTerm = searchInput.value.toLowerCase();
            let filteredPostOffices = postOfficesData.filter(postOffice =>
              postOffice.Name.toLowerCase().includes(searchTerm) ||
              postOffice.BranchType.toLowerCase().includes(searchTerm)
            );
            displayPostOffices(filteredPostOffices);
          }

          function displayPostOffices(postOffices) {
            let card_container = document.querySelector(".card_container");
            card_container.innerHTML = "";
          
            postOffices.forEach(postOffice => {
              card_container.innerHTML += `
                <div class="card">
                  <p class="top-detail-p">Name: ${postOffice.Name}</p>
                  <p class="top-detail-p">Branch Type: ${postOffice.BranchType}</p>
                  <p class="top-detail-p">Delivery Status: ${postOffice.DeliveryStatus}</p>
                  <p class="top-detail-p">District: ${postOffice.District}</p>
                  <p class="top-detail-p">State: ${postOffice.State}</p>
                </div>
              `;
            });
          }

          function postOfficeFound(pincode) {
            fetch(`https://api.postalpincode.in/pincode/${pincode}`)
              .then(response => response.json())
              .then(data => {
                document.getElementById("message_span").innerHTML += `${(data[0].PostOffice).length}`;
                if (data && data[0] && data[0].PostOffice && Array.isArray(data[0].PostOffice)) {
                  postOfficesData = data[0].PostOffice;
                  displayPostOffices(postOfficesData);
                } else {
                  throw new Error("Invalid data structure");
                }
              })
              .catch(error => {
                console.error("Error:", error);
                document.querySelector(".card_container").innerHTML = "<p class='error'>Unable to retrieve post office information.</p>";
              });
          }
