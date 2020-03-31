import request from "./request";
import global from "../global/global";


/**
 * 获取学生管理   列表
 */
export function getStudentSetList(query) {
    return request.post(global.domainUrl + "/school/student/list", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 获取学生管理   续费
 */
export function studentRenew(query) {
    return request.post(global.domainUrl + "/school/student/editRenewTime", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 获取学生详情
 */
export function getStudent(query) {
    return request.post(global.domainUrl + "/school/student/getStudentInfo", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 修改宝宝姓名
 */
export function editStudentName(query) {
    return request.post(global.domainUrl + "/school/student/updateStudentName", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 获取上课信息列表
 */
export function getClassList(query) {
    return request.post(global.domainUrl + "/school/student/getClassList", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 兑换星星接口
 */
export function changeStars(query) {
    return request.post(global.domainUrl + "/school/student/integralExchange", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 获取课时包列表
 */
export function getBagsList(query) {
    return request.post(global.domainUrl + "/school/coursePackage/selectPackageListBySchoolId", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 获取科目课表列表
 */
export function getOnesList(query) {
    return request.post(global.domainUrl + "/school/student/skxx_view_list", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
