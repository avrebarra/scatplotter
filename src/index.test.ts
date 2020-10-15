import scatplotter, { Color } from '.'

describe('Service', function () {
    it('could be instantiated', function () {
        const sp = scatplotter({
            xAxis: {
                length: 85,
                max: 100,
                min: 0,
            },
            yAxis: {
                length: 20,
                max: 100,
                min: 0,
            },
            plots: [
                { x: 0, y: 0, color: Color.Red, label: '6' },
                { x: 27, y: 27, color: Color.Red, label: '7' },
                { x: 100, y: 100, color: Color.Red, label: '8' },
            ],
        })

        expect(sp).not.toBeNull()
    })

    it('could build string', function () {
        const sp = scatplotter({
            xAxis: {
                length: 85,
                max: 100,
                min: 0,
            },
            yAxis: {
                length: 20,
                max: 100,
                min: 0,
            },
            plots: [
                { x: 0, y: 0, color: Color.Red, label: '6' },
                { x: 27, y: 27, color: Color.Red, label: '7' },
                { x: 100, y: 100, color: Color.Red, label: '8' },
            ],
        })

        const str = sp.stringify()

        expect(str).toMatchSnapshot()
    })

    it('could prettyprint', function () {
        const sp = scatplotter({
            xAxis: {
                length: 85,
                max: 100,
                min: 0,
            },
            yAxis: {
                length: 20,
                max: 100,
                min: 0,
            },
            plots: [
                { x: 0, y: 0, color: Color.Red, label: '6' },
                { x: 27, y: 27, color: Color.Red, label: '7' },
                { x: 100, y: 100, color: Color.Red, label: '8' },
            ],
        })

        let err: Error | null
        try {
            err = null
            sp.prettyprint()
        } catch (error) {
            err = error
        }

        expect(err).toBeNull()
    })
})