export class MapObjectsState {

    layerData: Phaser.Tilemaps.LayerData
    matrix: LayerObject[][]

    constructor(layerData: Phaser.Tilemaps.LayerData) {
        this.layerData = layerData
        this.matrix = this.createLayerMatrix(layerData)
    }

    //create a matrix at same dimension of the tilemap
    createLayerMatrix(layerData: Phaser.Tilemaps.LayerData): LayerObject[][] {
        let groundMatrix = new Array<LayerObject>(layerData.height).fill({ allowed: false, object: null })
            .map(_ => new Array(layerData.width).fill({ allowed: false, object: null }))
        layerData.data.forEach((tileLine: Phaser.Tilemaps.Tile[], lineIndex: number) => {
            tileLine.forEach((tile: Phaser.Tilemaps.Tile, tileIndex: number) => {
                if (tile.index >= 0) {
                    groundMatrix[lineIndex][tileIndex] = { allowed: true, object: null }
                }
            })
        })
        return groundMatrix
    }

    isPositionsAvailable(positions: Array<MatrixPosition>): boolean {
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i]
            if (position.line < 0 || position.column < 0 || this.matrix.length <= position.line ||
                this.matrix[position.line].length <= position.column) {
                return false
            }
            const matrixPosition = this.matrix[position.line][position.column]
            if (!matrixPosition.allowed || matrixPosition.object)
                return false
        }
        return true
    }

    insertObject(positions: Array<MatrixPosition>, object: any): boolean {
        //validate positions
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i]
            if (position.line < 0 || position.column < 0 || this.matrix.length <= position.line ||
                this.matrix[position.line].length <= position.column)
                return false
            const matrixPosition = this.matrix[position.line][position.column]
            if (!matrixPosition.allowed || matrixPosition.object)
                return false
        }
        //assign object
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i]
            this.matrix[position.line][position.column].object = object
        }
        return true
    }
    removeObject(object: any) {
        this.matrix.forEach(line => line.forEach(matrixPosition => {
            if (matrixPosition.object === object)
                matrixPosition.object = null
        }))
    }
    removeFromPositions(positions: Array<MatrixPosition>): boolean {
        //validate positions
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i]
            if (position.line < 0 || position.column < 0 || this.matrix.length <= position.line ||
                this.matrix[position.line].length <= position.column)
                return false
            const matrixPosition = this.matrix[position.line][position.column]
            if (!matrixPosition.allowed)
                return false
        }
        //assign object
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i]
            this.matrix[position.line][position.column].object = null
        }
        return true
    }
}

export interface MatrixPosition {
    column: number
    line: number
}

interface LayerObject {
    allowed: boolean
    object: any
}