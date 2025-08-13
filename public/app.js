async function fetchTickets() {
  const res = await fetch("/tickets");
  const data = await res.json();
  const tickets = Array.isArray(data) ? data : data.items || [];
  const tbody = document.getElementById("ticketList");
  tbody.innerHTML = "";
  tickets.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.title}</td>
        <td>${t.status}</td>
        <td>${t.priority}</td>
        <td>${t.customerEmail}</td>
      </tr>
    `;
  });
}

document.getElementById("ticketForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    customerEmail: document.getElementById("customerEmail").value,
    priority: document.getElementById("priority").value
  };
  await fetch("/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  fetchTickets();
});

fetchTickets();
