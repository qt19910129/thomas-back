<template>
    <div class="seeStudentClass">
        <!--返回首页-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/content/pageIndex' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:history.go(-2)">学生管理</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:history.go(-1)">学生详情</a></el-breadcrumb-item>
            <el-breadcrumb-item>学生科目课表详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!--页面列表-->
        <el-table :data="oneSubject" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="oneSubject">
            <el-table-column prop="subject" label="科目" align="center"></el-table-column>
            <el-table-column prop="ks" label="课时" align="center"></el-table-column>
            <el-table-column prop="kh" label="课耗" align="center"></el-table-column>
            <el-table-column prop="syks" label="剩余课时" align="center"></el-table-column>
        </el-table>
        <div class="tit">科目课表<el-button type="text" icon="el-icon-download" class="fr" @click="loadSubject()">导出</el-button></div>
        <el-table :data="listData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}">
            <el-table-column type="index" label="ID" width="" align="center"></el-table-column>
            <el-table-column prop="caArrDate" width="250" label="上课时间" align="center"></el-table-column>
            <el-table-column prop="teacherName" label="讲师" align="center"></el-table-column>
            <el-table-column prop="assistantName" label="助教" align="center"></el-table-column>
            <el-table-column prop="classRoomName" label="教室" align="center"></el-table-column>
            <el-table-column prop="caName" label="课程名称" align="center"></el-table-column>
            <el-table-column prop="assistantName" label="其他说明" align="center"></el-table-column>
            <el-table-column prop="caStatus" label="上课状态" align="center"></el-table-column>
            <el-table-column property="edit" label="操作" align="center" width="200" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-document" @click="signIn(scope.row.csdId,0,'签到')">签到</el-button>
                    <el-button type="text" icon="el-icon-pie-chart" @click="signIn(scope.row.csdId,1,'请假')">请假</el-button>
                    <el-button type="text" icon="el-icon-folder-delete" @click="signIn(scope.row.csdId,3,'旷课')">旷课</el-button>
                </template>
            </el-table-column>
        </el-table>
        <template>
            <el-pagination
                    align="right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="records"
                    background
                    :hide-on-single-page="pageValue"
                    class="pages">
            </el-pagination>
        </template>
    </div>
</template>

<script>
    import {
        getOnesList,
    } from "../../axios/studentSet";
    import {
        studentStatus
    } from "../../axios/pageIndex"
    export default {
        data() {
            return {
                oneSubject:[],  //单科目
                listData:[],   //数据列表
                currentPage:1,  //分页默认选中哪页
                records:0,  //总页数
                rows:10,  //默认每页条数
                page:1,  //默认打开第一页
                pageValue:false,  //当只有一页时 分页隐藏
            }
        },
        mounted() {
            this.getOneSubject();
            this.getList();
        },
        methods: {
            getOneSubject() {  //获取单科目
                this.oneSubject = [
                    {
                        'subject':this.$route.params.subject,
                        'ks':this.$route.params.ks,
                        'kh':this.$route.params.kh,
                        'syks':this.$route.params.syks,
                    }
                ]
            },
            getList() {
                let data = {
                    'subject':this.$route.params.subject,
                    'userId':this.$route.params.userId,
                    'rows':this.rows,
                    'page':this.page,
                };
                getOnesList(data).then(res => {
                    if(res.code == 0) {
                        this.listData = res.data.jqGirdPage.rows;
                        this.records = res.data.jqGirdPage.records;
                        if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                            this.pageValue = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.rows = `${val}`;
                this.currentPage = 1;
                this.page = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.page = `${val}`;
                this.getList();
            },
            signIn(csdId,statusValue,text) {
                this.$confirm('确定为该学员' + text + '吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        'csdId':csdId,
                        'statusValue':statusValue
                    };
                    studentStatus(data).then(res => {
                        if(res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: text + '成功!'
                            });
                            // this.dialogTableVisible = false;
                            setTimeout(function () {
                                window.location.reload();
                            },1000);
                        } else {
                            this.$message.error('网络异常，请稍后再试');
                        }
                    }).catch((e) => {});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + text
                    });
                });
            },
            loadSubject() {  //导出科目
                window.location.href = this.GLOBAL.domainUrl + '/school/student/export_skxx?userId=' + this.$route.params.userId + '&subject=' + this.$route.params.subject;
            },
        }
    }
</script>

<style scoped lang="less">
    .seeStudentClass{
        .oneSubject{
            margin: 20px 0;
        }
        .tit{
            font-size: 18px;
            margin: 20px 0;
            height: 18px;
            line-height: 18px;
            button{
                padding: 0;
                margin-top: 3px;
            }
        }
    }
</style>