export const textToColor = (str: string) => {
  const hash = str.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const color = Math.floor(Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216))
    .toString(16)
    .padStart(6, "0");

  return `#${color}`;
};
