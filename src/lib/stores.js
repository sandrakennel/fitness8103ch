import { writable } from "svelte/store";

// Sicherstellen, dass `localStorage` nur im Browser verfügbar ist
let storedData = [];

if (typeof window !== "undefined") {
    // Prüfen, ob wir im Browser sind (und nicht auf dem Server)
    const localStorageData = localStorage.getItem("fitnessData");
    if (localStorageData) {
        storedData = JSON.parse(localStorageData);
    }
}

// `dataStore` enthält die Trainingsdaten (initialisiert mit gespeicherten Daten oder einem leeren Array)
export const dataStore = writable(storedData);

// Abonnieren und Speichern im LocalStorage (nur im Browser)
if (typeof window !== "undefined") {
    dataStore.subscribe((value) => {
        localStorage.setItem("fitnessData", JSON.stringify(value));
    });
}