// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var IC = {}; // namespace

IC.data = [{
    x : 0,
    y : 0,
    z : 1,
    t : 'Hello'
},{
    x : 70,
    y : 15,
    z : 16,
    t : 'fantastic'
},{
    x : 71.1,
    y : 16.1,
    z : 256,
    t : 'world!'
}];

IC.init = function(){
    var c = document.getElementById('c');
    var ctx = this.context = c.getContext('2d');

    ctx.font = '32px sans-serif';
    ctx.textBaseline = 'top';

    var vp = this.viewport = { // initial viewport
        x : 0,
        y : 0,
        w : 800,
        h : 600,
        dx : 0,
        dy : 0
    };

    // mouse events
    var dd = false, x0, y0; // drag and drop
    $(c).bind('mousewheel', function(event, delta, deltaX, deltaY) {
        // fixed point zoom
        var zoom = Math.pow(1.1, -delta); // delta always 1/-1?
        var x = event.clientX - c.offsetLeft, y = event.clientY - c.offsetTop;
        IC.fpZoom(zoom, x, y);
    }).bind('mousedown', function(event){
        dd = true;
        x0 = event.clientX;
        y0 = event.clientY;
    }).bind('mouseup', function(){
        dd = false;
        vp.x += vp.dx;
        vp.y += vp.dy;
        vp.dx = 0;
        vp.dy = 0;
    }).bind('mousemove', function(event){
        if(dd){
            var zoom_abs = vp.h/600,
                dx = (x0 - event.clientX) * zoom_abs,
                dy = (y0 - event.clientY) * zoom_abs;
            vp.dx = dx;
            vp.dy = dy;
        }
    });
};


IC.draw = function(){
    // no 'this' in this function, it's called by requestAnimFrame
    var ctx = IC.context, vp = IC.viewport;

    ctx.clearRect(0, 0, 800, 600);
    ctx.save();
    var s = 600/vp.h;
    ctx.scale(s, s);
    ctx.translate(-vp.x - vp.dx, -vp.y - vp.dy);

    // debug
    ctx.strokeRect(0, 0, 800, 600);

    IC.data.forEach(function(o){
        var zoom = o.z, zh = zoom*vp.h;

        //if(zh < 6000 && 6000 < 200*zh){
        if(30 < zh && zh < 6000){
            ctx.save();
            ctx.translate(o.x, o.y);
            ctx.scale(1/zoom, 1/zoom);
            ctx.globalAlpha = Math.max(0, Math.min( zh/30 - 1 , 1));
            ctx.fillText(o.t, 0, 0);
            ctx.restore();
        }
    });
    ctx.restore();

    // next frame
    requestAnimFrame(IC.draw);
};

IC.fpZoom = function(zoom, x, y){
    var vp = this.viewport;
    // convert fixed point in absolute coordinates
    var zoom_abs = vp.h/600;
    var x_abs = x * zoom_abs + vp.x;
    var y_abs = y * zoom_abs + vp.y;
    // update viewport
    vp.w *= zoom;
    vp.h *= zoom;
    zoom_abs = vp.h/600;
    vp.x = x_abs - x * zoom_abs;
    vp.y = y_abs - y * zoom_abs;
};



window.onload = function(){
    IC.init();
    IC.draw();
};
