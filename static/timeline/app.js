const GAP_THRESHOLD = 4;
const CLUSTER_PIXEL_DISTANCE = 40; // Pixel distance for visual clustering (zoom-dependent)
const REGION_BUFFER_MILES = 15; // Buffer radius for region shading around markers

let selectedFigureIds = new Set();
let figureColors = {};
let markerRegistry = {};
let activeSortMode = 'name'; // Default explicit sort state
// High-contrast palette optimized for visual distinction across the color wheel
const palette = [
    "#e11d48", // bright red
    "#f97316", // bright orange
    "#eab308", // bright yellow
    "#22c55e", // bright green
    "#14b8a6", // teal
    "#3b82f6", // bright blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#ef4444", // red-orange
    "#06b6d4", // cyan
    "#a855f7", // violet
    "#84cc16"  // lime
];

figures.forEach((f, idx) => { figureColors[f.id] = palette[idx % palette.length]; });

// --- GIS CANVAS INVOCATION ---
const map = L.map('map', { zoomControl: false }).setView([48, -20], 4);
L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

let activeMapLayers = [];
map.on('zoomend', () => { updateMapEngine(false); });

// --- URL STATE MANAGEMENT ENGINE ---
function updateURLFromSelection() {
    const params = new URLSearchParams(window.location.search);
    if (selectedFigureIds.size > 0) {
        params.set('view', Array.from(selectedFigureIds).join(','));
    } else {
        params.delete('view');
    }
    const cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState(null, '', cleanUrl);
}

function loadSelectionFromURL() {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam) {
        viewParam.split(',').forEach(id => {
            const cleanId = id.trim();
            if (figures.some(f => f.id === cleanId)) {
                selectedFigureIds.add(cleanId);
            }
        });
    }
}

// --- FILTER DRAWER CLAPPER FUNCTION ---
function toggleFilterDrawer(event) {
    const drawer = document.getElementById('filter-drawer');
    const caret = document.getElementById('drawer-caret');
    const isExpanded = drawer.classList.toggle('expanded');
    caret.innerText = isExpanded ? "▼" : "▶";
}

// --- SORT MANAGEMENT RUNTIME ---
function changeSorting(mode) {
    activeSortMode = mode;
    document.querySelectorAll('.sort-mini-btn').forEach(btn => btn.classList.remove('active'));
    if (mode === 'name') {
        document.getElementById('sort-name-btn').classList.add('active');
    } else {
        document.getElementById('sort-year-btn').classList.add('active');
    }
    renderPeopleList();
}

// --- DATE FORMATTING ---
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateObj) {
    if (!dateObj) return '';

    // Year only
    if (!dateObj.month) return dateObj.year.toString();

    // Year + month
    if (!dateObj.day) return `${MONTH_NAMES[dateObj.month - 1]} ${dateObj.year}`;

    // Full date: "27 Mar 2026"
    return `${dateObj.day} ${MONTH_NAMES[dateObj.month - 1]} ${dateObj.year}`;
}

function isSameDate(date1, date2) {
    if (!date1 || !date2) return false;
    return date1.year === date2.year &&
           date1.month === date2.month &&
           date1.day === date2.day;
}

function isSameYear(date1, date2) {
    if (!date1 || !date2) return false;
    return date1.year === date2.year;
}

// Calculate age using only the precision available in the dates.
// Only adjusts age downward when we can PROVE the birthday hasn't occurred yet.
// Missing month/day is treated as unknown, not assumed to be any specific value.
function calculateAge(birthDate, eventDate) {
    if (!birthDate || !eventDate) return null;

    let age = eventDate.year - birthDate.year;

    // Only subtract a year if we can prove the birthday hasn't happened yet
    if (birthDate.month && eventDate.month) {
        if (eventDate.month < birthDate.month) {
            // Event definitely before birthday month
            age--;
        } else if (eventDate.month === birthDate.month && birthDate.day && eventDate.day) {
            // Same month - check day if both are known
            if (eventDate.day < birthDate.day) {
                age--;
            }
        }
    }
    // If either date lacks month info, we can't determine if birthday has passed,
    // so we assume it has (conservative, avoids false precision)

    return age;
}

