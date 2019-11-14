<!-- 注册 -->
<template>
  <div class="register-wrap">

    <!-- 第一步 -->
    <template v-if="curStep === 0">

      <h2 class="ta-c sys-title">手机号注册</h2>

      <div class="inp-item-wrap">
        <div class="pos-r inp-item">
          <span class="pos-a label">+86</span>
          <input type="text" placeholder="请输入手机号" v-model="formData.phone" maxlength="11" v-on:input ="firstKeyup">
        </div>
        <div class="pos-r inp-item">
          <span class="pos-a label">邀请人ID号</span>
          <input type="text" placeholder="请输入邀请人ID号(非必填)" v-model="formData.invitCode" v-on:input ="firstKeyup" maxlength="5">
          <span class="pos-a invit-name">{{formData.invitName}}</span>
        </div>
        <!-- <div class="pos-r inp-item">
          <span class="pos-a label">*朋友圈ID号</span>
          <input type="text" placeholder="请输入朋友圈ID号" v-model="formData.friendsCode" v-on:input ="firstKeyup">
        </div> -->
      </div>

      <div class="register-btn-wrap">
        <div class="ta-c register-btn" :class="{active: subActive}" @click="handleSendCodeBefore" v-if="noTap">注册</div>
        <div class="ta-c register-btn" v-else>注册</div>
      </div>

      <!-- <div class="reg-agreement">注册即表示同意<span @click="agreementVisible = true">《注册协议》</span></div> -->

      <div class="reg-agreement">注册即表示同意<span @click="agreementVisible = true">《用户注册协议》</span>及<span @click="$router.push('/privacyAgreement')">《隐私协议》</span></div>


      <x-dialog  v-model="agreementVisible"  :hide-on-blur="true" :dialog-style="{'text-align': 'left', width: '75%', 'max-width': '7.5rem'}">
        <div class="agreement-con">
          <div v-if="agreementCon" class="agreement-con-txt">
            <h2>真芯天下商城网站用户注册协议</h2>
            <div>本协议是您与真芯天下商城网站所有者（以下简称为“真芯天下商城”）之间就真芯天下商城网站服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您点击“同意以下协议，提交”按钮后，本协议即构成对双方有约束力的法律文件。</div>
            <div>
              <p>第 1 条 本站服务条款的确认和接纳</p>
              <p>1.1本站的各项电子服务的所有权和运作权归真芯天下商城所有。用户同意所有注册协议条款并完成注册程序，才能成为本站的正式用户。用户确认： 本协议条款是处理双方权利义务的契约，始终有效， 法律另有强制性规定或双方另有特别约定的，依其规定。</p>
              <p>1.2用户点击同意本协议的，即视为用户确认自己具有享受本站服务、下单购物等相应的权利能力和行为能力，能够独立承担法律责任。</p>
              <p>1.3如果您在 18 周岁以下，您只能在父母或监护人的监护参与下才能使用本站。</p>
              <p>1.4真芯天下商城保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。</p>
            </div>
            <div>
              <p>第 2 条 本站服务</p>
              <p>2.1本站通过互联网依法为用户提供互联网信息等服务，用户在完全同意本协议及本站规定的情况下，方有权使用本站的相关服务。</p>
              <p>2.2用户必须自行准备如下设备和承担如下开支：（1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；（2 ）上网开支， 包括并不限于网络接入费、上网设备租用费、手机流量费等。</p>
            </div>
            <div>
              <p>第 3 条 用户信息</p>
              <p>3.1用户应自行诚信向本站提供注册资料，用户同意其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且真芯天下商城保留终止用户使用真芯天下商城各项服务的权利。</p>
              <p>3.2用户在本站进行浏览、下单购物等活动时，涉及用户真实姓名/ 名称、通信地址、联系电话、电子邮箱等隐私信息的，本站将予以严格保密，除非得到用户的授权或法律另有规定，本站不会向外界披露用户隐私信息。</p>
              <p>3.3用户注册成功后，将产生用户名和密码等账户信息，您可以根据本站规定改变您的密码。用户应谨慎合理的保存、使用其用户名和密码。用户若发现任何非法使用账户账号或存在安全漏洞的情况，请立即通知本站并向公安机关报案。	用户若发现任何非法使用用户账号或存在安全漏洞的情况，请立即通知本站并向公安机关报案。</p>
              <p>3.4用户同意，真芯天下商城拥有通过邮件、短信电话等形式，向在本站注册、购物用户、收货人发送订单信息、促销活动等告知信息的权利。</p>
              <p>3.5用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任</p>
            </div>
            <div>
              <p>第 4 条 用户依法言行义</p>
              <p>本协议依据国家相关法律法规规章制定，用户同意严格遵守以下义务：
              <p>1)不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论</p>；
              <p>2)从中国大陆向境外传输资料信息时必须符合中国有关法规；</p>
              <p>3)不得利用本站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；</p>
              <p>4)不得干扰本站的正常运转，不得侵入本站及国家计算机信息系统；</p>
              <p>5)不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的、淫秽的、不文明的等信息资料；</p>
              <p>6)不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论；</p>
              <p>7)不得教唆他人从事本条所禁止的行为；</p>
              <p>8)不得利用在本站注册的账户进行牟利性经营活动；</p>
              <p>9)不得发布任何侵犯他人著作权、商标权等知识产权或合法权利的内容；用户应不时关注并遵守本站不时公布或修改的各类合法规则规定。
              本站保有删除站内各类不符合法律政策或不真实的信息内容而无须通知用户的权利。
              若用户未遵守以上规定的，本站有权作出独立判断并采取暂停或光闭用户帐号等措施。用户须对自己在网上的言论和行为承担法律责任。
              </p>
            </div>
            <div>
              <p>第 5 条 商品信息</p>
              <p>本站上的商品价格、数量、是否有货等商品信息随时都有可能发生变动，本站不作特别通知。 由于网站上商品信息的数量极其庞大，虽然本站会尽最大努力保证您所浏览商品信息的准确性，但由于众所周知的互联网技术因素等客观原因存在，本站网页显示的信息可能会有一定的滞后性或差错，对此情形您知悉并理解； 真芯天下商城欢迎纠错，并会视情况给予纠错者一定的奖励。
              </p>
            </div>
            <div>
              <p>第 6 条 订单</p>
              <p>6.1在您下订单时，请您仔细确认所购商品的名称、价格、数量、型号、规格、 尺寸、联系地址、电话、收货人等信息。收货人与用户本人不一致的，收货人的行为和意思表示视为用户的行为和意思表示，用户应对收货人的行为及意思表示的法律后果承担连带责任。</p>
              <p>6.2除法律另有强制性规定外，双方约定如下：本站上销售方展示的商品和价格等信息仅仅是要约邀请，您下单时须填写您希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址（合同履行地点）、合同履行方式等内容；系统生成的订单信息是计算机信息系统根据您填写的内容自动生成的数据，仅是您向销售方发出的合同要约；销售方收到该订单信息后，已将货物实际直接向您发出时，方视为您与销售方之间就发出的货物建立了合同光系；如果您在一份订单里订购了多种商品并且销售方只给您发出了部分商品时，您与销售方之间仅就实际向您发出的商品建立了合同关系。</p>
              <p>6.3由于市场变化及各种以合理商业努力难以控制的因素的影响，本站无法保证您提交的订单信息中希望购买的商品都会有货；如您拟购买的商品，发生缺货，您有权取消订单。</p>
            </div>
            <div>
              <p>第 7 条 配送</p>
              <p>7.1本站将会把商品（货物）送到您所指定的收货地址，所有在本站上列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。</p>
              <p>7.2本站所售出的每一件商品（货物）都粘贴或附有NFC“自媒体”防伪溯源芯片，您可以感应NFC“自媒体”防伪溯源芯片即可获得您所购买的商品（货物）基本信息。如您在本站购买的商品（货物）未粘贴或附有NFC“自媒体”防伪溯源芯片，有权向本站客服渠道或企业邮箱（120.77.210.28@126.com）进行投诉；本站将为您追究其责任。
              <p>7.3因如下情况造成订单延迟或无法配送等，本站将无法承担延迟配送的责任
              1)用户提供的信息错误、地址不详细等原因导致的；
              2)货物送达后无人签收，导致无法配送或延迟配送的；
              3)情势变更因素导致的；
              不可抗力因素导致的，例如：自然灾害、交通戒严、突发战争等。
              </p>
            </div>
            <div>
              <p>第 8 条 所有权及知识产权条款</p>
              <p>8.1用户一旦接受本协议，即表明该用户主动将其在任何时间段在本站发表的任何形式的信息内容（包括但不限于客户评价、客户咨询、各类话题文章等信息内）的财产性权利，如著作权财产权（包括并不限于：复制权、发行权、出租权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权等）全部独家且不可撤销地转让给真芯天下商城所有，用户同意真芯天下商城有权就任何主体侵权而单独提起诉讼。</p>
              <p>8.2本协议已经构成《中华人民共和国著作权法》第二十五条（条文序号依照2011年版著作权法确定）及相关法律规定的著作财产权转让书面协议，其效力及用户在真芯天下商城网站上发布的任何受著作权法保护的作品内容，无论该等内容形成于本协议订立前还是本协议订立后。</p>
              <p>8.3用户同意并已充分了解本协议的条款，承诺不将已发表于本站的信息，以任何形式发布或授权其他主体以任何方式使用（包括但限于在各类网站、媒体上使用）</p>
              <p>8.4真芯天下商城是本站的制作者,拥有此网站内容及资源的著作权等合法权利,受国家法律保护，有权不时地对本协议及本站的内容进行修改，并在本站张贴，无须另行通知用户。在法律允许的最大限度范围内，真芯天下商城对本协议及本站内容拥有解释权。</p>
              <p>8.5除法律另有强制性规定外，未经真芯天下商城明确的特别书面许可,任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用本站的信息内容，否则，真芯天下商城有权追究其法律责任。</p>
              <p>8.6本站所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段，数字下载，数据编辑和软件）均是真芯天下商城或其内容提供者的财产，受中国和国际版权法的保护。本站上所有内容的汇编是真芯天下商城的排他财产，受中国和国际版权法的保护。本站所有软件都是真芯天下商城或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。
              </p>
            </div>
            <div>
              <p>第9条 责任限制及不承诺担保 </p>
              <p>除非另有明确的书面说明，本站及其所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品(包括软件)和服务,均是在“按现状”和“按现有“的基础上提供。
              除非另有明确的书面说明，真芯天下商城不对本站的运营及其包含在本网站上的信息、内容、材料、产品(包括软件)或服务作任何形式的、明示或默示的声明或担保(根据中华人民共和国法律另有规定的以外)。
              真芯天下商城不担保本站所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品《包括软件)和服务、其服务器或从本站发出的电子信件、信息没有病毒或其他有害成分。
              如因不可抗力或其他本站无法控制的原因使本站销售系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等, 真芯天下商城会合理地尽力协助处理善后事宜。
              </p>
            </div>
            <div>
              <p>第10条协议更新及用户关注义务</p>
              <p>根据国家法律法规变化及站运营需要, 真芯天下商城有权对本协议条款不时地进行修改,修改后的协议一旦被张贴在本站上即生效,并代替原来的协议。用户可随时登陆查阅最新协议;用户有义务不时关注并阅读最新版的协议及网站公告。如用户不同意更新后的协议,可以且应立即停止接受真芯天下商域网站依据本协议提供的服务;如用户继续使用本阴站提供的服务的,即视为同意更新后的协议。本站建议您在使用本站之前阅读本协议及本站的公告。如果本协议中任何一条被视为废止，无效或因任何理由不可执行,该条应视为可分的且并不影响任何其余条款的有效性和可执行性。
              </p>
            </div>
            <div>
              <p>第11条 法律管辖和适用</p>
              <p>本协议的订立、执行和解释及争议的解决均应适用在中华人民共和国大陆地区适用之有效法律(但不包括其冲突法规则)。如发生本站服务条款与适用之法律相继续有效。如缔约方就本协议内容或其执行发生任何争议,双方应尽力友好协商解决;协商不成时,任何一方均可向有管辖权的中华人民共和国大陆地区法院提起诉讼。
              </p>
            </div>
            <div>
              <p>第12条 其他</p>
              <p>12．1真芯天下商域网站所有者是指在政府部内依法许可或备案的真芯天下商城网站经营主体。</p>
              <p>12．2真芯天下商城尊重用户和消费者的合法权利,本协议及本网站上发布的各类规则、声明等其他内容,均是为了更好的、更加便利的为用户和消费者提供服务。本站欢迎用户和社会各界提出意见和建议, 真芯天下商城将虚心接受并适时修改本协议及本站上的各类规则。</p>
              <p>12．3本协议内容中以黑体、加粗、下划线、斜体等方式显著标识的条款,请用户着重阅读。</p>
              <p>12．4您点击本协议上方的“同意以下协议,提交”按钮即视为您完全接受本协议,在点击之前请您再次确认已知悉并完全理解本协议的全部内容。
              </p>
            </div>
          </div>
          <div @click="agreementVisible = false" class="ta-c pos-a agree-agreement">
            <span class="d-ib" @click="agreementVisible = false">同意协议</span>
            <span class="d-ib" @click="$router.push('/login')">不同意</span>
          </div>
        </div>
      </x-dialog>
    </template>

    <!-- 第二步 -->
    <template v-if="curStep === 1">
      <div class="ta-c inp-code-wrap">
        <div class="ta-c sended-text">我们已向<span class="d-ib phone">{{formData.phone}}</span>发送验证码短信，请查看短信并输入验证码</div>
        <input-password inputType="code" @input="codeChange"></input-password>
      </div>

      <div class="ta-c not-received" @click="showActionsheet = true">收不到验证码短信？</div>

      <actionsheet v-model="showActionsheet" :menus="actionsheetMenu" @on-click-menu="actionsheetClick" show-cancel></actionsheet>

      <div class="register-btn-wrap">
        <div class="ta-c register-btn" :class="{active: inputCodeSuccess}" @click="handlevValidateCode">下一步</div>
      </div>
    </template>

    <!-- 第三步 -->
    <template v-if="curStep === 2">
      <div class="ta-c inp-code-wrap">
        <div class="ta-c sended-text">请为您的账号<span class="d-ib phone">{{formData.phone}}</span>设置一个密码</div>
      </div>

      <div class="inp-item-wrap">
        <div class="pos-r inp-item">
          <span class="pos-a label">输入密码</span>
          <input type="password" placeholder="6-20个字符" v-model="formData.password" min="6" maxlength="20" @keyup="handlePasswordKeyup">
        </div>
        <div class="pos-r inp-item">
          <span class="pos-a label">确认密码</span>
          <input type="password" placeholder="6-20个字符" v-model="formData.passwordAgain" min="6" maxlength="20" @keyup="handlePasswordKeyup">
        </div>
      </div>

      <div class="register-btn-wrap">
        <div class="ta-c register-btn" :class="{active: saveBtnActive}" @click="handleSavePassword" v-if="noTap">保存密码</div>
        <div class="ta-c register-btn" v-else>保存密码</div>
      </div>
    </template>
    <!-- 注册弹窗 -->
    <x-dialog v-model="showToast" class="register-confirm-wrap">
      <div class="register-confirm-box">
        <div class="confirm-header">
          <span class="fl-r" @click="showToast = false">×</span>
          <h3 class="ta-l">确认您的邀请人信息</h3>
        </div>
        <div class="confirm-body">
          <p>请确认您的邀请人，一旦确认将无法修改</p>
          <div>
            <dl>
              <dt>邀请人ID号</dt>
              <dd>{{formData.invitCode}}</dd>
            </dl>
            <dl>
              <dt>邀请人姓名</dt>
              <dd>{{formData.invitName}}</dd>
            </dl>
            <dl>
              <dt>邀请人手机</dt>
              <dd>{{formData.invitPhone}}</dd>
            </dl>
          </div>
        </div>
        <div class="confirm-footer">
          <div @click="showToast = false">修改邀请人</div>
          <div @click="showToast = false, handleSendCode()">确认</div>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import InputPassword from './public/InputPassword'
