import lxRequest from "./index";

export function getSongDetail(ids) {
  return lxRequest.get("/song/detail", {
    ids,
  });
}
