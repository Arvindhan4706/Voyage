async function run() {
  const q = `[out:json][timeout:10];node["tourism"="hotel"](around:150000,20.5937,78.9629);out center 10;`;
  console.log("Querying...");
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(q)}`,
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "VoyageAI-App/1.0"
      },
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Hotels found:", data.elements?.length);
  } catch (e) {
    console.error(e);
  }
}
run();
