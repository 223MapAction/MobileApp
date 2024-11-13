import http, { makeid } from "./http";

export async function list_user() {
  const getData = async (route) => {
    const { results, next } = await http.get(route);
    if (next) {
      const res = await getData(next);
      return [...results, ...res];
    }
    return results;
  };
  return getData("/user/");
}

export async function read_user(id) {
  return await http.get("/user/" + id);
}

export async function update_user(id, { avatar, ...data }, token = null) {
  let formdata = new FormData();

  // Vérifie que l'avatar est bien une URI locale, sinon ne pas l'ajouter
  if (avatar && avatar.startsWith("file://")) {
    let parts = avatar.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("avatar", {
      uri: avatar,
      name: `${makeid(60)}.${parts[parts.length - 1]}`,
      type: "image/png", // Utiliser le bon type MIME (ou le type attendu par le backend)
    });
  } else {
    console.warn("Avatar non inclus car il n'est pas local ou est manquant.");
  }

  // Ajout des autres données de l'utilisateur dans formdata
  Object.keys(data).forEach((key) => {
    formdata.append(key, data[key]);
  });

  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await http.put(`/user/${id}/`, formdata, options);
    return response.data; // Renvoyer les données pour un traitement ultérieur
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    throw error;
  }
}


export default {
  list_user,
};
