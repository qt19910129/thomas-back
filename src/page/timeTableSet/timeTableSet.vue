<template>
    <!--排课管理-->
    <div class="timeTableSet">
        <el-calendar v-model="value">
            <template
                    slot="dateCell"
                    slot-scope="{date, data}">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1).join('-') }}
                </p>
                <div v-for="a in timeTableList" v-if="data.day == a.arrangeDate && timeTableList.child != [] && data.type == 'current-month'">
                    <div v-for="b in a.child" @click="goAddTimeTable(2,b.caId,b.arrangeBegintime)">
                        <el-dropdown>
                            <el-button type="primary">
                                {{b.className | ellipsis}}
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    班级名称 : {{b.className}}
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    上课时间 : {{b.arrangeBegintime}} --- {{b.arrangeEndtime}}
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    课程名称 : {{b.currName}}
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    上课老师 : {{b.teacherName}} 、 {{b.assistantName}}
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    上课教室 : {{b.crName}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <!--{{new Date(data.day).getTime() < nowTime}}-->
                <span class="addClass" v-if="data.type == 'current-month' && new Date(data.day).getTime() > nowTime" @click="goAddTimeTable(1,data.day,data.day)">+</span>
            </template>
        </el-calendar>
        <div class="moreAddClass">
            <el-button type="primary" @click="goMoreTimeTable()">批量排课</el-button>
        </div>
    </div>
</template>

<script>
    import {
        getTimeTableSetList
    } from "../../axios/timeTableSet";
    export default {
        data() {
            return {
                timeTableList:[],
                value: new Date(),
                year:'',
                mounth:'',
                dates:'',
                nowTime:0
            }
        },
        methods:{
            goAddTimeTable(edit,today,arrangeBegintime) {   //跳转新增修改排课详情，1为新增 2为修改
                let nowTime = new Date().getTime();
                let startTime;
                if(arrangeBegintime.length > 10) {
                    startTime = arrangeBegintime + ':00';
                } else {
                    startTime = arrangeBegintime + ' 23:59';
                }
                startTime = new Date(startTime).getTime();
                if(startTime >= nowTime) {
                    if(edit == 1) {
                        this.$router.push({ path: `/content/details/addTimeTable/${edit}`, query: { dates: today }});
                    } else {
                        this.$router.push({ path: `/content/details/addTimeTable/${edit}`, query: { caId: today }});
                    }
                } else {
                    this.$message({
                        message: '小于等于当前日期，不能执行此操作',
                        type: 'warning'
                    });
                }
            },
            goMoreTimeTable() {   //跳转批量排课
                this.$router.push({
                    path: `/content/details/moreTimeTable`,
                })
            },
            getremarksList(val) {
                let date;
                if (val) {
                    date = new Date(val)
                } else {
                    date = new Date()
                }
                this.year = date.getFullYear();
                this.mounth = date.getMonth() + 1;
                if(this.mounth < 10) {
                    this.mounth = '0' + this.mounth;
                }
                this.dates = date.getDate();
                let arrange_date = this.year + '-' + this.mounth;
                let data = {
                    'arrange_date':arrange_date
                };
                //获取排课日期数据列表
                getTimeTableSetList(data).then(res => {
                    // console.log(res.data);
                    this.timeTableList = res.data.cList;
                }).catch((e) => {});
            },
        },
        mounted:function(){
            // console.log(this.GLOBAL.domainUrl);
            this.nowTime = new Date().getTime();
        },
        created() {
            this.getremarksList();
        },
        filters: {
            ellipsis (value) {
                if (!value) return '';
                if (value.length > 10) {
                    return value.slice(0,10) + '...'
                }
                return value
            }
        },
        watch: {
            value: function(val, oldVal) {
                let time = new Date(val);
                let time2 = new Date(oldVal);
                if (time2.getMonth() != time.getMonth()) {
                    this.getremarksList(val);
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .timeTableSet{
        border: 1px solid #ddd;
        border-radius: 10px;
        background: #fff;
        .is-selected {
            color: #1989FA;
        }
        .addClass{
            position: absolute;
            right: 20px;
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            color: #fff;
            background: #409EFF;
            cursor: pointer;
            top: 20px;
        }
        .addClass:hover{
            background: #1989FA;
            transition: 0.4s;
        }
        .moreAddClass{
            margin: 0px 0 30px 20px;
        }
    }
</style>
