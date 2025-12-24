import { API } from "../index";

/* ================= GET ================= */
export const getCompanyProfile = async (mainFolder) => {
  const response = await API.get(
    `/users/company/me`,
    { params: { mainFolder } }
  );
  return response.data;
};

/* ================= CREATE ================= */
export const createCompanyProfile = async (data, mainFolder) => {
  const body = data instanceof FormData ? data : new FormData();

  // if (!(data instanceof FormData)) {
  //   Object.entries(data).forEach(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       value.forEach(v => body.append(key, v));
  //     } else if (value !== null && value !== undefined) {
  //       body.append(key, value);
  //     }
  //   });
  // }

  const response = await API.post(
    `/users/company`,
    body, 
    {
      params: { mainFolder },
      headers: { "Content-Type": "multipart/form-data" } 
    }
  );

  return response.data;
};

/* ================= UPDATE ================= */
export const updateCompanyProfile = async ( data, mainFolder) => {
  const body = data instanceof FormData ? data : new FormData();

  // Object.entries(data).forEach(([key, value]) => {
  //   if (Array.isArray(value)) {
  //     value.forEach(v => formData.append(key, v));
  //   } else if (value !== null && value !== undefined) {
  //     formData.append(key, value);
  //   }
  // });

 
  const response = await API.patch(
    `/users/company`,
    body, 
    {
      params: { mainFolder },
      headers: { "Content-Type": "multipart/form-data" } 
    }
  );

  return response.data;
};

/* ================= DELETE ================= */
export const deleteCompanyProfile = async (id, mainFolder) => {
  const response = await API.delete(
    `/users/company/${id}`,
    { params: { mainFolder } }
  );

  return response.data;
};
