import lxRequest from "./index";

export function getTopMV(offset, limit = 10) {
  return lxRequest.get("/top/mv", {
    offset,
    limit,
  });
}
