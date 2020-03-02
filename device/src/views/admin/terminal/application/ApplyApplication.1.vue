<template>
  <!-- 终端-申请终端-申请终端 -->
    <div class="applicationapply-wrap">
      <div class="content-wrap">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <!-- 表单 -->
        <div class="form-wrap">
          <!-- 第一部分 -->
          <div class="form-section">
            <div class="fp1-item">
              <span class="item-label">采购单名称</span>
              <el-input v-model="applicantForm.orderName" placeholder="请输入申请单名称(20字符以内)" clearable></el-input>
            </div>
            <div class="fp1-item">
              <span class="item-label">申请人</span>
              <el-input v-model="applicantForm.applicant" placeholder="请输入申请人姓名(10字符以内)" clearable></el-input>
            </div>
          </div>
          <!-- 第二部分 -->
          <div class="form-section">
            <span class="item-label">选择款式规格</span>
            <div class="screenstyle-group" v-for="(item, index) in applicantForm.adminTerminalOrderStyleList" :key="index">
              <!-- 屏幕款式 -->
              <div class="screenstyle-wrap">
                <span class="style-name">屏幕款式</span>
                <el-select v-model="item.screenStyle" clearable>
                  <el-option label="落地式" :value="1"></el-option>
                  <el-option label="橱窗式" :value="2"></el-option>
                  <el-option label="镜面式" :value="3"></el-option>
                  <el-option label="悬挂式" :value="4"></el-option>
                </el-select>
              </div>
              <!-- 屏幕尺寸 -->
              <div class="screensize-wrap">
                <span class="style-name">屏幕尺寸</span>
                <el-select v-model="item.screenSize" clearable>
                  <el-option label="50寸" :value="1"></el-option>
                  <el-option label="60寸" :value="2"></el-option>
                </el-select>
              </div>
              <!-- 栏数 -->
              <div class="screencolumn-wrap">
                <span class="style-name">栏数</span>
                <el-select v-model="item.screenColumn" clearable>
                  <el-option label="一栏" :value="1"></el-option>
                  <el-option label="二栏" :value="2"></el-option>
                  <el-option label="三栏" :value="3"></el-option>
                  <el-option label="四栏" :value="4"></el-option>
                  <el-option label="五栏" :value="5"></el-option>
                </el-select>
              </div>
              <!-- 屏幕宽高 -->
              <div class="screenwidthheight-wrap">
                <span class="style-name">屏幕宽高</span>
                <el-select v-model="item.screenWideHigh" clearable>
                  <el-option label="74.8 * 132.9" :value="1"></el-option>
                  <el-option label="132.9 * 74.8" :value="2"></el-option>
                </el-select>
              </div>
              <!-- 数量 -->
              <div class="needamount-wrap">
                <span class="style-name">数量</span>
                <el-input v-model.number="item.needAmount" placeholder="请输入整数（1-1000）" clearable></el-input>
              </div>
              <!-- 删除 -->
              <span class="minus-one" @click="removeDomain(item)"></span>
            </div>
            <!-- 添加 -->
            <span class="add" @click="addDomain"></span>
          </div>
          <!-- 第三部分 -->
          <div class="form-section">
            <span class="item-label">备注说明</span>
            <el-input type="textarea" v-model="applicantForm.remark"></el-input>
          </div>
          <!-- 提交按钮 -->
          <!--<div class="submit-button" @click="submitForm">提交</div>-->
        </div>
      </el-form>
      </div>
      <div class="submit-button" @click="submitForm()">提交</div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        token: '',
        applicantForm: {
          orderName: null,
          applicant: null,
          remark: null,
          adminTerminalOrderStyleList: [
            {
              screenStyle: null,
              screenSize: null,
              screenColumn: null,
              screenWideHigh: null,
              needAmount: null
            }
          ]
        },
        validateGuardOfOrderName: false,
        validateGuardOfApplicant: false,
        validateGuardOfScreenStyle: false,
        validateGuardOfScreenSize: false,
        validateGuardOfScreenColumn: false,
        validateGuardOfScreenWideHigh: false,
        validateGuardOfNeedAmount: false
      }
    },
    mounted () {
      let adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
      this.token = adminInfo.token
    },
    methods: {
      addDomain () {
        this.applicantForm.adminTerminalOrderStyleList.push({
          screenStyle: null,
          screenSize: null,
          screenColumn: null,
          screenWideHigh: null,
          needAmount: null
        })
      },

      removeDomain (item) {
        let index = this.applicantForm.adminTerminalOrderStyleList.indexOf(item)
        if (index !== -1) {
          this.applicantForm.adminTerminalOrderStyleList.splice(index, 1)
        }
      },

      /**
       * 表单校验
       */
      checkOrderName (value) {
        let pattern = /^[\u4e00-\u9fa5]{1,20}$/g
        if (!pattern.test(value)) {
          this.$message.error('采购单名称填写不合法')
          this.validateGuardOfOrderName = false
        } else {
          this.validateGuardOfOrderName = true
        }
      },
      checkApplicant (value) {
        let pattern = /^[\u4e00-\u9fa5]{1,10}$/g
        if (!pattern.test(value)) {
          this.$message.error('申请人填写不合法')
          this.validateGuardOfApplicant = false
        } else {
          this.validateGuardOfApplicant = true
        }
      },
      checkScreenStyle (value) {
        if (!value) {
          this.$message.error('请选择屏幕款式')
          this.validateGuardOfScreenStyle = false
        } else {
          this.validateGuardOfScreenStyle = true
        }
      },
      checkScreenSize (value) {
        if (!value) {
          this.$message.error('请选择屏幕尺寸')
          this.validateGuardOfScreenSize = false
        } else {
          this.validateGuardOfScreenSize = true
        }
      },
      checkScreenColumn (value) {
        if (!value) {
          this.$message.error('请选择栏数')
          this.validateGuardOfScreenColumn = false
        } else {
          this.validateGuardOfScreenColumn = true
        }
      },
      checkScreenWideHign (value) {
        if (!value) {
          this.$message.error('请选择屏幕宽高')
          this.validateGuardOfScreenWideHigh = false
        } else {
          this.validateGuardOfScreenWideHigh = true
        }
      },
      checkNeedAmount (value) {
        let pattern = /^[1-9][0-9]{0,1}[0-9]{0,1}[0]{0,1}$/g
        if (!pattern.test(value)) {
          this.$message.error('请输入（1-1000）内的正整数')
          this.validateGuardOfNeedAmount = false
        } else {
          this.validateGuardOfNeedAmount = true
        }
      },
      applyTerminal () {
        let data = this.applicantForm
        this.$http.post('@ROOT_API/terminalOrderManage/add', data)
          .then((res) => {
            if (res.data.status === '1') {
              this.$message.success(res.data.msg)
              this.$router.push('/admin/terminal/application/manage')
            } else {
              this.$message.error(res.data.msg)
            }
          })
      },
      /**
       * 提交表单
       */
      submitForm () {
        var re = /^[0-9]+$/
        if (!this.applicantForm.orderName) {
          this.$message.error('请填写采购单名称')
          return false
        } if (this.applicantForm.orderName.length > 20) {
          this.$message.error('采购单名称20字符以内')
          return false
        } if (!this.applicantForm.applicant) {
          this.$message.error('请填写申请人')
          return false
        } if (this.applicantForm.applicant.length > 10) {
          this.$message.error('申请人10字符以内')
          return false
        }
        this.applicantForm.adminTerminalOrderStyleList.forEach((item) => {
          if (!item.screenStyle) {
            this.$message.error('请选择屏幕款式')
            return false
          } if (!item.screenSize) {
            this.$message.error('请选择屏幕尺寸')
            return false
          } if (!item.screenColumn) {
            this.$message.error('请选择栏数')
            return false
          } if (!item.screenWideHigh) {
            this.$message.error('请选择屏幕宽高')
            return false
          } if (!item.needAmount) {
            this.$message.error('请书输入数量')
            return false
          } if (!re.test(item.needAmount)) {
            this.$message.error('数量为正整数')
            return false
          } if (item.needAmount > 1000) {
            this.$message.error('数量(1-1000)')
            return false
          }
          this.applyTerminal()
        })

        // let orderNameStatus = this.validateGuardOfOrderName
        // let applicantStatus = this.validateGuardOfApplicant
        // let screenStyleStatus = this.validateGuardOfScreenStyle
        // let screenSizeStatus = this.validateGuardOfScreenSize
        // let screenColumnStatus = this.validateGuardOfScreenColumn
        // let screenWideHighStatus = this.validateGuardOfScreenWideHigh
        // let needAmountStatus = this.validateGuardOfNeedAmount
        // if (orderNameStatus && applicantStatus && screenStyleStatus && screenSizeStatus && screenColumnStatus && screenWideHighStatus && needAmountStatus) {
        //   this.applyTerminal()
        // } else {
        //   this.$message.error('表单填写不准确，请重新填写。')
        // }
      }
    }
  }
