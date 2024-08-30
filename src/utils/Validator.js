import * as yup from "yup";

yup.setLocale({
  mixed: {
    required: "${label} est un champ obligatoire",
    email: "Adresse e-mail invalide",
  },
  string: {
    min: "${label} doit comporter plus de ${min} caractères",
    max: "${label} ne doit pas comporter plus de ${max} caractères",
  },
});


export default yup;
