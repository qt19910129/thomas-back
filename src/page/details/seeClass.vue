<template>
    <div class="seeClass">
        <!--返回首页-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/content/pageIndex' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:history.go(-1)">班级管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>班级详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="main">
            <el-row>
                <el-col :span="24"><span class="classTit">班级名称 :</span> <span class="className">{{className}}</span></el-col>
            </el-row>
            <div class="tit">班级老师</div>
            <!--班级老师数据-->
            <el-table :data="classTeacherData" border style="width: 100%;border: 1px solid #ccc;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="personName" label="老师姓名" width="" align="center"></el-table-column>
                <el-table-column prop="mobile" label="老师手机号" width="" align="center"></el-table-column>
                <el-table-column prop="deptName" label="所在部门" width="" align="center"></el-table-column>
            </el-table>
            <div class="tit">班级学生</div>
            <!--班级学生数据-->
            <el-table :data="classStuData" border style="width: 100%;border: 1px solid #ccc;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}">
                <el-table-column type="index" label="ID" width="60px" align="center"></el-table-column>
                <el-table-column prop="personName" label="学生姓名" width="" align="center"></el-table-column>
                <el-table-column prop="birthday" label="出生年月" width="" align="center" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="gender" label="性别" width="" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gender == 1">男</span>
                        <span v-else-if="scope.row.gender == 2">女</span>
                        <span v-else="scope.row.gender == 3">其他</span>
                    </template>
                </el-table-column>
                <el-table-column prop="parentName" label="家长姓名" width="" align="center"></el-table-column>
                <el-table-column prop="mobile" label="家长电话" width="" align="center"></el-table-column>
            </el-table>
            <div class="tit">班级科目<el-button type="text" icon="el-icon-download" class="fr" @click="load()">导出</el-button></div>
            <!--班级科目数据-->
            <el-table :data="classSubjectData" border style="width: 100%;border: 1px solid #ccc;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="subjectName" label="科目名称" width="" align="center"></el-table-column>
                <el-table-column prop="subjectNum" label="课次" width="" align="center"></el-table-column>
                <el-table-column prop="studentCount" label="学生数" width="" align="center"></el-table-column>
                <el-table-column prop="allSubjectNum" label="总课时" width="" align="center"></el-table-column>
                <el-table-column prop="subjectConsumer" label="课耗" width="" align="center"></el-table-column>
                <!--<el-table-column prop="edit" label="操作" width="" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button type="text" icon="el-icon-view" @click="goSeeSubject()">查看</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
        </div>
    </div>
</template>

<script>
    import {
        editClass,
        loadSubject
    } from "../../axios/classSet";
    import moment from 'moment';
    export default {
        data() {
            return {
                classTeacherData:[  //班级老师数据

                ],
                classStuData:[  //班级学生数据

                ],
                classSubjectData:[

                ],
                className:'',
            }
        },
        mounted() {
            this.getList();  //数据
        },
        methods:{
            getList() {
                let data = {
                    'classId':this.$route.query.classId,
                };
                editClass(data).then(res => {
                    if(res.code == 0) {
                        this.classTeacherData = res.data.classTeacher;
                        this.classStuData = res.data.classStudent;
                        this.classSubjectData = res.data.keSubjectResults;
                        this.className = res.data.name;
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            goSeeSubject() {   //跳转查看科目
                this.$router.push({
                    path: `/content/details/seeSubject`,
                })
            },
            load() {  //导出科目
                let data = {
                    'classId':this.$route.query.classId,
                };
                // window.open("http://47.104.251.161:8080/school/schoolClass/exportSbjectExcel?classId="+ this.$route.query.classId);

                window.location.href = this.GLOBAL.domainUrl + '/school/schoolClass/exportSbjectExcel?classId='  + this.$route.query.classId;
                // loadSubject(data).then(res => {
                //     console.log(res);
                //     if(res.code == 0) {
                //
                //     } else {
                //         this.$message.error('网络异常，请稍后再试');
                //     }
                // }).catch((e) => {});
            },
            dateFormat(row, column, cellValue, index){  //表格日期格式化
                var date = row[column.property];
                if(date == undefined){return ''};
                return moment(date).format("YYYY-MM-DD");
            },
        }
    }
</script>

<style scoped lang="less">
    .seeClass{
        .main{
            margin: 20px 0;
            padding: 20px;
            background: #fff;
            .classTit{
                font-size: 16px;
            }
            .className{
                font-size: 14px;
            }
            .tit{
                font-size: 16px;
                margin: 20px 0;
            }
        }

    }
</style>