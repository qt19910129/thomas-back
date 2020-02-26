<template>
    <div class="schoolIntroduce">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="学校主图" prop="name">
                <el-upload
                        class="upload-demo"
                        action="http://admin.thomasbk.com:9007/school/fileUpload/upload"
                        :headers="{token:9999}"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :limit="1"
                        list-type="picture"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-change="imgChange">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，大小不超过2MB，且只能上传<span style="color: red;">一张主图</span>，如要重新上传，请先删除原图</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="联系人" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phoneNum">
                <el-input v-model="ruleForm.phoneNum" placeholder="请输入手机号码" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input v-model="ruleForm.address" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="详细介绍" prop="content">
                <el-card style=" width: 80%;height: 300px;">
                    <quill-editor v-model="ruleForm.content" ref="ruleForm.content" style="height: 220px;" :options="editorOption">
                        <!-- 自定义toolar -->
                        <div id="toolbar" slot="toolbar">
                            <!-- Add a bold button -->
                            <button class="ql-bold" title="加粗">Bold</button>
                            <button class="ql-italic" title="斜体">Italic</button>
                            <button class="ql-underline" title="下划线">underline</button>
                            <button class="ql-strike" title="删除线">strike</button>
                            <button class="ql-blockquote" title="引用"></button>
                            <button class="ql-code-block" title="代码"></button>
                            <button class="ql-header" value="1" title="标题1"></button>
                            <button class="ql-header" value="2" title="标题2"></button>
                            <!--Add list -->
                            <button class="ql-list" value="ordered" title="有序列表"></button>
                            <button class="ql-list" value="bullet" title="无序列表"></button>
                            <!-- Add font size dropdown -->
                            <select class="ql-header" title="段落格式">
                                <option selected>段落</option>
                                <option value="1">标题1</option>
                                <option value="2">标题2</option>
                                <option value="3">标题3</option>
                                <option value="4">标题4</option>
                                <option value="5">标题5</option>
                                <option value="6">标题6</option>
                            </select>
                            <select class="ql-size" title="字体大小">
                                <option value="10px">10px</option>
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px" selected>16px</option>
                                <option value="18px">18px</option>
                                <option value="20px">20px</option>
                            </select>
                            <select class="ql-font" title="字体">
                                <option value="SimSun">宋体</option>
                                <option value="SimHei">黑体</option>
                                <option value="Microsoft-YaHei">微软雅黑</option>
                                <option value="KaiTi">楷体</option>
                                <option value="FangSong">仿宋</option>
                                <option value="Arial">Arial</option>
                            </select>
                            <!-- Add subscript and superscript buttons -->
                            <select class="ql-color" value="color" title="字体颜色"></select>
                            <select class="ql-background" value="background" title="背景颜色"></select>
                            <select class="ql-align" value="align" title="对齐"></select>
                            <button class="ql-clean" title="还原"></button>
                            <!-- You can also add your own -->
                        </div>
                    </quill-editor>
                </el-card>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        getSchoolIntroduce,
        saveSchoolIntroduce,
    } from "../../axios/schoolIntroduce";
    import {
        Quill,
        quillEditor
    } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import '../../assets/font.css'
    // 自定义字体大小
    let Size = Quill.import('attributors/style/size')
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
    Quill.register(Size, true);
    // 自定义字体类型
    var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
        '宋体', '黑体'
    ]
    var Font = Quill.import('formats/font')
    Font.whitelist = fonts
    Quill.register(Font, true)

    export default {
        name: 'FuncFormsEdit',
        data() {
            var checkphone = (rule, value, callback) => {
                // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
                if (value == "") {
                    callback(new Error("请输入联系电话"));
                } else if (!this.isCellPhone(value)) {//引入methods中封装的检查手机格式的方法
                    callback(new Error("请输入正确的11位手机号码!"));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    name: '',
                    phoneNum: '',
                    address:'',
                    content: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入联系人', trigger: 'blur', pattern: '[^ \x22]+' },
                    ],
                    phoneNum: [
                        { required: true, validator: checkphone, trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请输入详细地址', trigger: 'blur', pattern: '[^ \x22]+' },
                    ],
                    content: [
                        { required: true, message: '请输详细介绍', trigger: 'blur', pattern: '[^ \x22]+' },
                    ],
                },
                fileList: [],
                dat: {
                    content: ''
                },
                imageUrl: [],

                editorOption: {
                    placeholder: "请输入",
                    theme: "snow", // or 'bubble'
                    modules: {
                        toolbar: {
                            container: '#toolbar'
                        }
                    }
                },
                siId:''  //简介id
            }
        },
        mounted() {
            this.getData();  //数据
        },
        methods: {
            handleRemove(file, fileList) {
                for(var i = 0; i < this.imageUrl.length; i++) {
                    if(file.url == this.imageUrl[i]) {
                        this.imageUrl.splice(i,1);
                    }
                }
            },
            handlePreview(file) {
                console.log(file);
            },
            handleAvatarSuccess(res, file) {  //上传完成事件
                if(res.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '图片上传成功'
                    });
                    this.imageUrl = res.data;
                } else {
                    this.$message.error('网络异常，请稍后再试');
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPng = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPng) {
                    this.$message.error('图片只能是 JPG/PNG 格式!');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                    return false;
                }
                return (isJPG || isPng) && isLt2M;
            },
            imgChange(file,fileList) {
                // console.log(file);
                // this.fileList.push(file);
            },
            submitForm(formName) {
                if(this.imageUrl.length < 1) {
                    this.imgEmpty();
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            // console.log(this.imageUrl);
                            // console.log(this.ruleForm);
                            let data = {
                                'cover':this.imageUrl,
                                'phone':this.ruleForm.phoneNum,
                                'address':this.ruleForm.address,
                                'contact':this.ruleForm.name,
                                'content':this.ruleForm.content,
                                'siId':this.siId
                            };
                            saveSchoolIntroduce(data).then(res => {
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
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }
            },
            ueEmpty() {
                this.$message({
                    message: '请输入详细介绍',
                    type: 'warning'
                });
            },
            imgEmpty() {
                this.$message({
                    message: '请选择学校主图',
                    type: 'warning'
                });
            },
            getData() {  //获取数据
                getSchoolIntroduce('').then(res => {
                    if(res.code == 0) {
                        if(res.code != null || res.data.cover != null) {
                            let schoolCover = {
                                'name':'img',
                                'url':res.data.cover
                            };
                            this.fileList.push(schoolCover);
                        }
                        this.imageUrl = res.data.cover;
                        this.ruleForm.phoneNum = res.data.phone;
                        this.ruleForm.address = res.data.address;
                        this.ruleForm.name = res.data.contact;
                        this.ruleForm.content = res.data.content;
                        // this.fileList[0].url = res.data.cover;
                        this.siId = res.data.siId * 1;
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
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
        },
        components: {
            quillEditor
        },
    }
</script>

<style scoped lang="less">
    .schoolIntroduce{
        .ql-snow .ql-picker-label::before {
            display: inline-block;
            line-height: 22px;
            height: 24px;
            position: absolute;
            top: -1px;
        }
    }
</style>
