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
                <el-table-column prop="name" label="课包名称" align="center"></el-table-column>
                <el-table-column prop="num" label="课时数" align="center"></el-table-column>
                <el-table-column prop="price" label="课包价格" align="center"></el-table-column>
                <el-table-column prop="explain" label="课包说明" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <el-button type="text" icon="el-icon-edit" @click="editCourseBag">编辑</el-button>
                </el-table-column>
            </el-table>
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
    export default {
        data() {
            return {
                courseBagVisible:false,   //新增编辑弹窗
                editTitle:'',  //弹窗标题
                courseBagData:[
                    {
                        'name':'少儿英语',
                        'num':'111',
                        'price':'35',
                        'explain':'少儿英语少儿英语少儿英语少儿英语',
                    }
                ],
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
            }
        },
        methods: {
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

                        } else if(this.editTitle == '编辑课包') {

                        }
                    }
                });
            },
            editCourseBag() {   //编辑课包
                this.courseBagVisible = true;
                this.editTitle = '编辑课包';
            }
        }
    }
</script>

<style scoped lang="less">
    .courseAddBox{
        margin-bottom: 20px;
    }
</style>