/**
 * Sistema simple de seguimiento de preferencias del usuario
 * Almacena los IDs de los arreglos más vistos localmente
 */

export interface ViewCount {
    productId: number;
    count: number;
}

const STORAGE_KEY = 'aledet_product_views';

export const trackProductView = (productId: number) => {
    if (typeof window === 'undefined') return;
    
    const views: ViewCount[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = views.findIndex(v => v.productId === productId);
    
    if (index > -1) {
        views[index].count += 1;
    } else {
        views.push({ productId, count: 1 });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
};

export const getMostViewed = (limit = 5): ViewCount[] => {
    if (typeof window === 'undefined') return [];
    
    const views: ViewCount[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return views.sort((a, b) => b.count - a.count).slice(0, limit);
};
