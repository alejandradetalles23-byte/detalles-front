import { PUBLIC_WHATSAPP_NUMBER, PUBLIC_API_URL } from '$env/static/public';

export const API_URL = PUBLIC_API_URL;
export const WHATSAPP_NUMBER = PUBLIC_WHATSAPP_NUMBER;

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category_id?: number;
    views: number;
    photos: string[];
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Stats {
    completed_sales: number;
    cancelled_sales: number;
    most_viewed: { name: string, count: number }[];
    most_ordered: { name: string, count: number }[];
}

export const getWhatsAppLink = (productTitle: string, price: number) => {
    const message = `Hola Alejandra Detalles! Me interesa el arreglo floral "${productTitle}" que tiene un precio de $${price}.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Obtiene todos los arreglos de la API
 */
export async function getProducts(categoryId?: number): Promise<Product[]> {
    try {
        const url = categoryId ? `${API_URL}/arrangements/?category_id=${categoryId}` : `${API_URL}/arrangements/`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error fetching products");
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Obtiene un solo arreglo por ID
 */
export async function getProduct(id: number | string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/arrangements/${id}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Obtiene todas las categorías
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/categories/`);
        if (!res.ok) throw new Error("Error fetching categories");
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Obtiene estadísticas del panel admin
 */
export async function getStats(): Promise<Stats | null> {
    try {
        const res = await fetch(`${API_URL}/stats/`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("Unauthorized or Error");
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Registra una vista de producto en el backend (incrementa contador en DB)
 */
export async function registerView(id: number): Promise<void> {
    try {
        await fetch(`${API_URL}/stats/view/${id}`, { method: "POST" });
    } catch (e) {
        console.error(e);
    }
}
/**
 * Crea un nuevo arreglo floral (vía FormData para fotos)
 */
export async function createProduct(formData: FormData): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/arrangements/`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: formData
        });
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Actualiza un arreglo existente
 */
export async function updateProduct(id: number, formData: FormData): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/arrangements/${id}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: formData
        });
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Elimina un arreglo por ID
 */
export async function deleteProduct(id: number): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/arrangements/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}
export async function getSettings() {
    try {
        const res = await fetch(`${API_URL}/settings/`);
        if (!res.ok) throw new Error("Error fetching settings");
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}
