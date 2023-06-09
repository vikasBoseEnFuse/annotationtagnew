import axios from "axios";
import {
    RectangleSelector,
    OvalSelector
  } from "react-image-annotation/lib/selectors";
  
  let fetchAnnotation = [];
      axios.get('http://localhost:6075/api/tag/fetch/one.jpg')
          .then(res => {
                console.log(res.data.annotations);
                for(let annotations of res.data.annotations) {
                  fetchAnnotation.push(annotations);
                }
          }).catch(error => {
               console.log(error);
          });
  var obj = fetchAnnotation.reduce(function(acc, cur, i) {
    acc[i] = cur;
    return acc;
  }, {});
//console.log(fetchAnnotation, obj);

 let imageList = [
    {
       id: 1,
       imgname: 'one.jpg',
       path: '../images/one.jpg'
    },
    {
      id: 2,
      imgname: 'two.jpg',
      path: '../images/two.jpg'
    },
    {
      id: 3,
      imgname: 'three.jpg',
      path: '../images/three.jpg'
    },
    {
      id: 4,
      imgname: 'four.jpg',
      path: '../images/four.jpg'
    },
    {
      id: 5,
      imgname: 'five.jpg',
      path: '../images/five.jpg'
    }
 ];
  export default {
    annotations: fetchAnnotation,
     /* annotations: [
      {
        geometry: {
          type: RectangleSelector.TYPE,
          x: 25,
          y: 31,
          width: 21,
          height: 35
        },
        data: {
          text: "Annotate!",
          id: 1
        }
      },
      {
        geometry: {
          type: OvalSelector.TYPE,
          x: 53,
          y: 33,
          width: 17.5,
          height: 28
        },
        data: {
          text: "Supports custom shapes too!",
          id: 2
        }
      }
    ]  */
    imageList: imageList
  };


  
  