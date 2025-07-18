import api from "./api";

const fetchAllPaginatedData = async (endpoint) => {
    let results = []
    let nextUrl = endpoint 

    while (nextUrl) {
        try {
            const res = await api.get(nextUrl)
            results = [...results, ...res.data.results]
            nextUrl = res.data.next?.replace(import.meta.env.VITE_API_URL, "") || null
        } catch (err) {
            console.log("Paginated fetch error:", err);
            break
        }
    }
    
    return results
};

export default fetchAllPaginatedData;