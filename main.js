//======================================================================================================================
// GRID LOGIC FUNCTIONS
//======================================================================================================================



//======================================================================================================================
/**
 * Create a blank <code>grid</code> object containing a 2d array, a height, and a width.
 * 
 * @param {*} height The height of the <code>grid</code> to create.
 * @param {*} width The width of the <code>grid</code> to create.
 * @returns The created <code>grid</code>.
 */
function createBlankGrid(height, width) {
    var grid = {
        arr: [],
        height: height,
        width: width
    };
    for (var i = 0; i < height; i++) {
        grid.arr[i] = [];
        for (var j = 0; j < width; j++) {
            grid.arr[i][j] = false;
        }
    }
    return grid;
} // createBlankGrid ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get the row and columns of all of a given cell's neighbor's on a <code>grid</code>.
 * 
 * @param {*} cellRow The given cell's row number.
 * @param {*} cellCol The given cell's column number.
 * @param {*} grid The grid the cell is on.
 * @returns An array of objects containing <code>row</code> and <code>col</code> fields indicating the row and columns
 * of the given cell's neighbors.
 */
function getCellNeighbors(cellRow, cellCol, grid) {
    var neighbors = [];
    for (var rowShift = -1; rowShift < 2; rowShift++) {
        for (var colShift = -1; colShift < 2; colShift++) {
            if (colShift == 0 && rowShift == 0) continue;
            var neighborRow = cellRow + rowShift;
            var neighborCol = cellCol + colShift;
            if ((neighborRow >= 0 && neighborRow < grid.height) && (neighborCol >= 0 && neighborCol < grid.width)) {
                neighbors.push({row: neighborRow, col: neighborCol});
            }
        }
    }
    return neighbors;
} // getCellNeighbors ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get the number of live neighbors of the cell at (<code>cellRow</code>, <code>cellCol</code>) on a <code>grid</code>.
 * 
 * @param {*} cellRow The row of the cell of interest.
 * @param {*} cellCol The column of the cell of interest.
 * @param {*} grid The grid the cell is on.
 * @returns The number of live neighbors of the cell.
 */
function getNumLiveNeighbors(cellRow, cellCol, grid) {
    var cellNeighbors = getCellNeighbors(cellRow, cellCol, grid);
    var numLive = 0;
    for (var i = 0; i < cellNeighbors.length; i++) {
        var cellNeighbor = cellNeighbors[i];
        if (grid.arr[cellNeighbor.row][cellNeighbor.col]) numLive += 1;
    }
    return numLive;
} // getNumLiveNeighbors ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get a cell's next state based on its current state and the number of its neighbors that are currently alive.
 * 
 * @param {*} cellState A boolean representing this cell's state.
 * @param {*} numLiveNeighbors The number of this cell's neighbors that are alive.
 * @returns A boolean representing this cell's state at the next tick.
 */
function cellRule(cellState, numLiveNeighbors) {
    if (cellState == true && (numLiveNeighbors == 2 || numLiveNeighbors == 3)) return true;
    if (cellState == false && (numLiveNeighbors == 3)) return true;
    return false;
} // cellRule ()
//======================================================================================================================



//======================================================================================================================
/**
 * Compute the next state of the <code>grid</code>.
 * 
 * @param {*} grid The <code>grid</code> representing the previous state.
 * @returns The next <code>grid</code>.
 */
function computeNextGrid(grid) {
    var nextGrid = createBlankGrid(grid.height, grid.width);
    for (var row = 0; row < grid.height; row++) {
        for (var col = 0; col < grid.width; col++) {
            var numLiveNeighbors = getNumLiveNeighbors(row, col, grid);
            nextGrid.arr[row][col] = cellRule(grid.arr[row][col], numLiveNeighbors);
        }
    }
    return nextGrid;
} // computeNexctGrid ()
//======================================================================================================================



//======================================================================================================================
function expandGrid(grid) {
    cellDimensions = getCellDimensions(grid.width+2, canvas);
    var expandedGrid = createBlankGrid(Math.floor(canvas.height / cellDimensions.cellLength), grid.width+2);
    for (var row = 0; row < grid.height; row++) {
        for (var col = 0; col < grid.width; col++) {
            expandedGrid.arr[row+1][col+1] = grid.arr[row][col];
        }
    }
    return expandedGrid;
} // expandGrid ()
//======================================================================================================================



