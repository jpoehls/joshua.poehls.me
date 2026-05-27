const LOCATIONS = {
    stadhampton: { key: "stadhampton", name: "Stadhampton", lat: 51.682, lng: -1.133 },
    fordham: { key: "fordham", name: "Fordham", lat: 51.921, lng: 0.793 },
    coggeshall: { key: "coggeshall", name: "Coggeshall", lat: 51.871, lng: 0.690 },
    oxford: { key: "oxford", name: "Oxford", lat: 51.752, lng: -1.257 },
    ealing: { key: "ealing", name: "Ealing (London)", lat: 51.513, lng: -0.308 },
    bedford: { key: "bedford", name: "Bedford", lat: 52.135, lng: -0.466 },
    london_petty: { key: "london_petty", name: "Petty France, London", lat: 51.499, lng: -0.133 },
    nottingham: { key: "nottingham", name: "Nottingham", lat: 52.954, lng: -1.158 },
    colorado: { key: "colorado", name: "Colorado", lat: 39.739, lng: -104.990 },
    california: { key: "california", name: "California", lat: 34.052, lng: -118.243 },
    sydney: { key: "sydney", name: "Sydney", lat: -33.868, lng: 151.209 },
    stornoway: { key: "stornoway", name: "Stornoway", lat: 58.209, lng: -6.387 },
    gloucestershire: { key: "gloucestershire", name: "Gloucestershire", lat: 51.749, lng: -2.241 },
    london: { key: "london", name: "London", lat: 51.507, lng: -0.127 },
    duns: { key: "duns", name: "Duns", lat: 55.771, lng: -2.342 },
    simprin: { key: "simprin", name: "Simprin", lat: 55.722, lng: -2.234 },
    ettrick: { key: "ettrick", name: "Ettrick", lat: 55.416, lng: -3.155 },
    london_walbrook: { key: "london_walbrook", name: "St. Stephen's Walbrook, London", lat: 51.512, lng: -0.111 },
    barnston: { key: "barnston", name: "Barnston", lat: 51.874, lng: 0.387 },
    bristol: { key: "bristol", name: "Broadmead, Bristol", lat: 51.456, lng: -2.587 },
    langham: { key: "langham", name: "Langham", lat: 51.928, lng: 0.981 },
    wicken: { key: "wicken", name: "Wicken", lat: 52.312, lng: 0.281 },
    soham: { key: "soham", name: "Soham", lat: 52.333, lng: 0.334 },
    kettering: { key: "kettering", name: "Kettering", lat: 52.404, lng: -0.728 },
    nisbet: { key: "nisbet", name: "Nisbet", lat: 55.518, lng: -2.522 },
    anwoth: { key: "anwoth", name: "Anwoth", lat: 54.878, lng: -4.211 },
    aberdeen: { key: "aberdeen", name: "Aberdeen", lat: 57.149, lng: -2.094 },
    standrews: { key: "standrews", name: "St Andrews", lat: 56.341, lng: -2.794 },
    kelvedon: { key: "kelvedon", name: "Kelvedon", lat: 51.841, lng: 0.702 },
    waterbeach: { key: "waterbeach", name: "Waterbeach", lat: 52.266, lng: 0.183 },
    east_windsor: { key: "east_windsor", name: "East Windsor, CT", lat: 41.916, lng: -72.601 },
    northampton: { key: "northampton", name: "Northampton, MA", lat: 42.325, lng: -72.641 },
    stockbridge: { key: "stockbridge", name: "Stockbridge, MA", lat: 42.282, lng: -73.311 },
    princeton: { key: "princeton", name: "Princeton, NJ", lat: 40.357, lng: -74.651 },
    derby: { key: "derby", name: "Derby", lat: 52.922, lng: -1.476 },
    boston_lincs: { key: "boston_lincs", name: "Boston, Lincs", lat: 52.978, lng: -0.026 },
    boston_ma: { key: "boston_ma", name: "Boston, MA", lat: 42.360, lng: -71.058 },
    willington: { key: "willington", name: "Willington", lat: 52.133, lng: -0.383 },
    wingrave: { key: "wingrave", name: "Wingrave", lat: 51.866, lng: -0.733 },
    elstow: { key: "elstow", name: "Elstow", lat: 52.116, lng: -0.472 },
    menton: { key: "menton", name: "Menton, France", lat: 43.774, lng: 7.497 }
};

