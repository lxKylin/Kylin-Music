import lxRequest from "./index";

export function getBanners() {
  return lxRequest.get("/banner", {
    type: 2,
  });
}

export function getRankings(id) {
  return lxRequest.get("/playlist/detail", {
    id,
  });
}
