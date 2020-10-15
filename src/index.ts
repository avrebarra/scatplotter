export enum Alignment {
    Left = 0,
    Center,
    Right,
}

export enum Color {
    Black = '\u001b[30m',
    Red = '\u001b[31m',
    Green = '\u001b[32m',
    Yellow = '\u001b[33m',
    Blue = '\u001b[34m',
    Magenta = '\u001b[35m',
    Cyan = '\u001b[36m',
    White = '\u001b[37m',
    Gray = '\u001b[90m',
    Grey = '\u001b[90m',
    Reset = '\u001b[0m',
}

type Axis = {
    length: number
    min: number
    max: number
}

type Plot = {
    x: number
    y: number
    label: string
    color: Color
}

class Plotter {
    x: number
    y: number
    data: { char: string, color: Color }[][]

    constructor() {
        this.x = 0
        this.y = 0
        this.data = [[]]
    }

    setChar(params: { x: number, y: number, char: string, color: Color }) {
        this.data[params.y] = this.data[params.y] || []
        this.data[params.y][params.x] = { char: params.char, color: params.color }
    }

    horizontalText(params: { x: number, y: number, text: string, align: Alignment, color: Color }) {
        params.text = ('' + params.text)

        if (params.align === Alignment.Right) {
            params.x -= params.text.length
        } else if (params.align === Alignment.Center) {
            params.x -= Math.floor(params.text.length / 2)
        }
        params.x = Math.max(0, params.x)

        params.text.split('').forEach((char, index) => {
            this.setChar({ x: params.x + index, y: params.y, char, color: params.color })
        })
    }

    verticalText({ x, y, text, align, color }: { x: number, y: number, text: string, align: number, color: Color }) {
        text = ('' + text)

        if (align === Alignment.Right) {
            y -= text.length
        } else if (align === Alignment.Center) {
            y -= Math.floor(text.length / 2)
        }
        y = Math.max(0, y)

        text.split('').forEach((char, index) => {
            this.setChar({ x, y: y + index, char, color })
        })
    }
}

export class ScatPlotter {
    axisX: Axis
    axisY: Axis
    plots: Plot[]

    constructor({ xAxis, yAxis, plots }: { xAxis: Axis, yAxis: Axis, plots: Plot[] }) {
        this.axisX = xAxis
        this.axisY = yAxis
        this.plots = plots
    }

    build(): Plotter {
        const plotter = new Plotter()

        // differentiate min/max
        if (this.axisX.min === this.axisX.max) {
            this.axisX.max += 1
        }
        if (this.axisY.min === this.axisY.max) {
            this.axisY.max += 1
        }

        const topMargin = 1
        const leftMargin = Math.max(('' + this.axisY.min).length, ('' + this.axisY.max).length) + 1

        // print border
        plotter.horizontalText({
            x: leftMargin,
            y: topMargin,
            text: '-'.repeat(this.axisX.length),
            align: 0,
            color: Color.Red,
        })

        plotter.horizontalText({
            x: leftMargin,
            y: topMargin + this.axisY.length,
            text: '-'.repeat(this.axisX.length),
            align: 0,
            color: Color.Red,
        })

        plotter.verticalText({
            x: leftMargin,
            y: topMargin,
            text: '|'.repeat(this.axisY.length),
            align: 0,
            color: Color.Red,
        })

        plotter.verticalText({
            x: leftMargin + this.axisX.length,
            y: topMargin,
            text: '|'.repeat(this.axisY.length),
            align: 0,
            color: Color.Red,
        })

        // print corner
        plotter.setChar({ color: Color.Red, x: leftMargin, y: topMargin, char: '+' })
        plotter.setChar({ color: Color.Red, x: leftMargin + this.axisX.length, y: topMargin, char: '+' })
        plotter.setChar({ color: Color.Red, x: leftMargin + this.axisX.length, y: topMargin + this.axisY.length, char: '+' })
        plotter.setChar({ color: Color.Red, x: leftMargin, y: topMargin + this.axisY.length, char: '+' })

        // print axis label
        plotter.horizontalText({
            x: leftMargin,
            y: 0,
            text: '',
            align: Alignment.Center,
            color: Color.Red,
        })
        plotter.horizontalText({
            x: leftMargin + this.axisX.length + 2,
            y: topMargin + this.axisY.length,
            align: Alignment.Center,
            text: '',
            color: Color.Red,
        })

        // print minX/maxX
        let [minXPos, maxXPos] = [leftMargin, leftMargin + this.axisX.length]

        plotter.horizontalText({
            x: minXPos,
            y: topMargin + this.axisY.length + 1,
            text: this.axisX.min.toString(),
            align: Alignment.Center,
            color: Color.Red,
        })
        plotter.horizontalText({
            x: maxXPos,
            y: topMargin + this.axisY.length + 1,
            text: this.axisX.max.toString(),
            align: Alignment.Center,
            color: Color.Red,
        })

        // print minY/maxY
        let [minYPos, maxYPos] = [topMargin + this.axisY.length, topMargin]

        plotter.horizontalText({
            x: leftMargin - 1,
            y: maxYPos,
            text: this.axisY.max.toString(),
            align: Alignment.Right,
            color: Color.Red,
        })
        plotter.horizontalText({
            x: leftMargin - 1,
            y: minYPos,
            text: this.axisY.min.toString(),
            align: Alignment.Right,
            color: Color.Red,
        })

        // print points
        this.plots.forEach(({ x, y, label, color }) => {
            const xStep = Math.floor((x - this.axisX.min) * this.axisX.length / (this.axisX.max - this.axisX.min))
            const yStep = Math.floor((y - this.axisY.min) * this.axisY.length / (this.axisY.max - this.axisY.min))

            plotter.setChar({
                x: leftMargin + xStep,
                y: topMargin + this.axisY.length - yStep,
                char: label || '*',
                color,
            })
        })

        return plotter
    }

    prettyprint() {
        const plotter = this.build()
        const isNode = typeof window === 'undefined'
        const args: string[] = []

        const str = Array.from(plotter.data).map(row => {
            if (!row) return ''

            return Array.from(row).map(item => {
                if (!item) return ' '

                const { char, color } = item
                if (color && isNode) {
                    return color + char + Color.Reset
                } else if (color && !isNode) {
                    args.push('color:' + color, '')
                    return '%c' + char + '%c'
                } else {
                    return char
                }
            }).join('')
        }).join('\n')

        console.log(str, ...args)
    }

    stringify() {
        const plotter = this.build()
        return Array.from(plotter.data).map(row => {
            if (!row) return ''

            return Array.from(row).map(item => {
                if (item) {
                    return item.char
                } else {
                    return ' '
                }
            }).join('')
        }).join('\n')
    }
}

export default function (params: { xAxis: Axis, yAxis: Axis, plots: Plot[] }): ScatPlotter {
    return new ScatPlotter(params)
}