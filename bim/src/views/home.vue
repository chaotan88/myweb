<template>
  <div id='viewer' style='width:100%; height:100%'></div>
</template>
<script type='application/javascript' src='latest/BOS3D.min.js'></script>
<script type='application/javascript' src='UI/latest/BOS3DUI.min.js'></script>
<script>

export default {
  data () {
    return {
      count: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      var option = { host: 'http://bos3d.bimwinner.com', viewport: 'viewer' }
      var viewer3D = new BOS3D.Viewer(option)
      var modelKey = 'M1603263440426';
      var projectKey = 'ld6702529bd14d528a343c9a972750c7';
      var modelKeyUser = 'M1603857092131';
      var projectKeyUser = 'ld6702529bd14d528a343c9a972750c7';
      // 适应屏幕大小
      if (BOS3DUI) {
        window.bos3dui = new BOS3DUI({
          viewer3D: viewer3D,
          BOS3D: BOS3D,
          funcOption: {
            init: true, // 初始化
            fit: true, // 聚焦
            undo: true, // 撤销
            roam: true, // 漫游
            pickByRect: true, // 框选
            hide: true, // 隐藏
            isolate: true, // 构件隔离
            section: true, // 剖切
            wireFrame: true, // 线框化
            scatter: true, // 模型分解
            changeCptColor: true, // 构件变色
            setting: true, // 设置
            fullScreen: true, // 全屏
            changeBgColor: true, // 改变背景色
            cptInfo: true, // 构件信息
            infoTree: true, // 结构树
            measure: true, // 测量
            mark: true, // 标签
            snapshot: true, // 快照
            annotation: true // 批注
          }
        })
      } else {
        var tool = new BOS3D.UI.ToolBar(viewer3D)
        tool.createTool()
      }
      viewer3D.addView(modelKey, projectKey);
      // viewer3D.addView(modelKeyUser, projectKeyUser);
      viewer3D.autoResize()
      window.addEventListener('resize', function () {
        viewer3D.autoResize()
      })
      const colors = ['red', 'green', 'yellow','red', 'green', 'yellow','red', 'green', 'yellow','red', 'green', 'yellow'];
      // viewer3D.getExternalObjectByCompoentKey('M1603263440426_2667611').then((obj) => {
      //   console.log(obj, 999999999999999999999);
      // });
      // this.initWebSocket();
      // setInterval(() => {
      //   this.getData().then((radaData) => {
      //     // 删除

      //     for (let i = 0; i < 20; i++) {
      //       // viewer3D.removeExternalObjectByName(`单个构件_${i}`);
      //       window.spriteMark && spriteMark.remove([`bim_ids${i}`]);
      //     }
      //     radaData.forEach((da, index) => {
      //       if (index < 10) {
      //         // viewer3D.removeExternalObjectByName(`单个构件_${index}`);
      //         // var geometry = new BOS3D.THREE.BoxGeometry(1000, 1000, 1000);
      //         // var material = new BOS3D.THREE.MeshLambertMaterial({
      //         //   color: colors[index]
      //         // });
      //         // var mesh = new BOS3D.THREE.Mesh(geometry, material);
      //         let x = da.x > 18000 ? 18000 : da.x;
      //         let y = da.y;
      //         let z = da.z;
      //         // console.log(x);
      //         // mesh.position.set(x, y, z);
      //         // viewer3D.addExternalObject(`单个构件_${index}`, mesh, false, material);
      //         //  window.spriteMark=new BOS3D.SpriteMark(viewer3D.viewerImpl);
      //         //   var options={
      //         //       id:`bim_ids${index}`,
      //         //       url:"../static/images/user-face01.png",
      //         //       // url:"/src/static/images/user-face01.png",
      //         //       scale:9,
      //         //       useImageSize:true,
      //         //       alwaysVisible:true,
      //         //       position:[x,y,z]
      //         //   };
      //         //   spriteMark.add(options,function(a){
      //         //       // console.log("id："+a+" 精灵标签添加成功");
      //         //   });
      //         viewer3D.setModelMatrix(modelKeyUser, new BOS3D.THREE.Matrix4().set(
      //             1, 0, 0, x,
      //             0, 1, 0, y,
      //             0, 0, 1, z,
      //             0, 0, 0, 1
      //         ));

      //         viewer3D.render()
      //       }
      //     });
      //   });
      // }, 1000);

      /***socked ***/
      var svc_websocket = null;
      function svc_connectPlatform() {
        var wsServer = 'ws://106.52.125.177:50001/';
        try {
            svc_websocket = new WebSocket(wsServer);
        } catch (evt) {
            console.log("new WebSocket error:" + evt.data);
            svc_websocket = null;
            if (typeof(connCb) != "undefined" && connCb != null)
                connCb("-1", "connect error!");
            return;
        }
        svc_websocket.onopen = svc_onOpen;
        svc_websocket.onclose = svc_onClose;
        svc_websocket.onmessage = svc_onMessage;
        svc_websocket.onerror = svc_onError;
      }


      function svc_onOpen(evt) {
        console.log("Connected to WebSocket server.");
      }


      function svc_onClose(evt) {
        console.log("Disconnected");
      }


      function svc_onMessage(evt) {
        let jsonData = eval('(' + evt.data + ')');
        jsonData.forEach((loc, index) => {
          if (index === 0) {
            let x = da.x > 18000 ? 18000 : da.x;
            let y = da.y;
            let z = da.z;
            viewer3D.addView(modelKeyUser, projectKeyUser);
            viewer3D.setModelMatrix(modelKeyUser, new BOS3D.THREE.Matrix4().set(
              1, 0, 0, x,
              0, 1, 0, y,
              0, 0, 1, z,
              0, 0, 0, 1
            ));
          }
        });
      }


      function svc_onError(evt) {
        console.log('Error occured: ' + evt.data);
      }


      function svc_send(msg) {
        if (svc_websocket.readyState == WebSocket.OPEN) {
          svc_websocket.send(msg);
        } else {
          console.log("send failed. websocket not open. please check.");
        }
      }
      svc_connectPlatform();
    },
    getData(viewer3D) {
      return new Promise((resovle) => {
        let data = { 
          "RadarID": "1101290001",
          "LocList": [{x:2, y:0, z:0},{x:0, y:3, z:0}]
        };
        let { LocList } = data;
        LocList.forEach(da => {
          da.x = da.x * 1000 + (this.count * 1000);
          da.y = da.y * 1000;
          da.z = da.z * 1000;
        });
        this.count += 1;
        resovle(LocList);
      });
      
      // let { LocList } = data;

      // let x = 0
      // let y = 0
      // let z = 0
      // setInterval(() => {
      //   viewer3D.removeExternalObjectByName(`单个构件_${x - 1000}`)
      //   var geometry = new BOS3D.THREE.BoxGeometry(1000, 1000, 1000)
      //   var material = new BOS3D.THREE.MeshLambertMaterial({
      //     color: 'red'
      //   })
      //   var mesh = new BOS3D.THREE.Mesh(geometry, material)
      //   mesh.position.set(x, y, z)
      //   viewer3D.addExternalObject(`单个构件_${x}`, mesh, false, material)
      //   x += 1000
      //   y += 10
      //   z += 10
      // }, 1000)
    },
    initWebSocket() {
      if(!window.WebSocket) {
        return;
      }
      this.loadDetailData();
    },
    loadDetailData() {
      var ws;
      var that = this;
      let soketURL = 'ws://106.52.125.177:50001/';
      ws = new WebSocket(soketURL);
      ws.onopen = function() {
        setInterval(function () {
          that.keepalive(ws)
        }, 40000);
      }
      ws.onmessage = function(e) {
        let { data } = e;
        var jsonData = JSON.parse(data);

      }
      ws.onclose = function() {
        ws = null;
      }
    },
    sendMsg2Soket(params, ws) {
      if(ws) {
        ws.send(params);
      } else {
        console.log("注册客户端失败");
      }
    },
    keepalive(ws) {
      this.sendMsg2Soket('', ws)
    },
  }
}
</script>
