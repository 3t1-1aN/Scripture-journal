/**
 * Local StudyEntry API using localStorage.
 * Replaces the base44 entity with the same interface: list, create, update, delete.
 */
const STORAGE_KEY = 'scripture_journal_study_entries';

function getAll() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveAll(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function parseSort(order) {
    if (!order || typeof order !== 'string') return null;
    const desc = order.startsWith('-');
    const field = desc ? order.slice(1) : order;
    return { field, desc };
}

export const StudyEntry = {
    list(order) {
        const entries = getAll();
        const sort = parseSort(order);
        if (sort) {
            entries.sort((a, b) => {
                const aVal = a[sort.field];
                const bVal = b[sort.field];
                if (aVal == null && bVal == null) return 0;
                if (aVal == null) return sort.desc ? 1 : -1;
                if (bVal == null) return sort.desc ? -1 : 1;
                const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
                return sort.desc ? -cmp : cmp;
            });
        }
        return entries;
    },

    create(data) {
        const entries = getAll();
        const id = crypto.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const entry = { ...data, id };
        entries.push(entry);
        saveAll(entries);
        return entry;
    },

    update(id, data) {
        const entries = getAll();
        const idx = entries.findIndex((e) => e.id === id);
        if (idx === -1) return null;
        entries[idx] = { ...entries[idx], ...data, id };
        saveAll(entries);
        return entries[idx];
    },

    delete(id) {
        const entries = getAll().filter((e) => e.id !== id);
        saveAll(entries);
    },
};
