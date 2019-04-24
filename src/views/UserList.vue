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
          @click="addUserClick"
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
          <img width="50" height="50" class="headImg" :src="scope.row.headerImg" alt>
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
            @click="updataUserClick( scope.row )"
          >编辑</el-button>
          <el-button
            v-if="scope.row.email != userNoDeleteName && loginAuth.auths.usersList.delete"
            size="mini"
            type="danger"
            @click="deleteUserClick(scope.row._id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      @current-change="handleCurrentChange"
      :page-size="filter.size"
      layout="prev, pager, next"
      :total="filter.conut"
    ></el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" max-height="200">
      <el-form
        :model="addUser"
        status-icon
        :rules="rules"
        ref="authForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addUser.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="登录邮箱" prop="email">
          <el-input
            :disabled="!dialogAddOrUpdata"
            type="text"
            v-model="addUser.email"
            placeholder="请输入登录邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="addUser.password" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="权限管理" prop="authId">
          <el-select v-model="addUser.authId" placeholder="请选择权限">
            <el-option v-for="item in auths" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="addUser.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEnter('authForm')">{{dialogButtonName}}</el-button>
      </div>
    </el-dialog>


    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="400px" center>
      <span class="spanTi">是否确定删除此数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterDelete()">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  name: "users",
  data() {
    let validatePass = (rule, value, callback) => {
      if (this.dialogAddOrUpdata) {
        if (value === "") {
          callback(new Error("密码不能为空"));
        } else if (value.length < 2 || value.length > 10) {
          callback(new Error("必须 2-10 个字符组成"));
        } else {
          callback();
        }
      } else {
        if(value === ''){
          callback();
        }else if (value.length < 2 || value.length > 10) {
          callback(new Error("必须 2-10 个字符组成"));
        } else {
          callback();
        }
      }
    };

    return {
      userNoDeleteName: "",
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
      usersList: [],
      addUser: {
        username: "",
        password: "",
        email: "",
        authId: "",
        status: true
      },
      auths: [],
      dialogTitle: "",
      dialogVisible: false,
      dialogButtonName: "",
      dialogAddOrUpdata: true,
      updataId: '',
      centerDialogVisible: false,
      rules: {
        username: [
          { required: true, message: "用户名不能为空", tigger: "blur" },
          { min: 2, max: 10, message: "必须 2-10 个字符组成", tigger: "blur" }
        ],
        password: [{ validator: validatePass, tigger: "blur" }],
        email: [
          { required: true, message: "登录邮箱不能为空", tigger: "blur" },
          { type: "email", message: "邮箱格式错误", tigger: "blur" }
        ],
        authId: [
          { required: true, message: "权限管理不能为空", tigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.loginUser = jwtDecode(localStorage.getItem("baseSystem-Token"));
    this.loginAuth.name = this.$store.state.auth.name;
    this.loginAuth.auths = this.$store.state.auth.auths;
    this.userNoDeleteName = this.$store.state.userNoDeleteName;
    this.selectPageData();
    this.getAuths();
  },
  methods: {
    selectPageData() {
      this.$axios
        .get(
          "/api/users/selectPageData/" +
            this.filter.status +
            "/" +
            this.filter.page +
            "/" +
            this.filter.size
        )
        .then(res => {
          this.usersList = res.data.users;
        });
    },
    getAuths() {
      this.$axios.get("/api/auths/selectAll/true").then(res => {
        this.auths = res.data.auths;
      });
    },
    addUserClick() {
      this.dialogVisible = true;
      this.dialogTitle = "添加用户";
      this.dialogButtonName = "添 加";
      this.dialogAddOrUpdata = true;
    },
    updataUserClick(data) {
      this.dialogVisible = true;
      this.dialogTitle = "修改用户";
      this.dialogButtonName = "修 改";
      this.dialogAddOrUpdata = false;

      this.addUser.username = data.username;
      this.addUser.email = data.email;
      this.addUser.authId = data.authId;
      this.addUser.status = data.status;
      this.addUser.password = ''

      this.updataId = data._id
    },
    deleteUserClick(id){
      this.updataId = id
      this.centerDialogVisible = true
    },
    enterDelete(){
      this.$axios.delete("/api/users/deleteById/" + this.updataId).then(res => {
        this.$message.success(res.data.msg);
        this.selectPageData();
        this.centerDialogVisible = false;
      });
    },
    dialogEnter(fromName) {
      this.$refs[fromName].validate(valid => {
        if (valid) {
          if (this.dialogAddOrUpdata) {
            this.addUserInterface();
          } else {
            this.updataUserInterface();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    handleCurrentChange(val) {
      this.filter.page = val;
      this.selectPageData();
    },
    addUserInterface() {
      this.$axios
        .post("/api/users/add/" + this.loginUser.id, this.addUser)
        .then(res => {
          this.$message.success("添加用户成功");
          this.selectPageData();
          this.dialogVisible = false;
        });
    },
    updataUserInterface() {
      let data = {}
      data.username = this.addUser.username
      data.email = this.addUser.email
      data.status = this.addUser.status
      data.authId = this.addUser.authId

      if(this.addUser.password.length > 0) data.password = this.addUser.password

      this.$axios.post('/api/users/updataById/'+ this.updataId + '/' + this.loginUser.id, data)
        .then( res => {
          this.$message.success('修改用户成功')
          this.selectPageData()
          this.dialogVisible = false
        })
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
.pagination {
  margin-top: 40px;
  text-align: center;
}
</style>


