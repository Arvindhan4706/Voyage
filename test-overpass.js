const fetch = require('node-fetch'); // Assuming node fetch is available or use native fetch if Node >= 18

async function run() {
  const q = `[out:json][timeout:15];nwr["tourism"~"hotel|hostel|motel|guest_house|resort|apartment"](around:25000,13.0827,80.2707);out center 15;`;
  console.log("Querying...");
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(q)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}
run();