// ============================================================================
// TAG TAXONOMY
// ============================================================================
// Strongly-typed tags for ecclesiological & theological positions.
// Use these constants in figures[] to ensure consistency and enable refactoring.

const TAGS = {
    // BAPTIST
    PB: { code: "PB", name: "Particular Baptist", description: "Calvinist Baptist, 1689 Confession tradition" },
    GB: { code: "GB", name: "General Baptist", description: "Arminian Baptist" },
    BPT: { code: "BPT", name: "Baptist", description: "Generic Baptist, when specific tradition unknown" },

    // PRESBYTERIAN
    PCSA: { code: "PCSA", name: "Presbyterian (Scotland)", description: "Presbyterian Church of Scotland" },
    PRES: { code: "PRES", name: "Presbyterian", description: "Generic or other Presbyterian traditions" },

    // CONGREGATIONALIST
    CONG: { code: "CONG", name: "Congregationalist", description: "English/American Congregationalism" },
    IND: { code: "IND", name: "Independent", description: "Puritan Independents, non-separating" },
    SEP: { code: "SEP", name: "Separatist", description: "Separating Congregationalists" },

    // PURITAN & REFORMED
    PUR: { code: "PUR", name: "Puritan", description: "English Puritans within Anglican Church" },
    REF: { code: "REF", name: "Reformed", description: "Continental Reformed tradition" },
    HUG: { code: "HUG", name: "Huguenot", description: "French Reformed" },

    // OTHER DENOMINATIONS
    ANG: { code: "ANG", name: "Anglican", description: "Church of England, non-Puritan" },
    METH: { code: "METH", name: "Methodist", description: "Methodist tradition" },
    CATH: { code: "CATH", name: "Catholic", description: "Roman Catholic" },
    ORTH: { code: "ORTH", name: "Orthodox", description: "Eastern Orthodox" },

    // THEOLOGICAL EMPHASIS (combine with ecclesiology tags)
    CALV: { code: "CALV", name: "Calvinist", description: "Calvinist emphasis (when ecclesiology unclear)" },
    ARM: { code: "ARM", name: "Arminian", description: "Arminian emphasis" },
    PIET: { code: "PIET", name: "Pietist", description: "Pietist emphasis" }
};

// ============================================================================
// DATE HELPERS
// ============================================================================
// Clean date builder functions for readable syntax:
//   born(1616)                    - year only
//   born(month(1616, 2))          - Feb 1616
//   born(day(1616, 2, 3))         - Feb 3, 1616

const month = (year, month) => ({ year, month });
const day = (year, month, day) => ({ year, month, day });

// Helper to normalize date input - accepts year (number) or date object
const normalizeDate = (date) => {
    if (typeof date === 'number') {
        return { year: date };
    }
    return date;
};

// ============================================================================
// EVENT BUILDER FUNCTIONS
// ============================================================================
// These functions create consistent event objects for common life events.
// Edit the description templates here to affect all events of that type.
//
// All date parameters support:
//   1616                 - year only
//   month(1616, 3)       - March 1616
//   day(1616, 3, 27)     - March 27, 1616

const born = (date, location) => ({
    description: "Born",
    location,
    dates: [{ start: normalizeDate(date) }]
});

const died = (date, location) => ({
    description: "Died",
    location,
    dates: [{ start: normalizeDate(date) }]
});

const published = (work, date, location) => ({
    description: `Published '${work}'`,
    location,
    dates: [{ start: normalizeDate(date) }]
});

