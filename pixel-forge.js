class PenTool {
    constructor(pixelDrawOffset, pixelDrawSize, color, pixelRes) {
        this.pixelDrawOffset = pixelDrawOffset;
        this.pixelDrawSize = pixelDrawSize;
        this.color = color;
        this.pixelRes = pixelRes;
    }

    updatePixel(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.clearRect(x, y, this.pixelRes, this.pixelRes);
        ctx.fillRect(x + this.pixelDrawOffset, y + this.pixelDrawOffset, this.pixelDrawSize, this.pixelDrawSize);
    }
}


class PenToolMirrorX {
    constructor(pixelDrawOffset, pixelDrawSize, color, pixelRes, canvasW) {
        this.pixelDrawOffset = pixelDrawOffset;
        this.pixelDrawSize = pixelDrawSize;
        this.color = color;
        this.pixelRes = pixelRes;
        this.canvasW = canvasW;
    }

    updatePixel(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.clearRect(x, y, this.pixelRes, this.pixelRes);
        ctx.fillRect(x + this.pixelDrawOffset, y + this.pixelDrawOffset, this.pixelDrawSize, this.pixelDrawSize);

        // Mirror X
        ctx.clearRect(this.canvasW - x, y, this.pixelRes, this.pixelRes);
        ctx.fillRect(this.canvasW - (x + this.pixelDrawOffset), y + this.pixelDrawOffset, this.pixelDrawSize, this.pixelDrawSize);
    }
}


class EraseTool {
    constructor(pixelDrawOffset, pixelDrawSize, pixelRes) {
        this.pixelDrawOffset = pixelDrawOffset;
        this.pixelDrawSize = pixelDrawSize;
        this.pixelRes = pixelRes;
    }

    updatePixel(ctx, x, y) {
        ctx.clearRect(x, y, this.pixelRes, this.pixelRes);
    }
}

class EraseToolMirrorX {
    constructor(pixelDrawOffset, pixelDrawSize, pixelRes, canvasW) {
        this.pixelDrawOffset = pixelDrawOffset;
        this.pixelDrawSize = pixelDrawSize;
        this.pixelRes = pixelRes;
        this.canvasW = canvasW;
    }

    updatePixel(ctx, x, y) {
        ctx.clearRect(x, y, this.pixelRes, this.pixelRes);
        
        // Mirror X
        ctx.clearRect(x, y, this.canvasW - this.pixelRes, this.pixelRes);
    }
}



class PixelGrid {
    constructor(drawingArea, drawingGrid) {
        this.isDrawing = false;
        this.onCanvas = false;
        this.erase = false;
        // Foreground drawing layer
        this.canvas = document.getElementById(drawingArea);
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        // Background layer
        this.canvasGrid = document.getElementById(drawingGrid); // previously this.canvasBackground
        this.ctxGrid = this.canvasGrid.getContext('2d', { alpha: true }); // previously this.ctxBackground
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.pixelRes = 12; // canvas width and height must be divisible by this value
        this.pixelDrawSize = this.pixelRes - 2; // mark as private/not to be changed. should optimally be 2 but the lines look too thick then
        this.pixelDrawOffset = 1; // mark as private/not to be changed

        this.drawToolMirrorX = false;
        this.drawTool;
    }

    setupCanvas() {
        this.fillCanvas();
        this.drawGrid();
        this.sliderInit();
        this.setDrawToolPen();
    }

    fillCanvas() {
        this.ctxGrid.fillStyle = "#535353";
        this.ctxGrid.fillRect(0, 0, this.canvasW, this.canvasH);
    }

    drawGrid() {
        let numOfGridsX = this.canvasW / this.pixelRes;
        let numOfGridsY = this.canvasH / this.pixelRes;
        this.ctxGrid.beginPath();
        this.ctxGrid.setLineDash([1, 1]); // width, space
        this.ctxGrid.strokeStyle = "#636363";
        this.ctxGrid.lineWidth = 1
        let xpos = 0;
        for (let xcount = 0; xcount <= numOfGridsX; xcount++) {
            this.ctxGrid.moveTo(xpos, 0);
            this.ctxGrid.lineTo(xpos, this.canvasH);
            this.ctxGrid.stroke();
            xpos += this.pixelRes;
        }
        let ypos = 0;
        for (let ycount = 0; ycount <= numOfGridsY; ycount++) {
            this.ctxGrid.moveTo(0, ypos);
            this.ctxGrid.lineTo(this.canvasW, ypos);
            this.ctxGrid.stroke();
            ypos += this.pixelRes;
        }
    }

    

