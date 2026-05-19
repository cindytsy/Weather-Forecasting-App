# Weather Forecasting App

This is a React Weather Forecasting App using the OpenWeatherMap API.
Users can search for a city and view current weather information.

---

## Features

- Search weather by city name
- Use current location to fetch local weather
- Display current temperature, humidity, wind speed, and weather condition
- Clothing suggestions based on the current weather
- Recent search history
- Sunrise and sunset time display
- Responsive design for desktop, tablet, and mobile screens
- Smooth transitions and animations for a better user experience

---

## Technologies Used

### Frontend Framework
- **React**: Used to build the user interface with reusable components.

### API
- **OpenWeatherMap API**: Used to fetch real-time weather data based on city name or geographic coordinates.

### Styling
- **CSS**: Used for layout, responsive design, transparent boxes, ocean background, and animations.

### Development Tooling
- **Create React App / react-scripts**: Used to set up and run the React project.
- **Node.js and npm**: Used to install dependencies and run the development server.

---

## Project Setup Instructions

### 1. Clone or Download the Project

If the project is on GitHub, clone it using:

```bash
git clone < https://github.com/cindytsy/Weather-Forecasting-App.git >
```

Then move into the project folder:

```bash
cd weather-forecasting-app
```

If you downloaded the project as a ZIP file, unzip it first and open the project folder in Visual Studio Code.

---

### 2. Install Dependencies

Run the following command in the project folder:

```bash
npm install
```

This will install all required packages listed in `package.json`.

---

### 3. Add OpenWeatherMap API Key

Create a `.env` file in the root folder of the project.

Add the following line:

```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your OpenWeatherMap API Key

Important: The variable name must start with `REACT_APP_` so React can read it.

---

### 4. Start the App

Run:

```bash
npm start
```

The app will open in your browser at:

```text
https://weather-forecasting-app-ehqc.onrender.com
```

---

## Code Organization

A typical structure of this project is:

```text
weather-forecasting-app/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── components/
│       ├── SearchBar.js
│       ├── WeatherCard.js
│       └── Forecast.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Main Files and Folders

#### `public/`
Contains static files such as `index.html` and app icons.

#### `src/`
Contains the main React application code.

#### `src/App.js`
The main component of the app. It usually manages the main state, API calls, weather data, location feature, and renders other components.

#### `src/App.css`
Contains the main styling for the app, including layout, responsive design, transparent cards, ocean background, and animations.

#### `src/index.js`
The entry point of the React app. It renders the `App` component into the browser.

#### `src/components/`
Stores reusable React components. For example:

- `SearchBar.js`: Handles city search input.
- `WeatherCard.js`: Displays current weather information.
- `Forecast.js`: Displays forecast information if included.

If your project does not use a `components` folder yet, the same logic may currently be inside `App.js`.

---

## Environment Variables

This project uses an environment variable to protect the API key:

```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

The `.env` file should not be uploaded to GitHub if it contains your real API key. Make sure `.env` is listed in `.gitignore`.

---

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.

### `npm run build`
Builds the app for production into the `build` folder.

### `npm test`
Runs the test runner if tests are included.

---

## How the App Works

1. The user enters a city name or clicks the **Use My Location** button.
2. The app sends a request to the OpenWeatherMap API.
3. The API returns weather data such as temperature, humidity, wind speed, weather condition, sunrise, and sunset time.
4. React stores the returned data in state.
5. The app updates the UI to show the weather information.

---

## Responsive Design

The app is designed to work on different screen sizes:

- Desktop
- Laptop
- Tablet
- Mobile phone

CSS media queries are used to adjust layout, font size, spacing, and card width for smaller screens.

---
