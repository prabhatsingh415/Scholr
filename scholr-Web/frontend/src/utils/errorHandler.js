export const handleApiError = (error) => {
    if (error.response) {
        console.error("API Error Response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        return {
            message: error.response.data?.message || "An error occurred",
            status: error.response.status,
        };
    }
    else if (error.request) {
        console.error("API Error Request:", error.request);
        return {
            message: "No response from server",
            status: null,
        };
    }
    else {
        console.error("API Error:", error.message);
        return {
            message: error.message,
            status: null,
        };
    }
};
