<template>
  <div>
    <canvas id='rainbow' />
  </div>
</template>

<script>
export default {
  name:'rainbow',
  mounted() {
    this.init()
  },
  methods:{
    init(){
        var cvs = document.getElementById('rainbow');
        var ctx = cvs.getContext('2d');

        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight * 2;

        var maxHeight = 40;
        var minHeight = 20;
        var maxSpeed = 4;
        var minSpeed = 2;
        var colors = ["#F8FFE5", "#06D6A0", "#1B9AAA", "#EF476F", "#FFC43D"];
        var amount = 30;
        var lines = [];
        var fast = false;

        function load() {
          var x = 0;
          var y = 0;
          var color;
          var width;
          var height;
          var speed;
          var handle = [];
          for (var i = 0; i < amount; i++) {
            x = (Math.random() * cvs.width) + 0;
            y = (Math.random() * cvs.height) + 0;
            color = Math.floor((Math.random() * colors.length) + 0);
            height = (Math.random() * maxHeight) + 0;
            speed = (Math.random() * maxSpeed) + minSpeed;
            width = height / 10;

            handle[0] = x;
            handle[1] = y;
            handle[2] = width;
            handle[3] = height;
            handle[4] = colors[color];
            handle[5] = speed;
            handle[6] = fast;

            lines.push(handle);

            handle = [];
            color = 0;
          }
        }

        function update() {
          for (var i = 0; i < amount; i++) {
            lines[i][1] += lines[i][5];

            if (lines[i][1] > cvs.height) {
              lines[i][1] = -lines[i][3];
              lines[i][0] = (Math.random() * cvs.width) + 0;
              lines[i][5] = lines[i][5] / 5;
              lines[i][6] = false;
            }
            if (lines[i][1] > cvs.height / 2 && !lines[i][6]) {
              lines[i][5] = lines[i][5] * 5;
              lines[i][6] = true;
            }
          }
        }

        function render() {
          ctx.clearRect(0, 0, cvs.width, cvs.height);
          var multi = 2;
          for (var i = 0; i < amount; i++) {
            ctx.fillStyle = lines[i][4];
            ctx.fillRect(lines[i][0], lines[i][1], lines[i][2], lines[i][3]);
            ctx.beginPath();
            ctx.arc(lines[i][0] + lines[i][2] / 2, lines[i][1] - lines[i][2] / 3, lines[i][2] / 2, 0, 2 * Math.PI);
            ctx.arc(lines[i][0] + lines[i][2] / 2, lines[i][1] + lines[i][3], lines[i][2] / 2, 0, 2 * Math.PI);
            ctx.fill();
            var grd = grd = ctx.createLinearGradient(lines[i][0], lines[i][1] - lines[i][3] * multi, lines[i][0], lines[i][1]);
            grd.addColorStop(0, "#76a1ef");
            grd.addColorStop(1, lines[i][4]);
            ctx.fillStyle = grd;
            ctx.fillRect(lines[i][0], lines[i][1] - lines[i][3] * multi, lines[i][2], lines[i][3] * multi);

          }
        }

        load();

        setInterval(render, 10);
        setInterval(update, 10);

    }
  }
};
</script>

<style lang='scss' scoped>
  #rainbow{
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: transparent;
  }
</style>
