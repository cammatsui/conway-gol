//======================================================================================================================
/**
 * Determine if the given 2d array <code>arr</code> is rectangular.
 * 
 * @param {*} arr The array to check.
 * @returns A boolean indicating whether the array is rectangular.
 */
function isRectangular(arr) {
    var height  = arr.length;
    var width   = arr[0].length;
    for (var i = 1; i < height; i++) {
        if (arr[i] != width) return false;
    }
    return true;
} // isRectangular
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
    for (var rowShift in [-1, 0, 1]) {
        for (var colShift in [-1, 0, 1]) {
            if (colShift == 0 && rowShift == 0) continue;
            var neighborRow = cellRow + rowShift;
            var neighborCol = cellCol + colShift;
            if ((neighborRow >= 0 && neighborRow < grid.height) && (neighborCol >= 0 && neighborCol < grid.width))
                neighbors.push({row: neighborRow, col: neighborCol});
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
    for (var cellNeighbor in cellNeighbors) {
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
            nextGrid[row][col] = cellRule(grid.arr[row][col], numLiveNeighbors);
        }
    }
    return nextGrid;
} // computeNexctGrid ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a <code>grid</code> onto the <code>canvas</code> from the given parameters.
 * 
 * @param {*} grid The <code>grid</code> to draw.
 * @param {*} canvas The <code>canvas</code> to draw onto.
 * @param {*} cellLength The length of cells.
 * @param {*} cellBorderWidth The border width of cells.
 * @param {*} cellBorderColor The border color of cells.
 * @param {*} liveColor The fill color for live cells.
 * @param {*} deadColor The fill color for dead cells.
 */
function drawGrid(grid, canvas, cellLength, cellBorderWidth, cellBorderColor, liveColor, deadColor) {
    var trueCellLength = cellLength + cellBorderWidth;
    var currentX = 0;
    var currentY = 0;
    for (var row = 0; row < grid.height; row++) {
        for (var col = 0; col < grid.width; col++) {
            var fillColor = (grid.arr[row][col]) ? liveColor : deadColor;
            drawCell(canvas, currentX, currentY, cellLength, cellBorderWidth, cellBorderColor, fillColor);
            currentX += trueCellLength;
        }
        currentX = 0;
        currentY += trueCellLength;
    }
} // drawGrid ()
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
    context.rect(cornerX, cornerY, length-borderWidth);
    context.fill();
} // drawCell ()
//======================================================================================================================