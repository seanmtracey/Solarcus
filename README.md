# Sunrise Sunset Menubar App

This is a simple Electron-based menubar application that displays the sunrise and sunset times for London in your macOS menubar. The icon and text dynamically update based on the current time of day.

## Features
- Shows upcoming sunrise or sunset time in the macOS menubar.
- Updates automatically every hour.
- Dynamically changes the menubar icon to indicate sunrise or sunset.
- Allows manual refresh via a context menu.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.
- [npm](https://www.npmjs.com/) (comes with Node.js).

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/seanmtracey/Solarcus.git
   cd sunrise-sunset-menubar
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## Packaging for Distribution
To package the app for distribution, you can use [Electron Builder](https://www.electron.build/). First, install it as a dev dependency:

```bash
npm install electron-builder --save-dev
```

Then, build the app with the following command:

```bash
npm run build
```

The built app will be available in the `dist/` directory.

## Usage
- After launching, the menubar will display the next upcoming sunrise or sunset time.
- Right-click on the menubar icon to refresh the data manually or quit the app.

## Customization
- The default location is set to **London**. To change it, update the latitude and longitude in the `fetchSunTimes()` function within `main.js`.
- Icons for sunrise and sunset are named `sunrise.png` and `sunset.png`. You can replace these with your own custom icons.

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue if you find a bug or have a suggestion.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

