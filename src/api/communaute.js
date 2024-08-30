import http from "./http";
export function create_communaute(data) {
  return http.post("/community/", data);

}

export async function list_communaute() {
  const { results } = await http.get("/community/");

  return results;
}

export default {
  create_communaute,
};
