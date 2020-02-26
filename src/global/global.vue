<template>

</template>

<script>
    //全局参数设置
    const token=localStorage.getItem("token");
    const domainUrl = 'http://47.104.251.161:8080';
    const domain = 'http://test.school.yiyatalk.com';
    // const token=localStorage.getItem("token");
    // const domainUrl = 'http://47.104.251.161:8080';
    // const domain = 'http://test.school.yiyatalk.com';
    // const domain = 'http://localhost:8888';


    //欣宇本地 http://192.168.0.191:8080
    //测试环境 http://47.104.251.161:8080

    //正式环境配置
    const token = localStorage.getItem("token");
    const domainUrl = 'http://admin.thomasbk.com:9007';
    const domain = 'http://admin.thomasbk.com';


    export default {
        token,//用户token身份
        domainUrl,
        domain
    }
</script>

<style scoped>

</style>
