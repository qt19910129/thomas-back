<template>
    <div class="signSet">
        <!--搜索from表单-->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-row>
                <el-col :span="4">
                    <el-form-item prop="phoneNum" class="signSetStyle">
                        <el-input v-model.trim="ruleForm.phoneNum" placeholder="请输入用户手机号" :maxlength=11></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item prop="stuName" class="signSetStyle">
                        <el-input v-model.trim="ruleForm.stuName" placeholder="请输入孩子姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item required>
                        <el-col :span="11">
                            <el-form-item prop="date1">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" value-format="yyyy-MM-dd" style="width: 100%;"
                                                :picker-options="pickerOptionsStart"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="date1">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date2" value-format="yyyy-MM-dd" style="width: 100%;"
                                                :picker-options="pickerOptionsEnd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item style="margin-left: 30px;">
                        <el-select v-model="ruleForm.classState" placeholder="请选择班级状态" filterable clearable>
                            <el-option label="新用户" value="1" key="1"></el-option>
                            <el-option label="已联系" value="2" key="2"></el-option>
                            <el-option label="试听" value="3" key="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')" style="margin-left: 20px;">搜索</el-button>
                        <el-button @click="dataReset()">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--新增及表格-->
        <div class="signSetMain">
            <!--新增-->
            <div class="signAddBox">
                <el-button type="primary" @click="addSignVisible = true">新增</el-button>
            </div>
            <!--数据表格-->
            <el-table :data="signSetData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="kidName" label="孩子姓名" width="120" align="center"></el-table-column>
                <el-table-column prop="birthday" label="出生日期" width="120" align="center" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="sex" label="性别" width="60" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gender == 1">男</span>
                        <span v-if="scope.row.gender == 2">女</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="联系电话" width="" align="center"></el-table-column>
                <el-table-column prop="address" label="家庭地址" width="" align="center"></el-table-column>
                <el-table-column prop="createTime" label="报名时间" width="" align="center"></el-table-column>
                <el-table-column label="沟通记录" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="openRemare(scope.row.id)">记录</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gender == 1">新用户</span>
                        <span v-if="scope.row.gender == 2">已联系</span>
                        <span v-if="scope.row.gender == 3">试听</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-document-checked" @click="openPay(scope.row.id)">签约</el-button>
                        <el-button type="text" icon="el-icon-document-delete" @click="openNoPay(scope.row.id)">未签约</el-button>
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

        <!--新增弹窗-->
        <el-dialog title="新增用户" :visible.sync="addSignVisible" class="add">
            <el-form :model="addForm" :rules="addRules" ref="addForm">
                <el-form-item label="学生姓名" prop="stuName" :label-width="formLabelWidth">
                    <el-input v-model="addForm.stuName" autocomplete="off" placeholder="请输入学生姓名"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="addForm.stuDate" type="date" placeholder="选择出生日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
                    <el-input v-model.trim="addForm.phone" autocomplete="off" placeholder="请输入联系电话" :maxlength=11></el-input>
                </el-form-item>
                <el-form-item label="所在区域" :label-width="formLabelWidth">
                    <el-cascader
                            ref="cascaderAddr"
                            v-model="addForm.address"
                            :options="citys"
                            :props="{ expandTrigger: 'hover' }"
                            @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="家庭住址" :label-width="formLabelWidth">
                    <el-input v-model="addForm.home" autocomplete="off" placeholder="请输入家庭住址"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-select v-model="addForm.sex" placeholder="请选择性别" filterable clearable>
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--记录弹窗-->
        <el-dialog title="沟通记录" :visible.sync="recordVisible">
            <el-form :model="recordForm" ref="recordForm">
                <el-form-item label="" :label-width="formLabelWidth">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入沟通记录" v-model="recordForm.record"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetRecordForm('recordForm')">取 消</el-button>
                <el-button type="primary" @click="submitRecordForm('recordForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--签约弹窗-->
        <el-dialog title="缴费信息" :visible.sync="payVisible" class="pay">
            <el-form :model="payForm" :rules="payRules" ref="payForm">
                <el-form-item label="缴费日期" prop="payDate" :label-width="formLabelWidth">
                    <el-date-picker type="date" placeholder="选择缴费日期" v-model="payForm.payDate" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>

                <!--<el-form-item label="缴费日期" prop="payDate" :label-width="formLabelWidth">-->
                    <!--<el-date-picker v-model="payForm.payDate" type="date" placeholder="选择缴费日期" value-format="yyyy-MM-dd"></el-date-picker>-->
                <!--</el-form-item>-->


                <el-form-item label="课时数" prop="payNum" :label-width="formLabelWidth">
                    <el-input v-model.number.trim="payForm.payNum" autocomplete="off" placeholder="请输入课时数"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetPayForm('payForm')">取 消</el-button>
                <el-button type="primary" @click="submitPayForm('payForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getSignSetList,
        addRegister,
        getRemark,
        addRemark,
        addPay,
        deletePay,
        getAllArea
    } from "../../axios/signSet";
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
                    phoneNum: '',
                    stuName: '',
                    date1: '',
                    date2: '',
                },
                rules: {
                    phoneNum: [
                        { required: true, validator: checkphone, trigger: 'blur' },
                    ],
                    stuName: [],
                    date1: [],
                    date2: [],
                },
                addRules:{
                    stuName: [
                        { required: true, message: '请输入学生姓名', trigger: 'blur' }
                    ],
                    stuDate: [],
                    phone: [
                        { required: true, validator: checkphone, trigger: 'blur' },
                    ],
                    address: [],
                    home: [],
                    sex: [],
                },
                signSetData:[],  //数据
                addSignVisible:false, //新增弹窗
                addForm:{  //新增数据
                    stuName:'',
                    stuDate:'',
                    phone:'',
                    address:[],
                    home:'',
                    sex:'',
                },
                formLabelWidth:'100px',
                recordVisible:false,  //沟通弹窗
                recordForm:{
                    record:''
                },
                payVisible:false, //签约弹窗
                payForm:{
                    payDate:'',
                    payNum:''
                },
                payRules:{
                    payDate: [
                        { type: 'string', required: true, message: '请选择缴费日期', trigger: 'change' }
                    ],
                    payNum: [
                        { required: true, message: '请输入课时数', trigger: 'blur' },
                        { type: 'number', message: '请输入正确的课时数'},
                        {
                            validator(rule, value, callback) {
                                if(value < 0) {
                                    callback(new Error('课时数不能为负数'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },
                currentPage:1,  //分页默认选中哪页
                records:0,  //总页数
                rows:10,  //默认每页条数
                page:1,  //默认打开第一页
                pageValue:false,  //当只有一页时 分页隐藏
                pickerOptionsStart: {  //开始时间不小于结束时间
                    disabledDate: time => {
                        let endDateVal = this.ruleForm.date2;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {  //结束时间不大于开始时间
                    disabledDate: time => {
                        let beginDateVal = this.ruleForm.date1;
                        if (beginDateVal) {
                            return (time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                            );
                        }
                    }
                },
                remarkId:0,  //沟通记录id
                payId:0,  //缴费id
                citys:[],  //省市区
                province:'',  //省
                city:'',  //市
                district:'',  //区
            }
        },
        mounted() {
            this.getList();
            this.getCitys();
        },
        methods: {
            getList() {  //数据列表
                let data = {
                    'rows':this.rows,
                    'page':this.page
                };
                getSignSetList(data).then(res => {
                    this.records = res.data.jqGirdPage.records;
                    this.signSetData = res.data.jqGirdPage.rows;
                    if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                        this.pageValue = true;
                    }
                }).catch((e) => {});
            },
            dataReset() {  //重置搜索
                this.$refs['ruleForm'].resetFields();
                this.ruleForm.date2 = '';
                let data = {
                    'rows':10,
                    'page':1
                };
                this.rows = 10;
                this.currentPage = 1;
                this.page = 1;
                getSignSetList(data).then(res => {
                    this.records = res.data.jqGirdPage.records;
                    this.signSetData = res.data.jqGirdPage.rows;
                    if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                        this.pageValue = true;
                    }
                }).catch((e) => {});
            },
            submitForm(formName) {  //搜索
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //搜索成功
                        if(this.ruleForm.phoneNum == '' && this.ruleForm.stuName == '' && this.ruleForm.date1 == '' && this.ruleForm.date2 == '') {
                            this.$message({
                                message: '请输入您要搜索的内容',
                                type: 'warning'
                            });
                        } else {
                            // console.log(this.ruleForm.date1);
                            this.rows = 10;
                            this.currentPage = 1;
                            this.page = 1;
                            let data = {
                                'mobile':this.ruleForm.phoneNum,
                                'kidName':this.ruleForm.stuName,
                                'createTimeStart':this.ruleForm.date1,
                                'createTimeEnd':this.ruleForm.date2,
                            };
                            getSignSetList(data).then(res => {
                                // console.log(res.data);
                                // console.log(res.data.jqGirdPage.rows);
                                this.records = res.data.jqGirdPage.records;
                                this.signSetData = res.data.jqGirdPage.rows;
                                if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                                    this.pageValue = true;
                                }
                            }).catch((e) => {});
                        }

                    } else {
                        // console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitAddForm(formName) {   //新增
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            'kidName':this.addForm.stuName,
                            'birthday':this.addForm.stuDate,
                            'mobile':this.addForm.phone,
                            'province':this.province,
                            'city':this.city,
                            'district':this.district,
                            'location':this.province+this.city+this.district,
                            'address':this.addForm.home,
                            'gender':this.addForm.sex,
                        };
                        console.log(data);
                        addRegister(data).then(res => {  //点击保存
                            if(res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '新增成功'
                                });
                                setTimeout(function () {
                                    window.location.reload();
                                },1000);
                            } else if(res.code == 2000) {
                                this.$message.error('该手机号已完成过注册，请重新输入');
                            } else if(res.code == 1) {
                                this.$message.error('手机号格式不对，请重新输入');
                            } else {
                                this.$message.error('网络异常，请稍后再试');
                            }
                        }).catch((e) => {});
                        this.$refs[formName].resetFields();
                        this.addSignVisible = false;
                    } else {
                        // console.log('error submit!!');
                        this.addSignVisible = true;
                        return false;
                    }
                });
            },
            resetAddForm(formName) {  //新增取消
                this.addSignVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            handleChange(value) {  //城市联动
                // console.log(value,this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels);
                this.province = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels[0];
                this.city = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels[1];
                this.district = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels[2];
            },
            resetRecordForm(formName) {  //沟通记录取消
                this.recordVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            submitRecordForm(formName) {   //沟通记录保存
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            'id':this.remarkId,
                            'remark':this.recordForm.record
                        };
                        addRemark(data).then(res => {  //点击保存
                            if(res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功'
                                });
                            } else {
                                this.$message.error('保存失败，请稍后再试');
                            }
                        }).catch((e) => {});
                        this.$refs[formName].resetFields();
                        this.recordVisible = false;
                    } else {
                        // console.log('error submit!!');
                        this.recordVisible = true;
                        return false;
                    }
                });
            },
            resetPayForm(formName) {   //签约弹窗取消
                this.payVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            submitPayForm(formName) {   //签约保存
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            'id':this.payId,
                            'renewTime':this.payForm.payDate,
                            'buyClassCount':this.payForm.payNum
                        };
                        addPay(data).then(res => {  //点击保存
                            if(res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功'
                                });
                                setTimeout(function () {
                                    window.location.reload();
                                },1000);
                            } else {
                                this.$message.error('网络异常，请稍后再试');
                            }
                        }).catch((e) => {});
                        this.$refs[formName].resetFields();
                        this.payVisible = false;
                    } else {
                        // console.log('error submit!!');
                        this.payVisible = true;
                        return false;
                    }
                });
            },
            openNoPay(id) {  //未签约用户
                this.$confirm('此操作将设定该用户未签约，数据将消失，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        'id':id
                    };
                    deletePay(data).then(res => {
                        // console.log(res.data);
                        if(res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
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
                        message: '已取消'
                    });
                });
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.rows = `${val}`;
                this.currentPage = 1;
                this.page = 1;
                let data = {
                    'page':this.page,
                    'rows':this.rows
                };
                getSignSetList(data).then(res => {
                    // console.log(res.data);
                    // console.log(res.data.jqGirdPage.rows);
                    this.records = res.data.jqGirdPage.records;
                    this.signSetData = res.data.jqGirdPage.rows;
                    if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                        this.pageValue = true;
                    }
                }).catch((e) => {});
            },
            handleCurrentChange(val) {
                this.page = `${val}`;
                let data = {
                    'page':this.page,
                    'rows':this.rows
                };
                getSignSetList(data).then(res => {
                    // console.log(res.data);
                    // console.log(res.data.jqGirdPage.rows);
                    this.records = res.data.jqGirdPage.records;
                    this.signSetData = res.data.jqGirdPage.rows;
                    if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                        this.pageValue = true;
                    }
                }).catch((e) => {});
            },
            openRemare(id){   //打开聊天记录弹窗
                this.remarkId = id;  //保存id
                let data = {
                    'id':id
                };
                getRemark(data).then(res => {  //点击记录 回显数据
                    this.recordForm.record = res.data.enroll.remark;
                    this.recordVisible = true;
                }).catch((e) => {});
            },
            openPay(id) {   //打开缴费信息弹窗
                this.payId = id;
                this.payVisible = true
            },
            getCitys() {
                getAllArea().then(res => {  //获取省市区

                    let arr = [];
                    var keyMap = {
                        "code" : "value",
                        "name" : "label",
                        "cList" : "children"
                    };
                    var keyMap1 = {
                        "code" : "value",
                        "name" : "label",
                        "aList" : "children"
                    };
                    var keyMap2 = {
                        "code" : "value",
                        "name" : "label",
                    };
                    for(var i = 0;i < res.data.length;i++){
                        var obj = res.data[i];
                        for(var key in obj){
                            var newKey = keyMap[key];
                            if(newKey){
                                obj[newKey] = obj[key];
                                delete obj[key];
                            }
                        }
                        for(var j = 0; j < res.data[i].children.length; j++) {
                            var obj1 = res.data[i].children[j];
                            for(var key1 in obj1) {
                                var newKey1 = keyMap1[key1];
                                if(newKey1){
                                    obj1[newKey1] = obj1[key1];
                                    delete obj1[key1];
                                }
                            }
                            for(var k = 0; k < res.data[i].children[j].children.length; k++) {
                                var obj2 = res.data[i].children[j].children[k];
                                for(var key2 in obj2) {
                                    var newKey2 = keyMap2[key2];
                                    if(newKey2){
                                        obj2[newKey2] = obj2[key2];
                                        delete obj2[key2];
                                    }
                                }
                            }
                        }
                    }
                    this.citys = res.data;
                }).catch((e) => {});
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
                if(date == undefined){return ''};
                return moment(date).format("YYYY-MM-DD");
            },
            // handleClose(done) {  //关闭新增弹窗
            //     this.$refs['addForm'].resetFields();
            //     done();
            // }
        }
    }
</script>

<style scoped lang="less">
    .signSet{
        .signAddBox{
            margin: 20px 0;
        }
        .pages{

        }
    }
</style>