</script>

<style lang="less" scoped>
  .applicationapply-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 9px 0.8px rgb(238, 241, 245);
      padding: 0 40px;
      /* 表单 */
      .form-wrap {
        border: 1px solid rgb(221, 221, 221);
        margin-top: 40px;
        margin-bottom: 60px;
        position: relative;
        .form-section {
          box-sizing: border-box;
          padding-left: 40px;
          padding-right: 40px;
          border-bottom: 1px solid rgb(221, 221, 221);

          .screenstyle-group {
            height: 36px;
            padding-left: 8px;
            margin-bottom: 20px;
            > div {
              display: inline-block;
              position: relative;
              top: -12px;
              margin-right: 35px;
            }
            .needamount-wrap {
              margin-right: 16px;
            }
          }
          .item-label {
            font-size: 14px;
            color: rgb(102, 102, 102);
            margin-right: 20px;
          }
          .item-label::before {
            content: '*';
            display: inline-block;
            color: rgb(255, 149, 1);
            position: relative;
            top: 2px;
            left: -10px;
          }
        }
        /* 第一部分 */
        .form-section:nth-of-type(1) {
          height: 120px;
          padding-top: 42px;
          .fp1-item {
            display: inline-block;
          }
          .fp1-item:nth-of-type(1) {
            margin-right: 40px;
          }
        }
        /* 第二部分 */
        .form-section:nth-of-type(2) {
          height: 100%;
          padding-bottom: 50px;
          .item-label {
            display: inline-block;
            margin: 40px 0;
          }
          .style-name {
            font-size: 14px;
            color: rgb(102, 102, 102);
            margin-right: 13px;
          }
        }
        /* 第三部分 */
        .form-section:nth-of-type(3) {
          height: 340px;
          border-bottom: 0;
          .item-label {
            display: inline-block;
            margin: 60px 0 20px 8px;
          }
          .item-label::before {
            display: none;
          }
        }
        /* 提交按钮 */
        /*.submit-button {
          width: 70px;
          height: 36px;
          border-radius: 4px;
          background-color: rgb(51, 113, 155);
          font-size: 14px;
          color: rgb(255, 255, 255);
          text-align: center;
          line-height: 36px;
          position: absolute;
          bottom: -128px;
          left: 0;
          right: 0;
          margin: auto;
          cursor: pointer;
        }*/
      }
    }
    .content-wrap::before {
      content: '';
      display: block;
      overflow: hidden;
    }
    /* 提交按钮 */
    .submit-button {
      width: 70px;
      height: 36px;
      border-radius: 4px;
      background-color: rgb(51, 113, 155);
      font-size: 14px;
      color: rgb(255, 255, 255);
      text-align: center;
      line-height: 36px;
      margin: 38px auto 0;
      cursor: pointer;
    }
  }
