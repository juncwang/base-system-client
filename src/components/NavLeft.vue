<template>
  <div class="navleft">
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="true"
    >
      <router-link to="/home">
        <el-menu-item index="1">
          <i class="fa fa-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
      </router-link>
      
      <router-link to="/auths">
        <el-menu-item v-if="loginAuth.name == 'root'" index="2">
          <i class="fa fa-robot"></i>
          <span slot="title">权限管理</span>
        </el-menu-item>
      </router-link>

      <router-link to="/auths">
        <el-menu-item v-if="loginAuth.auths.authsList.show" index="3">
          <i class="fa fa-robot"></i>
          <span slot="title">权限管理</span>
        </el-menu-item>
      </router-link>

      <router-link to="/users">
        <el-menu-item v-if="loginAuth.auths.usersList.show" index="4">
          <i class="fa fa-user"></i>
          <span slot="title">人员管理</span>
        </el-menu-item>
      </router-link>

    </el-menu>

    <!--  -->



    <!--  -->
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  name: "navleft",
  data() {
    return {
      loginAuth: {
        name: '',
        auths: {}
      }
    };
  },
  created() {
    let decode = jwtDecode(localStorage.getItem("baseSystem-Token"));
    if(this.$store.state.auth.name){
    this.loginAuth.name = this.$store.state.auth.name
    this.loginAuth.auths = this.$store.state.auth.auths
    }else{
      this.$router.push('/login')
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
.navleft {
  width: 64px;
  height: calc(100% - 64px);
  border-right: 1px solid #e6e6e6;
  float: left;
}
</style>
