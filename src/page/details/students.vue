<template>
    <div class="students">
        <!--返回首页-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/content/pageIndex' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:history.go(-1)">学生管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>学生详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="tit">学生信息</div>
        <div class="studentsMain">
            <el-row>
                <el-col :span="6" class="tableName">所在校区</el-col>
                <el-col :span="6">{{studentInfo.classSchoolName}}</el-col>
                <el-col :span="6" class="tableName">所在班级</el-col>
                <el-col :span="6" :title="studentInfo.className">
                    {{studentInfo.className|ellipsis}}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">班级老师</el-col>
                <el-col :span="6">{{studentInfo.chargeinTeacherName}}</el-col>
                <el-col :span="6" class="tableName">老师电话</el-col>
                <el-col :span="6">{{studentInfo.teacherMobile}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">缴费日期</el-col>
                <el-col :span="6" v-if="studentInfo.renewTime">{{studentInfo.renewTime.substring(0,10)}}</el-col>
                <el-col :span="6" v-else></el-col>
                <el-col :span="6" class="tableName">购课信息</el-col>
                <el-col :span="6" style="color: red;">
                    20/80
                    <el-button type="text" icon="el-icon-s-release" @click="refund()">退费</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">宝宝(学生)姓名</el-col>
                <el-col :span="6">
                    {{studentInfo.kidName}}
                    <el-button type="text" icon="el-icon-setting" @click="openEditName">修改</el-button>
                </el-col>
                <el-col :span="6" class="tableName">英文名</el-col>
                <el-col :span="6">
                    {{studentInfo.englishName}}
                    <el-button type="text" icon="el-icon-setting" @click="openEnglishName">修改</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">出生日期</el-col>
                <el-col :span="6">{{studentInfo.birthday | formatDate}}</el-col>
                <el-col :span="6" class="tableName">宝宝性别</el-col>
                <el-col :span="6">
                    <span v-if="studentInfo.birthday == 1">男</span>
                    <span v-if="studentInfo.birthday == 2">女</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">家长姓名</el-col>
                <el-col :span="6">{{studentInfo.parentName}}</el-col>
                <el-col :span="6" class="tableName">家长身份</el-col>
                <el-col :span="6">{{studentInfo.parentIdentity}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">家长电话</el-col>
                <el-col :span="6">{{studentInfo.mobile}}</el-col>
                <el-col :span="6" class="tableName">所在区域</el-col>
                <el-col :span="6">{{studentInfo.region}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">家庭住址</el-col>
                <el-col :span="6">{{studentInfo.address}}</el-col>
                <el-col :span="6" class="tableName">就读学校</el-col>
                <el-col :span="6">{{studentInfo.school}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="tableName">用户积分</el-col>
                <el-col :span="6">{{studentInfo.bonusPoint}}</el-col>
                <el-col :span="6" class="tableName">学习奖励</el-col>
                <el-col :span="6">
                    <span v-if="studentInfo.learningAwards == null || studentInfo.learningAwards == 0" class="color999">
                        暂无
                    </span>
                    <span v-else>
                        {{studentInfo.learningAwards}}星
                        <el-button type="text" icon="el-icon-star-off" @click="openChangeStar()">兑换</el-button>
                    </span>
                </el-col>
            </el-row>
        </div>
        <div class="tit">上课信息<el-button type="text" icon="el-icon-download" class="fr" @click="load()">导出</el-button></div>
        <!--数据表格-->
        <el-table :data="studentClassData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
            <el-table-column prop="subject" label="科目" align="center"></el-table-column>
            <el-table-column prop="zk" label="课时" align="center"></el-table-column>
            <el-table-column prop="kh" label="课耗" align="center"></el-table-column>
            <el-table-column prop="sy" label="剩余课时" align="center"></el-table-column>
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
        <!--缴费信息-->
        <div class="tit">缴费信息</div>
        <el-table :data="payData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
            <el-table-column prop="payDate" label="缴费日期" align="center"></el-table-column>
            <el-table-column prop="rePayData" label="续费日期" align="center"></el-table-column>
            <el-table-column prop="buyKs" label="购买课时" align="center"></el-table-column>
            <el-table-column prop="courseBagName" label="课包名称" align="center"></el-table-column>
            <el-table-column prop="edits" label="操作" align="center">
                <el-button type="text" icon="el-icon-edit" @click="editPay()">修改</el-button>
            </el-table-column>
        </el-table>
        <!--退费信息-->
        <div class="tit">退费信息</div>
        <el-table :data="refundData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
            <el-table-column prop="refundDate" label="退费日期" align="center"></el-table-column>
            <el-table-column prop="refundMoney" label="退费金额" align="center"></el-table-column>
            <el-table-column prop="refundExplain" label="退费说明" align="center"></el-table-column>
        </el-table>
        <!--兑换信息-->
        <div class="tit">兑换信息</div>
        <el-table :data="changeData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
            <el-table-column prop="changeDate" label="兑换日期" align="center"></el-table-column>
            <el-table-column prop="changeNum" label="使用数量" align="center"></el-table-column>
            <el-table-column prop="changeGoods" label="兑换商品" align="center"></el-table-column>
        </el-table>
        <!--退费弹窗-->
        <el-dialog title="退费" :visible.sync="refundVisible" :before-close="handleClose">
            <el-form :model="refundForm" :rules="refundRules" ref="refundForm">
                <el-form-item label="退费日期" :label-width="formLabelWidth" prop="refundDate">
                    <el-date-picker type="date" placeholder="选择退费日期" v-model="refundForm.refundDate" value-format="yyyy-MM-dd" style="width: 80%;" :picker-options='pickerOptions'></el-date-picker>
                </el-form-item>
                <el-form-item label="退费费用" :label-width="formLabelWidth" prop="refundMoney">
                    <el-input v-model.number="refundForm.refundMoney" autocomplete="off" placeholder="请输入退费费用"></el-input>
                </el-form-item>
                <el-form-item label="退费说明" :label-width="formLabelWidth" prop="refundExplain">
                    <el-input  v-model="refundForm.refundExplain" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入退费说明" :maxlength="120"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetRefundForm('refundForm')">取 消</el-button>
                <el-button type="primary" @click="submitRefundForm('refundForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--学习分析-->
        <!--<div class="tit">学习分析</div>-->
        <!--<div id="studentEcharts"></div>-->
    </div>
</template>

<script>
    import {
        getStudent,
        editStudentName,
        getClassList,
        changeStars
    } from "../../axios/studentSet";
    import {formatDate} from "../../components/common/date"
    export default {
        data() {
            return {
                formLabelWidth: '120px',
                studentInfo:{},  //学生信息
                studentId: -1, //学生id
                studentClassData:[
                    // {
                    //     subject:'数学',
                    //     num:20,
                    //     readyNum:10,
                    //     leaveNum:10,
                    // },
                ],
                starNum:-1,  //星星数量（模拟）
                option:{
                    backgroundColor: '#F6FAFF',
                    textStyle: {
                        color: '#333'
                    },
                    title : {
                        text: '某站点用户访问来源',
                        subtext: '纯属虚构',
                        x:'center',
                        textStyle: {
                            fontSize: 18,
                            fontWeight: 'bolder',
                            color: '#333'          // 主标题文字颜色
                        },
                        subtextStyle: {
                            color: '#333'          // 副标题文字颜色
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
                        textStyle: {
                            fontSize: 14,
                            color: '#333'          // 主标题文字颜色
                        },
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                currentPage:1,  //分页默认选中哪页
                records:0,  //总页数
                rows:10,  //默认每页条数
                page:1,  //默认打开第一页
                pageValue:false,  //当只有一页时 分页隐藏
                refundVisible:false,  //退费弹窗
                refundForm:{
                    'refundDate':'',
                    'refundMoney':'',
                    'refundExplain':''
                },
                refundRules:{
                    refundDate: [
                        { required: true, message: '请选择退费日期', trigger: 'blur' }
                    ],
                    refundMoney: [
                        { required: true, message: '请输入退费费用', trigger: 'blur' },
                        { type: 'number', message: '请输入正确的退费费用'},
                        {
                            validator(rule, value, callback) {
                                if(value <= 0) {
                                    callback(new Error('退费费用不能小于0'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    refundExplain: [
                        { required: true, message: '请输入退费备注信息', trigger: 'blur' }
                    ],
                },
                payData:[
                    {
                        'payDate':'2020-26-26',
                        'rePayData':'2020-26-26',
                        'buyKs':'111',
                        'courseBagName':'哈哈哈'
                    }
                ],
                refundData:[
                    {
                        'refundDate':'2020-26-26',
                        'refundMoney':200,
                        'refundExplain':'退费说明啊啊啊'
                    }
                ],
                changeData:[
                    {
                        'changeDate':'2020-26-26',
                        'changeNum':'-200星星',
                        'changeGoods':'狗'
                    }
                ]
            }
        },
        mounted() {
            window.scrollTo(0,0); //每次路由进入 页面滚动到顶部
            this.getInfo();  //数据
            this.getClass();  //上课信息
            //基于准备好的dom 初始化echarts实例
            // var myChart = this.$echarts.init(document.getElementById('studentEcharts'),'dark');
            // myChart.setOption(this.option);
        },
        methods: {
            getInfo() {
                let data = {
                    'id':this.$route.params.studentId,
                };
                getStudent(data).then(res => {
                    if(res.code == 0) {
                        this.studentInfo = res.data;
                        this.starNum = res.data.learningAwards;
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            getClass() {
                let data = {
                    'id':this.$route.params.studentId,
                    'rows':this.rows,
                    'page':this.page,
                };
                getClassList(data).then(res => {
                    if(res.code == 0) {
                        this.records = res.data.total;
                        this.studentClassData = res.data.list;
                        if(res.data.total <= 10) {  //小于10条时 隐藏分页
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
                this.getClass();
            },
            handleCurrentChange(val) {
                this.page = `${val}`;
                this.getClass();
            },
            openEditName() {
                this.$prompt('请输入宝宝(学生)姓名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:this.studentInfo.kidName,
                    inputPattern: /\S/,
                    inputErrorMessage: '请输入宝宝(学生)姓名'
                }).then(({ value }) => {
                    this.studentInfo.kidName = value;
                    let data = {
                        'id':this.$route.params.studentId,
                        'name':value,
                        'nameType':1
                    };
                    editStudentName(data).then(res => {
                        if(res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            });
                        } else {
                            this.$message.error('网络异常，请稍后再试');
                        }
                    }).catch((e) => {});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            openEnglishName() {
                this.$prompt('请输入英文名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:this.studentInfo.englishName,
                    inputPattern: /\S/,
                    inputErrorMessage: '请输入英文名'
                }).then(({ value }) => {
                    this.studentInfo.englishName = value;
                    let data = {
                        'id':this.$route.params.studentId,
                        'name':value,
                        'nameType':2
                    };
                    editStudentName(data).then(res => {
                        if(res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            });
                        } else {
                            this.$message.error('网络异常，请稍后再试');
                        }
                    }).catch((e) => {});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            openChangeStar() {
                this.$prompt('请输入要兑换的星星数量', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '请输入要兑换的星星数量'
                }).then(({ value }) => {
                    let reg = /^[-+]?\d+$/;
                    if(!reg.test(value) || value < 0) {
                        this.$message({
                            type: 'error',
                            message: '兑换失败，请输入正确兑换星星的数量'
                        });
                    } else if(this.starNum * 1 < value * 1) {
                        this.$message({
                            type: 'error',
                            message: '兑换失败，您输入的星星数量大于已有的星星数量'
                        });
                    } else {
                        let data = {
                            'id':this.$route.params.studentId,
                            'learningAwards':value
                        };
                        changeStars(data).then(res => {
                            if(res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '兑换成功'
                                });
                                this.studentInfo.learningAwards = this.studentInfo.learningAwards * 1 - value;
                            } else {
                                this.$message.error('网络异常，请稍后再试');
                            }
                        }).catch((e) => {});
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            load() {  //导出
                window.location.href = this.GLOBAL.domain + '/school/student/export?id=' + this.$route.params.studentId;
            },
            refund() {  //退费
                this.refundVisible = true;
            },
            handleClose(done) {
                this.$refs['refundForm'].resetFields();
                this.refundVisible = false;
            },
            resetRefundForm(formName) {  //续费取消
                this.refundVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            submitRefundForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                    } else {
                        this.refundVisible = true;
                        return false;
                    }
                });
            },
            editPay() {  //修改

            }
        },
        filters: {
            ellipsis (value) {
                if(value) {
                    let len=value.length;
                    if (!value) return ''
                    if (value.length > 20) {
                        return value.substring(0,15) + '...'
                    }
                    return value
                }
            },
            formatDate (time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd')
            }
        }
    }
</script>
<style scoped lang="less">
    .students{
        .studentsMain{
            background: #fff;
            border-radius: 10px;
            font-size: 14px;
            .tableName{
                background: #E8EEF3;
            }
            .el-col-6,.el-col-18{
                height: 50px;
                line-height: 50px;
                text-align: center;
                border: 1px solid #ddd;
                button{
                    margin-left: 10px;
                }
            }
        }
        .tit{
            font-size: 18px;
            margin: 20px 0;
            button{
                padding: 0;
            }
        }
        #studentEcharts{
            height: 600px;
            width: 600px;
            margin: 20px auto;
        }
    }
</style>
