<template>
  <div class="users">
    <el-row>
      <el-col class="changeStatus" :span="12">
        权限状态:
        <el-switch
          v-model="filter.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeStatus"
        ></el-switch>
      </el-col>
      <el-col :span="12">
        <el-button
          v-if="loginAuth.auths.usersList.add"
          style="float:right"
          type="primary"
          @click="addUser"
          plain
        >添加人员</el-button>
      </el-col>
    </el-row>


    <el-table :data="usersList" style="width: 100%" max-height="600">
      <el-table-column label="日期" width="240">
        <template slot-scope="scope">
          <i class="fa fa-clock"></i>
          <span style="margin-left: 10px">{{ getUpdataTime(scope.row.date)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <img width="50" height="50" class="headImg" :src="scope.row.headerImg" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="权限名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.authName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加人" width="300">
        <template slot-scope="scope">
          <i class="fa fa-user"></i>
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="loginAuth.auths.usersList.edit"
            size="mini"
            @click="handleEdit( scope.row )"
          >编辑</el-button>
          <el-button
            v-if="scope.row.email != userNoDeleteName && loginAuth.auths.usersList.delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" background @current-change="handleCurrentChange" :page-size="filter.size" layout="prev, pager, next" :total="filter.conut"></el-pagination>


  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  name: "users",
  data() {
    return {
        userNoDeleteName: '',
        loginUser: {},
      loginAuth: {
        name: "",
        auths: {}
      },
      filter: {
        status: true,
        page: 1,
        size: 10,
        conut: 0
      },
      usersList: []
    };
  },
  created() {
    let loginUser = jwtDecode(localStorage.getItem("baseSystem-Token"));
    this.loginAuth.name = this.$store.state.auth.name;
    this.loginAuth.auths = this.$store.state.auth.auths;
    this.userNoDeleteName = this.$store.state.userNoDeleteName
    this.selectPageData()
  },
  methods: {
    selectPageData() {
        this.$axios.get('/api/users/selectPageData/' + this.filter.status + '/' + this.filter.page + '/' + this.filter.size)
            .then(res => {
                console.log(res.data)
                this.usersList = res.data.users
            })
    },
    addUser(){

    },
    changeStatus() {
      this.filter.page = 1;
      this.selectPageData();
    },
    getUpdataTime(date) {
      let outDate = "";
      outDate += new Date(date).getFullYear() + "-";

      if (new Date(date).getMonth() + 1 < 10) {
        outDate += "0" + (new Date(date).getMonth() + 1) + "-";
      } else {
        outDate += new Date(date).getMonth() + 1 + "-";
      }

      if (new Date(date).getDate() < 10) {
        outDate += "0" + new Date(date).getDate() + " ";
      } else {
        outDate += new Date(date).getDate() + " ";
      }

      if (new Date(date).getHours() < 10) {
        outDate += "0" + new Date(date).getHours() + ":";
      } else {
        outDate += new Date(date).getHours() + ":";
      }

      if (new Date(date).getMinutes() < 10) {
        outDate += "0" + new Date(date).getMinutes() + ":";
      } else {
        outDate += new Date(date).getMinutes() + ":";
      }

      if (new Date(date).getSeconds() < 10) {
        outDate += "0" + new Date(date).getSeconds();
      } else {
        outDate += new Date(date).getSeconds();
      }

      return outDate;
    },
    handleCurrentChange(val){
        this.filter.page = val
        this.selectPageData()
    }
  }
};
</script>

<style scoped>
.users {
  float: left;
  box-sizing: border-box;
  width: calc(100% - 65px);
  height: calc(100% - 64px);
  padding: 20px;
}
.changeStatus {
  padding-top: 12px;
  font-size: 14px;
}
.pagination{
  margin-top: 40px;
  text-align: center;
}
</style>


