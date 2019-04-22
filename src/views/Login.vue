<template>
  <div class="login">
    <div class="wrapping">
      <div class="system-name animated pulse">{{systemName}}</div>
      <div class="input-content animated fadeInDown">
        <el-form
          :model="userLogin"
          status-icon
          :rules="rules"
          ref="userLogin"
          label-width="80px"
          class="el-from"
        >
          <el-form-item label="登录邮箱" prop="email">
            <el-input type="text" v-model="userLogin.email" placeholder="请输入登录邮箱"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input type="password" v-model="userLogin.password" placeholder="请输入登录密码"></el-input>
          </el-form-item>
          <el-button class="el-button" type="primary" @click="submitForm('userLogin')">登录</el-button>
        </el-form>
        <div class="logo"></div>
      </div>
    </div>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  name: "login",
  data() {
    return {
      systemName: '',
      userLogin: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created(){
    this.systemName = this.$store.state.systemName
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/users/login", this.userLogin)
            .then(res => {
              localStorage.setItem("baseSystem-Token", res.data.token);
              let decode = jwtDecode(res.data.token)
              this.$axios.get('/api/auths/selectById/' + decode.authId)
                .then(response => {
                  this.$store.dispatch('updataAuths',response.data.auth)
                  this.$router.push("/index");
                })
              
            })
            .catch(err => {
              console.log(err);
              this.userLogin.email = "";
              this.userLogin.password = "";
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  background-image: url("../assets/loginBackground.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: relative;
}

.wrapping{
  position: relative;
  width: 480px;
  left: 50%;
  margin-left: -240px;
  top: 120px;
}

.system-name {
  width: 100%;
  text-align: center;
  font-size: 32px;
  margin-bottom: 120px;
}

.input-content {
  box-sizing: border-box;
  background-color: white;
  width: 480px;
  height: 320px;
  border-radius: 15px;
  box-shadow: 0px 0px 10px #646464;
  padding: 30px;
  position: relative;
}

.el-from {
  margin-top: 68px;
}

.el-button {
  width: 100%;
  margin-top: 10px;
}

.logo {
  background-image: url("../assets/loginLogo.jpg");
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 10px solid white;
  position: absolute;
  top: -60px;
  left: 50%;
  margin-left: -60px;
}
</style>