    setDrawToolPen() {
        this.drawTool = new PenTool(this.pixelDrawOffset, this.pixelDrawSize, this.color, this.pixelRes);
    }

    setDrawToolPenMirrorX() {
        this.drawTool = new PenToolMirrorX(this.pixelDrawOffset, this.pixelDrawSize, this.color, this.pixelRes, this.canvasW);
    }

    setDrawToolErase() {
        //this.erase = true;
        this.drawTool = new EraseTool(this.pixelDrawOffset, this.pixelDrawSize, this.pixelRes);
    }

    setDrawToolEraseMirrorX() {
        //this.erase = true;
        this.drawTool = new EraseTool(this.pixelDrawOffset, this.pixelDrawSize, this.pixelRes, ths.canvasW);
    }

    toggleDrawToolMirrorX() {
        // toggles between true and false
        console.log(document.getElementById("mirror").checked);
        
        this.drawToolMirrorX = document.getElementById("mirror").checked; // does this toggle or always set to true?
        
        console.log(document.getElementById("mirror").checked);
        console.log(this.drawTool instanceof PenTool);
        
        this.setDrawToolPenMirrorX();
        
        if (this.drawToolMirrorX != true) {
            if (this.drawTool instanceof PenTool == true) {
                console.log("this hits?")
                this.setDrawToolPenMirrorX();
            }
        } else {
            if (this.drawTool instanceof PenTool == true) {
                this.setDrawToolPen();
            }
        }
        
        
        console.log(document.getElementById("mirror").checked);
    }

    clearCanvas() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    /**
    * 
    * @param {string} color hsl(<0-360>, <0-100>, <0-100>)
    */
    setColor(color) {
        this.drawTool.color = color;
    }


    
    sliderInit() {
        var hueEle = document.getElementById("hueSlider");
        var satEle = document.getElementById("saturationSlider");
        var lightEle = document.getElementById("lightnessSlider");

        var output = document.getElementById("demoBox");
        var hueVal = document.getElementById("hueSliderValue");
        var satVal = document.getElementById("saturationSliderValue");
        var lightVal = document.getElementById("lightnessSliderValue");

        // Set initial values
        hueVal.innerHTML = hueEle.value;
        satVal.innerHTML = satEle.value;
        lightVal.innerHTML = lightEle.value;
        output.style.background = `hsl(${hueEle.value}, ${satEle.value}%, ${lightEle.value}%)`;

        hueEle.oninput = function() {
            hueVal.innerHTML = this.value;
            
            output.style.background = `hsl(${hueEle.value}, ${satEle.value}%, ${lightEle.value}%)`;
        }

        satEle.oninput = function() {
            satVal.innerHTML = this.value;

            output.style.background = `hsl(${hueEle.value}, ${satEle.value}%, ${lightEle.value}%)`;
        }

        lightEle.oninput = function() {
            lightVal.innerHTML = this.value;

            output.style.background = `hsl(${hueEle.value}, ${satEle.value}%, ${lightEle.value}%)`;
        }

    }
    


    startEventListeners() {
        this.canvas.addEventListener("mousedown", event => {
            //console.log(`x: ${event.clientX}, y: ${event.clientY}`); // DEBUG
            //console.log(`offsetX: ${event.offsetX}, offsetY: ${event.offsetY}`); // DEBUG
            this.isDrawing = true;
            this.onCanvas = true;
            
            // Draw with the current set color
            var colorBox = document.getElementById("demoBox");
            this.setColor(colorBox.style.backgroundColor);
        });
        this.canvas.addEventListener("mousemove", event => {
            if (this.isDrawing === true) {
                this.drawTool.updatePixel(this.ctx, 
                                          (event.offsetX - (event.offsetX % this.pixelRes)), 
                                          (event.offsetY - (event.offsetY % this.pixelRes)));
            }
        });
        window.addEventListener("mouseup", event => {
            if (this.isDrawing === true) {
                // To avoid having a pixel drawn if mouse is released outside of the canvas
                if (this.onCanvas === true) {
                    this.drawTool.updatePixel(this.ctx, 
                                              (event.offsetX - (event.offsetX % this.pixelRes)), 
                                              (event.offsetY - (event.offsetY % this.pixelRes)));
                }
                this.isDrawing = false;
            }
        });
        this.canvas.addEventListener("mouseleave", event => {
            this.onCanvas = false;
        });
    }
}

pg = new PixelGrid("drawingArea", "drawingGrid");
pg.setupCanvas();
pg.startEventListeners();
