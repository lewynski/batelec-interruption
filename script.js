// Sample data - Replace this with your actual Batelec interruption data
const interruptionsData = [
    {
        id: 1,
        date: "2026-11-05",
        startTime: "09:00",
        endTime: "17:00",
        duration: 8,
        areas: ["Bauan", "Talisay", "Lemery"],
        reason: "Scheduled Maintenance",
        description: "Transmission line maintenance and inspection"
    },
    {
        id: 2,
        date: "2026-11-07",
        startTime: "08:00",
        endTime: "16:00",
        duration: 8,
        areas: ["Batangas City", "Rosario"],
        reason: "Equipment Upgrade",
        description: "New transformer installation and testing"
    },
    {
        id: 3,
        date: "2026-11-10",
        startTime: "10:00",
        endTime: "14:00",
        duration: 4,
        areas: ["Nasugbu", "Calatagan"],
        reason: "Preventive Maintenance",
        description: "Distribution transformer maintenance"
    },
    {
        id: 4,
        date: "2026-11-12",
        startTime: "06:00",
        endTime: "18:00",
        duration: 12,
        areas: ["Lipa City", "San Juan"],
        reason: "System Upgrade",
        description: "Major grid modernization project"
    },
    {
        id: 5,
        date: "2026-11-15",
        startTime: "09:00",
        endTime: "15:00",
        duration: 6,
        areas: ["Tanauan", "Malvar", "Sto. Tomas"],
        reason: "Routine Inspection",
        description: "Annual safety inspection and repairs"
    }
];

let filteredData = [...interruptionsData];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderInterruptions();
    updateStats();
    setupEventListeners();
});

// Setup event listeners for search and sort
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    searchInput.addEventListener('input', () => {
        filterAndSort();
    });

    sortSelect.addEventListener('change', () => {
        filterAndSort();
    });
}

// Filter and sort interruptions
function filterAndSort() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortOption = document.getElementById('sortSelect').value;

    // Filter by search term
    filteredData = interruptionsData.filter(interruption => {
        const areasMatch = interruption.areas.some(area =>
            area.toLowerCase().includes(searchTerm)
        );
        const reasonMatch = interruption.reason.toLowerCase().includes(searchTerm);
        const descMatch = interruption.description.toLowerCase().includes(searchTerm);

        return areasMatch || reasonMatch || descMatch || searchTerm === '';
    });

    // Sort
    if (sortOption === 'date-asc') {
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === 'date-desc') {
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === 'duration-desc') {
        filteredData.sort((a, b) => b.duration - a.duration);
    }

    renderInterruptions();
    updateStats();
}

// Render interruptions to the page
function renderInterruptions() {
    const container = document.getElementById('interruptionsList');
    const noResults = document.getElementById('noResults');

    container.innerHTML = '';

    if (filteredData.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    filteredData.forEach(interruption => {
        const card = createCard(interruption);
        container.appendChild(card);
    });
}

// Create a single interruption card
function createCard(interruption) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const interruptionDate = new Date(interruption.date);
    const isUpcoming = interruptionDate >= today;
    const isUrgent = (interruptionDate - today) / (1000 * 60 * 60 * 24) <= 3 && isUpcoming;

    const card = document.createElement('div');
    card.className = `interruption-card ${isUrgent ? 'urgent' : ''} ${isUpcoming ? 'upcoming' : ''}`;

    const dateObj = new Date(interruption.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const badgeClass = isUrgent ? 'urgent' : isUpcoming ? 'upcoming' : 'past';
    const badgeText = isUrgent ? 'URGENT' : isUpcoming ? 'UPCOMING' : 'PAST';

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">${interruption.reason}</div>
            <span class="badge ${badgeClass}">${badgeText}</span>
        </div>

        <div class="card-body">
            <div class="info-item">
                <span class="info-label">📅 Date</span>
                <span class="info-value">${formattedDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">🕐 Time</span>
                <span class="info-value">${interruption.startTime} - ${interruption.endTime}</span>
            </div>
            <div class="info-item">
                <span class="info-label">⏱️ Duration</span>
                <span class="info-value">${interruption.duration} hours</span>
            </div>
        </div>

        <div class="areas-list">
            <div class="areas-label">📍 Affected Areas</div>
            <div class="areas-tags">
                ${interruption.areas.map(area => `<span class="area-tag">${area}</span>`).join('')}
            </div>
        </div>

        <p style="margin-top: 15px; color: #4a5568; font-size: 0.95rem;">
            <strong>Details:</strong> ${interruption.description}
        </p>
    `;

    return card;
}

// Update statistics
function updateStats() {
    const totalCount = document.getElementById('totalInterruptions');
    const upcomingCount = document.getElementById('upcomingCount');

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcoming = filteredData.filter(i => {
        const iDate = new Date(i.date);
        return iDate >= today && iDate <= nextWeek;
    });

    totalCount.textContent = interruptionsData.length;
    upcomingCount.textContent = upcoming.length;
      }
