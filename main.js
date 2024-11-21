// Install the required modules by running:
// npm install electron menubar node-fetch

import { menubar } from 'menubar';
import fetch from 'node-fetch';
import { app, Menu, Tray } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Set up the menubar
const mb = menubar({
  preloadWindow: false,
  tooltip: 'Sunrise and Sunset Times',
  icon: path.join(__dirname, 'sunrise.png'), // Set an initial icon
  browserWindow: false, // Disable browser window since we're only using the menubar
});

// Function to fetch sunrise and sunset times
async function fetchSunTimes() {
  try {
    const response = await fetch('https://api.sunrisesunset.io/json?lat=51.5072&lng=0.00&time_format=24');
    const data = await response.json();
    if (data && data.results) {
      return {
        sunrise: parseTime(data.results.sunrise),
        sunset: parseTime(data.results.sunset),
      };
    }
  } catch (error) {
    console.error('Failed to fetch sunrise and sunset data:', error);
  }
  return null;
}

// Function to parse time strings from the API
function parseTime(timeString) {
  let [hours, minutes, seconds] = timeString.split(':').map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
}

// Update tray information
async function updateTray() {
  const sunTimes = await fetchSunTimes();
  if (sunTimes) {
    const now = new Date();
    let nextEvent = '';
    let nextTime = null;
    let icon = '';

    if (now < sunTimes.sunrise) {
      // Before sunrise, show the sunrise time
      nextEvent = 'Sunrise';
      nextTime = sunTimes.sunrise;
      icon = 'sunrise.png';
    } else if (now < sunTimes.sunset) {
      // After sunrise but before sunset, show the sunset time
      nextEvent = 'Sunset';
      nextTime = sunTimes.sunset;
      icon = 'sunset.png';
    } else {
      // After sunset, show the next day's sunrise time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextDaySunTimes = await fetchSunTimesForDate(tomorrow);
      if (nextDaySunTimes) {
        nextEvent = 'Sunrise';
        nextTime = nextDaySunTimes.sunrise;
        icon = 'sunrise.png';
      }
    }

    if (nextTime) {
      const trayText = `  ${nextTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
      if (mb.tray) {
        mb.tray.setTitle(trayText);
        mb.tray.setImage(path.join(__dirname, icon)); // Set the tray icon based on the event
      }
    }
  } else {
    if (mb.tray) {
      mb.tray.setTitle('Error fetching data');
    }
  }
}

// Function to fetch sunrise and sunset times for a specific date
async function fetchSunTimesForDate(date) {
  try {
    const response = await fetch(`https://api.sunrisesunset.io/json?lat=51.5072&lng=0.00&time_format=24&date=${date.toISOString().split('T')[0]}`);
    const data = await response.json();
    if (data && data.results) {
      return {
        sunrise: parseTime(data.results.sunrise),
        sunset: parseTime(data.results.sunset),
      };
    }
  } catch (error) {
    console.error('Failed to fetch sunrise and sunset data:', error);
  }
  return null;
}

// Menubar event listeners
mb.on('ready', async () => {
  console.log('Menubar app is ready.');

  // Set initial tray information
  if (mb.tray) {
    mb.tray.setImage(path.join(__dirname, 'sunrise.png'));
  }
  updateTray();

  // Set an interval to update the data every hour
  setInterval(updateTray, 60 * 60 * 1000);

  // Add a context menu to allow for manually refreshing the data
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Refresh',
      click: updateTray,
    },
    {
      label: 'Quit',
      click: () => app.quit(),
    },
  ]);

  if (mb.tray) {
    mb.tray.setContextMenu(contextMenu);
  }
});
