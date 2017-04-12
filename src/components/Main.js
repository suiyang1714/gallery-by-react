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
})(imageDatas)

/*imageDatas = getImageURL(imageDatas)*/

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