// --- HIGH-DENSITY MINIMALIST CARD SHARED UI ENGINE ---
function createEventCardHTML(item) {
    const startDate = item.ev.dates[0].start;
    const endDate = item.ev.dates[0].end;

    let dateString;
    if (endDate) {
        // Multi-date event
        if (isSameYear(startDate, endDate)) {
            // Same year: just show year range
            dateString = `${startDate.year}`;
        } else {
            // Different years: show year range
            dateString = `${startDate.year}–${endDate.year}`;
        }
    } else {
        // Single date: show full date if available
        dateString = formatDate(startDate);
    }

    // Calculate and format age if applicable
    let ageHTML = "";
    const isBirthEvent = item.ev.description.toLowerCase() === "born";

    if (item.figure.birthYear && !isBirthEvent) {
        const birthDate = {
            year: item.figure.birthYear,
            month: item.figure.birthMonth,
            day: item.figure.birthDay
        };

        if (endDate) {
            // Multi-date event: show age range
            const ageStart = calculateAge(birthDate, startDate);
            const ageEnd = calculateAge(birthDate, endDate);

            if (ageStart !== null && ageEnd !== null && ageStart !== ageEnd) {
                ageHTML = `<span class="event-age">age ${Math.min(ageStart, ageEnd)}–${Math.max(ageStart, ageEnd)}</span>`;
            } else if (ageStart !== null) {
                ageHTML = `<span class="event-age">age ${ageStart}</span>`;
            }
        } else {
            // Single date event: show single age
            const age = calculateAge(birthDate, startDate);
            if (age !== null) {
                ageHTML = `<span class="event-age">age ${age}</span>`;
            }
        }
    }

    return `
        <div class="event-card" onclick="focusOnCoordinate(${item.resolvedLoc.lat}, ${item.resolvedLoc.lng}, '${item.figure.id}')">
            <div class="event-meta-line">
                <span class="event-figure" style="color: ${figureColors[item.figure.id]}">${item.figure.name}</span>
                <span class="event-years">${dateString}</span>
                ${ageHTML}
                <span class="event-loc-inline">${item.resolvedLoc.name}</span>
            </div>
            <div class="event-desc">${item.ev.description}</div>
        </div>
    `;
}

// Get the year from a date object (handles both old number format and new object format)
function getYear(date) {
    return typeof date === 'number' ? date : date.year;
}

// Prepare a timeline: sort events chronologically and insert gap markers
// Returns array of { type: 'event'|'gap', data: event|years }
function prepareEventTimeline(events) {
    const sortedEvents = [...events].sort((a,b) => {
        const aYear = getYear(a.ev.dates[0].start);
        const bYear = getYear(b.ev.dates[0].start);
        return aYear - bYear;
    });
    const timeline = [];

    sortedEvents.forEach((item, index) => {
        // Insert gap marker if needed
        if (index > 0) {
            const previousItem = sortedEvents[index - 1];
            const previousEndDate = previousItem.ev.dates[0].end || previousItem.ev.dates[0].start;
            const currentStartDate = item.ev.dates[0].start;

            const previousEndYear = getYear(previousEndDate);
            const currentStartYear = getYear(currentStartDate);
            const computedGap = currentStartYear - previousEndYear;

            if (computedGap >= GAP_THRESHOLD) {
                timeline.push({ type: 'gap', years: computedGap });
            }
        }

        timeline.push({ type: 'event', data: item });
    });

    return timeline;
}

