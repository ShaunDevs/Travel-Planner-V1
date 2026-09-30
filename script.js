const planButton = document.getElementById("planButton");
const errorMessage = document.getElementById("errorMessage");
const results = document.getElementById("results");

planButton.addEventListener("click", createTrip);

async function createTrip() {

    const destination = document
        .getElementById("destination")
        .value
        .trim();

    const days = Number(
        document.getElementById("days").value
    );

    const budget = Number(
        document.getElementById("budget").value
    );

    const travelStyle = document.getElementById("style").value;

    errorMessage.textContent = "";

    if (!destination || !days || !budget) {
        errorMessage.textContent =
            "Please complete all fields before creating your trip.";
        return;
    }

    if (days < 1 || days > 14) {
        errorMessage.textContent =
            "Please choose between 1 and 14 days.";
        return;
    }

    planButton.textContent = "Planning your trip...";

    try {

        const location = await getLocation(destination);

        if (!location) {
            throw new Error(
                "We couldn't find that destination."
            );
        }

        const weather = await getWeather(
            location.latitude,
            location.longitude
        );

        displayTrip(
            location,
            weather,
            days,
            budget,
            travelStyle
        );

        results.classList.remove("hidden");

        results.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        errorMessage.textContent = error.message;

    } finally {

        planButton.innerHTML = 'Create my trip <span>→</span>';

    }
}


async function getLocation(destination) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to search for that destination.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return null;
    }

    return data.results[0];
}


async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to retrieve weather information.");
    }

    return await response.json();
}


function displayTrip(
    location,
    weather,
    days,
    budget,
    travelStyle
) {

    const temperature =
        Math.round(weather.current.temperature_2m);

    const weatherCode =
        weather.current.weather_code;

    const weatherInfo =
        getWeatherInfo(weatherCode);

    const dailyBudget =
        budget / days;

    const costs =
        calculateBudget(budget, travelStyle);

    document.getElementById("destinationName").textContent =
        location.name;

    document.getElementById("tripSummary").textContent =
        `${location.country} • ${days} day${days === 1 ? "" : "s"} • ${capitalize(travelStyle)} trip`;

    document.getElementById("temperature").textContent =
        `${temperature}°C`;

    document.getElementById("weatherIcon").textContent =
        weatherInfo.icon;

    document.getElementById("weatherDescription").textContent =
        weatherInfo.description;

    document.getElementById("daysResult").textContent =
        days;

    document.getElementById("budgetResult").textContent =
        formatCurrency(budget);

    document.getElementById("dailyBudget").textContent =
        formatCurrency(dailyBudget);

    document.getElementById("styleResult").textContent =
        capitalize(travelStyle);

    document.getElementById("accommodationCost").textContent =
        formatCurrency(costs.accommodation);

    document.getElementById("foodCost").textContent =
        formatCurrency(costs.food);

    document.getElementById("transportCost").textContent =
        formatCurrency(costs.transport);

    document.getElementById("activitiesCost").textContent =
        formatCurrency(costs.activities);

    document.getElementById("totalCost").textContent =
        formatCurrency(costs.total);

    generateItinerary(
        days,
        travelStyle,
        weatherInfo
    );
}


function calculateBudget(budget, style) {

    let accommodation;
    let food;
    let transport;
    let activities;

    switch (style) {

        case "adventure":
            accommodation = budget * 0.35;
            food = budget * 0.20;
            transport = budget * 0.15;
            activities = budget * 0.30;
            break;

        case "relaxed":
            accommodation = budget * 0.45;
            food = budget * 0.25;
            transport = budget * 0.15;
            activities = budget * 0.15;
            break;

        case "culture":
            accommodation = budget * 0.35;
            food = budget * 0.20;
            transport = budget * 0.15;
            activities = budget * 0.30;
            break;

        case "food":
            accommodation = budget * 0.35;
            food = budget * 0.35;
            transport = budget * 0.10;
            activities = budget * 0.20;
            break;

        default:
            accommodation = budget * 0.40;
            food = budget * 0.25;
            transport = budget * 0.15;
            activities = budget * 0.20;
    }

    return {
        accommodation,
        food,
        transport,
        activities,
        total: accommodation + food + transport + activities
    };
}


