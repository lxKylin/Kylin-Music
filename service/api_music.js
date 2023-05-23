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

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return lxRequest.get("/top/playlist", {
    cat,
    limit,
    offset,
  });
}