// Render timeline to DOM element
function renderEventList(events, containerElement) {
    const timeline = prepareEventTimeline(events);
    containerElement.innerHTML = "";

    timeline.forEach(item => {
        if (item.type === 'gap') {
            const gapCard = document.createElement('div');
            gapCard.className = 'timeline-gap';
            gapCard.innerHTML = `<span>⏳ ${item.years} Year Gap</span>`;
            containerElement.appendChild(gapCard);
        } else {
            const containerCard = document.createElement('div');
            containerCard.innerHTML = createEventCardHTML(item.data);
            containerElement.appendChild(containerCard.firstElementChild);
        }
    });
}

// Render timeline to HTML string (for popups)
function renderEventListHTML(events) {
    const timeline = prepareEventTimeline(events);
    let html = "";

    timeline.forEach(item => {
        if (item.type === 'gap') {
            html += `<div class="timeline-gap"><span>⏳ ${item.years} Year Gap</span></div>`;
        } else {
            html += createEventCardHTML(item.data);
        }
    });

    return html;
}

function focusOnCoordinate(lat, lng, figureId) {
    const lookupKey = `${figureId}-${lat}-${lng}`;
    const targetMarker = markerRegistry[lookupKey];
    if (targetMarker) {
        map.setView([lat, lng], Math.max(map.getZoom(), 11));
        targetMarker.openPopup();
    }
}

// --- SIDEBAR MANAGEMENT & LAYOUT RECALCULATION ENGINE ---
function togglePanel() {
    const panel = document.getElementById('unified-panel');
    panel.classList.toggle('collapsed');
    updateToggleHandleOrientation();

    setTimeout(() => {
        map.invalidateSize({ animate: true });
    }, 320);
}

function updateToggleHandleOrientation() {
    const panel = document.getElementById('unified-panel');
    const arrow = document.getElementById('toggle-arrow');
    const isCollapsed = panel.classList.contains('collapsed');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        arrow.innerText = isCollapsed ? "▼" : "▲";
    } else {
        arrow.innerText = isCollapsed ? "▶" : "◀";
    }
}

window.addEventListener('resize', updateToggleHandleOrientation);

function switchTab(event, tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    if (event) event.currentTarget.classList.add('active');

    const panel = document.getElementById('unified-panel');
    if (panel.classList.contains('collapsed')) {
        togglePanel();
    }
}

// --- FILTER LAYER ENGINE OPERATIONS ---
function setupFilters() {
    const tagCodes = new Set();
    const centuries = new Set();
    figures.forEach(f => {
        f.tags.forEach(t => tagCodes.add(t.code));
        [f.birthYear, f.deathYear].forEach(yr => {
            if (yr && yr > 0) {
                const century = Math.floor((yr - 1) / 100) + 1;
                if (century > 0) centuries.add(century);
            }
        });
    });
    const tagSelect = document.getElementById('tag-filter');
    // Sort tags by code and display with name
    Array.from(tagCodes).sort().forEach(code => {
        const tag = Object.values(TAGS).find(t => t.code === code);
        tagSelect.innerHTML += `<option value="${code}">${tag.name}</option>`;
    });
    const centSelect = document.getElementById('century-filter');
    Array.from(centuries).sort((a,b)=>a-b).forEach(c => centSelect.innerHTML += `<option value="${c}">${c}th Century</option>`);
}

function getVisibleFigures() {
    const searchVal = document.getElementById('search-input').value.toLowerCase();
    const centVal = document.getElementById('century-filter').value;
    const tagVal = document.getElementById('tag-filter').value;

    return figures.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchVal);
        const matchesTag = tagVal === 'all' || f.tags.some(t => t.code === tagVal);
        let matchesCentury = centVal === 'all';
        if (!matchesCentury && f.birthYear && f.deathYear) {
            const target = parseInt(centVal);
            matchesCentury = (target >= (Math.floor((f.birthYear - 1) / 100) + 1) && target <= (Math.floor((f.deathYear - 1) / 100) + 1));
        } else if (!matchesCentury && (!f.birthYear || !f.deathYear)) {
            // If no birth/death year, show in all century filters
            matchesCentury = true;
        }
        return matchesSearch && matchesTag && matchesCentury;
    });
}

