const numRows = 6;
const numCols = 6;
const startCell = { row: 0, col: 0 };
const endCell = { row: 5, col: 5 };
const grid = [];
const obstacles = new Set();

// Tạo bảng và định nghĩa ô bắt đầu, kết thúc, và các điểm cản trở.
function createGrid() {
	const table = document.getElementById("grid");

	for (let i = 0; i < numRows; i++) {
		const row = document.createElement("tr");
		grid[i] = [];
		for (let j = 0; j < numCols; j++) {
			const cell = document.createElement("td");
			cell.setAttribute("data-row", i);
			cell.setAttribute("data-col", j);
			grid[i][j] = cell;
			row.appendChild(cell);

			if (i === startCell.row && j === startCell.col) {
				cell.classList.add("start");
			} else if (i === endCell.row && j === endCell.col) {
				cell.classList.add("end");
			} else {
				cell.addEventListener("click", toggleObstacle);
			}
		}
		table.appendChild(row);
	}
}

// Thêm hoặc xóa điểm cản trở khi click vào ô.
function toggleObstacle(event) {
	const cell = event.target;
	const row = cell.getAttribute("data-row");
	const col = cell.getAttribute("data-col");
	const position = `${row}-${col}`;
	if (!obstacles.has(position)) {
		cell.classList.add("obstacle");
		obstacles.add(position);
	} else {
		cell.classList.remove("obstacle");
		obstacles.delete(position);
	}
}

// Xóa lớp "visited" và "path" trên bảng và duy trì trạng thái của điểm cản trở.
function clearGrid() {
	for (let i = 0; i < numRows; i++) {
		for (let j = 0; j < numCols; j++) {
			const cell = grid[i][j];
			cell.classList.remove("visited", "path");
		}
	}
}

// Hàm sleep để tạo độ trễ trong quá trình tạo đường đi.
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Thực hiện thuật toán BFS để tạo đường đi và tô màu các ô.
async function visualizeBFS() {
	clearGrid();
	const queue = [{ row: startCell.row, col: startCell.col, path: [] }];
	while (queue.length > 0) {
		const { row, col, path } = queue.shift();
		if (row < 0 || col < 0 || row >= numRows || col >= numCols) continue;
		const cell = grid[row][col];
		if (
			cell.classList.contains("visited") ||
			cell.classList.contains("obstacle")
		)
			continue;
		cell.classList.add("visited");
		path.push(cell);
		if (row === endCell.row && col === endCell.col) {
			await animatePath(path);
			return;
		}
		await sleep(50);
		queue.push({ row: row - 1, col: col, path: path.slice() });
		queue.push({ row: row + 1, col: col, path: path.slice() });
		queue.push({ row: row, col: col - 1, path: path.slice() });
		queue.push({ row: row, col: col + 1, path: path.slice() });
	}
}

// Tô màu các ô trên đường đi để hiển thị kết quả.
async function animatePath(path) {
	for (const cell of path) {
		cell.classList.add("path");
		await sleep(100);
	}
}
