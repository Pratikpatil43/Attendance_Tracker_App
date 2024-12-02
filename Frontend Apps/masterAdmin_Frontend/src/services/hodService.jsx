import axios from "axios";

export const addHod = async (formData) => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("Authentication token is required.");

  const response = await axios.post(
    "http://localhost:5000/api/masterAdmin/hod/add",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