function generateItinerary(days, style, weather) {

    const itinerary =
        document.getElementById("itinerary");

    itinerary.innerHTML = "";

    const activities = getActivities(style);

    for (let i = 1; i <= days; i++) {

        const activity =
            activities[(i - 1) % activities.length];

        const card =
            document.createElement("div");

        card.className = "day-card";

        card.innerHTML = `
            <div class="day-number">
                DAY ${i}
            </div>

            <h4>${activity.title}</h4>

            <p>
                ${activity.description}
                ${weather.description.toLowerCase()}
                conditions are expected, so plan your
                activities accordingly.
            </p>
        `;

        itinerary.appendChild(card);
    }
}


function getActivities(style) {

    const activities = {

        adventure: [
            {
                title: "Explore the outdoors",
                description:
                    "Start your trip with a scenic outdoor adventure and discover the natural side of your destination."
            },
            {
                title: "Find an adventure",
                description:
                    "Try a local outdoor activity such as hiking, cycling, kayaking or another experience."
            },
            {
                title: "Discover hidden spots",
                description:
                    "Explore a less tourist-heavy area and look for local viewpoints and interesting places."
            },
            {
                title: "Big experience day",
                description:
                    "Reserve your day for one of the destination's major adventure activities."
            }
        ],

        relaxed: [
            {
                title: "Slow morning",
                description:
                    "Take your time with breakfast before exploring the destination at a relaxed pace."
            },
            {
                title: "Scenic exploration",
                description:
                    "Visit a beautiful area, enjoy the scenery and leave plenty of time to relax."
            },
            {
                title: "Local café day",
                description:
                    "Explore local cafés, shops and relaxed neighbourhoods without rushing."
            },
            {
                title: "Rest and recharge",
                description:
                    "Keep the day light with a peaceful activity and plenty of downtime."
            }
        ],

        culture: [
            {
                title: "Discover the history",
                description:
                    "Visit museums, historical landmarks or cultural sites to understand the destination."
            },
            {
                title: "Explore local culture",
                description:
                    "Spend the day discovering local traditions, architecture and neighbourhoods."
            },
            {
                title: "Art and creativity",
                description:
                    "Visit galleries, creative spaces or cultural centres."
            },
            {
                title: "Local experience",
                description:
                    "Find an authentic local experience and learn something about the community."
            }
        ],

        food: [
            {
                title: "Local food tour",
                description:
                    "Explore local restaurants and try some of the destination's signature dishes."
            },
            {
                title: "Market morning",
                description:
                    "Visit a local food market and discover regional ingredients and street food."
            },
            {
                title: "Restaurant discovery",
                description:
                    "Choose a highly-rated local restaurant and make the meal part of the experience."
            },
            {
                title: "Food and lifestyle",
                description:
                    "Explore neighbourhood cafés, bakeries and local food spots."
            }
        ],

        balanced: [
            {
                title: "See the highlights",
                description:
                    "Start with some of the destination's most recognisable attractions."
            },
            {
                title: "Culture and food",
                description:
                    "Combine a cultural experience with a local meal."
            },
            {
                title: "Outdoor exploration",
                description:
                    "Spend the day outside exploring the destination and its surroundings."
            },
            {
                title: "Free exploration",
                description:
                    "Leave some room in your schedule to discover places spontaneously."
            }
        ]
    };

    return activities[style] || activities.balanced;
}


function getWeatherInfo(code) {

    if (code === 0) {
        return {
            icon: "☀️",
            description: "Clear skies"
        };
    }

    if (code <= 3) {
        return {
            icon: "⛅",
            description: "Partly cloudy"
        };
    }

    if (code <= 48) {
        return {
            icon: "🌫️",
            description: "Foggy"
        };
    }

    if (code <= 67) {
        return {
            icon: "🌧️",
            description: "Rainy"
        };
    }

    if (code <= 77) {
        return {
            icon: "❄️",
            description: "Snowy"
        };
    }

    if (code <= 82) {
        return {
            icon: "🌦️",
            description: "Rain showers"
        };
    }

    return {
        icon: "⛈️",
        description: "Thunderstorms"
    };
}


function formatCurrency(amount) {

    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0
    }).format(amount);
}


function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);
}