</style>

<style lang="less">
  .content-wrap {
    /* 表单 */
    .form-wrap {
      /* 第一部分 */
      .form-section:nth-of-type(1) {
        .el-input {
          width: 430px;
          height: 36px;
          border-radius: 4px;
          input {
            height: inherit;
            background-color: rgb(248, 248, 248);
            border: 1px solid rgb(221, 221, 221);
          }
        }
      }
      /* 第二部分 */
      .form-section:nth-of-type(2) {
        position: relative;
        .screenstyle-group {
          /* 屏幕款式  屏幕尺寸 */
          .screenstyle-wrap, .screensize-wrap {
            .el-select .el-input {
              width: 160px;
            }
          }
          /* 屏幕栏数 */
          .screencolumn-wrap {
            .el-select .el-input {
              width: 100px;
            }
          }
          /* 屏幕宽高 */
          .screenwidthheight-wrap {
            .el-select .el-input {
              width: 140px;
            }
          }
          /* 数量 */
          .needamount-wrap {
            margin-right: 18px;
            .el-input {
              width: 160px;
              height: 36px;
              input {
                height: inherit;
                border-radius: 4px;
                background-color: rgb(248, 248, 248);
                border: 1px solid rgb(221, 221, 221);
              }
            }
          }
          /* 删除 */
          .minus-one {
            width: 60px;
            height: 36px;
            background-image: url(../../../../../static/img/shanchu.png);
            background-size: 100% 100%;
            position: relative;
            top: 0;
            cursor: pointer;
            display: inline-block;
          }
          /* 公共样式 */
          .el-select {
            .el-input {
              height: 36px;
              input {
                height: inherit;
                border-radius: 4px;
                background-color: rgb(248, 248, 248);
                border: 1px solid rgb(221, 221, 221);
              }
            }
          }
        }
        /* 添加 */
        .add {
          width: 60px;
          height: 36px;
          background-image: url(../../../../../static/img/tianjia.png);
          background-size: 100% 100%;
          cursor: pointer;
          position: absolute;
          top: 99px;
          left: 1260px;
          z-index: 100;
        }
      }
      /* 第三部分 */
      .form-section:nth-of-type(3) {
        .el-textarea {
          margin-left: 8px;
          textarea {
            height: 200px;
            background-color: rgb(248, 248, 248);
            border: 1px solid rgb(221, 221, 221);
          }
        }
      }
    }
  }
</style>