// FIXED: Loop now iterates directly over the freshly sorted 'visible' sequence arrays
function renderPeopleList() {
    const listEl = document.getElementById('people-list');
    listEl.innerHTML = "";
    let visible = getVisibleFigures();

    if (activeSortMode === 'name') {
        visible.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSortMode === 'year') {
        visible.sort((a, b) => a.birthYear - b.birthYear);
    }

    visible.forEach(figure => {
        const isSelected = selectedFigureIds.has(figure.id);
        const li = document.createElement('li');
        li.className = `person-item ${isSelected ? 'selected' : ''}`;
        const birthDisplay = figure.birthYear || '?';
        const deathDisplay = figure.deathYear || '?';
        li.innerHTML = `
            <input type="checkbox" ${isSelected ? 'checked' : ''}>
            <div class="person-info">
                <div class="person-name">${figure.name} ${figure.tags.map(t => `<span class="tag" title="${t.description}">${t.code}</span>`).join(" ")}</div>
                <div class="person-dates">${birthDisplay} — ${deathDisplay}</div>
            </div>
            <div class="color-dot" style="background-color: ${figureColors[figure.id]}"></div>
        `;
        li.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') { const cb = li.querySelector('input'); cb.checked = !cb.checked; }
            if (li.querySelector('input').checked) selectedFigureIds.add(figure.id);
            else selectedFigureIds.delete(figure.id);
            li.classList.toggle('selected', selectedFigureIds.has(figure.id));

            updateURLFromSelection();
            updateMapEngine(true);
        });
        listEl.appendChild(li);
    });
}

