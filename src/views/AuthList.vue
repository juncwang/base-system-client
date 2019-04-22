<template>
  <div class="auth">
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
          v-if="loginAuth.auths.authsList.add || loginAuth.name == authNoDeleteName"
          style="float:right"
          type="primary"
          @click="addAuth"
          plain
        >添加权限</el-button>
      </el-col>
    </el-row>
    <el-table :data="authsList" style="width: 100%" max-height="600">
      <el-table-column label="日期" width="240">
        <template slot-scope="scope">
          <i class="fa fa-clock"></i>
          <span style="margin-left: 10px">{{ getUpdataTime(scope.row.date)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
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
            v-if="loginAuth.auths.authsList.edit || loginAuth.name == authNoDeleteName"
            size="mini"
            @click="handleEdit( scope.row )"
          >编辑</el-button>
          <el-button
            v-if="scope.row.name != authNoDeleteName && (loginAuth.auths.authsList.delete  || loginAuth.name == authNoDeleteName)"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" background @current-change="handleCurrentChange" :page-size="filter.size" layout="prev, pager, next" :total="filter.conut"></el-pagination>

    <el-dialog :title="dialogTitleName" :visible.sync="dialogEditVisible" max-height="200">
      <el-form
        :model="auth"
        status-icon
        :rules="rules"
        ref="authForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input
            :disabled="auth.name == authNoDeleteName?true:false"
            type="text"
            v-model="auth.name"
            placeholder="请输入权限名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            :disabled="auth.name == authNoDeleteName?true:false"
            v-model="auth.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="权限范围">
          <el-checkbox
            v-if="auth.name != authNoDeleteName"
            v-model="treeData.authsList.show"
            @change="changeAuths"
          >权限管理</el-checkbox>
          <div class="checkTable">
            <el-checkbox
              v-if="treeData.authsList.show && auth.name != authNoDeleteName"
              v-model="treeData.authsList.add"
            >添加</el-checkbox>
            <el-checkbox
              v-if="treeData.authsList.show && auth.name != authNoDeleteName"
              v-model="treeData.authsList.edit"
            >编辑</el-checkbox>
            <el-checkbox
              v-if="treeData.authsList.show && auth.name != authNoDeleteName"
              v-model="treeData.authsList.delete"
            >删除</el-checkbox>
          </div>

          <el-checkbox v-model="treeData.usersList.show" @change="changeUsers">人员管理</el-checkbox>
          <div class="checkTable">
            <el-checkbox v-if="treeData.usersList.show" v-model="treeData.usersList.add">添加</el-checkbox>
            <el-checkbox v-if="treeData.usersList.show" v-model="treeData.usersList.edit">编辑</el-checkbox>
            <el-checkbox v-if="treeData.usersList.show" v-model="treeData.usersList.delete">删除</el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
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
  name: "auth",
  data() {
    let validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("权限名称不能为空"));
      } else {
        callback();
      }
    };
    return {
      authNoDeleteName : '',
      deleteId: "",
      loginAuth: {
        name: "",
        authsList: {}
      },
      filter: {
        status: true,
        page: 1,
        size: 10,
        conut: 0
      },
      userId: "",
      authId: "",
      loginName: "",
      authsList: [],
      auth: {
        name: "",
        status: true,
        auths: {}
      },
      treeData: {
        authsList: {
          show: false,
          add: false,
          edit: false,
          delete: false
        },
        usersList: {
          show: false,
          add: false,
          edit: false,
          delete: false
        }
      },
      dialogAddOrEdit: true,
      dialogEditVisible: false,
      dialogButtonName: "",
      dialogTitleName: "",
      centerDialogVisible: false,
      rules: {
        name: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  created() {
    this.selectPageData();
    let decode = jwtDecode(localStorage.getItem("baseSystem-Token"));
    this.userId = decode.id;
    this.loginAuth.name = this.$store.state.auth.name;
    this.loginAuth.auths = this.$store.state.auth.auths;
    this.authNoDeleteName = this.$store.state.authNoDeleteName
  },
  methods: {
    selectPageData() {
      this.$axios
        .get(
          "/api/auths/selectPageData/" +
            this.filter.status +
            "/" +
            this.filter.page +
            "/" +
            this.filter.size
        )
        .then(res => {
          this.authsList = res.data.auths;
          this.filter.conut = res.data.conut
        });
    },
    handleCurrentChange(val){
      this.filter.page = val
      this.selectPageData()
    },
    handleEdit(auth) {
      this.authId = auth._id;
      this.auth.name = auth.name;
      this.auth.status = auth.status;
      this.getTreeData(auth);

      this.dialogButtonName = "修 改";
      this.dialogTitleName = "修改权限";
      this.dialogAddOrEdit = false;
      this.dialogEditVisible = true;
    },
    handleDelete(id) {
      this.deleteId = id;
      this.centerDialogVisible = true;
    },
    enterDelete() {
      this.$axios.delete("/api/auths/deleteById/" + this.deleteId).then(res => {
        this.$message.success(res.data.msg);
        this.selectPageData();
        this.centerDialogVisible = false;
      });
    },
    addAuth() {
      this.auth.name = "";
      this.auth.status = true;
      this.auth.auths = {};

      this.initTreedata();

      this.dialogButtonName = "保 存";
      this.dialogTitleName = "添加权限";
      this.dialogAddOrEdit = true;
      this.dialogEditVisible = true;
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
    dialogEnter(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 把权限数据更新到 this.auth.auths 中
          this.getAuthsData();
          let data = {
            name: this.auth.name,
            status: this.auth.status,
            auths: this.auth.auths
          };
          if (this.dialogAddOrEdit) {
            // 新增数据
            this.$axios
              .post("/api/auths/add/" + this.userId, data)
              .then(res => {
                this.$message.success(res.data.msg);
                this.dialogEditVisible = false;
                this.selectPageData();
              });
          } else {
            // 修改数据
            this.$axios
              .post(
                "/api/auths/updataById/" + this.authId + "/" + this.userId,
                data
              )
              .then(res => {
                this.$message.success(res.data.msg);
                this.dialogEditVisible = false;
                this.selectPageData();
              });
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
    changeAuths() {
      if (!this.treeData.authsList.show) {
        this.treeData.authsList.add = false;
        this.treeData.authsList.edit = false;
        this.treeData.authsList.delete = false;
      }
    },
    changeUsers() {
      if (!this.treeData.usersList.show) {
        this.treeData.usersList.add = false;
        this.treeData.usersList.edit = false;
        this.treeData.usersList.delete = false;
      }
    },
    getAuthsData() {
      this.auth.auths = this.treeData;
    },
    getTreeData(auth) {
      if (auth.auths) {
        // 这里每增加一个权限组就必须判断一次
        if (auth.auths.authsList) {
          this.treeData.authsList = auth.auths.authsList;
        } else {
          this.initTreedataAuths();
        }

        if (auth.auths.usersList) {
          this.treeData.usersList = auth.auths.usersList;
        } else {
          this.initTreedataUsers();
        }
      } else {
        this.initTreedata();
      }
    },
    initTreedata() {
      this.initTreedataAuths();
      this.initTreedataUsers();
    },
    initTreedataAuths() {
      this.treeData.authsList.show = false;
      this.treeData.authsList.add = false;
      this.treeData.authsList.edit = false;
      this.treeData.authsList.delete = false;
    },
    initTreedataUsers() {
      this.treeData.usersList.show = false;
      this.treeData.usersList.add = false;
      this.treeData.usersList.edit = false;
      this.treeData.usersList.delete = false;
    }
  }
};
</script>

<style scoped>
.auth {
  float: left;
  box-sizing: border-box;
  width: calc(100% - 65px);
  height: calc(100% - 64px);
  padding: 20px;
}
.checkTable {
  padding-left: 20px;
}
.changeStatus {
  padding-top: 12px;
  font-size: 14px;
}
.spanTi {
  display: inline-block;
  width: 100%;
  text-align: center;
}
.pagination{
  margin-top: 40px;
  text-align: center;
}
</style>
