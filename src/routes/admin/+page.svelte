<script>
	import { dataStore } from '$lib/stores'; // Import des globalen Stores
	import { onDestroy } from 'svelte'; // Importiere onDestroy für das Abmelden vom Store

	let selectedFile = null; // Speichert die ausgewählte Datei (einmalig deklarieren)
	let date = new Date(); // Setzt das Startdatum auf den aktuellen Monat
	let newRow = { datum: '', zeit: '', wert: '', sport: '' }; // Neue Zeile für Eingaben
	let sortAsc = true; // Flag für die Sortierreihenfolge
	let fileName = 'Keine Datei ausgewählt'; // Initialer Text für den Dateinamen

	let sportarten = [
		'Crosstrainer',
		'Beinpressing',
		'Bauch',
		'Rücken',
		'Hüfte außen',
		'Bauch seitlich',
		'Schulter',
		'Hüfte innen',
		'Laufband Grundlagen',
		'Laufband Intervall',
		'Lauf Outdoor Grundl.',
		'Lauf Outdoor Interv.',
		'Hinzufügen...'
	];

	let data = []; // Lokale Daten (werden aus dem Store geladen)

	// Store abonnieren, um die aktuellen Daten zu bekommen
	const unsubscribe = dataStore.subscribe((value) => {
		// Nur Daten des aktuellen Monats anzeigen
		data = value.filter((row) => {
			const rowDate = new Date(row.datum);
			return rowDate.getMonth() === date.getMonth() && rowDate.getFullYear() === date.getFullYear();
		});
	});

	// Monat wechseln (vorwärts/rückwärts)
	function changeMonth(delta) {
		const newDate = new Date(date);
		newDate.setMonth(date.getMonth() + delta); // Monat anpassen
		date = newDate; // Das Datum für den neuen Monat setzen

		// Daten erneut filtern, wenn der Monat gewechselt wurde
		dataStore.subscribe((value) => {
			data = value.filter((row) => {
				const rowDate = new Date(row.datum);
				return (
					rowDate.getMonth() === date.getMonth() && rowDate.getFullYear() === date.getFullYear()
				);
			});
		});
	}

	// CSV-Datei importieren
	function importCSV() {
		if (!selectedFile) {
			alert('Bitte zuerst eine CSV-Datei auswählen.');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target.result;
			const delimiter = text.includes(';') ? ';' : ',';
			const rows = text.split('\n').map((row) => row.split(delimiter));

			const importedData = rows
				.filter((row) => row.length >= 4)
				.map((row) => ({
					datum: row[0].trim(),
					zeit: row[1].trim(),
					wert: row[2].trim(),
					sport: row[3].trim()
				}));

			// Speichern der CSV-Daten im Store
			dataStore.set(importedData);
			console.log('✅ CSV-Daten wurden in dataStore gespeichert:', importedData);
		};

		reader.readAsText(selectedFile);
	}

	// Datei auswählen (für CSV)
	function handleFileSelect(event) {
		selectedFile = event.target.files[0]; // Speichert die ausgewählte Datei
		fileName = selectedFile ? selectedFile.name : 'Keine Datei ausgewählt'; // Text anpassen
	}

	// Zeile hinzufügen
	function addRow() {
		if (newRow.datum && newRow.zeit && newRow.wert && newRow.sport) {
			dataStore.update((existingData) => {
				return [{ ...newRow }, ...existingData]; // Neue Zeile oben einfügen
			});

			newRow = { datum: '', zeit: '', wert: '', sport: '' }; // Leere Eingabefelder zurücksetzen
		} else {
			alert('Bitte füllen Sie alle Felder aus!');
		}
	}

	// Datum sortieren
	function sortByDate() {
		sortAsc = !sortAsc; // Umschalten der Sortierreihenfolge
		dataStore.update((existingData) => {
			return existingData.sort((a, b) => {
				const dateA = new Date(a.datum);
				const dateB = new Date(b.datum);
				return sortAsc ? dateB - dateA : dateA - dateB; // Auf- oder absteigend sortieren
			});
		});
	}

	// Lösch-Funktion: Zeile anhand des Indexes löschen
	function deleteRow(index) {
		dataStore.update((existingData) => {
			return existingData.filter((_, i) => i !== index); // Filtert die Zeile basierend auf dem Index heraus
		});
	}

	onDestroy(() => {
		unsubscribe(); // Abmelden vom Store, wenn die Seite verlassen wird
	});
</script>

<svelte:head>
	<!-- Google Fonts Link für Urbanist -->
	<link
		href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<main>
	<h1><a href="http://localhost:5173/">Fitness-Daten</a> [Eingabe]</h1>
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

	<!-- Upload und Eingabebereich -->

	<div class="datenEingabeWrapper">
		<h2>Neue Eingabe</h2>
		<div class="datenEingabe">
			<div class="datum">
				<input bind:value={newRow.datum} type="date" />
			</div>
			<div class="dauer">
				<input bind:value={newRow.zeit} type="time" />
			</div>
			<div class="kg_min">
				<input bind:value={newRow.wert} />
			</div>
			<div class="was">
				<select bind:value={newRow.sport}>
					{#each sportarten as sport}
						<option value={sport}>{sport}</option>
					{/each}
				</select>
			</div>
			<div class="mod">
				<button on:click={addRow}>➕</button>
			</div>
		</div>
	</div>
	<table class="tabelle">
		<thead>
			<tr>
				<th class="datum">
					<button on:click={sortByDate}>
						Datum {sortAsc ? '⬇️' : '⬆️'}
					</button>
				</th>
				<th class="dauer">Dauer</th>
				<th class="kg_min">kg / min</th>
				<th class="was">Was</th>
				<th class="mod">!</th>
			</tr>
		</thead>
		<tbody>
			{#each data as row, i}
				<tr>
					<td class="datum">{new Date(row.datum).toLocaleDateString('de-DE')}</td>
					<td class="dauer">{row.zeit}</td>
					<td class="kg_min">{row.wert}</td>
					<td class="was">{row.sport}</td>
					<td class="mod">
						<button on:click={() => deleteRow(i)}>🗑️</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="uploadWrapper">
		<h2>CSV-Upload</h2>
		<div class="upload">
			<div class="file-input">
				<input
					class="file-input"
					type="file"
					accept=".csv"
					id="fileInput"
					on:change={handleFileSelect}
				/>
			</div>
			<div class="fileUpload">
				<label for="fileInput" class="fileUpload">Durchsuchen…</label>
			</div>
			<div class="buttonUpload">
				<button class="buttonUpload" on:click={importCSV}>📂 CSV hochladen</button>
			</div>
		</div>
	</div>
</main>

<style>
	@import '../../styles/styles.css'; /* Passe den Pfad nach Bedarf an */
</style>
