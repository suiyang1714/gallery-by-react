require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function getImageURL(imageDataArr){
  for (var i = 0 , j = imageDataArr.length ; i < j;i++) {
    var singleImageData = imageDataArr[i];

    singleImageData.imageURL = require('../images/'+singleImageData.fileName);

    imageDataArr[i] = singleImageData
  }
  return imageDataArr;
})(imageDatas);

//给定一个区间，取随机位置，即获取区间内的一个随机值
function getRangeRandom(low,high) {
  return Math.ceil(Math.random() * (high - low) + low)
}
//获取0~30°之间的一个正负值
function get30DegRandom(){
  return Math.random() > 0.5 ? Math.ceil(Math.random() * 30) : -Math.ceil(Math.random() * 30)
}

var ImgFigure = React.createClass({

    //*
    handleClick: function (e) {


        if(this.props.arrange.isCenter){
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },


    render: function () {

        var styleObj = {};


        //如果props属性中制定了这张图片的位置，则使用

        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值并且不为0，则添加旋转角度

        if(this.props.arrange.rotate){
          (['-moz-','-ms-','-webkit-','']).forEach(function (value) {

                styleObj[value+'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';


            }.bind(this));

        }

        if (this.props.arrange.isCenter) {
          styleObj.zIndex = 11;
        }

        var imgFigureClassName = "img-figure";
            imgFigureClassName += this.props.arrange.isInverse ? ' isInverse' : '';


        return (
            <figure className={imgFigureClassName} style = {styleObj}  ref="figure" onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                      <p>
                        {this.props.data.desc}
                      </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
});

var GalleryByReactApp = React.createClass({
  //图片排列位置
  Constant: {
    centerPos:{
      left : 0,
      right : 0
    },
    hPosRange:{   // 水平方向的取值范围
      leftSecX: [0,0],    //左侧分区范围
      rightSecX: [0,0],   //右侧分区范围
      y: [0,0]            //Y轴的范围
    },
    vPosRange:{   // 垂直方向的取值范围
      x:[0,0],    //上侧分区
      topY: [0,0]
    }
  },
  /*
  * 翻转图片
   * @param index 输入当前被执行inverse 操作的图片对应的图片信息数组的index值
   * @return { Function} 这是一个闭包函数，其内return一个真正待被执行的函数
  */
  inverse : function (index){
      return function(){
        var imgsArrangeArr = this.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        })

      }.bind(this);
  },


  //重新布局所有的图片
  // @param centerIndex 指定居中排布哪个图片
  rearrange: function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr, //存放的是所有图片的状态信息
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      //该数组存储放在上侧分区图片的状态信息
      imgsArrangeTopArr = [];
      //放在上侧分区图片的数量
      var topImgNum = Math.ceil(Math.random() * 2) ; //取一个或者不取

      //用来标记部署在上侧的图片是从数组中哪个位置中拿出来的
      var topImgSpliceIndex = 0 ;
      //imgArrangeCenterArr存放居中图片的状态信息
      var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
      //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目
      //该方法会改变原始数组

      // 首先居中 centerIndex 的图片
      imgsArrangeCenterArr[0]= {
          pos: centerPos,
          rotate: 0,
          isCenter: true
      };

      //居中的 centerIndex 的图片不需要旋转

      imgsArrangeCenterArr[0].rotate = 0;

      //取出要布局上侧的图片的状态信息

      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

      //布局位图上侧的图片
      imgsArrangeTopArr.forEach(function (value,index) {
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
      });

      // 布局左右两侧的图片

      for(var i = 0, j = imgsArrangeArr.length,k = j/2;i<j;i++){
          var hPosRangeLORX = null;


          //前半部分布局左边，右半部分布局右边
          if(i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }


          imgsArrangeArr[i] = {
              pos: {
                  top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
          };
      }

      //如果上侧分区放图片了，再将该图片放入到imgsArrangeArr原来的位置
      if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0 ,imgsArrangeTopArr[0]);
      }

      //接下来，再将中心位置的图片放入到imgsArrangeArr原来的位置
      imgsArrangeArr.splice(centerIndex, 0 ,imgsArrangeCenterArr[0]);

      //接下来设置state，可以出发~，重新渲染页面
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });

  },
  /*
  * 利用 rearrange函数，居中对应index 的图片
  * @param index ,需要悲剧中的图片对应的图片信息数组的index值
  * */
  center : function(index){
    return function () {
      this.rearrange(index);
    }.bind(this)
  },
  getInitialState:function () {
      return {
          imgsArrangeArr: [
              /*{
                  pos:{
                    left: '0',
                    top: '0'
                  },
                  rotate:  0, //旋转角度
                  isInverse: false, //图片正反面
                  isCenter: false  //图片是否居中
              }*/
          ]
      };
  },
  // 组件加载以后，为每张图片计算其位置范围
  componentDidMount: function() {


    //首先拿到舞台的大小

    //scrollWidth：对象的实际内容的宽度，不包滚动条和边线宽度，会随对象中内容超过可视区后而变大。

    //clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。

    //offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。

    var stageDOM = this.refs.stage,
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到一个imageFigure的大小
    var imgFigureDOM = this.refs.imgFigure0.refs.figure,
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    //第一张图片居中
    this.rearrange(0)
  },



  render: function() {
    var controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate : 0,
          isInverse: false,
          isCenter: false
        };
      }

      imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} key = {index}  arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
      //通过arrange将
    }.bind(this));


    return (
      <section className="stage"  ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
