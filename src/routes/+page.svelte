<script>
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<!-- Google Fonts Link für Urbanist -->
	<link
		href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<main>
	<div class="introWrapper">
		<h1>Willkommen zur Fitness-App</h1>
		<div class="intro">
			<div class="buttonIntroLeft">
				<button on:click={() => goto('/admin')}>Eingabe</button>
			</div>
			<div class="buttonIntroRight">
				<button on:click={() => goto('/tabelle')}>Ansicht</button>
			</div>
		</div>
	</div>
</main>

<style>
	@import '../styles/styles.css'; /* Passe den Pfad nach Bedarf an */
</style>
