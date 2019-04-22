<template>
  <div class="headcontent">
    <el-row>
      <el-col :span="12">
        <img src="../assets/loginLogo.jpg" class="logo">
        <span class="title">{{systemName}}</span>
      </el-col>
      <el-col :span="12">
        <div class="rightContent">
          <img :src="user.headerImg" class="headImg">
          <el-dropdown class="userContent" @command="handleCommand">
            <span class="el-dropdown-link">
              {{user.username}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userData">个人资料</el-dropdown-item>
              <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="个人资料" width="400px" :visible.sync="userDataVisble">
      <img :src="headerImgTmp" alt class="modifgHeadImg">
      <el-button class="modifgHeadBtn" size="mini" round>
        修改头像
        <input
          class="upFile"
          @change="addFile"
          type="file"
          ref="myFile"
          multiple="multiple"
          accept="img/*"
        >
      </el-button>
      <el-form :model="user" status-icon ref="user" label-width="80px" class="el-from">
        <el-form-item label="用户名">
          <el-input type="text" v-model="usernameTmp" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="登录邮箱">
          <el-input type="text" v-model="user.email" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDataVisble = false">返 回</el-button>
        <el-button type="primary" @click="upImg">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" width="400px" :visible.sync="userPassVisble">
      <img :src="headerImgTmp" alt class="modifgHeadImg">
      <el-form
        :model="modifgPass"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原始密码" prop="oldPassword">
          <el-input type="password" v-model="modifgPass.oldPassword" placeholder="请输入原始密码"></el-input>
        </el-form-item>
        <el-form-item label="新的密码" prop="newPassword">
          <el-input type="password" v-model="modifgPass.newPassword" placeholder="请输入新的密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="resPassword">
          <el-input type="password" v-model="modifgPass.resPassword" placeholder="请确认新的密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userPassVisble = false">返 回</el-button>
        <el-button type="primary" @click="upPass('ruleForm')">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="400px" center>
      <span class="spanTi">是否确定退出系统</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logoutSystem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  name: "headcontent",
  data() {
    var oldPassValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error("密码为 6 - 16 位"));
      } else {
        callback();
      }
    };
    var newPassValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新的密码"));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error("密码为 6 - 16 位"));
      } else {
        callback();
      }
    };
    var resPassValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认新的密码"));
      } else if (value !== this.modifgPass.newPassword) {
        callback(new Error("你输入的密码与新密码不一致"));
      } else {
        callback();
      }
    };
    return {
      systemName: "",
      user: {
        id: "",
        username: "",
        email: "",
        authId: "",
        headerImg: ""
      },
      modifgPass: {
        oldPassword: "",
        newPassword: "",
        resPassword: ""
      },
      userDataVisble: false,
      userPassVisble: false,
      centerDialogVisible: false,
      headerImgTmp: "",
      usernameTmp: "",
      file: "",
      rules: {
        oldPassword: [{ validator: oldPassValid, trigger: "blur" }],
        newPassword: [{ validator: newPassValid, trigger: "blur" }],
        resPassword: [{ validator: resPassValid, trigger: "blur" }]
      }
    };
  },
  created() {
    this.systemName = this.$store.state.systemName;
    let decode = jwtDecode(localStorage.getItem("baseSystem-Token"));
    this.user.id = decode.id;
    this.user.username = decode.username;
    this.user.email = decode.email;
    this.user.authId = decode.authId;
    this.user.headerImg = decode.headerImg;
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "userData":
          this.headerImgTmp = this.user.headerImg;
          this.usernameTmp = this.user.username;
          this.userDataVisble = true;
          break;
        case "modifyPassword":
          this.headerImgTmp = this.user.headerImg;
          this.modifgPass.oldPassword = "";
          this.modifgPass.newPassword = "";
          this.modifgPass.resPassword = "";
          this.userPassVisble = true;
          break;
        case "logout":
          this.centerDialogVisible = true;
          break;
      }
    },
    addFile() {
      let files = [...this.$refs.myFile.files];
      this.headerImgTmp = this.getObjectURL(files[0]);
      this.file = files[0];
    },
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    upImg() {
      this.userDataVisble = false;
      if (this.file != "") {
        let formdata = new FormData();
        formdata.append("file", this.file);
        formdata.append("submit", false);
        formdata.append("userId", this.user.id);
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        this.$axios
          .post("/api/transfer/updataHeadImg", formdata, config)
          .then(res => {
            this.$axios
              .post(
                "/api/users/updataById/" + this.user.id + "/" + this.user.id,
                { headerImg: res.data.url }
              )
              .then(response => {
                localStorage.setItem("baseSystem-Token", response.data.token);
                let decode = jwtDecode(
                  localStorage.getItem("baseSystem-Token")
                );
                this.user.id = decode.id;
                this.user.username = decode.username;
                this.user.email = decode.email;
                this.user.authId = decode.authId;
                this.user.headerImg = decode.headerImg;
              });
          });
      }
    },
    upPass(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            oldPassword: this.modifgPass.oldPassword,
            newPassword: this.modifgPass.newPassword
          };
          this.$axios
            .post(
              "/api/users/updataPasswordById/" +
                this.user.id +
                "/" +
                this.user.id,
              data
            )
            .then(res => {
              this.userPassVisble = false;
            })
            .catch(err => {
              this.modifgPass.oldPassword = "";
              this.modifgPass.newPassword = "";
              this.modifgPass.resPassword = "";
            });
        } else {
          return false;
        }
      });
    },
    logoutSystem() {
      this.centerDialogVisible = false
      localStorage.removeItem("baseSystem-Token");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.headcontent {
  width: 100%;
  height: 63px;
  background-color: #e2eac5;
  border-bottom: 1px solid #3e7c8b;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid white;
  margin: 9px 5px 0px 5px;
  vertical-align: -16px;
}

.title {
  font-size: 24px;
  margin-top: 9px;
}

.rightContent {
  float: right;
  margin-right: 20px;
}

.headImg {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid white;
  margin: 9px 5px 0px 5px;
  vertical-align: -16px;
}

.userContent {
  cursor: pointer;
}

.modifgHeadImg {
  width: 180px;
  height: 180px;
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  border: 5px solid #e2eac5;
  margin-bottom: 20px;
}

.modifgHeadBtn {
  display: block;
  margin: 0 auto;
  margin-bottom: 30px;
  position: relative;
}

.upFile {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  opacity: 0;
}

.spanTi {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
