<template>
    <div class="seeGoods">
        <!--返回首页-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/content/pageIndex' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:history.go(-1)">物品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>物品详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main">
            <div class="tit">物品信息</div>
            <div class="goods">
                <el-row style="height: auto;">
                    <el-col :span="6" class="tableName" style="height: 200px;line-height: 200px;">物品图片</el-col>
                    <el-col :span="6" style="height: 200px;">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="click">
                            <el-image slot="reference" :src="goodsMain.goodsImg" :alt="goodsMain.goodsImg" style="height: 180px;width: 180px;margin-top: 10px;cursor: pointer;"></el-image>
                            <el-image :src="goodsMain.goodsImg"></el-image>
                        </el-popover>
                    </el-col>
                    <el-col :span="6" class="tableName" style="height: 200px;line-height: 200px;">物品名称</el-col>
                    <el-col :span="6" style="height: 200px;line-height: 200px;">{{goodsMain.goodsName}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" class="tableName">物品分类</el-col>
                    <el-col :span="6" v-for="list in wpfz" v-if="list.groupId == goodsMain.goodsGroup">{{list.groupName}}</el-col>
                    <el-col :span="6" class="tableName">物品总数</el-col>
                    <el-col :span="6">{{goodsMain.goodsCount}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" class="tableName">物品库存</el-col>
                    <el-col :span="6">{{goodsMain.goodsSurplus}}</el-col>
                    <el-col :span="6" class="tableName">已消耗数</el-col>
                    <el-col :span="6">{{goodsMain.goodsConsume}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" class="tableName">采购价格</el-col>
                    <el-col :span="6">{{goodsMain.purchasePrice}}</el-col>
                    <el-col :span="6" class="tableName">零售价格</el-col>
                    <el-col :span="6">{{goodsMain.retailPrice}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" class="tableName">是否积分</el-col>
                    <el-col :span="6">
                        <span v-if="goodsMain.useIntegral == 0">否</span>
                        <span v-if="goodsMain.useIntegral == 1">是</span>
                    </el-col>
                    <el-col :span="6" class="tableName">所需积分</el-col>
                    <el-col :span="6">
                        <span v-if="goodsMain.integral == null">无</span>
                        <span v-if="goodsMain.integral != null">{{goodsMain.integral}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="tit">领用信息</div>
            <!--数据表格-->
            <el-table :data="goodsDetailData" border style="width: 100%;border: 1px solid #eee;font-size: 14px;" :header-cell-style="{background:'#53A1E8',color:'#fff'}" class="signTable">
                <el-table-column type="index" label="ID" width="" align="center"></el-table-column>
                <el-table-column prop="name" label="领取用户" align="center"></el-table-column>
                <el-table-column prop="useStatus" label="领取类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.useStatus == 0">作废</span>
                        <span v-if="scope.row.useStatus == 1">领取</span>
                        <span v-if="scope.row.useStatus == 2">兑换</span>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsNum" label="领取数量" align="center"></el-table-column>
                <el-table-column prop="useIntegral" label="使用积分数" align="center"></el-table-column>
                <el-table-column prop="createTime" label="领取时间" align="center"  :formatter="dateFormat"></el-table-column>
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
    </div>
</template>

<script>
    import {
        seeGoodsMain,
        seeGoodsUseList
    } from "../../axios/goodsSet";
    import moment from 'moment';
    export default {
        data() {
            return {
                goodsMain:{},
                wpfz:{},  //物品分类
                goodsDetailData: [],  //领用信息列表
                canActivate (transition) {
                    transition.next();
                },
                currentPage:1,  //分页默认选中哪页
                records:0,  //总页数
                rows:10,  //默认每页条数
                page:1,  //默认打开第一页
                pageValue:false,  //当只有一页时 分页隐藏
            }
        },
        mounted() {
            this.getGoodsMain();
            this.getGoodsUseList();
        },
        methods: {
            getGoodsMain() {  //获取物品详细信息
                let data = {
                    'goodsId':this.$route.params.goodsId,
                };
                seeGoodsMain(data).then(res => {
                    if(res.code == 0) {
                        this.goodsMain = res.data.goodsDetail;
                        this.wpfz = res.data.wpfz;
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            getGoodsUseList() {  //获取物品领用信息
                let data = {
                    'goodsId':this.$route.params.goodsId,
                    'rows':this.rows,
                    'page':this.page
                };
                seeGoodsUseList(data).then(res => {
                    if(res.code == 0) {
                        this.goodsDetailData = res.data.jqGirdPage.rows;
                        this.records = res.data.jqGirdPage.records;
                        if(res.data.jqGirdPage.records <= 10) {  //小于10条时 隐藏分页
                            this.pageValue = true;
                        }
                    } else {
                        this.$message.error('网络异常，请稍后再试');
                    }
                }).catch((e) => {});
            },
            dateFormat(row, column, cellValue, index){  //表格日期格式化
                var date = row[column.property];
                if(date == undefined){return ''};
                return moment(date).format("YYYY-MM-DD");
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.rows = `${val}`;
                this.currentPage = 1;
                this.page = 1;
                this.getGoodsUseList();
            },
            handleCurrentChange(val) {
                this.page = `${val}`;
                this.getGoodsUseList();
            },
        },
        computed: {

        },
    }
</script>

<style scoped lang="less">
    .seeGoods{
        .main{
            padding: 20px;
            background: #fff;
            margin-top: 20px;
            .tit{
                font-size: 18px;
                line-height: 18px;
                margin: 20px 0;
            }
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
    }
</style>