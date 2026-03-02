export const capitalize = (str: string, separator = " ") => {
  if (!str || typeof str !== "string") return "";

  return (
    str
      // .toLowerCase() // Pastikan semua huruf kecil dulu agar konsisten
      .split(separator) // Pisahkan per kata
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
  );
};

export const splitPascalCase = (str: string) => {
  return str.match(/[A-Z][a-z]+/g) || [];
};
