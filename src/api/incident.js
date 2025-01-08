// import http from "./http";
import { makeid } from "./challenge";

// export async function create_incident(
//   { photo, audio, video, ...data },
//   onUploadProgress
// ) {
//   let formdata = new FormData();
//   if (photo) {
//     let parts = photo.split("/");
//     let filename = parts[parts.length - 1];
//     parts = filename.split(".");
//     formdata.append("photo", {
//       uri: photo,
//       name: `${makeid(60)}.${parts[parts.length - 1]}`,
//       type: "multipart/form-data",
//     });
//   }
//   if (audio) {
//     let parts = audio.split("/");
//     let filename = parts[parts.length - 1];
//     parts = filename.split(".");
//     formdata.append("audio", {
//       uri: audio,
//       name: `${makeid(60)}.${parts[parts.length - 1]}`,
//       type: "multipart/form-data",
//     });
//   }
//   if (video) {
//     let parts = video.split("/");
//     let filename = parts[parts.length - 1];
//     parts = filename.split(".");
//     formdata.append("video", {
//       uri: video,
//       name: `${makeid(60)}.${parts[parts.length - 1]}`,
//       type: "multipart/form-data",
//     });
//   }
//   Object.keys(data).map((k) => {
//     formdata.append(k, data[k]);
//   });

//   console.log("formData", formdata);

//   return http.upload(formdata, "/incident/", onUploadProgress);
// }
import http from "./http"; // Assurez-vous que 'http' est bien configuré pour retourner des réponses appropriées.

export async function create_incident(
  { photo, audio, video, ...data },
  onUploadProgress
) {
  let formdata = new FormData();
  
  // Ajout des fichiers (photo, audio, vidéo)
  if (photo) {
    let parts = photo.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("photo", {
      uri: photo,
      name: `${makeid(60)}.${parts[parts.length - 1]}`,
      type: "multipart/form-data",
    });
  }
  if (audio) {
    let parts = audio.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("audio", {
      uri: audio,
      name: `${makeid(60)}.${parts[parts.length - 1]}`,
      type: "multipart/form-data",
    });
  }
  if (video) {
    let parts = video.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("video", {
      uri: video,
      name: `${makeid(60)}.${parts[parts.length - 1]}`,
      type: "multipart/form-data",
    });
  }

  Object.keys(data).map((k) => {
    formdata.append(k, data[k]);
  });

  try {
    const response = await http.upload(formdata, "/incident/", onUploadProgress);
    console.log("Voyons voir de pres", response);
    
    // Assurez-vous que la réponse contient un objet JSON avec un statut
    if (response && response.status === 201) {
      return { ok: true, data: response.data }; // Retourner un objet avec 'ok' et 'data'
    } else {
      return { ok: false, error: response }; // Retourner un objet avec 'ok' et une erreur si la requête échoue
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'incident:", error);
    return { ok: false, error }; // Retourner un objet avec 'ok' et l'erreur
  }
}


export function update_incident(id, data) {
  return http.put("/incident/" + id + "/", data);
}

export async function list_incident() {
  const res = await http.get("/incident/");

  const { results, ...rest } = res;
  console.log(rest);
  const finalData = [];
  results.map((res) => {
    if (res.user_id) {
      res.user = res.user_id;
      res.user_id = res.user.id;
      finalData.push(res);
    } else {
      finalData.push({ ...res, user: {} });
    }

    return res;
  });

  return finalData;
}


export async function my_list_incident(userId) {
  try {
    const res = await http.get("/incident/");
    const { results } = res;
    console.log('Les incidents récupérés:', results);

    const finalData = results.filter(incident => incident.user_id && incident.user_id.id === userId);

    return finalData;
  } catch (error) {
    console.error("Erreur lors de la récupération des incidents:", error);
    return [];
  }
}




export async function list_categories() {
  const { results } = await http.get("/category/");

  return results;
}

export async function list_zone() {
  const { results } = await http.get("/zone/");

  return results;
}