//======================================================================================================================
function shrinkGrid(grid) {
    if (grid.height <= 2 || grid.width <= 2) return;
    cellDimensions = getCellDimensions(grid.width-2, canvas);
    var shrunkGrid = createBlankGrid(Math.floor(canvas.height / cellDimensions.cellLength), grid.width-2);
    for (var row = 0; row < shrunkGrid.height; row++) {
        for (var col = 0; col < shrunkGrid.width; col++) {
            shrunkGrid.arr[row][col] = grid.arr[row+1][col+1];
        }
    }
    return shrunkGrid;
} // shrinkGrid ()
//======================================================================================================================



//======================================================================================================================
// DRAWING FUNCTIONS
//======================================================================================================================



//======================================================================================================================
/**
 * Perform the action ("shrink" or "expand") on the grid and redraw it.
 * 
 * @param {*} action The action to perform.
 */
function drawChangedGrid(action) {
    // action is "shrink" or "expand"
    var newGrid;
    if (action == "shrink") newGrid = shrinkGrid(grid);
    if (action == "expand") newGrid = expandGrid(grid);
    grid = newGrid;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGridFromDimensions(grid, cellDimensions, 2, "black", liveCellColor, deadCellColor);
} // drawChangedGrid ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a cell onto the <code>canvas</code> from the given parameters.
 * 
 * @param {*} canvas The <code>canvas</code> to draw the cell onto.
 * @param {*} cornerX The x coordinate of the top left corner of this cell.
 * @param {*} cornerY The y coordinate of the top left corner of this cell.
 * @param {*} length The length of the cell.
 * @param {*} borderWidth The width of the cell's border.
 * @param {*} borderColor The cell's border color.
 * @param {*} fillColor The cell's fill color.
 */
function drawCell(canvas, cornerX, cornerY, length, borderWidth, borderColor, fillColor) {
    var context = canvas.getContext("2d");
    context.beginPath();
    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.fillStyle = fillColor;
    context.rect(cornerX, cornerY, length-borderWidth, length-borderWidth);
    context.stroke();
    context.fill();
} // drawCell ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a <code>grid</code> onto the <code>canvas</code> from the given parameters.
 * 
 * @param {*} grid The <code>grid</code> to draw.
 * @param {*} cellLength The length of cells.
 * @param {*} cellBorderWidth The border width of cells.
 * @param {*} cellBorderColor The border color of cells.
 * @param {*} liveColor The fill color for live cells.
 * @param {*} deadColor The fill color for dead cells.
 */
function drawGrid(cornerX, cornerY, grid, cellLength, cellBorderWidth, cellBorderColor, liveColor, deadColor) {
    var currentX = cornerX + cellBorderWidth / 2;
    var currentY = cornerY + cellBorderWidth / 2;
    for (var row = 0; row < grid.height; row++) {
        for (var col = 0; col < grid.width; col++) {
            var fillColor = (grid.arr[row][col]) ? liveColor : deadColor;
            drawCell(canvas, currentX, currentY, cellLength, cellBorderWidth, cellBorderColor, fillColor);
            currentX += cellLength;
        }
        currentX = cornerX + cellBorderWidth / 2;
        currentY += cellLength;
    }
} // drawGrid ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get the canvas dimensions for cells given the grid width.
 * 
 * @param {*} gridWidth The number of columns on the grid.
 * @returns An object containing the cell lengths, and corner coordinates for the drawing.
 */
function getCellDimensions(gridWidth) {
    var cellLength = canvas.width / gridWidth; 
    var cornerX = (canvas.width - (cellLength * gridWidth)) / 2;
    var cornerY = 0;
    return {cellLength : cellLength, cornerX : cornerX, cornerY : cornerY};
} // getCellDimensions ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a <code>grid</code> to the <code>canvas</code> given the <code>cellDimensions</code> object.
 * 
 * @param {*} grid The <code>grid</code> to draw.
 * @param {*} cellDimensions The object that is a result of <code>getCellDimensions()</code>.
 * @param {*} cellBorderWidth The border width for cells.
 * @param {*} cellBorderColor The border color for cells.
 * @param {*} liveColor The fill color for live cells.
 * @param {*} deadColor The fill color for dead cells.
 */
