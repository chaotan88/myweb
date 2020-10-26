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
      var modelKey = 'M1603263440426'
      var projectKey = 'ld6702529bd14d528a343c9a972750c7'
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
      viewer3D.addView(modelKey, projectKey)
      viewer3D.autoResize()
      window.addEventListener('resize', function () {
        viewer3D.autoResize()
      })
      const colors = ['red', 'green', 'yellow','red', 'green', 'yellow','red', 'green', 'yellow','red', 'green', 'yellow'];
      viewer3D.getExternalObjectByCompoentKey('M1603263440426_2667611').then((obj) => {
        console.log(obj, 999999999999999999999);
      });
      setInterval(() => {
        this.getData().then((radaData) => {
          // 删除
          for (let i = 0; i < 20; i++) {
            viewer3D.removeExternalObjectByName(`单个构件_${i}`);
          }
          radaData.forEach((da, index) => {
            if (index < 10) {
              viewer3D.removeExternalObjectByName(`单个构件_${index}`);
              var geometry = new BOS3D.THREE.BoxGeometry(1000, 1000, 1000);
              var material = new BOS3D.THREE.MeshLambertMaterial({
                color: colors[index]
              });
              var mesh = new BOS3D.THREE.Mesh(geometry, material);
              let x = da.x;
              let y = da.y;
              let z = da.z;
              mesh.position.set(x, y, z);
              viewer3D.addExternalObject(`单个构件_${index}`, mesh, false, material)
            }
          });
        });
      }, 1000);
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
      let soketURL = 'www.baidu.com';
      ws = new WebSocket(soketURL);
      ws.onopen = function() {
        setInterval(function () {
          that.keepalive(ws)
        }, 40000);
      }
      ws.onmessage = function(e) {
        console.log(e.data);
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
