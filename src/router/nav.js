

const PageIndex = () => import("@/page/pageIndex/pageIndex.vue");  //首页
const TimeTableSet = () => import("@/page/timeTableSet/timeTableSet.vue");  //排课管理
const DayFood = () => import("@/page/dayFood/dayFood.vue");  //每日食谱
const SignSet = () => import("@/page/signSet/signSet.vue");  //报名管理
const ClassSet = () => import("@/page/classSet/classSet.vue");  //班级管理
const StudentSet = () => import("@/page/studentSet/studentSet.vue");  //学生管理
const TeacherSet = () => import("@/page/teacherSet/teacherSet.vue");  //教师管理
const ClassRoomSet = () => import("@/page/classRoomSet/classRoomSet.vue");  //教室管理
const SchoolIntroduce = () => import("@/page/schoolIntroduce/schoolIntroduce.vue");  //学校介绍
const SchoolNotice = () => import("@/page/schoolNotice/schoolNotice.vue");  //校区公告
const PosterExtend = () => import("@/page/posterExtend/posterExtend.vue");  //海报推广
const CourseSet = () => import("@/page/courseSet/courseSet.vue");  //课程管理
const SubjectSet = () => import("@/page/subjectSet/subjectSet.vue");  //科目设置
const LevelSet = () => import("@/page/levelSet/levelSet.vue");  //级别设置
const ClassFeedback = () => import("@/page/classFeedback/classFeedback.vue");  //课后反馈
const GoodsSet = () => import("@/page/goodsSet/goodsSet.vue");  //物品管理
const CourseBag = () => import("@/page/courseBag/courseBag.vue");  //课包管理

//详情页
const Students = () => import("@/page/details/students.vue");  //查看学生
const AddTimeTable = () => import("@/page/details/addTimeTable.vue");  //添加修改排课列表
const MoreTimeTable = () => import("@/page/details/moreTimeTable.vue");  //批量排课
const Foods = () => import("@/page/details/foods.vue");  //编辑，添加每日食谱
const SeeClass = () => import("@/page/details/seeClass.vue");  //查看班级
const EditClass = () => import("@/page/details/editClass.vue");  //编辑班级
const SeeSubject = () => import("@/page/details/seeSubject.vue");  //班级科目表详情
const Teachers = () => import("@/page/details/teachers.vue");  //查看教师详情
const TeacherClassTable = () => import("@/page/details/teacherClassTable.vue");  //查看教师课表详情
const SeeGoods = () => import("@/page/details/seeGoods.vue");  //查看物品详情
export default [
    { path: "/content/pageIndex", name: "首页", component: PageIndex },
    { path: "/content/dayFood", name: "每日食谱", component: DayFood },
    { path: "/content/timeTableSet", name: "排课管理", component: TimeTableSet },
    { path: "/content/signSet", name: "班级管理", component: SignSet },
    { path: "/content/classSet", name: "班级管理", component: ClassSet },
    { path: "/content/studentSet", name: "学生管理", component: StudentSet },
    { path: "/content/teacherSet", name: "教师管理", component: TeacherSet },
    { path: "/content/classRoomSet", name: "教室管理", component: ClassRoomSet },
    { path: "/content/schoolIntroduce", name: "学校介绍", component: SchoolIntroduce },
    { path: "/content/schoolNotice", name: "校区公告", component: SchoolNotice },
    { path: "/content/posterExtend", name: "海报推广", component: PosterExtend },
    { path: "/content/courseSet", name: "课程管理", component: CourseSet },
    { path: "/content/subjectSet", name: "科目设置", component: SubjectSet },
    { path: "/content/levelSet", name: "级别设置", component: LevelSet },
    { path: "/content/details/students/:studentId", name: "查看学生", component: Students },
    { path: "/content/details/addTimeTable/:edit", name: "排课详情", component: AddTimeTable },
    { path: "/content/details/moreTimeTable", name: "批量排课", component: MoreTimeTable },
    { path: "/content/details/foods/:edit", name: "编辑/添加食谱", component: Foods },
    { path: "/content/details/seeClass", name: "查看班级", component: SeeClass },
    { path: "/content/details/editClass/:edit", name: "编辑班级", component: EditClass },
    { path: "/content/details/seeSubject", name: "班级科目表详情", component: SeeSubject },
    { path: "/content/details/teachers/:teacherId", name: "教师详情", component: Teachers },
    { path: "/content/details/teacherClassTable/:classId", name: "教师课表详情", component: TeacherClassTable },
    { path: "/content/classFeedback", name: "课后反馈", component: ClassFeedback },
    { path: "/content/goodsSet", name: "物品管理", component: GoodsSet },
    { path: "/content/goodsSet/seeGoods/:goodsId", name: "查看物品", component: SeeGoods },
    { path: "/content/courseBag", name: "课包管理", component: CourseBag },
]
