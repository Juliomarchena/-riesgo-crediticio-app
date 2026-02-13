const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return data.status === "healthy" ? "online" : "offline";
  } catch {
    return "offline";
  }
}

export async function predictRisk(formData) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error en la predicci\u00f3n");
  }

  return data;
}

export { API_URL };
