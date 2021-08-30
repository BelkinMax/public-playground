<template>
  <v-row justify="center" align="center">
    <v-col cols="10" md="6" justify="center" align="center">
      <div v-if="matrix.length" class="matrix-grid">
        <div
          class="matrix-row"
          v-for="(row, rowIdx) in matrix"
          :key="`row-${rowIdx}`"
        >
          <label
            v-for="(cell, cellIdx) in matrix[rowIdx]"
            :key="`cell-${cellIdx}`"
            class="matrix-cell-wrapper"
            :class="borderArea(rowIdx, cellIdx)"
          >
            <input v-model="matrix[rowIdx][cellIdx]" type="checkbox" />
            <span :ref="cordinates(rowIdx, cellIdx)" class="checkmark"></span>
          </label>
        </div>
      </div>
      <div>
        <v-btn class="run-btn" @click="reFillRandom()">Random</v-btn>
        <v-btn class="run-btn" @click="excludeTouching()">Run</v-btn>
        <v-btn class="run-btn" @click="randomAndRun()">Random & Run</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      matrix: [],
      matrixSize: {
        h: 0,
        w: 0
      },
      touching: []
    };
  },
  mounted() {
    this.setMatrixSize(25, 25);
    this.fillRandom();
  },
  methods: {
    fillRandom() {
      // Fill the matrix with checked cells.
      // Cells that are checked have a better chance to get a checked neighbor
      // so the cells will be more grouped

      const lowChance = 7; // 1/7 chance
      const heightChance = 2; // 1/2 chance

      for (let x = 0; x < this.matrix.length; x++) {
        const row = this.matrix[x];

        for (let y = 0; y < row.length; y++) {
          const neighbors = this.getNeighbors(x, y);

          if (neighbors.some(n => n !== false)) {
            // there are at least one neighbor
            // so the chance to be checked
            // for this cell will be higher
            row[y] = this.random(heightChance);
          } else {
            // No neighbors = lower chance
            row[y] = this.random(lowChance);
          }
        }
      }
    },

    reFillRandom() {
      // Refill the matrix
      this.matrix = [];
      this.setMatrixSize(this.matrixSize.h, this.matrixSize.w);
      this.fillRandom();
      this.resetStyles();
    },

    resetStyles() {
      // Reset the checkbox styles
      this.touching.forEach(cell => {
        this.$refs[cell][0].classList.value = "checkmark";
      });
      this.touching = [];
    },

    randomAndRun() {
      this.reFillRandom();
      this.excludeTouching();
    },

    setMatrixSize(h, w) {
      // Create an empty matrix filled with unchecked cells
      this.matrixSize.h = h;
      this.matrixSize.w = w;

      for (let row = 0; row < this.matrixSize.h; row++) {
        const emptyRow = new Array(this.matrixSize.w);
        emptyRow.fill(false);
        this.matrix.push(emptyRow);
      }
    },

    random(chance) {
      return Math.floor(Math.random() * chance) === 1;
    },

    borderArea(row, col) {
      // Draw the border
      if (
        row === 0 ||
        row === this.matrixSize.h - 1 ||
        col === 0 ||
        col === this.matrixSize.w - 1
      ) {
        return "borderArea";
      } else {
        return "";
      }
    },

    excludeTouching() {
      this.resetStyles();

      const reviewed = [];
      const touching = [];

      // Recursivly find all the neighbors
      const excludeNeighbors = (x, y) => {
        const neighbors = this.getNeighbors(x, y);

        for (let z = 0; z < neighbors.length; z++) {
          const element = neighbors[z];

          if (element && reviewed.indexOf(element) === -1) {
            touching.push(element);
            reviewed.push(element);

            const strIdx = element.split(".");
            excludeNeighbors(+strIdx[0], +strIdx[1]);
          }
        }
      };
      // - //

      for (let x = 0; x < this.matrix.length; x++) {
        const row = this.matrix[x];

        for (let y = 0; y < row.length; y++) {
          const cell = row[y];
          const idx = this.cordinates(x, y);

          let isTouching = false;
          if (this.borderArea(x, y)) {
            isTouching = true;
          }

          // Cell is not touching the border or is not checked
          if (!isTouching || !cell) continue;

          touching.push(idx);
          reviewed.push(idx);

          excludeNeighbors(x, y);
        }
      }

      this.touching = touching;
      this.setNotSelected();
    },

    setNotSelected() {
      // Set "not-selected" style on cells
      this.touching.forEach(cell => {
        this.$refs[cell][0].classList.value = "checkmark not-selected";
      });
    },

    getNeighbors(x, y) {
      // If neighbor cell exists and checked returns its coordinates "row.col"
      // Else returns false

      const neighbors = [false, false, false, false]; // [top, right, bottom, left]

      const t = !!(this.matrix[x - 1] && this.matrix[x - 1][y]);
      const r = !!this.matrix[x][y + 1];
      const b = !!(this.matrix[x + 1] && this.matrix[x + 1][y]);
      const l = !!this.matrix[x][y - 1];

      if (t) neighbors[0] = this.cordinates(x - 1, y);
      if (r) neighbors[1] = this.cordinates(x, y + 1);
      if (b) neighbors[2] = this.cordinates(x + 1, y);
      if (l) neighbors[3] = this.cordinates(x, y - 1);

      return neighbors;
    },

    cordinates(x, y) {
      return `${x}.${y}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.matrix-grid {
  width: 100%;

  .matrix-row {
    display: flex;
    width: 100%;

    .matrix-cell-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      // border: 1px solid black;
      cursor: pointer;
      margin: 0;
      padding: 0;
      background-color: white;

      transition: all 0.3s;

      &:hover {
        opacity: 0.9;
      }

      input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;

        &:checked ~ .checkmark {
          background-color: royalblue;
        }
      }

      .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;

        transition: all 0.3s;
      }

      .selected {
        background-color: green;
      }
      .not-selected {
        opacity: 0.25;
      }
    }

    .borderArea {
      background-color: lightcoral;
    }
  }
}

.run-btn {
  margin-top: 2rem;
}
</style>
