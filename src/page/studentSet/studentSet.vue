<template>
    <div class="studentSet">
        <!--搜索-->
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-form-inline">
            <el-row>
                <el-col :span="6">
                    <el-form-item prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入家长或孩子姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="phoneNum">
                        <el-input v-model="ruleForm.phoneNum" placeholder="请输入联系电话" :maxlength="11"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
                        <el-button @click="dataReset()">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--数据表格-->
        <el-table :data="studentSetData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;margin-top: 20px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
            <el-table-column type="index" label="ID" align="center"></el-table-column>
            <el-table-column prop="studentName" label="学生姓名" align="center"></el-table-column>
            <el-table-column prop="birthDay" label="出生日期" width="" align="center" :formatter="dateFormat"></el-table-column>
            <el-table-column prop="parentName" label="家长姓名" width="" align="center"></el-table-column>
            <el-table-column prop="phone" label="联系电话" width="" align="center"></el-table-column>
            <el-table-column prop="className" label="所在班级" width="" align="center"></el-table-column>
            <el-table-column prop="statusStr" label="学生状态" width="" align="center">
                <!--<template slot-scope="scope">-->
                    <!--<span type="text" v-if="scope.row.studentState == 1" class="greenText">上课中</span>-->
                    <!--<span type="text" v-if="scope.row.studentState == 2">停课中</span>-->
                <!--</template>-->
            </el-table-column>
            <el-table-column fixed="right" prop="studentState" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" @click="goDetail(scope.row.id)">查看</el-button>
                    <!--<el-button type="text" v-if="scope.row.status == 1" icon="el-icon-notebook-2" @click="classEnd()">停课</el-button>-->
                    <el-button type="text" v-if="scope.row.status == 2" icon="el-icon-notebook-2" @click="classBegin()">开课</el-button>
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
        <!--续费弹窗-->
        <el-dialog title="续费" :visible.sync="dialogFormVisible" :before-close="handleClose">
            <el-form :model="moneyForm" :rules="moneyRules" ref="moneyForm">
                <el-form-item label="选择课包名称" :label-width="formLabelWidth" prop="courseBagName">
                    <el-select v-model="moneyForm.courseBagName" placeholder="请选择课包名称" filterable clearable>
                        <el-option v-for="list in courseBag" :label="list.name" :value="list.value" :key="list.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="续费课时" :label-width="formLabelWidth" prop="renewNum">
                    <el-input v-model.number="moneyForm.renewNum" autocomplete="off" placeholder="请输入续费课时"></el-input>
                </el-form-item>
                <el-form-item label="续费费用" :label-width="formLabelWidth" prop="renewMoney">
                    <el-input v-model.number="moneyForm.renewMoney" autocomplete="off" placeholder="请输入续费费用"></el-input>
                </el-form-item>
                <el-form-item label="续费日期" :label-width="formLabelWidth" prop="renewDay">
                    <el-date-picker type="date" placeholder="选择续费日期" v-model="moneyForm.renewDay" value-format="yyyy-MM-dd" style="width: 80%;" :picker-options='pickerOptions'></el-date-picker>
                </el-form-item>
                <el-form-item label="续费备注信息" :label-width="formLabelWidth" prop="explain">
                    <el-input  v-model="moneyForm.explain" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入续费备注信息" :maxlength="120"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetMoneyForm('moneyForm')">取 消</el-button>
                <el-button type="primary" @click="submitMoneyForm('moneyForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getStudentSetList,
        studentRenew,
        getBagsList
    } from "../../axios/studentSet";
    import moment from 'moment';
    export default {
        data() {
            var checkphone = (rule, value, callback) => {
                // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
                if (!this.isCellPhone(value) && value.length > 0) {//引入methods中封装的检查手机格式的方法
                    callback(new Error("请输入正确的11位手机号码!"));
                } else {
                    callback();
                }
            };
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                ruleForm: {
                    name: '',
                    phoneNum: '',
                },
                rules: {
                    name: [],
                    phoneNum: [
                        { validator: checkphone, trigger: 'blur' },
                    ],
                },
                studentSetData:[],  //数据
                dialogFormVisible:false, //续费弹窗
                moneyForm: {
                    renewNum: '',
                    renewDay: '',
                    courseBagName:'',
                    renewMoney:'',
                    explain:''
                },
                formLabelWidth: '120px',
                moneyRules: {
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
                currentPage:1,  //分页默认选中哪页
                records:0,  //总页数
                rows:10,  //默认每页条数
                page:1,  //默认打开第一页
                pageValue:false,  //当只有一页时 分页隐藏
                ids:-1,  //续费学生id
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
            this.getList();  //列表数据
            this.getBags();  //课时包列表
        },
        methods: {
            getBags() {  //获取课时包列表
                getBagsList().then(res => {
                    if(res.code == 0) {

                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            dataReset() {  //重置搜索
                this.$refs['ruleForm'].resetFields();
                let data = {
                    'rows':10,
                    'page':1
                };
                this.rows = 10;
                this.currentPage = 1;
                this.page = 1;
                getStudentSetList(data).then(res => {
                    if(res.code == 0) {
                        this.records = res.data.jqGirdPage.records;
                        this.studentSetData = res.data.jqGirdPage.rows;
                        if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                            this.pageValue = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            getList() {  //获取数据列表
                let data = {
                    'rows':this.rows,
                    'page':this.page,
                };
                getStudentSetList(data).then(res => {
                    if(res.code == 0) {
                        this.records = res.data.jqGirdPage.records;
                        this.studentSetData = res.data.jqGirdPage.rows;
                        if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                            this.pageValue = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.ruleForm.name === '' && this.ruleForm.phoneNum === '') {
                            this.$message({
                                message: '请输入您要搜索的内容',
                                type: 'warning'
                            });
                        } else {
                            this.rows = 10;
                            this.currentPage = 1;
                            this.page = 1;
                            let data = {
                                'name':this.ruleForm.name,
                                'phone':this.ruleForm.phoneNum,
                                'page':1,
                                'rows':10
                            };
                            getStudentSetList(data).then(res => {
                                if(res.code == 0) {
                                    this.records = res.data.jqGirdPage.records;
                                    this.studentSetData = res.data.jqGirdPage.rows;
                                    if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                                        this.pageValue = true;
                                    }
                                } else {
                                    this.$message.error('网络异常，请稍后再试');
                                }
                            }).catch((e) => {});
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            goDetail(studentId) {  //跳转差看学生详情页
                this.$router.push({
                    path: `/content/details/students/${studentId}`,
                })
            },
            submitMoneyForm(formName) {  //续费确定
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            'ids':this.ids,
                            'renewTime':this.moneyForm.renewDay,
                            'buyClassCount':this.moneyForm.renewNum
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
            resetMoneyForm(formName) {  //续费取消
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            classBegin() {  //开课
                this.$confirm('此操作将为该学员开课, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '开课成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消开课'
                    });
                });
            },
            classEnd() {  //停课
                this.$confirm('此操作将为该学员停课, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '停课成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消停课'
                    });
                });
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
            //检查手机号
            isCellPhone(val) {
                if (!/^1[3456789]\d{9}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            },
            dateFormat(row, column, cellValue, index){  //表格日期格式化
                var date = row[column.property];
                if(date == undefined || date == '' || date == null){return ''};
                return moment(date).format("YYYY-MM-DD");
            },
            renew(ids) {
                this.dialogFormVisible = true;
                this.ids = ids;
            },
            handleClose(done) {
                this.$refs['moneyForm'].resetFields();
                this.dialogFormVisible = false;
            },
        }
    }
</script>

<style scoped class="less">
    .studentSet{

    }
</style>
