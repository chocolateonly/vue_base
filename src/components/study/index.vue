<template>
  <div>
    <h2 class="title">mix-blend-mode</h2>
    // 代表了页面不同的可以吸附的元素，它们的高宽、border-radius 各不相同
    <div class="g-animation">Lorem ...</div>
    <div class="g-animation">Lorem ...</div>
    <div class="g-animation">Lorem ...</div>

    // 模拟鼠标指针的两个元素
    <div id="g-pointer-1"></div>
    <div id="g-pointer-2"></div>

    <h2 class="title">打字输入效果</h2>
    <div class="print-text">
      <p>{{data}}</p>
    </div>
    <!--        <p></p>-->
    <!--        <p></p>-->
    <!--        <p></p>-->


  </div>
</template>

<script>
export default {
  name:'studyRecordCom',
  data(){
    return {
      text:'白日依山尽黄河入海流欲穷千里目更上一层楼',
      data:'',
      index:0
    }
  },
  mounted() {
    this.addChar()

    this.mixAnimation()
  },
  methods:{
    mixAnimation(){
      const body = document.querySelector("body");
      const element = document.getElementById("g-pointer-1");
      const element2 = document.getElementById("g-pointer-2");
      const halfAlementWidth = element.offsetWidth / 2;
      const halfAlementWidth2 = element2.offsetWidth / 2;

      // 该变量用于跟踪鼠标是否悬停在具有类名为 .g-animation 的元素上
      let isHovering = false;

      // 判断元素是否悬停在具有类名为 .g-animation 的元素上
      window.addEventListener("mouseover", (event) => {
        const target = event.target;
        // console.log(target.classList,'鼠标移动时 所在区域元数类名');
        if (target.classList.contains("g-animation")) {
          isHovering = true;
          //  重点学习：获取元素相对于视口的位置 getBoundingClientRect
          //  获取样式 getComputedStyle
          const rect = target.getBoundingClientRect();
          const style = window.getComputedStyle(target);

          element2.style.width = `${rect.width + 20}px`;
          element2.style.height = `${rect.height + 20}px`;
          element2.style.borderRadius = `${style.borderRadius}`;
          element2.style.transform = `translate(${rect.left - 10}px, ${
              rect.top - 10
          }px)`;
        }
      });

      // 判断元素是否离开在具有类名为 .g-animation 的元素上
      window.addEventListener("mouseout", (event) => {
        const target = event.target;
        if (target.classList.contains("g-animation")) {
          isHovering = false;

          // 样式复原
          element2.style.width = `42px`;
          element2.style.height = `42px`;
          element2.style.borderRadius = `50%`;
        }
      });

      // 用于控制两个鼠标指针元素
      body.addEventListener("mousemove", (e) => {
        setPosition(e.clientX, e.clientY);
      });

      function setPosition(x, y) {
        window.requestAnimationFrame(function () {
          // element.style.transform = `translate(${x - halfAlementWidth}px, ${
          //     y - halfAlementWidth
          // }px)`;

          if (!isHovering) {
            element2.style.transform = `translate(${x - halfAlementWidth2}px, ${
                y - halfAlementWidth2
            }px)`;
          }
        });
      }
    },
    addChar(){
      if(this.index<this.text.length) {
        this.data+=this.text[this.index]
        this.index++
        setTimeout(this.addChar,Math.random()*150+30)
      }
      else{
        this.index=0
        this.data = ''
        setTimeout(this.addChar,Math.random()*150+30)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.title{
  margin: 10px 0;
}
//打字效果
:root{
  --pointerColor:#000
}
.print-text{
  width: 10ch;
}
.print-text p {
  display: inline;
  border-right: 2px solid var(--pointerColor);
  //background: linear-gradient(90deg, transparent calc(100% - 2px), #000 2px,var(--pointerColor) calc(100% - 2px),var(--pointerColor) 2px) no-repeat;
  animation: colorChange .8s linear infinite;
  padding-right: 4px;
}
@keyframes colorChange {
  0%,50% {
    --pointerColor:#000;
  }
  50%,100% {
    --pointerColor: transparent;
  }
}

p{
  //width: 56ch;
  //white-space: nowrap;
  //overflow: hidden;
  //animation: types 3s steps(56) infinite;
}
@keyframes types {
  0% {
    width: 0;
  }
  100% {
    width: 56ch;
  }
}
//
//$str: '白日依山尽黄河入海流欲穷千里目更上一层楼abcdefghigklmnopqrstuvwxyz123456789%@#$<>^&*_+';
//$length: str-length($str);
//
//@function randomChar() {
//    $r: random($length);
//    @return str-slice($str, $r, $r);
//}
//
//@function randomChars($number) {
//    $value: '';
//
//    @if $number > 0 {
//        @for $i from 1 through $number {
//            $value: $value + randomChar();
//        }
//    }
//    @return $value;
//}
//
//p:nth-child(1)::before {
//    content: randomChars(25);
//}
//p:nth-child(2)::before {
//    content: randomChars(25);
//}
//p:nth-child(3)::before {
//    content: randomChars(25);
//}

.g-animation{
  position: relative;
  margin: auto;
  padding: 20px;
  width: 400px;
  font-size: 24px;
  line-height: 1.5;
  text-align: justify;
  background: #42b983;
  color: #fff;
  border: 3px solid #333;
  border-radius: 5px;
}
.g-animation:nth-child(2) {
  background: #ff8c00;
  border-radius: 0;
}
.g-animation:nth-child(3) {
  width: 240px;
  height: 240px;
  background: #673ab7;
  border-radius: 50%;
  font-size: 18px;
  text-align: center;
}
#g-pointer-1,
#g-pointer-2
{
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background: #999;
  border-radius: 50%;
  background-color: #4caf50;
  z-index: 1;
  mix-blend-mode: exclusion;
  pointer-events: none;
}
#g-pointer-2 {
  width: 42px;
  height: 42px;
  background: #fff;
  transition: .15s ease-out;
}
</style>
