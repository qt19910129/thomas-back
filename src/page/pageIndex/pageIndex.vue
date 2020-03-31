<template>
    <!--首页-->
    <div class="pageIndex">
        <!--面包屑-->
        <!--<div class="routeBack">-->
            <!--<router-link to="/content/pageIndex">首页</router-link>-->
        <!--</div>-->
        <!--首页内容-->
        <div class="columnData">
            <el-row :gutter="20" style="height: 440px;">
                <el-col :span="6">
                    <div class="columnFour columnFour-1">
                        <img src="../../static/img/pageIndex/stuNum.png">
                        <div>{{indexData.usersCount}}</div>
                        <div>在校学生</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="columnFour columnFour-2">
                        <img src="../../static/img/pageIndex/onClass.png">
                        <div>{{indexData.classCount}}</div>
                        <div>上课班级</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="columnFour columnFour-3">
                        <img src="../../static/img/pageIndex/teacherNum.png">
                        <div>{{indexData.teacherCount}}</div>
                        <div>在校教师</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="columnFour columnFour-4">
                        <img src="../../static/img/pageIndex/signNum.png">
                        <div>{{indexData.member}}</div>
                        <div>报名人数</div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="columnTwo">
                <el-col :span="12">
                    <div class="columnTwo-1">
                        <div>{{indexData.schoolAllCourseTime}}</div>
                        <div>课时总数</div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="columnTwo-2">
                        <div>{{indexData.schoolConsumeCourseTime}}</div>
                        <div>消耗课时</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--今日签到信息-->
        <div class="signMessage">
            <div class="signTitle">今日签到信息</div>
            <el-table :data="signTableData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="className" label="班级名称" width="" align="center"></el-table-column>
                <el-table-column prop="teacherName" label="主讲" width="" align="center"></el-table-column>
                <el-table-column prop="assistantName" label="助教" width="" align="center"></el-table-column>
                <el-table-column prop="subject" label="课程名称" width="" align="center"></el-table-column>
                <el-table-column prop="arrangeDate" label="上课时间" width="120" align="center" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="studentCount" label="总人数" width="" align="center"></el-table-column>
                <el-table-column prop="attendanceCount" label="已签到" width="" align="center"></el-table-column>
                <!--<el-table-column prop="noSignNum" label="未签到" width="" align="center"></el-table-column>-->
                <el-table-column label="未签到" width="" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-user" @click="noSign(scope.row.classId,scope.row.className,scope.row.subject)">{{scope.row.unAttendanceCount}}</el-button>
                        <!--<span icon="el-icon-user">{{scope.row.unAttendanceCount}}</span>-->
                    </template>
                </el-table-column>
                <el-table-column prop="attendance" label="出勤率" width="" align="center">
                    <template slot-scope="scope">
                        <span type="text" class="attendance">{{scope.row.attendance}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--未签到表格-->
            <el-dialog :title="noSignTitle" :visible.sync="dialogTableVisible">
                <el-table :data="gridData" border style="font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}">
                    <el-table-column type="index" label="ID" align="center"></el-table-column>
                    <el-table-column property="studentName" label="学生姓名" align="center"></el-table-column>
                    <el-table-column property="edit" label="操作" align="center" width="200">
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
                            @size-change="handleSizeChange1"
                            @current-change="handleCurrentChange1"
                            :current-page.sync="currentPage1"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="5"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="records1"
                            background
                            :hide-on-single-page="pageValue1"
                            class="pages">
                    </el-pagination>
                </template>
            </el-dialog>
        </div>
        <!--续费学员-->
        <div class="renewStudent">
            <div class="renewTitle">续费学员</div>
            <el-table :data="renewTableData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="renewTable">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="studentName" label="学生姓名" align="center"></el-table-column>
                <el-table-column prop="renewTime" label="续费截止日期" width="120" align="center" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="parentName" label="家长姓名" width="" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" width="" align="center"></el-table-column>
                <el-table-column prop="className" label="所在班级" width="" align="center"></el-table-column>
                <el-table-column prop="statusStr" label="学生状态" width="" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="goDetail(scope.row.id)">查看</el-button>
                        <!--<router-link to="/content/details/students">-->
                            <!---->
                        <!--</router-link>-->
                        <el-button type="text" icon="el-icon-money" @click="renew(scope.row.id)">续费</el-button>
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
        <!--续费弹窗-->
        <el-dialog title="续费" :visible.sync="dialogFormVisible" :before-close="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="选择课包名称" :label-width="formLabelWidth" prop="courseBagName">
                    <el-select v-model="form.courseBagName" placeholder="请选择课包名称" filterable clearable>
                        <el-option v-for="list in courseBag" :label="list.name" :value="list.value" :key="list.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="续费课时" :label-width="formLabelWidth" prop="renewNum">
                    <el-input v-model.number="form.renewNum" autocomplete="off" placeholder="请输入续费课时" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="续费费用" :label-width="formLabelWidth" prop="renewMoney">
                    <el-input v-model.number="form.renewMoney" autocomplete="off" placeholder="请输入续费费用"></el-input>
                </el-form-item>
                <el-form-item label="续费日期" :label-width="formLabelWidth" prop="renewDay">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.renewDay" value-format="yyyy-MM-dd" style="width: 80%;" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-form-item label="续费备注信息" :label-width="formLabelWidth" prop="explain">
                    <el-input  v-model="form.explain" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入续费备注信息" :maxlength="120"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        allData,
        renewData,
        signInData,
        noSignData,
        signUpData,
        studentStatus
    } from "../../axios/pageIndex";
    import {
        studentRenew,
    } from "../../axios/studentSet";
    import moment from 'moment';
    export default {
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                renewTableData: [], //续费学员列表
                signTableData: [],  //今日签到信息
                dialogFormVisible: false,
                form: {
                    renewNum: '',
                    renewDay: '',
                    courseBagName:'',
                    renewMoney:'',
                    explain:''
                },
                formLabelWidth: '120px',
                rules: {
                    renewNum: [
                        { required: true, message: '请输入续费课时数', trigger: 'blur' },
                        { type: 'number', message: '请输入正确的续费课时数'},
                        {
                            validator(rule, value, callback) {
                                if(value <= 0) {
                                    callback(new Error('续费课时数不能小于0'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    renewDay: [
                        { required: true, message: '请选择续费日期', trigger: 'blur' }
                    ],
                    courseBagName: [
                        { required: true, message: '请选择课包名称', trigger: 'change' }
                    ],
                    renewMoney: [
                        { required: true, message: '请输入续费费用', trigger: 'blur' },
                        { type: 'number', message: '请输入正确的续费费用'},
                        {
                            validator(rule, value, callback) {
                                if(value <= 0) {
                                    callback(new Error('续费费用不能小于0'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    explain: [
                        { required: true, message: '请输入续费备注信息', trigger: 'blur' }
                    ],
                },
                gridData: [],  //未签到信息表
                dialogTableVisible: false,
                indexData:{},  //总数据
                currentPage:1,  //分页默认选中哪页
                records:0,  //总页数
                rows:10,  //默认每页条数
                page:1,  //默认打开第一页
                pageValue:false,  //当只有一页时 分页隐藏
                ids:-1,  //续费id
                noSignTitle:'',  //未签到title
                currentPage1:1,  //分页默认选中哪页
                records1:0,  //总页数
                rows1:10,  //默认每页条数
                page1:1,  //默认打开第一页
                pageValue1:false,  //当只有一页时 分页隐藏
                courseBag:[
                    {
                        'name':111,
                        'value':1

                    },
                    {
                        'name':222,
                        'value':2

                    }
                ]
            }
        },
        mounted() {
            this.allDatas();
            this.renewList();
            this.signInList();
            this.signUp();
        },
        methods: {
            allDatas() {  //总数据
                allData('').then(res => {
                    if(res.code == 0) {
                        this.indexData = res.data;
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            renewList() {   //续费列表数据
                let data = {
                    'rows':this.rows,
                    'page':this.page,
                };
                renewData(data).then(res => {
                    if(res.code == 0) {
                        this.records = res.data.jqGirdPage.records;
                        this.renewTableData = res.data.jqGirdPage.rows;
                        if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                            this.pageValue = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            signInList() {  //今日签到信息列表
                signInData('').then(res => {
                    if(res.code == 0) {
                        this.signTableData = res.data.list;
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
                this.renewList();
            },
            handleCurrentChange(val) {
                this.page = `${val}`;
                this.renewList();
            },
            goDetail(studentId) {  //跳转差看学生详情页
                this.$router.push({
                    path: `/content/details/students/${studentId}`,
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            'ids':this.ids,
                            'renewTime':this.form.renewDay,
                            'buyClassCount':this.form.renewNum
                        };
                        studentRenew(data).then(res => {
                            if(res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功'
                                });
                                this.$refs[formName].resetFields();
                                this.dialogFormVisible = false;
                                setTimeout(function () {
                                    window.location.reload();
                                },1000);
                            } else {
                                this.$message.error('网络异常，请稍后再试');
                            }
                        }).catch((e) => {});
                    } else {
                        console.log('error submit!!');
                        this.dialogFormVisible = true;
                        return false;
                    }
                });
            },
            resetForm(formName) {  //续费取消
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
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
                            setTimeout(function () {
                                window.location.reload();
                            },1000);
                            // this.dialogTableVisible = false;
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
            signOut() {
                this.dialogTableVisible = false;
                this.$message({
                    type: 'success',
                    message: '请假成功'
                });
            },
            signNo() {
                this.dialogTableVisible = false;
                this.$message({
                    type: 'success',
                    message: '旷课成功'
                });
            },
            dateFormat(row, column, cellValue, index){  //表格日期格式化
                var date = row[column.property];
                if(date == undefined){return ''};
                return moment(date).format("YYYY-MM-DD");
            },
            renew(ids) {
                this.dialogFormVisible = true;
                this.ids = ids;
            },
            handleClose(done) {
                this.$refs['form'].resetFields();
                this.dialogFormVisible = false;
            },
            noSign(classId,className,subject) {  //点击未签到
                this.dialogTableVisible = true;
                this.noSignTitle = className + " 签到表";
                let data = {
                    'classId':classId,
                    'subject':subject,
                    'page1':this.page1,
                    'rows1':this.rows1
                };
                noSignData(data).then(res => {
                    if(res.code == 0) {
                        this.records1 = res.data.pages;
                        this.gridData = res.data.list;
                        if(res.data.pages <= 10) {  //小于10条时 隐藏分页
                            this.pageValue1 = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            handleSizeChange1(val) {
                // console.log(`每页 ${val} 条`);
                this.rows1 = `${val}`;
                this.currentPage1 = 1;
                this.page1 = 1;
                this.noSign();
            },
            handleCurrentChange1(val) {
                this.page1 = `${val}`;
                this.noSign();
            },
            signUp() {  //每次加载首页 调取是否有新增报名学员
                signUpData('').then(res => {
                    if(res.code == 0) {
                        if(res.data > 0) {
                            this.$alert('有新的报名信息，请点击前往查看', '报名信息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$router.push({
                                        path: `/content/signSet`,
                                    })
                                }
                            });
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            }
        }
    }
</script>

<style scoped lang="less">
    .pageIndex{
        width: 100%;
        .columnFour{
            height: 100%;
            box-shadow: 0 2px 12px 0 #999;
            text-align: center;
            min-width: 130px;
            animation:rotaY 2s 1;
            -webkit-animation:rotaY 2s 1;
            border-radius: 10px;
            img{
                width: 80px;
                height: 80px;
                margin: 80px 0 50px 0;
            }
            div{
                margin-top: 40px;
                font-weight: bold;
                line-height: 30px;
                color: #fff;
                font-size: 30px;
            }
        }
        .columnFour-1{
            background: linear-gradient(to bottom, #FEBD12, #FF921D);
            /*background: url("../../static/img/pageIndex/bg1.png") no-repeat 100% 100%;*/
        }
        .columnFour-2{
            background: linear-gradient(to bottom, #6ACAFF, #5E89FC);
            /*background: url("../../static/img/pageIndex/bg2.png") no-repeat 100% 100%;*/
        }
        .columnFour-3{
            background: linear-gradient(to bottom, #FE8D47, #F45F58);
            /*background: url("../../static/img/pageIndex/bg3.png") no-repeat 100% 100%;*/
        }
        .columnFour-4{
            background: linear-gradient(to bottom, #8FB0FF, #9F86FF);
            /*background: url("../../static/img/pageIndex/bg4.png") no-repeat 100% 100%;*/
        }
        .columnTwo{
            margin-top: 20px;
            height: 180px;
            .columnTwo-1,.columnTwo-2{
                box-shadow: 0 2px 12px 0 #999;
                font-weight: bold;
                color: #fff;
                font-size: 30px;
                text-align: center;
                height: 130px;
                padding-top: 50px;
                animation:rotaX 2s 1;
                -webkit-animation:rotaX 2s 1;
                border-radius: 10px;
                div{
                    line-height: 30px;
                    margin-bottom: 30px;
                }
            }
        }
        .columnTwo-1{
            background: linear-gradient(94deg, #B099FA, #6E85F2);
            /*background: url("../../static/img/pageIndex/bg5.png"),linear-gradient(94deg, #B099FA, #6E85F2) no-repeat;*/
            background-size: cover;

        }
        .columnTwo-2{
            background: linear-gradient(94deg, #4C5DFD, #5DABF6);
            /*background: url("../../static/img/pageIndex/bg6.png") no-repeat 90% 40%;*/
            background-size: 160%;
        }
        @-webkit-keyframes rotaY{
            from{-webkit-transform:rotateY(0deg) }
            to{-webkit-transform:rotateY(-360deg) }
        }
        @-webkit-keyframes rotaX{
            from{-webkit-transform:rotateX(0deg)}
            to{-webkit-transform:rotateX(-360deg)}
        }
        .renewTitle,.signTitle{
            width: 100%;
            height: 20px;
            line-height: 20px;
            font-size: 16px;
            padding-top: 50px;
        }
        .renewTable,.signTable{
            margin: 20px 0 0 0;
        }
        .renewTable th{
            padding: 10px 0 !important;
        }
        .renewTable td{
            padding: 8px 0 !important;
        }
        .attendance{
            color: #1298D6;
        }
    }
</style>
