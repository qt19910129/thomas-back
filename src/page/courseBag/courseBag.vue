<template>
    <div class="courseBag">
        <div class="courseBagMain">
            <!--新增-->
            <div class="courseAddBox">
                <el-button type="primary" @click="addCourseBag()">新增</el-button>
            </div>
            <!--数据表格-->
            <el-table :data="courseBagData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}">
                <el-table-column type="index" label="ID" width="" align="center"></el-table-column>
                <el-table-column prop="packageName" label="课包名称" align="center"></el-table-column>
                <el-table-column prop="packageTimes" label="课时数" align="center"></el-table-column>
                <el-table-column prop="packagePrice" label="课包价格" align="center"></el-table-column>
                <el-table-column prop="packageRemark" label="课包说明" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="editCourseBag(scope.row.packageId)">编辑</el-button>
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
            <!--新增，编辑弹窗-->
            <el-dialog :title="editTitle" :visible.sync="courseBagVisible" class="courseBagAlert" :before-close="handleClose">
                <el-form :model="courseBagForm" :rules="courseBagRules" ref="courseBagForm">
                    <el-form-item label="课包名称" prop="name">
                        <el-input v-model="courseBagForm.name" placeholder="请输入课包名称"></el-input>
                    </el-form-item>
                    <el-form-item label="课包课时" prop="num">
                        <el-input v-model.number.trim="courseBagForm.num" placeholder="请输入课包课时"></el-input>
                    </el-form-item>
                    <el-form-item label="课包价格" prop="price">
                        <el-input v-model.number.trim="courseBagForm.price" placeholder="请输入课包价格"></el-input>
                    </el-form-item>
                    <el-form-item label="课包说明" prop="explain">
                        <el-input  v-model="courseBagForm.explain" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入级别说明" :maxlength="120"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" align="center">
                    <el-button @click="editForm('courseBagForm')">取 消</el-button>
                    <el-button type="primary" @click="submitEditForm('courseBagForm')">保 存</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {
        getCourseBagList,
        getCourseBagAdd,
        getCourseBagEditShow,
        getCourseBagEditSave
    } from "../../axios/courseBag";
    export default {
        data() {
            return {
                courseBagVisible:false,   //新增编辑弹窗
                editTitle:'',  //弹窗标题
                courseBagData:[],
                courseBagForm: {
                    name:'',
                    num:'',
                    explain:'',
                    price:''
                },
                courseBagRules: {
                    name: [
                        { required: true, message: '请输入课包名称', trigger: 'blur', pattern: '[^ \x22]+' },
                    ],
                    num: [
                        { required: true, message: '请输入课包课时数', trigger: 'blur' },
                        { type: 'number', message: '请输入正确的课包课时数'},
                        {
                            validator(rule, value, callback) {
                                if(value <= 0) {
                                    callback(new Error('课包课时数不能小于0'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    explain: [
                        { required: true, message: '请输入课包说明', trigger: 'blur', pattern: '[^ \x22]+' },
                    ],
                    price: [
                        { required: true, message: '请输入课包价格', trigger: 'blur' },
                        { type: 'number', message: '请输入正确的课包价格'},
                        {
                            validator(rule, value, callback) {
                                if(value <= 0) {
                                    callback(new Error('课包价格不能小于0'));
                                } else {
                                    callback();
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
                packageId:-1,  //课包id
            }
        },
        mounted() {
            this.getList();  //列表数据
        },
        methods: {
            getList() {  //获取课程包列表
                let data = {
                    'rows':this.rows,
                    'page':this.page
                };
                getCourseBagList(data).then(res => {
                    if(res.code == 0) {
                        this.records = res.data.jqGirdPage.records;
                        this.courseBagData = res.data.jqGirdPage.rows;
                        if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                            this.pageValue = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            addCourseBag() {  //新增
                this.courseBagVisible = true;
                this.editTitle = '新增课包';
            },
            handleClose(done) {
                this.$refs['courseBagForm'].resetFields();
                this.courseBagVisible = false;
            },
            editForm(formName) {   //添加级别弹窗取消
                this.courseBagVisible = false;
                this.$refs['courseBagForm'].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            submitEditForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.editTitle == '新增课包') {
                            let data = {
                                'packageName':this.courseBagForm.name,
                                'packageTimes':this.courseBagForm.num,
                                'packagePrice':this.courseBagForm.price,
                                'packageRemark':this.courseBagForm.explain,
                            };
                            getCourseBagAdd(data).then(res => {
                                if(res.code == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功'
                                    });
                                    this.$refs[formName].resetFields();
                                    this.courseBagVisible = false;
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1000);
                                } else {
                                    this.$message.error('网络异常，请稍后再试');
                                }
                            }).catch((e) => {});
                        } else if(this.editTitle == '编辑课包') {
                            let data = {
                                'packageName':this.courseBagForm.name,
                                'packageTimes':this.courseBagForm.num,
                                'packagePrice':this.courseBagForm.price,
                                'packageRemark':this.courseBagForm.explain,
                                'packageId':this.packageId
                            };
                            getCourseBagEditSave(data).then(res => {
                                if(res.code == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功'
                                    });
                                    this.$refs[formName].resetFields();
                                    this.courseBagVisible = false;
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1000);
                                } else {
                                    this.$message.error('网络异常，请稍后再试');
                                }
                            }).catch((e) => {});
                        }
                    }
                });
            },
            editCourseBag(packageId) {   //编辑课包
                this.courseBagVisible = true;
                this.editTitle = '编辑课包';
                this.packageId = packageId;
                let data = {
                    'packageId':packageId
                };
                getCourseBagEditShow(data).then(res => {
                    if(res.code == 0) {
                        this.courseBagForm.name = res.data.packageName;
                        this.courseBagForm.num = res.data.packageTimes;
                        this.courseBagForm.explain = res.data.packageRemark;
                        this.courseBagForm.price = res.data.packagePrice;
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
        }
    }
</script>

<style scoped lang="less">
    .courseAddBox{
        margin-bottom: 20px;
    }
</style>