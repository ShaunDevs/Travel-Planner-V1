# Travel Planner

A web-based travel planning application built with HTML, CSS and JavaScript.

The user enters a destination, trip duration, budget and preferred travel style. The application then uses external APIs to find the destination, retrieve current weather information and generate a personalized travel plan.

## Features

- Destination search using geocoding
- Live weather information
- Custom trip duration
- Budget input and daily budget calculation
- Travel styles including Adventure, Relaxed, Culture, Food and Balanced
- Automatic budget breakdown
- Dynamic day-by-day itinerary
- Responsive interface
- Error handling for invalid destinations and missing information

## Technologies

- HTML
- CSS
- JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Weather API

## How It Works

The application takes the user's input and sends the destination to a geocoding API. The returned coordinates are then used to retrieve current weather data.

JavaScript processes the information, calculates the estimated budget and generates an itinerary based on the selected travel style. The results are then dynamically displayed on the webpage.

## Purpose

This project was created to practice JavaScript fundamentals while working with real-world API data and user input.

It demonstrates the use of asynchronous JavaScript, API requests, JSON data, DOM manipulation, functions, objects, arrays, loops, conditional logic and dynamic content generation.