function drawGridFromDimensions(grid, cellDimensions, cellBorderWidth, cellBorderColor, liveColor, deadColor) {
    drawGrid(cellDimensions.cornerX, cellDimensions.cornerY, grid, cellDimensions.cellLength, cellBorderWidth,
             cellBorderColor, liveColor, deadColor);
} // drawGridWithinCanvas ()
//======================================================================================================================


//======================================================================================================================
/**
 * Convert the slider value (from 0 to 99) to <code>waitFrames</code> for the speed of the animation.
 * 
 * @param {*} sliderValue The value of the slider.
 * @returns The corresponding value for <code>waitFrames</code> giving the animation's speed.
 */
function getWaitFramesFromSliderValue(sliderValue) {
    var slope = (waitFramesLowerBound-waitFramesUpperBound)/(maxSliderValue-minSliderValue);
    return waitFramesUpperBound+Math.floor(slope*sliderValue);
} // getWaitFramesFromSliderValue ()
//======================================================================================================================



//======================================================================================================================
/**
 * Update the variable <code>waitFrames</code> given the speed slider's value.
 */
function updateWaitFrames() {
    numFrames = 0;
    var sliderValue = document.getElementById("speedSlider").value;
    waitFrames = getWaitFramesFromSliderValue(sliderValue);

} // updateWaitFrames ()
//======================================================================================================================



//======================================================================================================================
/**
 * Play or pause the animation, and change the play/pause button's text.
 */
function playPause() {
    var playPauseButton = document.getElementById('playPause');
    if (paused) playPauseButton.innerHTML = "Pause";
    else playPauseButton.innerHTML = "Play";
    paused = !paused;
    animate();
} // playPause ()
//======================================================================================================================



//======================================================================================================================
/**
 * Given a point on the canvas, get the corresponding row and column on the <code>grid</code>.
 * 
 * @param {*} x The x coordinate of the point on the canvas.
 * @param {*} y The y coordinate of the point on the canvas.
 * @returns The corresponding <code>grid</code> row and column.
 */
function getRowColumn(x, y) {
    var row = Math.floor((y-cellDimensions.cornerY) / cellDimensions.cellLength);
    var col = Math.floor((x-cellDimensions.cornerX) / cellDimensions.cellLength);
    return {row: row, col: col};
} // getRowColumn ()
//======================================================================================================================



//======================================================================================================================
/**
 * The animation loop.
 */
function animate() {
    if (paused) return;
    if (numFrames == waitFrames) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        numFrames = 0;
        grid = computeNextGrid(grid);
        drawGridFromDimensions(grid, cellDimensions, 2, "black", liveCellColor, deadCellColor);
    } else {
        numFrames += 1;
    }
    requestAnimationFrame(animate);
} // animate ()
//======================================================================================================================



//======================================================================================================================
// ANIMATION PARAMETERS
const waitFramesUpperBound = 60;
const waitFramesLowerBound = 0;
const minSliderValue = 0;
const maxSliderValue = 99;

const deadCellColor = "#cccccc";
const liveCellColor = "#161d20";
//======================================================================================================================



//======================================================================================================================
// ANIMATION SETUP
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.85;

const startWidth = 80;
var cellDimensions = getCellDimensions(startWidth, canvas);
const startHeight = Math.floor(canvas.height / cellDimensions.cellLength);

var grid = createBlankGrid(startHeight, startWidth);
var waitFrames = getWaitFramesFromSliderValue(50);
var ctx = canvas.getContext("2d");
var numFrames = 0;
var paused = true;

drawGridFromDimensions(grid, cellDimensions, 2, "black", liveCellColor, deadCellColor);
animate();

// Add event listener to change state of cells when clicked when animation is paused.
canvas.addEventListener('click', event => {
    if (paused) {
        let bound = canvas.getBoundingClientRect();
        let x = event.clientX - bound.left - canvas.clientLeft;
        let y = event.clientY - bound.top - canvas.clientTop;
        rowCol = getRowColumn(x, y);
        if ((rowCol.col >= 0 && rowCol.col < grid.width) && (rowCol.row >= 0 && rowCol.row < grid.height)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            grid.arr[rowCol.row][rowCol.col] = !grid.arr[rowCol.row][rowCol.col];
            drawGridFromDimensions(grid, cellDimensions, 2, "black", liveCellColor, deadCellColor);
        }
    }
});
//======================================================================================================================