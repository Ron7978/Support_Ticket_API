async function fetchTickets() {
  const res = await fetch("/tickets");
  const data = await res.json();
  const tickets = data.items || data;

  const tbody = document.getElementById("ticketList");
  tbody.innerHTML = "";
  tickets.forEach((t) => {
    function toCamelCase(str) {
      return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }
    tbody.innerHTML += `
      <tr>
        <td>${t.title}</td>
        <td>${t.status}</td>
        <td>${t.priority}</td>
        <td class="email">${t.customerEmail}</td>
        <td>
          <button class="update-btn" onclick="updateTicket('${t._id}')">Update</button>
          <button class="delete-btn" onclick="deleteTicket('${t._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Update ticket function
async function updateTicket(id) {
  const newStatus = prompt("Enter new status (open, in-progress, resolved):");
  if (!newStatus) return;
  await fetch(`/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  fetchTickets();
}

//delete ticket function
async function deleteTicket(id) {
  if (!confirm("Are you sure you want to delete this ticket?")) return;
  await fetch(`/tickets/${id}`, { method: "DELETE" });
  fetchTickets();
}

document.getElementById("ticketForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    customerEmail: document.getElementById("customerEmail").value,
    priority: document.getElementById("priority").value,
  };
  await fetch("/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  fetchTickets();
});

fetchTickets();
