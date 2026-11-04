/** A least-recently-used cache whose entries also expire */
export class Cache<T> {
	#entries = new Map<string, { value: T; expires: number }>();

	constructor(
		private maxEntries: number,
		private now = Date.now
	) {}

	get(key: string): T | undefined {
		const entry = this.#entries.get(key);
		if (!entry) return undefined;

		this.#entries.delete(key);
		if (entry.expires <= this.now()) return undefined;

		// Maps keep insertion order, so the first key is always the one used longest ago
		this.#entries.set(key, entry);
		return entry.value;
	}

	set(key: string, value: T, ttlMs: number) {
		this.#entries.delete(key);
		this.#entries.set(key, { value, expires: this.now() + ttlMs });

		if (this.#entries.size > this.maxEntries) {
			this.#entries.delete(this.#entries.keys().next().value as string);
		}
	}
}
