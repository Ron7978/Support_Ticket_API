// ===== Global Pagination State =====
let currentPage = 1;
let totalPages = 1;

// ===== Utility: Camel Case converter =====
function toCamelCase(str) {
  return str
    ? str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    : "";
}

// ===== Fetch Tickets (Filters + Pagination) =====
async function fetchTickets(page = 1) {
  try {
    const search = document.getElementById("searchInput")?.value || "";
    const status = document.getElementById("statusFilter")?.value || "";
    const priority = document.getElementById("priorityFilter")?.value || "";

    const query = new URLSearchParams({
      page,
      limit: 5,
      search,
      status,
      priority,
    });

    const res = await fetch(`/tickets?${query}`);
    const data = await res.json();

    const tbody = document.getElementById("ticketList");
    tbody.innerHTML = "";

    // If no tickets, show message
    if (!data.items || data.items.length === 0) {
      tbody.innerHTML = `
        <tr class="no-data">
          <td colspan="5">No tickets found</td>
        </tr>
      `;
    } else {
      data.items.forEach((t) => {
        tbody.innerHTML += `
          <tr>
            <td>${toCamelCase(t.title)}</td>
            <td>${toCamelCase(t.status)}</td>
            <td>${toCamelCase(t.priority)}</td>
            <td class="email">${t.customerEmail}</td>
            <td>
              <button class="update-btn" onclick="updateTicket('${t._id}')">Update</button>
              <button class="delete-btn" onclick="deleteTicket('${t._id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    }

    // Update pagination info
    currentPage = data.page;
    totalPages = Math.ceil(data.total / data.limit);
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages}`;

  } catch (err) {
    console.error("Error fetching tickets:", err);
  }
}

// ===== Create Ticket =====
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

  e.target.reset();
  fetchTickets(currentPage);
  fetchStats();
});

// ===== Update Ticket =====
async function updateTicket(id) {
  const newStatus = prompt("Enter new status (open, in-progress, resolved):");
  if (!newStatus) return;

  await fetch(`/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  fetchTickets(currentPage);
  fetchStats();
}

// ===== Delete Ticket =====
async function deleteTicket(id) {
  if (!confirm("Are you sure you want to delete this ticket?")) return;

  await fetch(`/tickets/${id}`, { method: "DELETE" });

  fetchTickets(currentPage);
  fetchStats();
}

// ===== Change Page =====
function changePage(step) {
  const newPage = currentPage + step;
  if (newPage > 0 && newPage <= totalPages) {
    fetchTickets(newPage);
  }
}

// ===== Fetch Stats =====
async function fetchStats() {
  try {
    const res = await fetch("/tickets/stats");
    const stats = await res.json();

    document.getElementById("openCount").innerText = `Open: ${stats.open || 0}`;
    document.getElementById("inProgressCount").innerText = `In Progress: ${stats.inProgress || 0}`;
    document.getElementById("resolvedCount").innerText = `Resolved: ${stats.resolved || 0}`;

  } catch (err) {
    console.error("Error fetching stats:", err);
  }
}

// ===== Init =====
fetchStats();
fetchTickets();
