/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


// Time Complexity = O(n^2)
window.findNRooksSolution = function(n) {
  var solution = [];

  // Just creates a diagonal of rooks
  for (var i = 0; i < n; i++) {
    // create empty row
    var row = [];
    for (var col = 0; col < n; col++) {
      row.push(0);
    }
    // Set rook location
    row[i] = 1;
    solution.push(row);
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
// Time Complexity = O(n)
window.countNRooksSolutions = function(n) {
  var factorial = function(n) {
    if (n > 0) {
      return n * factorial(n - 1);
    } else {
      return 1;
    }
  };

  var solutionCount = factorial(n);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = window._solveNQueens(n);

  if (n === 0) {
    return 0;
  } else if (n === 1) {
    return [[1]];
  } else if (n === 2) {
    return [[0, 0], [0, 0]];
  } else if (n === 3) {
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution[0]));
  return solution[0];
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var startTime = Date.now();

  var solutionCount = window._solveNQueens(n).length;

  if (n === 0) {
    solutionCount = 1;
  }

  var algorithmTime = Date.now() - startTime;

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  console.log('Time: ' + algorithmTime + ' ms');
  return solutionCount;
};

// Time Complexity = O(n)
window._solveNQueens = function(n) {  
  // build empty starting matrix
  var emptyMatrix = [];
  var emptyRow = [];
  for (var i = 0; i < n; i++) {
    emptyRow.push(0);
  }
  for (var i = 0; i < n; i++) {
    emptyMatrix.push(emptyRow);
  }

  // build initial openColumns array
  var initialColumns = [];
  for (var i = 0; i < n; i++) {
    initialColumns.push(i);
  }

  // Time Complexity = O(n^n) worst case, but it's actually way better
  // since we cut off all rows and columns dynamically
  var buildSolutions = function(n, row, tree) {
    tree = tree || new Tree(emptyMatrix, initialColumns);

    if ( row < n ) {
      // optimize for central symmetry on every board
      var columnLimit = row === 0 ? Math.ceil(n / 2) : tree.openColumns.length;

      for (var openColumnsIndex = 0; openColumnsIndex < columnLimit; openColumnsIndex++) {
        // Build new matrix to be added as a child
        var newMatrix = [];
        for (var i = 0; i < n; i++) {
          var newRow = tree.matrix[i].slice();
          newMatrix.push(newRow);
        }
        var nextQueenColumnIndex = tree.openColumns[openColumnsIndex];
        newMatrix[row][nextQueenColumnIndex] = 1;

        // Take out the newly occupied column from openColumns
        var newOpenColumns = tree.openColumns.slice();
        newOpenColumns.splice(openColumnsIndex, 1);

        // check if the added queens makes board still valid
        if (checkDiagonals(newMatrix, row, nextQueenColumnIndex)) {
          tree.children.push(new Tree(newMatrix, newOpenColumns));
          if (row === n - 1) {
            validBoards.push(newMatrix);

            // Add the symmetrical duplicate unless the board's first queen
            // is at the center column
            var shouldNotDuplicate = (n % 2 === 1 && newMatrix[0][Math.floor(n / 2)] === 1) || n === 1;

            if ( !shouldNotDuplicate ) {
              var duplicateMatrix = [];
              for (var i = newMatrix.length - 1; i >= 0; i--) {
                var duplicateRow = newMatrix[i].slice();
                duplicateMatrix.push(duplicateRow);
              }
              validBoards.push(duplicateMatrix);
            }
          }
        }
      }
      
      for (var i = 0; i < tree.children.length; i++) {
        var child = tree.children[i];
        buildSolutions(n, row + 1, child);
      }   
    }
    return tree;
  }; 

  // Simple tree class for holding boards
  var Tree = function(matrix, openColumns) {
    this.matrix = matrix;
    this.openColumns = openColumns;
    this.children = [];
  };

  var checkDiagonals = function (matrix, rI, cI) {
    var board = new Board(matrix);
    var majorDiagColumnIndex = cI - rI;
    var minorDiagColumnIndex = cI + rI;
    if (board.hasMajorDiagonalConflictAt(majorDiagColumnIndex) || 
        board.hasMinorDiagonalConflictAt(minorDiagColumnIndex) ) {
      return false;
    }
    return true;
  };  

  var validBoards = [];
  buildSolutions(n, 0);

  return validBoards;
};
