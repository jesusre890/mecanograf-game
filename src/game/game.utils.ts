type NormalizeOptions = {
  uppercase: boolean;
  accents: boolean;
  punctuation: boolean;
};

export function normalizeText(text: string, options: NormalizeOptions) {
  let result = text;

  if (!options.uppercase) {
    result = result.toLowerCase();
  }

  if (!options.accents) {
    result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  if (!options.punctuation) {
    result = result.replace(/[.,;:!?¿¡"]/g, "");
  }

  return result;
}
