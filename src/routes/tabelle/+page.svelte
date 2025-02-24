<script>
	import { dataStore } from '$lib/stores'; // Import des globalen Stores
	import { onDestroy } from 'svelte'; // Importiere onDestroy für das Abmelden vom Store

	let date = new Date(); // Aktuelles Datum setzen
	let data = []; // Die Daten aus dem Store
	let filteredData = []; // Gefilterte Daten für den aktuellen Monat

	// Store abonnieren, um die aktuellen Daten zu bekommen
	const unsubscribe = dataStore.subscribe((value) => {
		data = value; // Alle Daten aus dem Store
		filterDataForCurrentMonth(); // Filtere die Daten nach dem aktuellen Monat
	});

	// Umgebungsvariable setzen
	const isLocal = import.meta.env.VITE_APP_ENV === 'local';

	onDestroy(() => {
		unsubscribe(); // Abmelden vom Store, wenn die Seite verlassen wird
	});

	// Monat wechseln
	function changeMonth(delta) {
		const newDate = new Date(date);
		newDate.setMonth(date.getMonth() + delta); // Monat anpassen
		date = newDate; // Setzt das neue Datum

		// Filtere die Daten basierend auf dem neuen Monat
		filterDataForCurrentMonth();
	}

	// Filtere die Daten nur für den aktuellen Monat
	function filterDataForCurrentMonth() {
		filteredData = data.filter((row) => {
			const rowDate = new Date(row.datum);
			return rowDate.getMonth() === date.getMonth() && rowDate.getFullYear() === date.getFullYear();
		});
		console.log('Gefilterte Daten für den aktuellen Monat:', filteredData); // Debugging
	}
</script>

<svelte:head>
	<!-- Google Fonts Link für Urbanist -->
	<link
		href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<main>
	<h1><a href={isLocal ? 'http://localhost:5173/' : '/'}>Fitness-Daten</a>[Anzeige]</h1>

	<!-- Monatsnavigation -->
	<nav>
		<div class="navButtons">
			<button class="arrow-button prev" on:click={() => changeMonth(-1)}></button>
			<div class="wrapperToday">
				<div class="dateToday">{date.toLocaleDateString()}</div>
			</div>
			<button class="arrow-button next" on:click={() => changeMonth(1)}></button>
		</div>
	</nav>

	<!-- Tabelle -->
	<table class="datenAusgabe">
		<thead class="datenAusgabe">
			<tr>
				<th class="datum">Datum</th>
				<th class="dauer">Dauer</th>
				<th class="kg_min">kg / min</th>
				<th class="was">Was</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredData as row, i}
				<tr>
					<td class="datum">{new Date(row.datum).toLocaleDateString('de-DE')}</td>
					<td class="dauer">{row.zeit}</td>
					<td class="kg_min">{row.wert}</td>
					<td class="was">{row.sport}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main>

<style>
	@import '../../styles/styles.css'; /* Passe den Pfad nach Bedarf an */
</style>
