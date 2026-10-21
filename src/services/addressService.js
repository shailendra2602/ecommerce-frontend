
const API_URL = "http://localhost:5000/api/addresses";

// Save address
export const saveAddress = async (addressData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save address");
  }

  return data;
};

// Get logged-in user's addresses
export const getAddresses = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first");
  }

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch addresses");
  }

  return data.addresses;
};
