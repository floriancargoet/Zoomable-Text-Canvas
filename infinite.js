var data = [{
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

window.onload = function(){
    var c = document.getElementById('c');
    var ctx = c.getContext('2d');
    
    ctx.font = '32px sans-serif';
    ctx.textBaseline = 'top';
    
    var viewport = { // initial viewport
        x : 0,
        y : 0,
        w : 800,
        h : 600,
        dx : 0,
        dy : 0
    };
    var dd = false, x0, y0; // drag and drop
    
    $(c).bind('mousewheel', function(event, delta, deltaX, deltaY) {
        // fixed point zoom
        var zoom = Math.pow(1.1, -delta); // delta always 1/-1?
        var x = event.clientX - c.offsetLeft, y = event.clientY - c.offsetTop;
        fpZoom(viewport, zoom, x, y);
        draw(ctx, viewport);
    }).bind('mousedown', function(event){
        dd = true;
        x0 = event.clientX;
        y0 = event.clientY;
    }).bind('mouseup', function(){
        dd = false;
        viewport.x += viewport.dx;
        viewport.y += viewport.dy;
        viewport.dx = 0;
        viewport.dy = 0;
    }).bind('mousemove', function(event){
        if(dd){
            var zoom_abs = viewport.h/600,
                dx = (x0 - event.clientX) * zoom_abs,
                dy = (y0 - event.clientY) * zoom_abs;
            viewport.dx = dx;
            viewport.dy = dy;
            draw(ctx, viewport);
        }
    });
    
    draw(ctx, viewport);
};

    
function draw(ctx, viewport){
    ctx.clearRect(0, 0, 800, 600);
    ctx.save();
    var s = 600/viewport.h;
    ctx.scale(s, s);
    ctx.translate(-viewport.x - viewport.dx, -viewport.y - viewport.dy);
    
    // debug 
    ctx.strokeRect(0, 0, 800, 600);
    
    data.forEach(function(o){
        var zoom = o.z, zh = zoom*viewport.h;
        
        //if(zh < 6000 && 6000 < 200*zh){
        if(30 < zh && zh < 6000){
            ctx.save();
            ctx.translate(o.x, o.y)
            ctx.scale(1/zoom, 1/zoom);
            ctx.globalAlpha = Math.max(0, Math.min( zh/30 - 1 , 1));
            ctx.fillText(o.t, 0, 0);
            ctx.restore();
        }
    });
    ctx.restore();
}    

function fpZoom(viewport, zoom, x, y){
    // convert fixed point in absolute coordinates
    var zoom_abs = viewport.h/600;
    var x_abs = x * zoom_abs + viewport.x;
    var y_abs = y * zoom_abs + viewport.y;
    // update viewport
    viewport.w *= zoom;
    viewport.h *= zoom;
    zoom_abs = viewport.h/600;
    viewport.x = x_abs - x * zoom_abs;
    viewport.y = y_abs - y * zoom_abs;
}
