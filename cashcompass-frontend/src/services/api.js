const API_BASE_URL = "http://localhost:8080";

async function apiRequest(endpoint, options = {}) {

    const token =
        localStorage.getItem("cashcompass_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    /*
     * Attach JWT to every request automatically.
     */
    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data = null;

    try {

        data = await response.json();

    } catch (error) {

        data = null;
    }

    /*
     * If backend returns 401, the JWT was
     * rejected / expired / logged out.
     */
    if (response.status === 401) {

        console.warn(
            "Unauthorized request. JWT may be invalid or logged out."
        );
    }

    if (!response.ok) {

        throw new Error(
            data?.message ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
}


export const api = {

    get: (endpoint) =>
        apiRequest(endpoint, {
            method: "GET"
        }),

    post: (endpoint, body) =>
        apiRequest(endpoint, {
            method: "POST",
            body:
                body !== undefined
                    ? JSON.stringify(body)
                    : undefined
        }),

    put: (endpoint, body) =>
        apiRequest(endpoint, {
            method: "PUT",
            body: JSON.stringify(body)
        }),

    delete: (endpoint) =>
        apiRequest(endpoint, {
            method: "DELETE"
        }),

    download: async (endpoint) => {

        const token =
            localStorage.getItem("cashcompass_token");

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                method: "GET",
                headers: token
                    ? {
                        Authorization: `Bearer ${token}`
                    }
                    : {}
            }
        );

        if (!response.ok) {
            let message = `Request failed with status ${response.status}`;
            try {
                const data = await response.json();
                message = data?.message || message;
            } catch (error) {
                // PDF/error response was not JSON.
            }
            throw new Error(message);
        }

        return response.blob();
    },
};