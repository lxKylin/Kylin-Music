import lxRequest from "./index";

export function getBanners() {
  return lxRequest.get("/banner", {
    type: 2,
  });
}
