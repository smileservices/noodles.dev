export const shortenText = (text, start, maxLength) => {
    return text.length > maxLength
      ? text.slice(start, maxLength)
      : text;
};