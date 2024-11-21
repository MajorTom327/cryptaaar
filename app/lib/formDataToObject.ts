export const formDataToObject = (formData: FormData) => {
  return Object.fromEntries(formData.entries());
};
