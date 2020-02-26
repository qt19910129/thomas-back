<template>
    <div class="leftBar">
        <el-menu router
                 :default-active="activeIndex"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#202D3D"
                text-color="#ccc"
                active-text-color="#1890ff"
                 :default-openeds="openeds"
        >
            <router-link to="/content/pageIndex">
                <el-menu-item index="/content/pageIndex">
                    <i class="el-icon-menu"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
            </router-link>

            <router-link to="/content/timeTableSet">
                <el-menu-item index="/content/timeTableSet">
                    <i class="el-icon-reading"></i>
                    <span slot="title">排课管理</span>
                </el-menu-item>
            </router-link>

            <router-link to="/content/dayFood">
                <el-menu-item index="/content/dayFood">
                    <i class="el-icon-fork-spoon"></i>
                    <span slot="title">每日食谱</span>
                </el-menu-item>
            </router-link>

            <router-link to="/content/signSet">
                <el-menu-item index="/content/signSet">
                    <i class="el-icon-set-up"></i>
                    <span slot="title">报名管理</span>
                </el-menu-item>
            </router-link>

            <router-link to="/content/classSet">
                <el-menu-item index="/content/classSet">
                    <i class="el-icon-bank-card"></i>
                    <span slot="title">班级管理</span>
                </el-menu-item>
            </router-link>

            <router-link to="/content/studentSet">
                <el-menu-item index="/content/studentSet">
                    <i class="el-icon-user"></i>
                    <span slot="title">学生管理</span>
                </el-menu-item>
            </router-link>

            <router-link to="/content/teacherSet">
                <el-menu-item index="/content/teacherSet">
                    <i class="el-icon-s-custom"></i>
                    <span slot="title">教师管理</span>
                </el-menu-item>
            </router-link>

            <el-submenu index="8">
                <template slot="title">
                    <i class="el-icon-s-data"></i>
                    <span>课程管理</span>
                </template>
                <router-link to="/content/courseSet">
                    <el-menu-item-group>
                        <el-menu-item index="/content/courseSet">课程管理</el-menu-item>
                    </el-menu-item-group>
                </router-link>

                <router-link to="/content/subjectSet">
                    <el-menu-item-group>
                        <el-menu-item index="/content/subjectSet">科目设置</el-menu-item>
                    </el-menu-item-group>
                </router-link>

                <router-link to="/content/levelSet">
                    <el-menu-item-group>
                        <el-menu-item index="/content/levelSet">级别设置</el-menu-item>
                    </el-menu-item-group>
                </router-link>
            </el-submenu>

            <el-submenu index="9">
                <template slot="title">
                    <i class="el-icon-s-order"></i>
                    <span>信息管理</span>
                </template>
                <router-link to="/content/schoolNotice">
                    <el-menu-item-group>
                        <el-menu-item index="/content/schoolNotice">校区公告</el-menu-item>
                    </el-menu-item-group>
                </router-link>
                <router-link to="/content/classFeedback">
                    <el-menu-item-group>
                        <el-menu-item index="/content/classFeedback">课后反馈</el-menu-item>
                    </el-menu-item-group>
                </router-link>
            </el-submenu>

            <el-submenu index="10">
                <template slot="title">
                    <i class="el-icon-office-building"></i>
                    <span>校区管理</span>
                </template>
                <router-link to="/content/classRoomSet">
                    <el-menu-item-group>
                        <el-menu-item index="/content/classRoomSet">教室管理</el-menu-item>
                    </el-menu-item-group>
                </router-link>
                <router-link to="/content/schoolIntroduce">
                    <el-menu-item-group>
                        <el-menu-item index="/content/schoolIntroduce">学校介绍</el-menu-item>
                    </el-menu-item-group>
                </router-link>
                <router-link to="/content/goodsSet">
                    <el-menu-item-group>
                        <el-menu-item index="/content/goodsSet">物品管理</el-menu-item>
                    </el-menu-item-group>
                </router-link>
            </el-submenu>

            <!--<router-link to="/content/classRoomSet">-->
                <!--<el-menu-item index="/content/classRoomSet">-->
                    <!--<i class="el-icon-discount"></i>-->
                    <!--<span slot="title">教室管理</span>-->
                <!--</el-menu-item>-->
            <!--</router-link>-->

            <!--<router-link to="/content/schoolIntroduce">-->
                <!--<el-menu-item index="/content/schoolIntroduce">-->
                    <!--<i class="el-icon-school"></i>-->
                    <!--<span slot="title">学校介绍</span>-->
                <!--</el-menu-item>-->
            <!--</router-link>-->

            <!--<router-link to="/content/schoolNotice">-->
                <!--<el-menu-item index="/content/schoolNotice">-->
                    <!--<i class="el-icon-chat-line-square"></i>-->
                    <!--<span slot="title">校区公告</span>-->
                <!--</el-menu-item>-->
            <!--</router-link>-->

            <router-link to="/content/posterExtend">
                <el-menu-item index="/content/posterExtend">
                    <i class="el-icon-postcard"></i>
                    <span slot="title">海报推广</span>
                </el-menu-item>
            </router-link>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return{
                studentId:'',  //学生id
                timeTableId:'',  //排课编辑修改id
                foodsId:'',  //每日食谱id
                classId:'',  //班级管理id
                teacherId1:'',  //老师id
                teacherId2:'',  //老师id
                openeds:[],
                goodsId:'',  //查看物品id
                // openeds:['8','9','10']
            }

        },
        methods: {
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            },
        },
        mounted() {

        },
        computed: {
            activeIndex() {  //路由设置高亮
                this.studentId = this.$route.params.studentId;  //获取学生id
                this.timeTableId = this.$route.params.edit;  //获取排课编辑修改id
                this.foodsId = this.$route.params.edit;  //获取每日食谱id
                this.classId = this.$route.params.edit;  //获取班级管理id
                this.teacherId1 = this.$route.params.teacherId;  //获取老师id
                this.teacherId2 = this.$route.params.classId;  //获取老师id
                this.goodsId = this.$route.params.goodsId;  //获取查看物品id
                if(this.$route.path === '/content/pageIndex') {
                    return '/content/pageIndex';
                } else if(this.$route.path === '/content/timeTableSet' || this.$route.path === '/content/details/addTimeTable/'+this.timeTableId || this.$route.path === '/content/details/moreTimeTable') {
                    return '/content/timeTableSet';
                } else if(this.$route.path === '/content/dayFood' || this.$route.path === '/content/details/foods/'+this.foodsId) {
                    return '/content/dayFood';
                } else if(this.$route.path === '/content/signSet') {
                    return '/content/signSet';
                } else if(this.$route.path === '/content/classSet' || this.$route.path === '/content/details/editClass/'+this.classId || this.$route.path === '/content/details/seeClass' || this.$route.path === '/content/details/seeSubject') {
                    return '/content/classSet';
                } else if(this.$route.path === '/content/studentSet' || this.$route.path === '/content/details/students/'+this.studentId) {
                    return '/content/studentSet';
                } else if(this.$route.path === '/content/teacherSet' || this.$route.path === '/content/details/teachers/'+this.teacherId1 || this.$route.path === '/content/details/teacherClassTable/'+this.teacherId2) {
                    return '/content/teacherSet';
                } else if(this.$route.path === '/content/courseSet') {
                    return '/content/courseSet';
                } else if(this.$route.path === '/content/subjectSet') {
                    return '/content/subjectSet';
                } else if(this.$route.path === '/content/levelSet') {
                    return '/content/levelSet';
                } else if(this.$route.path === '/content/classRoomSet') {
                    return '/content/classRoomSet';
                } else if(this.$route.path === '/content/schoolIntroduce') {
                    return '/content/schoolIntroduce';
                } else if(this.$route.path === '/content/schoolNotice') {
                    return '/content/schoolNotice';
                } else if(this.$route.path === '/content/posterExtend') {
                    return '/content/posterExtend';
                } else if(this.$route.path === '/content/classFeedback') {
                    return '/content/classFeedback';
                } else if(this.$route.path === '/content/goodsSet' || this.$route.path === '/content/goodsSet/seeGoods/'+this.goodsId) {
                    return '/content/goodsSet';
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .leftBar{
        width: 190px;
        position: fixed;
        height: 100%;
        overflow-y: scroll;
        background: #202D3D;
    }
    .el-menu-item.is-active {
        background: #1a2431 !important;
        box-sizing: border-box;
        border-left: 2px solid #1890ff;
    }
    .el-menu-item {

    }

</style>
