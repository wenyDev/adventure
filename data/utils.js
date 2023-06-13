Array.prototype.parse2D = function () {
    const rows = []
    for (let i = 0; i < this.length; i += 16) {
      rows.push(this.slice(i, i + 16))
    }
  
    return rows
  }
  
  Array.prototype.createObjectsFrom2D = function (numberC) {
    const objects = []
    this.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === numberC) {
          // push a new collision into collisionblocks array
          objects.push(
            new CollisionBlock({
              position: {
                x: x * 64,
                y: y * 64,
              },
            })
          )
        }
      })
    })
  
    return objects
  }

  