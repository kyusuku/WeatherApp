document.addEventListener('DOMContentLoaded', () => {
const button = document.getElementById('Button');
const textbox = document.getElementById('Textbox');
const resultDiv = document.getElementById('result');

button.addEventListener('click', () => {
    // Grab the value from the textbox
    const city = textbox.value.trim();

    if (city) {
    // Display the typed city
    resultDiv.innerHTML = `You entered: ${city}`;
    } else {
    // Display a default message if no city was entered
    resultDiv.innerHTML = 'Please enter a city name.';
    }
});
});
