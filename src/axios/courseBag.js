import request from "./request";
import global from "../global/global";

/**
 * 课程包 列表
 */
export function getCourseBagList(query) {
    return request.post(global.domainUrl + "/school/coursePackage/list", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 课程包 新增
 */
export function getCourseBagAdd(query) {
    return request.post(global.domainUrl + "/school/coursePackage/add", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 课程包 编辑回显
 */
export function getCourseBagEditShow(query) {
    return request.post(global.domainUrl + "/school/coursePackage/edit_page", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 课程包 编辑保存
 */
export function getCourseBagEditSave(query) {
    return request.post(global.domainUrl + "/school/coursePackage/add", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}