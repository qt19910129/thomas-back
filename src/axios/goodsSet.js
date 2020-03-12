import request from "./request";
import global from "../global/global";

/**
 * 物品管理 列表
 */
export function getGoodsSetList(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/list", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}
/**
 * 物品分类 列表
 */
export function getGoodsClass(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/add_page", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}
/**
 * 物品分类 新增
 */
export function goodsAdd(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/add", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}
/**
 * 物品分类 领用页面
 */
export function collarUse(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/draw_page", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}
/**
 * 物品分类 领用保存
 */
export function saveUse(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/draw", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}
/**
 * 物品分类 续存
 */
export function saveGoods(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/edit", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}
/**
 * 物品详情页 明细
 */
export function seeGoodsMain(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/edit_page", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}
/**
 * 物品详情页 领用信息
 */
export function seeGoodsUseList(query) {
    return request.post(global.domainUrl + "/school/goodsDetail/goodsGetsLog_list", query
        , {
            headers:{
                token:global.token
            }
        }
    );
}