import {XDialog, XInput, Actionsheet} from 'vux'
import { setTimeout } from 'timers'

export default {
  components: {InputPassword, XDialog, XInput, Actionsheet},

  data () {
    return {
      yqId: null,
      attCode: null,
      noTap: true,                  // 防止多次提交
      curStep: 0,                   // 当前步骤
      formData: {
        phone: '',                  // 手机号
        invitCode: '',              // 邀请码
        invitName: '',              // 邀请人
        invitPhone: '',             // 邀请人手机
        friendsCode: '',            // 朋友圈ID
        code: '',                   // 验证码
        password: '',               // 密码
        passwordAgain: ''           // 确认密码
      },
      codeIdIsTrue: false,          // 邀请人id是否正确
      showToast: false,             // 注册确认弹窗
      subActive: false,             // 提交按钮选中效果
      agreementVisible: false,      // 注册协议弹窗
      agreementCon: {},             // 用户协议内容
      inputCodeSuccess: false,      // 验证码输入完成
      showActionsheet: false,       // 显示再次发送验证码
      actionsheetMenu: {
        list: '重新获取验证短信'
      },
      saveBtnActive: false,          // 高亮显示保存密码
      shareInvitationCode: ''        // 通过分享进来的code
    }
  },

  mounted () {
    let invitationCode = localStorage.getItem('invitationCode')
    this.attCode = this.$route.query.attCode
    this.yqId = this.$route.query.yqId
    if (invitationCode) {        // A开头积分系统邀请码 SH商城系统邀请码  (积分系统邀请码默认赋值)
      console.log(invitationCode, 'invitationCode')
      var res = /^[A-Z]/
      console.log(res.test(invitationCode), 'tr')
      if (res.test(invitationCode)) {
        this.formData.invitCode = invitationCode
        this.firstKeyup()
      }
    } else if (this.attCode) {
      this.formData.invitCode = this.attCode
    } else {
      this.formData.invitCode = ''
    }
    this.getAgreement()
  },

  methods: {
    /**
     * 用户协议
     */
    getAgreement () {
      this.$http.post(this.api.getContent, {
        type: 1
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          this.agreementCon = res.data.data
        }
      })
    },

    /**
     * 校验手机号是否存在
    */
    checkPhoneExist (fun) {
      this.$http.post(this.api.checkPhoneExist, {
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          fun()
        } else {
          this.$vux.toast.text(resData.msg)
          return false
        }
      }).finally(() => {
        this.$vux.loading.hide()
        setTimeout(() => {
          this.noTap = true
        }, 100)
      })
    },

    /**
     * 校验注册
     */
    registerCheck () {
      if (!this.formData.phone) {
        this.$vux.toast.text('请输入手机号')
        return false
      } else if (!this.formData.phone.match(/^1\d{10}$/g)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      } else if (this.formData.invitCode.length > 0 && !this.formData.invitCode.match(/^[A-Z]\d{4,}$/)) {
        this.$vux.toast.text('邀请码对应用户不存在')
        return false
      }
      return true
    },

    /**
     * 第一步输入内容
     */
    firstKeyup () {
      // this.subActive = this.formData.phone ? !!true : !!false
      if (this.formData.phone) {
        this.subActive = true
      } else {
        this.subActive = false
      }
      // 输入验证码够5位是请求接口验证
      if (this.formData.invitCode.length >= 5) {
        this.checkInvCodeId((res) => {
          if (res.data.status !== this.api.ERR_OK) {
            this.$vux.toast.text(res.data.msg)
            this.codeIdIsTrue = false      // 邀请码是否正确
            return false
          } else {
            this.codeIdIsTrue = true       // 邀请码是否正确
            this.formData.invitName = res.data.data.beCardName
            this.formData.invitPhone = res.data.data.bePhone
          }
        })
      } else {
        this.formData.invitName = ''
        this.formData.invitPhone = ''
      }
    },
    /**
     * 检测邀请码ID是否正确
    */
    checkInvCodeId (fun) {
      if (!this.formData.invitCode.match(/^[A-Z]\d{4,}$/)) {
        this.$vux.toast.text('邀请码对应用户不存在')
        return false
      }
      this.$http.post(`${this.api.getInvitationInfo}`, {
        recommendCode: this.formData.invitCode
      }).then((res) => {
        fun(res)
      })
    },
    /**
     * 注册发送验证码
     */
    handleSendCodeBefore () {
      if (!this.subActive) return false
      if (this.registerCheck()) {
        if (!this.codeIdIsTrue && this.formData.invitCode.length > 0) {
          this.$vux.toast.text('邀请码对应用户不存在')
          return false
        } else {
          this.checkPhoneExist(() => {
            if (this.formData.invitCode.length > 0) {
              this.showToast = true
            } else {
              this.noTap = false
              this.$vux.loading.show({
                text: '验证码发送中'
              })
              this.handleSendCode()
            }
          })
        }
      }
      // this.noTap = false
      // this.$vux.loading.show({
      //   text: '验证码发送中'
      // })
      // if (this.registerCheck()) {
      //   this.checkPhoneExist(() => {
      //     this.handleSendCode()
      //   })
      // }
    },
    /**
     * 校验邀请码
     */
    handleCheckInvitcode () {
      this.$http.post(this.baseUrl + 'login/checkInvicationCode', {
        invicationCode: this.formData.invitCode,
        recommendCode: this.formData.friendsCode
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK) {
          this.$vux.toast.text(resData.msg)
          return false
        }
        this.handleSendCode()
      })
    },

    /**
     * 发送验证码
     */
    handleSendCode () {
      let myreg = /^1\d{10}$/g
      if (!myreg.test(this.formData.phone)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      }
      this.$http.post(this.api.getCode, {
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) this.curStep = 1
        this.$vux.toast.text(res.data.msg)
      })
    },

    /**
     * 输入框值改变
     */
    codeChange (value) {
      this.formData.code = value
      if (value.length === 4) this.inputCodeSuccess = true
    },

    /**
     * 收不到验证码短信
     */
    actionsheetClick (value) {
      if (value !== 'cancel') this.handleSendCode()
    },

    /**
     * 校验验证码
     */
    handlevValidateCode () {
      if (this.inputCodeSuccess) {
        this.$http.post(`${this.api.checkCode}`, {
          phone: this.formData.phone,
          verifyCode: this.formData.code
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            this.curStep = 2
          }
        })
      }
    },

    /**
     * 密码输入
     */
    handlePasswordKeyup () {
      let password = this.formData.password
      let passwordAgain = this.formData.passwordAgain
      this.saveBtnActive = (password.match(/^.{6,20}$/) && passwordAgain.match(/^.{6,20}$/)) ? !!true : !!false
    },

    /**
     * 保存密码
     */
    handleSavePassword () {
      let pwd = this.formData.password
      let pwdAgain = this.formData.passwordAgain
      if (!pwd) {
        this.$vux.toast.text('请输入密码')
        return false
      } else if (pwd.length < 6 || pwd.length > 20) {
        this.$vux.toast.text('密码6-20位')
        return false
      }
      if (!pwdAgain) {
        this.$vux.toast.text('请输入确认密码')
        return false
      } else if (pwdAgain.length < 6 || pwdAgain.length > 20) {
        this.$vux.toast.text('确认密码6-20位')
        return false
      }
      if (pwd !== pwdAgain) {
        this.$vux.toast.text('密码输入不一致')
        return false
      }
      this.handleRegister()
    },

    /**
     * 注册
     */
    handleRegister () {
      this.noTap = false
      this.$vux.loading.show({
        text: '数据提交中'
      })
      if (this.attCode) {
        this.$http.post(`${this.api.register}`, {
          phone: this.formData.phone,
          password: this.formData.password,
          confirmPwd: this.formData.passwordAgain,
          verifyCode: this.formData.code,
          invitationCode: this.attCode,
          recommendCode: this.formData.invitCode
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            setTimeout(() => {
              this.$vux.toast.text('注册成功')
              // 更新存储的账号
              var accountMes = {}
              accountMes.userName = this.formData.phone
              localStorage.setItem('accountMes', JSON.stringify(accountMes))
              localStorage.removeItem('invitationCode')        // 移除邀请码
              // if (this.$route.query.yqId === 1) {
              //   this.$router.push('/login')
              // } else {
              //   this.$router.push('/downLoad')
              // }
              this.$router.push('/login')
            }, 100)
          }
        }).finally(() => {
          this.$vux.loading.hide()
          setTimeout(() => {
            this.noTap = true
          }, 100)
        })
      } else {
        this.$http.post(`${this.api.register}`, {
          phone: this.formData.phone,
          password: this.formData.password,
          confirmPwd: this.formData.passwordAgain,
          verifyCode: this.formData.code,
          invitationCode: this.formData.invitCode,
          recommendCode: this.formData.invitCode
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            setTimeout(() => {
              this.$vux.toast.text('注册成功')
              // 更新存储的账号
              var accountMes = {}
              accountMes.userName = this.formData.phone
              localStorage.setItem('accountMes', JSON.stringify(accountMes))
              localStorage.removeItem('invitationCode')        // 移除邀请码
              if (this.yqId) {
                // alert('downLoad')
                this.$router.push('/downLoad')
              } else {
                // alert('login')
                this.$router.push('/login')
              }
            }, 100)
          }
        }).finally(() => {
          this.$vux.loading.hide()
          setTimeout(() => {
            this.noTap = true
          }, 100)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.register-wrap{
  .sys-title{
    color: #666;
    font-size: .46rem;
    font-family: 'microsoft yahei';
    padding: .6rem 0;
  }
  /* -------------------- { 注册弹窗 } -------------------- */
  .register-confirm-wrap{
    width: 100%;

    .register-confirm-box{
      /*padding: .2rem .3rem;*/
      border-radius: .05rem;

      .confirm-header{
        padding: .2rem .3rem;
        border-bottom: 1px solid #d9d9d9;

        span{
          font-size: .4rem;
          line-height: .44rem;
        }
      }

      .confirm-body{
        font-size: .2rem;
        margin: 0 .3rem;

        p{
          margin: .2rem 0;
          text-align: left;
          color: #f74d4d;
        }

        dl{
          display: flex;
          border: 1px solid #d9d9d9;
          height: .6rem;
          line-height: .6rem;

          dt{
            width: 40%;
            border-right: 1px solid #d9d9d9;
            background: #ebeef5;
          }

          dd{
            width: 60%;
            text-align: center;
          }

        }

        dl:nth-child(2) {
          border-top: 0;
          border-bottom: 0;
        }
      }

      .confirm-footer{
        display: flex;
        margin-top: .2rem;
        border-top: 1px solid #d9d9d9;

        div{
          width: 50%;
          /*color: #f74d4d;*/
          padding: .2rem 0;
          font-size: .24rem;
        }

        div:last-child{
          color: #fff;
          background: #f74d4d;
        }
      }
    }
  }
  /* -------------------- { 注册主体 } -------------------- */
  .inp-item-wrap{
    padding: 0 .22rem;

    .inp-item{
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      border-bottom: 1px solid #eee;
      margin-top:0.3rem;
      left: 0;
      transition: .3s ease-in-out;

      .label{
        color: #3c3c3c;
        font-size: .3rem;
      }
      .invit-name{
        right: 0;
        bottom: 0;
      }

      input{
        width: 100%;
        height: 100%;
        font-size: .3rem;
        margin-left: 0;
        border:none;
        padding-left: 2rem;
        background: none;
        box-sizing: border-box;
      }

      .pwdInput{
        width:4.0rem;
      }

      .code{
        color:#ed3738;
        height: .9rem;
        line-height: .9rem;
        font-size: .28rem;
        right: 0;
        bottom: 0;
      }
    }
  }

  .register-btn-wrap{
    padding: 0 .4rem;

    .register-btn{
      color:#fff;
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.28rem;
      margin-top: 0.9rem;
      background:#f9b7b7;
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }

    .register-btn.active{
      background: linear-gradient(90deg,#f77574,#ed3638);
      -webkit-background: linear-gradient(90deg,#f77574,#ed3638);
    }

    span{
      color: #333;
      margin-top: .3rem;
    }
  }

  /* -------------------- { 注册协议 } -------------------- */
  .reg-agreement{
    width: 100%;
    font-size: .24rem;
    color:#999;
    margin-top: .3rem;
    padding: 0 .4rem;
    bottom: .4rem;
    box-sizing: border-box;

    span{
      color: #3c7ac6;
    }
  }

  /* -------------------- { 注册协议弹窗 } -------------------- */
  .agreement-con{
    width: 100%;
    height: 6rem;
    font-size: .3rem;
    padding-top:.4rem;
    background: #fff;
    z-index: 100;
    border-radius: 4px;
    h2{
      text-align: center;
      font-weight: bold;
      margin-bottom: .3rem;
    }

    .agreement-con-txt{
      color: #666;
      height: 5rem;
      overflow-y: scroll;
      padding: 0 .3rem;
      font-size: .28rem;
      div{
        margin-bottom: .2rem;
        p:nth-child(1){
          font-weight: bold;
          margin-bottom: .2rem;
        }
        p:not(:first-child){
          text-indent: 2em;
          margin-bottom: .2rem;
        }
      }
    }

    .agree-agreement{
      color: #3aa5ed;
      height: 1rem;
      font-size: .28rem;
      margin: auto;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 500;

      span{
        height: .6rem;
        line-height: .62rem;
        margin: .2rem;
        padding: 0 .2rem;
        border-radius: .1rem;
      }

      span:first-child{
        color: #fff;
        background: linear-gradient(90deg,#f77574,#ed3638);
      }

      span:last-child{
        color: #999;
        border: 1px solid #ccc;
      }
    }
  }

  /* -------------------- { 接收验证码 } -------------------- */
  .inp-code-wrap{
    padding: .5rem .4rem 0;

    .sended-text{
      color: #999;
      margin-bottom: .4rem;
      padding: 0 .2rem;

      .phone{
        color: #333;
        margin: 0 .1rem;
      }
    }

    .inp-code{
      width: .8rem;
      height: .8rem;
      border: 1px solid #e5e5e5;
      margin: .3rem .2rem;
    }

  }

  .not-received{
    color: #3aa5ed;
    font-size: .28rem;
    margin-top: .4rem;
  }
}
</style>
