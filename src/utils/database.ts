import type { ClothingItem, Coordinate } from '../types';

const DB_NAME = 'MyClosetDB';
const DB_VERSION = 1;
const STORE_NAME = 'clothing';

class DatabaseService {
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('category', 'category', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    async addClothing(clothing: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        if (!this.db) await this.init();

        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newClothing: ClothingItem = {
            ...clothing,
            id,
            createdAt: now,
            updatedAt: now,
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(newClothing);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(id);
        });
    }

    async getAllClothing(): Promise<ClothingItem[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getClothingById(id: string): Promise<ClothingItem | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || null);
        });
    }

    async updateClothing(id: string, updates: Partial<ClothingItem>): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onerror = () => reject(getRequest.error);
            getRequest.onsuccess = () => {
                const existing = getRequest.result;
                if (!existing) {
                    reject(new Error('Clothing item not found'));
                    return;
                }

                const updatedClothing = {
                    ...existing,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };

                const putRequest = store.put(updatedClothing);
                putRequest.onerror = () => reject(putRequest.error);
                putRequest.onsuccess = () => resolve();
            };
        });
    }

    async deleteClothing(id: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async getClothingByCategory(category: string): Promise<ClothingItem[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('category');
            const request = index.getAll(category);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async addCoordinate(clothingId: string, coordinate: Omit<Coordinate, 'id'>): Promise<void> {
        const clothing = await this.getClothingById(clothingId);
        if (!clothing) throw new Error('Clothing item not found');

        const newCoordinate: Coordinate = {
            ...coordinate,
            id: crypto.randomUUID(),
        };

        const updatedCoordinates = [...clothing.coordinates, newCoordinate];
        await this.updateClothing(clothingId, { coordinates: updatedCoordinates });
    }

    async deleteCoordinate(clothingId: string, coordinateId: string): Promise<void> {
        const clothing = await this.getClothingById(clothingId);
        if (!clothing) throw new Error('Clothing item not found');

        const updatedCoordinates = clothing.coordinates.filter(c => c.id !== coordinateId);
        await this.updateClothing(clothingId, { coordinates: updatedCoordinates });
    }
}

export const dbService = new DatabaseService(); 