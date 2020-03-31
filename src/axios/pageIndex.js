import request from "./request";
import global from "../global/global";

/**
 * 首页 总数据
 */
export function allData(query) {
    return request.post(global.domainUrl + "/school/schoolIndex/indexData", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 首页 续费学员列表数据
 */
export function renewData(query) {
    return request.post(global.domainUrl + "/school/student/payStudentList", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 首页 今日签到信息列表
 */
export function signInData(query) {
    return request.post(global.domainUrl + "/school/curriculumArrangement/queryAttendance", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 首页 未签到列表
 */
export function noSignData(query) {
    return request.post(global.domainUrl + "/school/curriculumArrangement/queryAttendanceStudentList", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 首页 是否有新增报名学员
 */
export function signUpData(query) {
    return request.post(global.domainUrl + "/school/register/hasUnRead", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}
/**
 * 首页 签到等操作
 */
export function studentStatus(query) {
    return request.post(global.domainUrl + "/school/schoolIndex/updateCheckInStatus", query
        , {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    );
}