const pastored = (location, startDate, endDate = null, customPlace = null) => ({
    description: customPlace ? `Pastored at ${customPlace}` : "Pastored",
    location,
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

const taught = (institution, startDate, endDate = null, location = null) => ({
    description: `Taught at ${institution}`,
    location: location || institution.toLowerCase().replace(/\s+/g, '_'),
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

const served = (role, startDate, endDate = null, location) => ({
    description: `Served as ${role}`,
    location,
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

const attended = (institution, startDate, endDate = null, location = null) => ({
    description: `Attended ${institution}`,
    location: location || institution.toLowerCase().replace(/\s+/g, '_'),
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

const ordained = (date, location) => ({
    description: "Ordained to ministry",
    location,
    dates: [{ start: normalizeDate(date) }]
});

const exiled = (reason, startDate, endDate = null, location) => ({
    description: reason ? `Exiled for ${reason}` : "Exiled",
    location,
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

const imprisoned = (reason, startDate, endDate = null, location) => ({
    description: reason ? `Imprisoned for ${reason}` : "Imprisoned",
    location,
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

const preached = (place, startDate, endDate = null, location = null) => ({
    description: place ? `Preached at ${place}` : "Preached",
    location: location || (typeof place === 'string' ? place.toLowerCase().replace(/\s+/g, '_') : place),
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

const event = (description, startDate, endDate = null, location) => ({
    description,
    location,
    dates: [{ start: normalizeDate(startDate), ...(endDate && { end: normalizeDate(endDate) }) }]
});

// ============================================================================
// FIGURE BUILDER
// ============================================================================
// Chainable builder for creating figure objects with clean syntax.

class FigureBuilder {
    constructor(id, name) {
        this.figure = { id, name, tags: [], events: [] };
    }

    born(date, location = null) {
        const normalized = normalizeDate(date);
        // Store birth year (and optionally month/day) for age calculations
        this.figure.birthYear = normalized.year;
        if (normalized.month) this.figure.birthMonth = normalized.month;
        if (normalized.day) this.figure.birthDay = normalized.day;

        if (location) {
            this.figure.events.push({
                description: "Born",
                location,
                dates: [{ start: normalized }]
            });
        }
        return this;
    }

    died(date, location = null) {
        const normalized = normalizeDate(date);
        // Store death year (and optionally month/day)
        this.figure.deathYear = normalized.year;
        if (normalized.month) this.figure.deathMonth = normalized.month;
        if (normalized.day) this.figure.deathDay = normalized.day;

        if (location) {
            this.figure.events.push({
                description: "Died",
                location,
                dates: [{ start: normalized }]
            });
        }
        return this;
    }

    tags(...tags) {
        this.figure.tags = tags;
        return this;
    }

    events(...events) {
        this.figure.events.push(...events);
        return this;
    }

    build() {
        return this.figure;
    }
}

const figure = (id, name) => new FigureBuilder(id, name);

// ============================================================================
// FIGURES DATA
// ============================================================================
//
// Example usage of date helpers:
//   .born(1834)                                  - born in 1834 (year only)
//   .born(month(1834, 6))                        - born June 1834
//   .born(day(1834, 6, 19), LOCATIONS.kelvedon) - born June 19, 1834 in Kelvedon
//   .died(day(1892, 1, 31), LOCATIONS.menton)   - died January 31, 1892 in Menton
//   event("Published", day(1678, 1, 25), null, LOCATIONS.london)

const figures = [
    figure("owen_j", "John Owen")
        .born(1616, LOCATIONS.stadhampton)
        .died(day(1683, 8, 24), LOCATIONS.ealing)
        .tags(TAGS.PUR, TAGS.IND)
        .events(
            event("Pastored Parish Ministry", 1643, null, LOCATIONS.fordham),
            event("Pastored Independent Congregation", 1646, null, LOCATIONS.coggeshall),
            served("Vice-Chancellor of Oxford University", 1652, 1657, LOCATIONS.oxford)
        )
        .build(),

    figure("coxe_n", "Nehemiah Coxe")
        .born(1645)
        .died(1689)
        .tags(TAGS.PB)
        .events(
            event("Admitted to church membership alongside Bunyan", 1669, null, LOCATIONS.bedford),
            event("Pastored and co-edited 1689 London Baptist Confession", 1675, 1689, LOCATIONS.london_petty)
        )
        .build(),

    figure("pink_a", "Arthur W. Pink")
        .born(day(1886, 4, 1), LOCATIONS.nottingham)
        .died(day(1952, 7, 15), LOCATIONS.stornoway)
        .tags(TAGS.BPT, TAGS.CALV)
        .events(
            event("Pastored short itineraries", 1910, null, LOCATIONS.colorado),
            event("Pastored across ministries", 1920, null, LOCATIONS.california),
            pastored(LOCATIONS.sydney, 1925, 1928),
            event("Isolated writing ministry and Died", 1940, 1952, LOCATIONS.stornoway)
        )
        .build(),

    figure("fisher_e", "Edward Fisher")
        .born(1601, LOCATIONS.gloucestershire)
        .died(1655)
        .tags(TAGS.PUR)
        .events(
            published("Marrow of Modern Divinity", 1645, LOCATIONS.london)
        )
        .build(),

    figure("boston_t", "Thomas Boston")
        .born(day(1676, 3, 17), LOCATIONS.duns)
        .died(day(1732, 5, 20), LOCATIONS.ettrick)
        .tags(TAGS.PCSA)
        .events(
            ordained(1699, LOCATIONS.simprin),
            event("Pastored and defended Marrow Theology", 1707, 1732, LOCATIONS.ettrick)
        )
        .build(),

    figure("watson_t", "Thomas Watson")
        .born(1620)
        .died(1686, LOCATIONS.barnston)
        .tags(TAGS.PUR)
        .events(
            event("Rector of St. Stephen's Walbrook", 1646, 1662, LOCATIONS.london_walbrook),
            event("Ejected during Great Ejection", 1662, null, LOCATIONS.london)
        )
        .build(),

    figure("purnell_r", "Robert Purnell")
        .born(1606)
        .died(1666)
        .tags(TAGS.PB)
        .events(
            event("Served as founding Elder (Circa 1657 prominence)", 1640, 1666, LOCATIONS.bristol)
        )
        .build(),

    figure("trivett_z", "Zenas Trivett")
        .born(1745)
        .died(1822)
        .tags(TAGS.PB)
        .events(
            event("Served long-standing Particular Baptist Pastorate", 1772, 1822, LOCATIONS.langham)
        )
        .build(),

    figure("fuller_a", "Andrew Fuller")
        .born(day(1754, 2, 6), LOCATIONS.wicken)
        .died(day(1815, 5, 7), LOCATIONS.kettering)
        .tags(TAGS.PB)
        .events(
            pastored(LOCATIONS.soham, 1775),
            pastored(LOCATIONS.kettering, 1782, 1815)
        )
        .build(),

    figure("rutherford_s", "Samuel Rutherford")
        .born(1600, LOCATIONS.nisbet)
        .died(day(1661, 3, 29), LOCATIONS.standrews)
        .tags(TAGS.PCSA)
        .events(
            pastored(LOCATIONS.anwoth, 1627, 1636),
            exiled("nonconformity", 1636, 1638, LOCATIONS.aberdeen),
            event("University Professor", 1639, 1661, LOCATIONS.standrews)
        )
        .build(),

    figure("spurgeon_c", "Charles Spurgeon")
        .born(day(1834, 6, 19), LOCATIONS.kelvedon)
        .died(day(1892, 1, 31), LOCATIONS.menton)
        .tags(TAGS.PB)
        .events(
            event("First Pastorate", 1851, null, LOCATIONS.waterbeach),
            preached("Metropolitan Tabernacle", 1854, 1892, LOCATIONS.london)
        )
        .build(),

    figure("edwards_j", "Jonathan Edwards")
        .born(day(1703, 10, 5), LOCATIONS.east_windsor)
        .died(day(1758, 3, 22), LOCATIONS.princeton)
        .tags(TAGS.CONG)
        .events(
            event("Pastored during Great Awakening", 1726, 1750, LOCATIONS.northampton),
            event("Missionary to Mohican tribes", 1751, 1757, LOCATIONS.stockbridge),
            event("College President", 1758, null, LOCATIONS.princeton)
        )
        .build(),

    figure("cotton_j", "John Cotton")
        .born(day(1585, 12, 4), LOCATIONS.derby)
        .died(day(1652, 12, 23), LOCATIONS.boston_ma)
        .tags(TAGS.PUR, TAGS.CONG)
        .events(
            event("Puritan Vicar", 1612, 1633, LOCATIONS.boston_lincs),
            event("Migrated and Served as Teacher", 1633, 1652, LOCATIONS.boston_ma)
        )
        .build(),

    figure("adams_t", "Thomas Adams")
        .born(1583)
        .died(1652, LOCATIONS.london)
        .tags(TAGS.PUR)
        .events(
            event("Preacher", 1612, 1614, LOCATIONS.willington),
            event("Vicar", 1614, 1618, LOCATIONS.wingrave),
            event("Preacher", 1619, 1652, LOCATIONS.london)
        )
        .build(),

    figure("bunyan_j", "John Bunyan")
        .born(day(1628, 11, 28), LOCATIONS.elstow)
        .died(day(1688, 8, 31), LOCATIONS.london)
        .tags(TAGS.PB)
        .events(
            event("Preached and Imprisoned inside Bedford Jail", 1655, 1672, LOCATIONS.bedford)
        )
        .build()
];
