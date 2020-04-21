import React from 'react';
import './App.css';

import ImageList from './components/ImageList'

function App() {
  const photoFiles = [
      "http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-04-21-instapicture-a.jpeg",
      "http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-04-21-instapicture-b.jpeg",
      "http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-04-21-instapicture-d.jpg",
      "http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-04-21-instapicture-e.jpg",
      "http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-04-21-instapicture-f.jpg",
      "http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-04-21-instapicture-c.jpeg"
  ];
  return (
    <div className="App">
      <ImageList photoImages={photoFiles} />
    </div>
  );
}

export default App;
