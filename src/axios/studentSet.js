import request from "./request";
import global from "../global/global";


/**
 * 获取学生管理   列表
 */
export function getStudentSetList(query) {
    return request.post(global.domainUrl + "/school/student/list", query
        , {
            headers:{
                token:global.token
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
                token:global.token
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
                token:global.token
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
                token:global.token
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
                token:global.token
            }
        }
    );
}