function bulkSelect(shouldSelect) {
    getVisibleFigures().forEach(f => { if (shouldSelect) selectedFigureIds.add(f.id); else selectedFigureIds.delete(f.id); });
    renderPeopleList();
    updateURLFromSelection();
    updateMapEngine(true);
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.bulk-actions').addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

function resetFilters() {
    document.getElementById('search-input').value = "";
    document.getElementById('century-filter').value = "all";
    document.getElementById('tag-filter').value = "all";
    renderPeopleList();
    updateMapEngine(true);
}

// --- CHRONO-GEOGRAPHIC PROJECTION PIPELINE ---
function updateMapEngine(shouldFitBounds = false) {
    activeMapLayers.forEach(l => map.removeLayer(l));
    activeMapLayers = [];
    markerRegistry = {};

    const eventListEl = document.getElementById('event-list');
    eventListEl.innerHTML = "";
    const timelineCountBadge = document.getElementById('timeline-count');
    const peopleCountBadge = document.getElementById('people-count');

    // Update people count badge
    peopleCountBadge.innerText = selectedFigureIds.size;

    if (selectedFigureIds.size === 0) {
        timelineCountBadge.innerText = "0";
        if (shouldFitBounds) map.setView([48, -20], 4);
        return;
    }

    const selectedFigures = figures.filter(f => selectedFigureIds.has(f.id));
    let boundaryCoords = [];
    let localizedEventArray = [];
    let geographicClusters = [];

    // First pass: build clusters based on visual proximity
    selectedFigures.forEach(figure => {
        figure.events.forEach(ev => {
            const loc = ev.location;
            boundaryCoords.push([loc.lat, loc.lng]);
            localizedEventArray.push({ figure, ev, resolvedLoc: loc });

            // Use pixel distance for clustering (zoom-dependent visual clustering)
            const currentPoint = map.latLngToLayerPoint([loc.lat, loc.lng]);
            let targetCluster = null;

            for (let cluster of geographicClusters) {
                const clusterPoint = map.latLngToLayerPoint([cluster.lat, cluster.lng]);
                if (currentPoint.distanceTo(clusterPoint) < CLUSTER_PIXEL_DISTANCE) {
                    targetCluster = cluster;
                    break;
                }
            }

            if (targetCluster) {
                targetCluster.events.push({ figure, ev, resolvedLoc: loc });
                if (!targetCluster.names.includes(loc.name)) targetCluster.names.push(loc.name);
            } else {
                geographicClusters.push({
                    lat: loc.lat,
                    lng: loc.lng,
                    names: [loc.name],
                    events: [{ figure, ev, resolvedLoc: loc }]
                });
            }
        });
    });

    // Second pass: draw region shading around cluster marker positions
    selectedFigures.forEach(figure => {
        const color = figureColors[figure.id];

        // Get cluster positions for this figure's events
        const figureClusterPoints = [];
        figure.events.forEach(ev => {
            const loc = ev.location;
            // Find which cluster this event belongs to
            for (let cluster of geographicClusters) {
                if (cluster.events.some(e => e.ev === ev && e.figure.id === figure.id)) {
                    const point = [cluster.lng, cluster.lat];
                    // Avoid duplicates
                    if (!figureClusterPoints.some(p => p[0] === point[0] && p[1] === point[1])) {
                        figureClusterPoints.push(point);
                    }
                    break;
                }
            }
        });

        if (figureClusterPoints.length > 0) {
            // Group points into segments based on distance
            // If consecutive points are > 500 miles apart, treat as separate regions
            const segments = [];
            let currentSegment = [figureClusterPoints[0]];

            for (let i = 1; i < figureClusterPoints.length; i++) {
                const prevPoint = turf.point(figureClusterPoints[i - 1]);
                const currPoint = turf.point(figureClusterPoints[i]);
                const distance = turf.distance(prevPoint, currPoint, { units: 'miles' });

                if (distance > 500) {
                    // Too far apart - start a new segment
                    segments.push(currentSegment);
                    currentSegment = [figureClusterPoints[i]];
                } else {
                    currentSegment.push(figureClusterPoints[i]);
                }
            }
            segments.push(currentSegment);

            // Draw each segment separately
            segments.forEach(segment => {
                let travelFeature;
                if (segment.length === 1) {
                    travelFeature = turf.buffer(turf.point(segment[0]), REGION_BUFFER_MILES, { units: 'miles' });
                } else {
                    travelFeature = turf.buffer(turf.lineString(segment), REGION_BUFFER_MILES, { units: 'miles' });
                }
                const vectorLayer = L.geoJSON(travelFeature, {
                    style: { color: color, weight: 1.5, opacity: 0.4, fillColor: color, fillOpacity: 0.08, interactive: false }
                }).addTo(map);
                activeMapLayers.push(vectorLayer);
            });
        }
    });

    timelineCountBadge.innerText = localizedEventArray.length;

    // Render markers with popups using shared event list renderer
    geographicClusters.forEach(cluster => {
        const marker = L.marker([cluster.lat, cluster.lng]).addTo(map);

        // Use shared renderer for popup content
        let popupDom = `<div class="popup-timeline-header">${cluster.names.join(' / ')}</div>`;
        popupDom += renderEventListHTML(cluster.events);

        marker.bindPopup(popupDom);
        activeMapLayers.push(marker);

        cluster.events.forEach(item => {
            const associationKey = `${item.figure.id}-${item.resolvedLoc.lat}-${item.resolvedLoc.lng}`;
            markerRegistry[associationKey] = marker;
        });
    });

    // Render timeline panel using shared event list renderer
    renderEventList(localizedEventArray, eventListEl);

    if (shouldFitBounds && boundaryCoords.length > 0) {
        const spatialBounds = L.latLngBounds(boundaryCoords);
        map.fitBounds(spatialBounds, { padding: [40, 40], maxZoom: 9 });
    }
}

document.getElementById('search-input').addEventListener('input', renderPeopleList);
document.getElementById('century-filter').addEventListener('change', renderPeopleList);
document.getElementById('tag-filter').addEventListener('change', renderPeopleList);

// --- LIFECYCLE INITIALIZATION ---
setupFilters();
loadSelectionFromURL();
renderPeopleList();
updateMapEngine(true);
updateToggleHandleOrientation();
