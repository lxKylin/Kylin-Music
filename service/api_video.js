import lxRequest from "./index";

export function getTopMV(offset, limit = 10) {
  return lxRequest.get("/top/mv", {
    offset,
    limit,
  });
}

/**
 * 请求MV的播放地址
 */
export function getMVURL(id) {
  return lxRequest.get("/mv/url", {
    id,
  });
}

/**
 * 请求mv详情
 * @param {number} id
 */
export function getMVDetail(mvid) {
  return lxRequest.get("/mv/detail", {
    mvid,
  });
}

/**
 * 请求mv相关推荐
 * @param {number} id
 */
export function getRelatedVideo(id) {
  return lxRequest.get("/related/allvideo", {
    id,
  });
}
