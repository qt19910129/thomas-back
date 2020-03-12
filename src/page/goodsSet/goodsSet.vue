<template>
    <div class="goodsSet">
        <!--搜索-->
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-form-inline">
            <el-row>
                <el-col :span="6">
                    <el-form-item prop="state">
                        <el-select v-model="ruleForm.state" placeholder="请选择物品分类" filterable clearable>
                            <el-option v-for="list in goodsClassList" :label="list.groupName" :value="list.groupId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入物品名称"></el-input>
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
        <!--新增及表格-->
        <div class="goodsMain">
            <!--新增-->
            <div class="classAddBox">
                <el-button type="primary" @click="addGoods()">新增</el-button>
            </div>
            <!--表格-->
            <el-table :data="goodsData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}">
                <el-table-column type="index" label="ID" width="" align="center"></el-table-column>
                <el-table-column prop="goodsName" label="物品名称" align="center"></el-table-column>
                <el-table-column prop="goodsGroup" label="物品分类" align="center">
                    <template slot-scope="scope">
                        <div v-for="states in goodsState">
                            <span v-if="scope.row.goodsGroup == states.groupId">{{states.groupName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsCount" label="物品总数" align="center"></el-table-column>
                <el-table-column prop="goodsSurplus" label="物品库存" align="center"></el-table-column>
                <el-table-column prop="purchasePrice" label="采购价格" align="center"></el-table-column>
                <el-table-column prop="retailPrice" label="零售价格" align="center"></el-table-column>
                <el-table-column prop="goodsConsume" label="已消耗" align="center"></el-table-column>
                <el-table-column label="可使用积分" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.useIntegral == 1">是</span>
                        <span v-if="scope.row.useIntegral == 0">否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="integral" label="所需积分数" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.integral">{{scope.row.integral}}</span>
                        <span v-if="scope.row.integral == null">无</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-finished" @click="collarUse(scope.row.goodsId,scope.row.goodsSurplus)">领用</el-button>
                        <el-button type="text" icon="el-icon-view" @click="goGoodsDetail(scope.row.goodsId)">查看</el-button>
                        <el-button type="text" icon="el-icon-folder-add" @click="goodsSave(scope.row.goodsId)">续存</el-button>
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
        <!--新增编辑弹窗-->
        <el-dialog title="添加物品" :visible.sync="addGoodsVisible" append-to-body class="addGoodsProp" :before-close="handleClose">
            <el-form :inline="true" :model="goodsForm" ref="goodsForm" :rules="goodsRules" class="demo-form-inline">
                <div>
                    <el-form-item>
                        <el-upload
                                action="http://admin.thomasbk.com:9007/school/fileUpload/upload"
                                :headers="{token:9999}"
                                list-type="picture-card"
                                :file-list="goodsImg"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :class="{disabled:uploadDisabled}"
                                :on-success="handleAvatarSuccess"
                                :on-change="handleLimit"
                                accept="image/*"
                                :limit="1">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" append-to-body class="showImg">
                            <img width="100%" :src="showImg" alt="">
                        </el-dialog>
                    </el-form-item>
                </div>
                <el-form-item prop="state">
                    <el-select v-model="goodsForm.state" placeholder="请选择物品分类" filterable clearable>
                        <el-option v-for="list in goodsClassList" :label="list.groupName" :value="list.groupId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="goodsForm.name" placeholder="请输入物品名称"></el-input>
                </el-form-item>
                <el-form-item prop="price">
                    <el-input v-model.trim="goodsForm.price" placeholder="请输入采购价格"></el-input>
                </el-form-item>
                <el-form-item prop="retailPrice">
                    <el-input v-model.number="goodsForm.retailPrice" placeholder="请输入零售价格"></el-input>
                </el-form-item>
                <el-form-item prop="stock">
                    <el-input v-model.number="goodsForm.stock" placeholder="请输入物品库存"></el-input>
                </el-form-item>
                <el-form-item prop="points" v-if="goodsForm.exchange == true">
                    <el-input v-model.number="goodsForm.points" placeholder="请输入使用积分数"></el-input>
                </el-form-item>
                <div class="exchange">
                    <el-form-item label="支持积分兑换" prop="exchange">
                        <el-switch v-model="goodsForm.exchange"></el-switch>
                    </el-form-item>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetgoodsForm('goodsForm')">取 消</el-button>
                <el-button type="primary" @click="submitgoodsForm('goodsForm')">保 存</el-button>
            </div>
        </el-dialog>
        <!--领用弹窗-->
        <el-dialog title="物品领用" :visible.sync="collarUseVisible" append-to-body class="collarForm" :before-close="handleCloseUse">
            <el-form :model="collarForm" ref="collarForm" :rules="collarRules" class="demo-form-inline">
                <el-form-item prop="useNum">
                    <el-input v-model.number="collarForm.useNum" placeholder="请输入领用数量"></el-input>
                </el-form-item>
                <el-form-item prop="teacherClass">
                    <el-radio-group v-model="collarForm.teacherClass">
                        <el-radio label="老师"></el-radio>
                        <el-radio label="班级"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="changeTeacher" v-if="collarForm.teacherClass == '老师'">
                    <el-select v-model="collarForm.changeTeacher" placeholder="请选择老师" filterable clearable>
                        <el-option v-for="list in changeTeachers" :label="list.name" :value="list.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="changeClass" v-if="collarForm.teacherClass == '班级'">
                    <el-select v-model="collarForm.changeClass" placeholder="请选择班级" filterable clearable>
                        <el-option v-for="list in changeClasss" :label="list.name" :value="list.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetcollarForm('collarForm')">取 消</el-button>
                <el-button type="primary" @click="submitcollarForm('collarForm')">保 存</el-button>
            </div>
        </el-dialog>
        <!--续存弹窗-->
        <el-dialog title="物品续存" :visible.sync="goodsSaveVisible" append-to-body class="goodsSaveForm" :before-close="handleCloseUseSave">
            <el-form :model="saveForm" ref="saveForm" :rules="saveRules" class="demo-form-inline">
                <el-form-item prop="num">
                    <el-input v-model.number="saveForm.num" placeholder="请输入续存物品数量"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetsaveForm('saveForm')">取 消</el-button>
                <el-button type="primary" @click="submitsaveForm('saveForm')">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getGoodsSetList,
        getGoodsClass,
        goodsAdd,
        collarUse,
        saveUse,
        saveGoods
    } from "../../axios/goodsSet";
    export default {
        data() {
            return {
                ruleForm: {  //查询
                    state: '',
                    name: '',
                },
                rules: {   //查询规则
                },
                addGoodsVisible:false,  //新增弹窗
                goodsForm: {  //新增
                    goodsImg:'',
                    state:'',
                    name:'',
                    price:'',
                    retailPrice:'',
                    stock:'',
                    exchange:false,
                    points:''
                },
                goodsRules: {  //新增规则
                    goodsImg: [
                        { required: true, message: '请上传物品图片', trigger: 'change' },
                    ],
                    state: [
                        { required: true, message: '请选择物品分类', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入物品名称', trigger: 'blur' },
                    ],
                    price: [
                        { required: true, message: '请输入采购价格', trigger: 'blur' },
                        {
                            validator(rule, value, callback) {
                                var reg = /^[0-9]+.?[0-9]*$/;
                                if(!reg.test(value)) {
                                    callback(new Error('采购价格数必须为数字'));
                                } if(value <= 0) {
                                    callback(new Error('采购价格数不能小于0'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    retailPrice: [
                        { required: true, message: '请输入零售价格'},
                        { type: 'number', message: '零售价格必须为数字值'}
                    ],
                    stock: [
                        { required: true, message: '请输入物品库存'},
                        { type: 'number', message: '物品库存必须为数字值'}
                    ],
                    points: [
                        { required: true, message: '请输入使用积分数'},
                        { type: 'number', message: '使用积分数必须为数字值'}
                    ]
                },
                dialogVisible: false,  //上传图片预览窗
                goodsImg:[],
                imageUrl:[],  //盛放图片的容器
                showImg:'',  //点击放大图片
                goodsData: [],
                collarUseVisible:false,  //物品领用弹窗
                collarForm: {  //领用form
                    useNum:'',
                    teacherClass:'老师',
                    changeTeacher:'',
                    changeClass:''
                },
                collarRules: {   //领用规则
                    useNum: [
                        { required: true, message: '请输入领用数量'},
                        { type: 'number', message: '领用数量必须为数字值'}
                    ],
                    teacherClass: [
                        { required: true, message: '请选择老师或者班级', trigger: 'change' }
                    ],
                    changeTeacher: [
                        { required: true, message: '请选择老师', trigger: 'change' }
                    ],
                    changeClass: [
                        { required: true, message: '请选择班级', trigger: 'change' }
                    ],
                },
                goodsSaveVisible:false,  //物品续存弹窗
                saveForm: {
                    num:''
                },
                saveRules: {
                    num: [
                        { required: true, message: '请输入续存物品数量'},
                        { type: 'number', message: '续存物品数量必须为数字值'}
                    ],
                },
                currentPage:1,  //分页默认选中哪页
                records:0,  //总页数
                rows:10,  //默认每页条数
                page:1,  //默认打开第一页
                pageValue:false,  //当只有一页时 分页隐藏
                goodsClassList:[],  //物品分类数据
                goodsState:[], //物品分类对比
                uploadDisabled:false,  //上传图片 隐藏
                changeTeachers:[],  //选择老师列表
                changeClasss:[],  //选择班级列表
                useGoodsId:-1,  //领用的物品id
                useGoodsNum:-1,  //领用物品的数量
                goodsSaveId:-1,   //续存物品id
            }
        },
        mounted() {
            this.getList();  //列表数据
            this.getClassList();  //物品分类列表
        },
        methods: {
            dataReset() {  //重置搜索
                this.$refs['ruleForm'].resetFields();
                let data = {
                    'rows':10,
                    'page':1
                };
                this.rows = 10;
                this.currentPage = 1;
                this.page = 1;
                getGoodsSetList(data).then(res => {
                    if(res.code == 0) {
                        this.goodsState = res.data.wpfz;
                        this.records = res.data.jqGirdPage.records;
                        this.goodsData = res.data.jqGirdPage.rows;
                        if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                            this.pageValue = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            getClassList() {  //物品分类列表
                getGoodsClass().then(res => {
                    if(res.code == 0) {
                        this.goodsClassList = res.data.wpfz;
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            getList() {  //物品列表
                let data = {
                    'rows':this.rows,
                    'page':this.page
                };
                getGoodsSetList(data).then(res => {
                    if(res.code == 0) {
                        this.goodsState = res.data.wpfz;
                        this.records = res.data.jqGirdPage.records;
                        this.goodsData = res.data.jqGirdPage.rows;
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
                        if(this.ruleForm.state == '' && this.ruleForm.name == '') {
                            this.$message({
                                message: '请输入您要搜索的内容',
                                type: 'warning'
                            });
                        } else {
                            this.rows = 10;
                            this.currentPage = 1;
                            this.page = 1;
                            let data = {
                                'goodsName':this.ruleForm.name,
                                'goodsGroup':this.ruleForm.state,
                                'rows':this.rows,
                                'page':this.page
                            };
                            getGoodsSetList(data).then(res => {
                                if(res.code == 0) {
                                    this.goodsState = res.data.wpfz;
                                    this.records = res.data.jqGirdPage.records;
                                    this.goodsData = res.data.jqGirdPage.rows;
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
            addGoods() {  //新增物品按钮
                this.addGoodsVisible = true;  //展开弹窗
            },
            handleRemove(file, fileList) {  //图片删除事件
                if(fileList.length < 1){
                    this.uploadDisabled = false;
                }
                this.imageUrl = []; //删除图片 图片容器清空
            },
            handlePictureCardPreview(file) {
                this.showImg = file.url;
                this.dialogVisible = true;
            },
            handleAvatarSuccess(res, file) {
                if(res.code == 0) {
                    let data = {
                        'url':res.data,
                        'name':file.name
                    };
                    this.imageUrl.push(data);
                    this.$message({
                        type: 'success',
                        message: '图片上传成功'
                    });
                } else {
                    this.$message.error('网络异常，请稍后再试');
                }
            },
            resetgoodsForm(formName) {   //新增弹窗取消
                this.addGoodsVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            submitgoodsForm(formName) {   //新增保存
                if(this.imageUrl.length == 0) {
                    this.$message({
                        message: '请上传物品图片',
                        type: 'warning'
                    });
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let useIntegral; //是否可积分 0不可 1可
                            if(this.goodsForm.exchange == true) {
                                this.goodsForm.points = this.goodsForm.points;
                                useIntegral = 1;
                            } else {
                                this.goodsForm.points = '';
                                useIntegral = 0;
                            }
                            let data = {
                                'useIntegral':useIntegral,
                                'integral':this.goodsForm.points,
                                'goodsImg':this.imageUrl[0].url,
                                'goodsGroup':this.goodsForm.state,
                                'goodsCount':this.goodsForm.stock,
                                'purchasePrice':this.goodsForm.price,
                                'retailPrice':this.goodsForm.retailPrice,
                                'goodsName':this.goodsForm.name
                            };
                            goodsAdd(data).then(res => {
                                if(res.code == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功'
                                    });
                                    this.$refs[formName].resetFields();
                                    this.addGoodsVisible = false;
                                    window.location.reload();
                                } else {
                                    this.$message.error('网络异常，请稍后再试');
                                }
                            }).catch((e) => {});
                        } else {
                            console.log('error submit!!');
                            this.addGoodsVisible = true;
                            return false;
                        }
                    });
                }
            },
            collarUse(goodsId,useGoodsNum) {  //领用弹窗
                this.useGoodsId = goodsId;
                this.useGoodsNum = useGoodsNum;
                collarUse().then(res => {
                    if(res.code == 0) {
                        this.collarUseVisible = true;
                        this.changeTeachers = res.data.teacherList;
                        this.changeClasss = res.data.classList;
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            resetcollarForm(formName) {  //领用弹窗取消
                this.collarUseVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            submitcollarForm(formName) {  //领用弹窗提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data;
                        if(this.collarForm.teacherClass == '老师') {
                            data = {
                                'goodsId':this.useGoodsId,
                                'useStatus':1,
                                'useIntegral':0,
                                'userType':0,
                                'userId':this.collarForm.changeTeacher,
                                'goodsNum':this.collarForm.useNum
                            }
                        } else if (this.collarForm.teacherClass == '班级') {
                            data = {
                                'goodsId':this.useGoodsId,
                                'useStatus':1,
                                'useIntegral':0,
                                'userType':1,
                                'userId':this.collarForm.changeClass,
                                'goodsNum':this.collarForm.useNum
                            }
                        }
                        if(this.useGoodsNum < this.collarForm.useNum) {
                            this.$message({
                                message: '物品数量不足，请重新输入你要领取的数量',
                                type: 'warning'
                            });
                        } else {
                            saveUse(data).then(res => {
                                if(res.code == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '领用成功'
                                    });
                                    this.$refs[formName].resetFields();
                                    this.collarUseVisible = false;
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1000)
                                } else {
                                    this.$message.error('网络异常，请稍后再试2');
                                }
                            }).catch((e) => {});
                        }
                    } else {
                        console.log('error submit!!');
                        this.collarUseVisible = true;
                        return false;
                    }
                });
            },
            goodsSave(goodsId) {
                this.goodsSaveVisible = true;  //续存物品弹窗
                this.goodsSaveId = goodsId;
            },
            resetsaveForm(formName) {
                this.goodsSaveVisible = false;
                this.$refs[formName].resetFields();
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            },
            submitsaveForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            'goodsId':this.goodsSaveId,
                            'goodsCount':this.saveForm.num
                        };
                        saveGoods(data).then(res => {
                            if(res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '续存成功'
                                });
                                this.$refs[formName].resetFields();
                                this.goodsSaveVisible = false;
                                setTimeout(function () {
                                    window.location.reload();
                                },1000)
                            } else {
                                this.$message.error('网络异常，请稍后再试2');
                            }
                        }).catch((e) => {});
                    } else {
                        console.log('error submit!!');
                        this.goodsSaveVisible = true;
                        return false;
                    }
                });
            },
            goGoodsDetail(goodsId) {  //跳转查看物品详情页
                this.$router.push({
                    path: `/content/goodsSet/seeGoods/${goodsId}`,
                })
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
            handleLimit(file,fileList){  //上传图片 1张后隐藏
                if(fileList.length >= 1){
                    this.uploadDisabled = true;
                }
            },
            handleClose(done) {
                this.$refs['goodsForm'].resetFields();
                this.addGoodsVisible = false;
            },
            handleCloseUse(done) {
                this.$refs['collarForm'].resetFields();
                this.collarUseVisible = false;
            },
            handleCloseUseSave(done) {
                this.$refs['saveForm'].resetFields();
                this.goodsSaveVisible = false;
            },
        },
        computed: {
            hideUpload:function () {
                if(this.imageUrl.length >1) {
                    return true
                } else {
                    return false
                }
            }
        },
    }
</script>

<style scoped lang="less">
    .goodsSet{
        .classAddBox{
            margin: 20px 0;
        }
    }
</style>