<template>
  <div class="mnsHeader">
    <div class="headerMain">
      <el-row>
          <el-col :span="12">
              <div class="left">
                  <router-link class="left-txt" :to="'/Home'">
                    <div class="logo">
                        <!-- <img src="../assets/images/logo.png" alt="" srcset=""> -->
                    </div>

                    <div class="text">
                        运营支持系统
                        <span class="version">V1.0 Bate</span>
                    </div>
                  </router-link>
              </div>
          </el-col>
          
          <el-col :span="12">
              <div class="right">

                  <el-dropdown trigger="click">

                      <div class="el-dropdown-link clearfix">
                          <div class="icon">
                              <img src="../assets/images/icon_default.png" alt="" srcset="">
                          </div>
                          <div class="name">
                              {{getUserInfo.userInfo.store_name}}
                          </div>
                      </div>
                      <el-dropdown-menu slot="dropdown">
                        <router-link to="/Information">
                          <el-dropdown-item>个人信息</el-dropdown-item>
                        </router-link>

                        <div @click="loginOut">
                          <el-dropdown-item >退出系统</el-dropdown-item>
                        </div>
                      </el-dropdown-menu>

                  </el-dropdown>

              </div>
          </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="less">
.mnsHeader {
  height: 66px;
  .headerMain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    padding: 10px 0;
    box-shadow: 0 0 10px rgba(178, 178, 178, 0.3);
    z-index: 99;
    .left {
      text-align: left;
      margin-top: 8px;
      margin-left: 50px;
      .left-txt{
          display: flex;
          align-items: center;
      }
      .logo {
        display: inline-block;
        width: 146px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .text {
        line-height: 28px;
        margin-top: 2px;
        margin-left: 4px;
        vertical-align: middle;
        display: inline-block;
        font-size: 28px;
        color: #333333;
        .version {
          font-size: 14px;
        }
      }
    }
    .right {
      text-align: right;
      margin-right: 50px;
      .el-dropdown-link {
        cursor: pointer;
        margin-top: 4px;
        .icon {
          display: inline-block;
          border-radius: 100%;
          overflow: hidden;
          height: 38px;
          width: 38px;
          float: left;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          margin-left: 10px;
          vertical-align: middle;
          display: inline-block;
          font-size: 14px;
          color: #333333;
          line-height: 38px;
          float: right;
        }
      }
    }
    .el-menu {
        border: none;
        .el-menu-item {
          display: inline-block;
          margin-right: 50px;
        }
      }
  }
}
</style>

<script>
import { mapActions,mapGetters } from 'vuex'
export default {
  	name: "mnsHeader",
	data() {
		return {
     
		};
	},

	computed: {
    ...mapGetters(['getUserInfo'])
	},
	created() {
	},

	methods: {
    ...mapActions([
      'upDataUserInfo'
    ]),
		loginOut(){
      sessionStorage.clear()
      this.$message({
        message:'已退出系统',
        type:'success'
      })
      this.upDataUserInfo('')
      this.$router.push({
          path:'/login'
      })
    }
	}
};
</script>
