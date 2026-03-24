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
    likes: number;
    photos: string[];
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Comment {
    id: number;
    arrangement_id: number;
    author_name: string;
    content: string;
    is_approved: boolean;
    created_at: string;
}

export interface Stats {
    completed_sales: number;
    cancelled_sales: number;
    most_viewed: { name: string, count: number }[];
    most_liked: { name: string, count: number }[];
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
        const token = localStorage.getItem("token");
        if (!token) {
            if (typeof window !== "undefined") window.location.href = "/login";
            return null;
        }
        const res = await fetch(`${API_URL}/stats/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) {
            localStorage.removeItem("token");
            if (typeof window !== "undefined") window.location.href = "/login";
            return null;
        }
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
 * Registra un 'Me gusta' de producto en el backend (incrementa contador en DB)
 */
export async function registerLike(id: number): Promise<void> {
    try {
        await fetch(`${API_URL}/stats/like/${id}`, { method: "POST" });
    } catch (e) {
        console.error(e);
    }
}

/**
 * Quita un 'Me gusta' de producto en el backend (decrementa contador en DB)
 */
export async function registerUnlike(id: number): Promise<void> {
    try {
        await fetch(`${API_URL}/stats/unlike/${id}`, { method: "POST" });
    } catch (e) {
        console.error(e);
    }
}

// --- Utilidades de localStorage para likes ---
const LIKES_KEY = "ale_det_liked_products";

export function isLiked(productId: number): boolean {
    if (typeof localStorage === "undefined") return false;
    const liked: number[] = JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
    return liked.includes(productId);
}

export function saveLike(productId: number): void {
    if (typeof localStorage === "undefined") return;
    const liked: number[] = JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
    if (!liked.includes(productId)) {
        liked.push(productId);
        localStorage.setItem(LIKES_KEY, JSON.stringify(liked));
    }
}

export function removeLike(productId: number): void {
    if (typeof localStorage === "undefined") return;
    const liked: number[] = JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
    localStorage.setItem(LIKES_KEY, JSON.stringify(liked.filter(id => id !== productId)));
}

// --- Funciones de Comentarios ---

/**
 * Obtiene los comentarios aprobados de un arreglo
 */
export async function getComments(arrangementId: number): Promise<Comment[]> {
    try {
        const res = await fetch(`${API_URL}/arrangements/${arrangementId}/comments`);
        if (!res.ok) throw new Error("Error fetching comments");
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Publica un nuevo comentario para un arreglo
 */
export async function postComment(arrangementId: number, author_name: string, content: string): Promise<Comment | null> {
    try {
        const res = await fetch(`${API_URL}/arrangements/${arrangementId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author_name, content })
        });
        if (!res.ok) throw new Error("Error posting comment");
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
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
